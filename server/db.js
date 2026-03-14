import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create database and table if they don't exist
export async function initDatabase() {
  // First connect without specifying database to create it
  const tempConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await tempConnection.execute(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
  );
  await tempConnection.end();

  // Now create the users table
  const connection = await pool.getConnection();
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        discord_id VARCHAR(255) UNIQUE,
        steam_id VARCHAR(255) UNIQUE,
        username VARCHAR(255) NOT NULL,
        global_name VARCHAR(255),
        avatar VARCHAR(255),
        email VARCHAR(255),
        access_token TEXT,
        refresh_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Ensure steam_id column exists for existing tables
    try {
      await connection.execute(`ALTER TABLE users ADD COLUMN steam_id VARCHAR(255) UNIQUE`);
    } catch (e) {
      // Ignore if column already exists
    }
    
    // Make discord_id nullable to support Steam-only logins initially
    try {
      await connection.execute(`ALTER TABLE users MODIFY discord_id VARCHAR(255) NULL`);
    } catch (e) {
      // Ignore errors
    }

    // Create bans table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        reason TEXT NOT NULL,
        banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        banned_until TIMESTAMP NULL,
        server_name VARCHAR(255) DEFAULT 'FiveM Brazil',
        status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create appeals table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS appeals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ban_id INT NOT NULL,
        user_id INT NOT NULL,
        appeal_reason TEXT NOT NULL,
        proof_link VARCHAR(1000),
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (ban_id) REFERENCES bans(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY(ban_id)
      )
    `);

    console.log('✅ Banco de dados e tabela "users" prontos!');
  } finally {
    connection.release();
  }
}

export default pool;
