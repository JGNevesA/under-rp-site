import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function showTableStructure() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [users] = await connection.execute('DESCRIBE users');
    console.log('users schema:', users);
  } catch (e) {
    console.error('users table err:', e.message);
  }

  try {
    const [bans] = await connection.execute('DESCRIBE bans');
    console.log('bans schema:', bans);
  } catch (e) {
    console.error('bans table err:', e.message);
  }

  await connection.end();
}

showTableStructure();
