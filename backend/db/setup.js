// Run this once to create tables and seed data:
//   node backend/db/setup.js

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setup() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(sql);
    console.log('✅ Database schema created and seeded successfully.');
    console.log('   Test credentials: admin@test.com / password123');
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
  } finally {
    await pool.end();
  }
}

setup();
