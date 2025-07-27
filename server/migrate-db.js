require('dotenv').config();
const pool = require('./db');

async function migrateDatabase() {
  try {
    // Add status column if it doesn't exist
    await pool.query(`
      ALTER TABLE inquiries 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending'
    `);

    // Add progress column if it doesn't exist
    await pool.query(`
      ALTER TABLE inquiries 
      ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0
    `);

    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Error migrating database:', error);
  } finally {
    await pool.end();
  }
}

migrateDatabase(); 