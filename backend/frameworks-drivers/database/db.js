// backend/frameworks-drivers/database/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pitchsafe_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection and provide helpful error messages
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    console.log('\n⚠️  Troubleshooting steps:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your .env file configuration');
    console.log('3. Verify database exists: ' + (process.env.DB_NAME || 'pitchsafe_db'));
    console.log('4. Check username/password credentials');
    console.log('\n💡 To start PostgreSQL (if using Homebrew on macOS):');
    console.log('   brew services start postgresql');
    console.log('\n💡 To create the database:');
    console.log('   createdb pitchsafe_db');
  }
};

testConnection();

module.exports = pool;