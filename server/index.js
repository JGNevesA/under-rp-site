import express from 'express';
import cors from 'cors';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import SteamStrategy from 'passport-steam';
import pool, { initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - allow frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
// =============================================
// Epic Games KWS Webhook (Verificação Parental)
// =============================================
// Esta rota precisa vir antes do app.use(express.json()) para obtermos o body "cru" para validar a assinatura.
app.post('/api/webhook/epic-kws', express.raw({ type: 'application/json' }), async (req, res) => {
  const secret = process.env.EPIC_WEBHOOK_SECRET;
  
  if (!secret) {
    console.log('⚠️ Webhook recebido, mas EPIC_WEBHOOK_SECRET não está configurado no .env!');
    return res.status(500).send('Secret não configurado');
  }

  const signature = req.headers['x-kws-signature']; // O header oficial da Epic Games KWS
  if (!signature) {
    return res.status(401).send('Assinatura ausente');
  }

  try {
    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body) // req.body é um Buffer cruntamente pelo express.raw
      .digest('hex');

    if (signature === expectedSignature) {
      const payload = JSON.parse(req.body.toString());
      console.log('✅ Epic KWS Webhook Válido recebido!', payload);
      
      // TODO: Quando o banco do FiveM estiver pronto com a coluna de idade, desative o comentário abaixo e adapte os nomes das colunas:
      // const epicUserId = payload.userId; // Ajuste conforme a documentação da KWS
      // await pool.execute('UPDATE users SET vrp_verificado = 1 WHERE epic_account_id = ?', [epicUserId]);

      res.status(200).send('OK');
    } else {
      console.log('❌ Epic KWS Webhook Assinatura Inválida!');
      res.status(401).send('Assinatura inválida');
    }
  } catch (error) {
    console.error('❌ Erro processando webhook Epic:', error);
    res.status(500).send('Erro Interno');
  }
});

app.use(express.json());
// Session is required for Passport OpenID
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Configure Steam Strategy
passport.use(new SteamStrategy({
    returnURL: process.env.STEAM_RETURN_URL,
    realm: process.env.STEAM_REALM,
    apiKey: process.env.STEAM_API_KEY,
    passReqToCallback: true
  },
  async function(req, identifier, profile, done) {
    try {
      // Find or create user
      const steamId = profile.id;
      const username = profile.displayName;
      const avatar = profile.photos && profile.photos.length > 2 ? profile.photos[2].value : (profile.photos[0] ? profile.photos[0].value : null);

      let existingUserId = null;
      if (req.session && req.session.linkToken) {
        try {
          const decoded = jwt.verify(req.session.linkToken, process.env.JWT_SECRET);
          // Only fetch existing ID from DB if needed, or if the token is discord
          existingUserId = decoded.id; // Usually we don't have this in older tokens, so we should query it:
          if (!existingUserId) {
            let uQuery = ''; let uParams = [];
            if (decoded.steam_id) { uQuery = 'SELECT id FROM users WHERE steam_id=?'; uParams = [decoded.steam_id]; }
            else if (decoded.discord_id) { uQuery = 'SELECT id FROM users WHERE discord_id=?'; uParams = [decoded.discord_id]; }
            
            if (uQuery) {
              const [rs] = await pool.execute(uQuery, uParams);
              if (rs.length > 0) existingUserId = rs[0].id;
            }
          }
        } catch(e) {}
        req.session.linkToken = null;
      }

      if (existingUserId) {
        await pool.execute(
          `UPDATE users SET steam_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [steamId, existingUserId]
        );
      } else {
        await pool.execute(
          `INSERT INTO users (steam_id, username, global_name, avatar)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             username = VALUES(username),
             global_name = IFNULL(global_name, VALUES(global_name)),
             avatar = VALUES(avatar),
             updated_at = CURRENT_TIMESTAMP`,
          [steamId, username, username, avatar]
        );
      }

      // We pass the profile forward to generate the JWT
      return done(null, {
        source: 'steam',
        steam_id: steamId,
        username: username,
        global_name: username,
        avatar: avatar
      });
    } catch (err) {
      return done(err, null);
    }
  }
));

// =============================================
// Discord OAuth2 Routes
// =============================================

// Step 1: Redirect to Discord authorization
app.get('/auth/discord', (req, res) => {
  if (req.query.token) {
    req.session.linkToken = req.query.token;
  }
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email',
  });

  res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
});

// Step 2: Discord callback - exchange code for token
app.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
        scope: 'identify email',
      }),
      {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'User-Agent': 'UnderRP-Auth/1.0 (https://underrp-api.onrender.com)'
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // Fetch user data from Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        'Accept': 'application/json',
        'User-Agent': 'UnderRP-Auth/1.0 (https://underrp-api.onrender.com)'
      },
    });

    const discordUser = userResponse.data;

    // Check if we are linking
    let existingUserId = null;
    if (req.session && req.session.linkToken) {
      try {
        const decoded = jwt.verify(req.session.linkToken, process.env.JWT_SECRET);
        existingUserId = decoded.id;
        if (!existingUserId) {
          let uQuery = ''; let uParams = [];
          if (decoded.steam_id) { uQuery = 'SELECT id FROM users WHERE steam_id=?'; uParams = [decoded.steam_id]; }
          else if (decoded.discord_id) { uQuery = 'SELECT id FROM users WHERE discord_id=?'; uParams = [decoded.discord_id]; }
          
          if (uQuery) {
            const [rs] = await pool.execute(uQuery, uParams);
            if (rs.length > 0) existingUserId = rs[0].id;
          }
        }
      } catch(e) {}
      req.session.linkToken = null;
    }

    if (existingUserId) {
      await pool.execute(
        `UPDATE users SET discord_id = ?, email = ?, access_token = ?, refresh_token = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [discordUser.id, discordUser.email || null, access_token, refresh_token || null, existingUserId]
      );
    } else {
      // Save or update user in database
      await pool.execute(
        `INSERT INTO users (discord_id, username, global_name, avatar, email, access_token, refresh_token)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           username = VALUES(username),
           global_name = VALUES(global_name),
           avatar = VALUES(avatar),
           email = VALUES(email),
           access_token = VALUES(access_token),
           refresh_token = VALUES(refresh_token),
           updated_at = CURRENT_TIMESTAMP`,
        [
          discordUser.id,
          discordUser.username,
          discordUser.global_name || discordUser.username,
          discordUser.avatar,
          discordUser.email || null,
          access_token,
          refresh_token || null,
        ]
      );
    }

    // Create JWT
    const token = jwt.sign(
      {
        source: 'discord',
        discord_id: discordUser.id,
        username: discordUser.username,
        global_name: discordUser.global_name || discordUser.username,
        avatar: discordUser.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    console.error('❌ Erro no login Discord:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      redirect_uri: process.env.DISCORD_REDIRECT_URI
    });
    res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  }
});

// Step 3: Get current user data
app.get('/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let userQuery = '';
    let userParams = [];
    if (decoded.id) {
       userQuery = 'SELECT * FROM users WHERE id = ?';
       userParams = [decoded.id];
    } else if (decoded.steam_id) {
       userQuery = 'SELECT * FROM users WHERE steam_id = ?';
       userParams = [decoded.steam_id];
    } else if (decoded.discord_id) {
       userQuery = 'SELECT * FROM users WHERE discord_id = ?';
       userParams = [decoded.discord_id];
    }

    if (!userQuery) return res.status(400).json({ error: 'Token inválido' });

    const [users] = await pool.execute(userQuery, userParams);
    if (users.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    const dbUser = users[0];

    // Build avatar URL based on source
    let avatarUrl = dbUser.avatar;
    if (dbUser.discord_id && (!avatarUrl || !avatarUrl.startsWith('http'))) {
      avatarUrl = dbUser.avatar
        ? `https://cdn.discordapp.com/avatars/${dbUser.discord_id}/${dbUser.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(dbUser.discord_id || 0) % 5}.png`;
    }

    res.json({
      id: dbUser.id,
      discord_id: dbUser.discord_id,
      steam_id: dbUser.steam_id,
      username: dbUser.username,
      global_name: dbUser.global_name,
      avatar: avatarUrl,
      source: decoded.source,
    });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
});

// Logout (optional - just for clearing server-side if needed)
app.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logout realizado' });
});

// =============================================
// Steam OAuth2 Routes
// =============================================

app.get('/auth/steam', (req, res, next) => {
  if (req.query.token) {
    req.session.linkToken = req.query.token;
  }
  passport.authenticate('steam', { failureRedirect: process.env.FRONTEND_URL })(req, res, next);
});

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: process.env.FRONTEND_URL }),
  (req, res) => {
    // Successful authentication, create JWT.
    const user = req.user;
    
    // Create JWT
    const token = jwt.sign(
      {
        source: 'steam',
        steam_id: user.steam_id,
        username: user.username,
        global_name: user.global_name,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

// =============================================
// Ban & Appeal Routes
// =============================================

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// GET /api/bans - Get all bans for the logged-in user
app.get('/api/bans', authenticateToken, async (req, res) => {
  try {
    const { discord_id, steam_id } = req.user;
    
    // First, find the user's ID in the database
    let userQuery = '';
    let userParams = [];
    
    if (steam_id) {
      userQuery = 'SELECT id FROM users WHERE steam_id = ?';
      userParams = [steam_id];
    } else if (discord_id) {
      userQuery = 'SELECT id FROM users WHERE discord_id = ?';
      userParams = [discord_id];
    } else {
      return res.status(400).json({ error: 'Usuário inválido' });
    }
    
    const [users] = await pool.execute(userQuery, userParams);
    if (users.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    
    const userId = users[0].id;
    
    // Fetch bans and their associated appeal status
    const [bans] = await pool.execute(`
      SELECT b.*, a.status as appeal_status, a.id as appeal_id
      FROM bans b
      LEFT JOIN appeals a ON b.id = a.ban_id
      WHERE b.user_id = ?
      ORDER BY b.banned_at DESC
    `, [userId]);
    
    res.json(bans);
  } catch (error) {
    console.error('Erro ao buscar bans:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/bans/:id/appeal - Create an appeal for a specific ban
app.post('/api/bans/:id/appeal', authenticateToken, async (req, res) => {
  try {
    const banId = req.params.id;
    const { reason, proof_link } = req.body;
    const { discord_id, steam_id } = req.user;
    
    if (!reason || !proof_link) {
      return res.status(400).json({ error: 'Motivo e link de provas são obrigatórios' });
    }

    // Find the user's ID in the database
    let userQuery = '';
    let userParams = [];
    
    if (steam_id) {
      userQuery = 'SELECT id FROM users WHERE steam_id = ?';
      userParams = [steam_id];
    } else if (discord_id) {
      userQuery = 'SELECT id FROM users WHERE discord_id = ?';
      userParams = [discord_id];
    }
    
    const [users] = await pool.execute(userQuery, userParams);
    if (users.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    
    const userId = users[0].id;
    
    // Check if ban exists and belongs to user
    const [bans] = await pool.execute('SELECT * FROM bans WHERE id = ? AND user_id = ?', [banId, userId]);
    if (bans.length === 0) {
      return res.status(404).json({ error: 'Ban não encontrado ou não pertence a você' });
    }
    
    // Create the appeal
    try {
      await pool.execute(`
        INSERT INTO appeals (ban_id, user_id, appeal_reason, proof_link)
        VALUES (?, ?, ?, ?)
      `, [banId, userId, reason, proof_link]);
      
      res.status(201).json({ success: true, message: 'Apelo enviado com sucesso' });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Você já possui um apelo para este ban' });
      }
      throw err;
    }
  } catch (error) {
    console.error('Erro ao criar apelo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =============================================
// Ticket Routes
// =============================================

// Helper to get user DB id from JWT token
async function getUserId(req, res) {
  const { discord_id, steam_id } = req.user;
  let userQuery = '', userParams = [];
  if (steam_id) { userQuery = 'SELECT id FROM users WHERE steam_id = ?'; userParams = [steam_id]; }
  else if (discord_id) { userQuery = 'SELECT id FROM users WHERE discord_id = ?'; userParams = [discord_id]; }
  else { res.status(400).json({ error: 'Usuário inválido' }); return null; }
  const [users] = await pool.execute(userQuery, userParams);
  if (users.length === 0) { res.status(404).json({ error: 'Usuário não encontrado' }); return null; }
  return users[0].id;
}

// GET /api/tickets - Get all tickets for the logged-in user
app.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const userId = await getUserId(req, res);
    if (!userId) return;
    const [tickets] = await pool.execute(
      'SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(tickets);
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/tickets - Create a new ticket
app.post('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
    }
    const userId = await getUserId(req, res);
    if (!userId) return;
    const [result] = await pool.execute(
      'INSERT INTO tickets (user_id, title, category, description) VALUES (?, ?, ?, ?)',
      [userId, title, category, description]
    );
    res.status(201).json({ success: true, ticketId: result.insertId });
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
// GET /api/tickets/:id/messages - Get specific ticket and all messages
app.get('/api/tickets/:id/messages', authenticateToken, async (req, res) => {
  try {
    const userId = await getUserId(req, res);
    if (!userId) return;
    const ticketId = req.params.id;
    
    // First, verify the ticket belongs to the user
    const [tickets] = await pool.execute('SELECT * FROM tickets WHERE id = ? AND user_id = ?', [ticketId, userId]);
    if (tickets.length === 0) return res.status(404).json({ error: 'Ticket não encontrado' });
    
    // Then get messages
    const [messages] = await pool.execute(
      `SELECT tm.*, u.username, u.avatar 
       FROM ticket_messages tm 
       JOIN users u ON tm.user_id = u.id 
       WHERE tm.ticket_id = ? 
       ORDER BY tm.created_at ASC`,
      [ticketId]
    );
    
    res.json({ ticket: tickets[0], messages });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/tickets/:id/messages - Add message to ticket
app.post('/api/tickets/:id/messages', authenticateToken, async (req, res) => {
  try {
    const userId = await getUserId(req, res);
    if (!userId) return;
    const ticketId = req.params.id;
    const { message } = req.body;
    
    if (!message) return res.status(400).json({ error: 'Mensagem vazia' });
    
    // Verify the ticket belongs to the user and is not closed
    const [tickets] = await pool.execute('SELECT * FROM tickets WHERE id = ? AND user_id = ?', [ticketId, userId]);
    if (tickets.length === 0) return res.status(404).json({ error: 'Ticket não encontrado' });
    if (tickets[0].status === 'closed') return res.status(400).json({ error: 'Este ticket está fechado' });
    
    await pool.execute(
      'INSERT INTO ticket_messages (ticket_id, user_id, message) VALUES (?, ?, ?)',
      [ticketId, userId, message]
    );
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
// =============================================
// Start Server
// =============================================
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`🔗 Login Discord: http://localhost:${PORT}/auth/discord`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

start();
