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
      CREATE TABLE IF NOT EXISTS site_users (
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

    try {
      await connection.execute(`ALTER TABLE site_users ADD COLUMN steam_id VARCHAR(255) UNIQUE`);
    } catch (e) {}
    
    try {
      await connection.execute(`ALTER TABLE site_users MODIFY discord_id VARCHAR(255) NULL`);
    } catch (e) {}

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_bans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        reason TEXT NOT NULL,
        banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        banned_until TIMESTAMP NULL,
        server_name VARCHAR(255) DEFAULT 'FiveM Brazil',
        status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
        FOREIGN KEY (user_id) REFERENCES site_users(id) ON DELETE CASCADE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_appeals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ban_id INT NOT NULL,
        user_id INT NOT NULL,
        appeal_reason TEXT NOT NULL,
        proof_link VARCHAR(1000),
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES site_users(id) ON DELETE CASCADE,
        UNIQUE KEY(ban_id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES site_users(id) ON DELETE CASCADE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_ticket_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id INT NOT NULL,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        is_staff BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES site_tickets(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES site_users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Banco de dados e tabela "users" prontos!');
  } finally {
    connection.release();
  }
}

export default pool;
