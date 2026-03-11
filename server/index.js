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
    apiKey: process.env.STEAM_API_KEY
  },
  async function(identifier, profile, done) {
    try {
      // Find or create user
      const steamId = profile.id;
      const username = profile.displayName;
      const avatar = profile.photos && profile.photos.length > 2 ? profile.photos[2].value : (profile.photos[0] ? profile.photos[0].value : null);

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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // Fetch user data from Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const discordUser = userResponse.data;

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
    console.error('❌ Erro no login Discord:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  }
});

// Step 3: Get current user data
app.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Build avatar URL based on source
    let avatarUrl = decoded.avatar;
    if (decoded.source === 'discord' && !avatarUrl.startsWith('http')) {
      avatarUrl = decoded.avatar
        ? `https://cdn.discordapp.com/avatars/${decoded.discord_id}/${decoded.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(decoded.discord_id || 0) % 5}.png`;
    }

    res.json({
      id: decoded.discord_id || decoded.steam_id,
      discord_id: decoded.discord_id,
      steam_id: decoded.steam_id,
      username: decoded.username,
      global_name: decoded.global_name,
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

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: process.env.FRONTEND_URL })
);

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
