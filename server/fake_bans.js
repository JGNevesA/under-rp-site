import pool, { initDatabase } from './db.js';

async function addFakeBans() {
  try {
    await initDatabase(); // Ensure tables exist
    
    // Find the first user in the database
    const [users] = await pool.execute('SELECT id, username FROM users LIMIT 1');
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado no banco de dados. Faça login no site primeiro antes de rodar este script.');
      process.exit(1);
    }
    
    const user = users[0];
    console.log(`👤 Inserindo bans fake para o usuário: ${user.username} (ID: ${user.id})`);
    
    // Check if ban already exists to avoid duplicates
    const [existing] = await pool.execute('SELECT id FROM bans WHERE user_id = ? LIMIT 1', [user.id]);
    if (existing.length > 0) {
      console.log('⚠️ Já existem bans para este usuário. Deletando para recriar...');
      await pool.execute('DELETE FROM bans WHERE user_id = ?', [user.id]);
    }
    
    // Insert an Active Ban
    const [activeResult] = await pool.execute(`
      INSERT INTO bans (user_id, reason, server_name, status, banned_until)
      VALUES (?, 'Uso de Hack (Aimbot detectado) - Ban Fake de Teste', 'UnderRP Principal', 'active', NULL)
    `, [user.id]);
    
    // Insert an Expired Ban
    const [expiredResult] = await pool.execute(`
      INSERT INTO bans (user_id, reason, server_name, status, banned_at, banned_until)
      VALUES (?, 'RDM na Praça (Matou 3 pessoas sem motivação)', 'UnderRP Principal', 'expired', '2023-05-10 14:30:00', '2023-05-17 14:30:00')
    `, [user.id]);
    
    // Insert a Revoked Ban
    const [revokedResult] = await pool.execute(`
      INSERT INTO bans (user_id, reason, server_name, status, banned_at, banned_until)
      VALUES (?, 'Anti-RP (Deslogar em combate)', 'UnderRP Arena', 'revoked', '2023-08-01 20:00:00', '2023-08-08 20:00:00')
    `, [user.id]);
    
    // Add a fake resolved appeal for the revoked ban
    await pool.execute(`
      INSERT INTO appeals (ban_id, user_id, appeal_reason, proof_link, status)
      VALUES (?, ?, 'Meu jogo crashou no meio da ação, segue o print do erro do FiveM.', 'https://imgur.com/fake-proof', 'accepted')
    `, [revokedResult.insertId, user.id]);

    console.log('✅ Bans fake e histórico de apelo inseridos com sucesso!');
  } catch (err) {
    console.error('Erro ao inserir bans fake:', err);
  } finally {
    process.exit(0);
  }
}

addFakeBans();
