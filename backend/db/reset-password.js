const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function resetPassword() {
  const email = 'admin@test.com';
  const newPassword = 'password123';

  try {
    const hash = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING email',
      [hash, email]
    );

    if (result.rows.length === 0) {
      console.log('User not found — inserting new user...');
      await pool.query(
        'INSERT INTO users (email, password, full_name) VALUES ($1, $2, $3)',
        [email, hash, 'Admin User']
      );
    }

    console.log('✅ Password updated successfully.');
    console.log('   Email:   ', email);
    console.log('   Password:', newPassword);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

resetPassword();
