import pool from './db.js';

async function clearFakeBans() {
  try {
    console.log('🧹 Limpando bans falsos do banco de dados...');
    await pool.execute('DELETE FROM bans'); // This will also cascade delete appeals
    console.log('✅ Histórico de bans apagado com sucesso!');
  } catch (err) {
    console.error('Erro ao limpar bans:', err);
  } finally {
    process.exit(0);
  }
}

clearFakeBans();
