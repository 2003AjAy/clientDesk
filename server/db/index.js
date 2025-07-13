// server/db/index.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Needed for Neon
});

module.exports = pool;
// This module exports a configured PostgreSQL connection pool using the 'pg' library.
// It reads the database connection string from environment variables, allowing for secure and flexible database connections.