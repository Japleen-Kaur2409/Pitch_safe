// tests/setup/setupTestDb.js
/**
 * Test Database Setup Script
 * 
 * This script sets up a clean test database before running tests.
 * It creates necessary tables and seeds test data if needed.
 * 
 * Usage: node tests/setup/setupTestDb.js
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.test' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pitchsafe_test_db',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function setupTestDatabase() {
  console.log('🔧 Setting up test database...\n');

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // Drop existing tables
    console.log('🗑️  Dropping existing tables...');
    await pool.query(`
      DROP TABLE IF EXISTS players_games_records CASCADE;
      DROP TABLE IF EXISTS players_personal_info CASCADE;
      DROP TABLE IF EXISTS players CASCADE;
      DROP TABLE IF EXISTS coaches_credentials CASCADE;
    `);
    console.log('✅ Tables dropped\n');

    // Create coaches_credentials table
    console.log('📋 Creating coaches_credentials table...');
    await pool.query(`
      CREATE TABLE coaches_credentials (
        coach_id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        team_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ coaches_credentials table created\n');

    // Create players table
    console.log('📋 Creating players table...');
    await pool.query(`
      CREATE TABLE players (
        player_id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        coach_id INTEGER REFERENCES coaches_credentials(coach_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ players table created\n');

    // Create players_personal_info table
    console.log('📋 Creating players_personal_info table...');
    await pool.query(`
      CREATE TABLE players_personal_info (
        info_id SERIAL PRIMARY KEY,
        player_id INTEGER UNIQUE REFERENCES players(player_id) ON DELETE CASCADE,
        bats CHAR(1) CHECK (bats IN ('R', 'L', 'S')),
        throws CHAR(1) CHECK (throws IN ('R', 'L')),
        height VARCHAR(10),
        weight INTEGER CHECK (weight >= 0),
        date_of_birth DATE,
        level VARCHAR(100),
        school VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ players_personal_info table created\n');

    // Create players_games_records table
    console.log('📋 Creating players_games_records table...');
    await pool.query(`
      CREATE TABLE players_games_records (
        record_id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(player_id) ON DELETE CASCADE,
        game_date DATE NOT NULL,
        pitch_type VARCHAR(50) NOT NULL,
        release_speed DECIMAL(5,2) CHECK (release_speed > 0),
        spin_rate DECIMAL(7,2) CHECK (spin_rate > 0),
        release_pos_x DECIMAL(5,2),
        release_pos_y DECIMAL(5,2),
        release_pos_z DECIMAL(5,2),
        opponent VARCHAR(255),
        innings_pitched DECIMAL(4,1),
        hits INTEGER,
        runs INTEGER,
        earned_runs INTEGER,
        walks INTEGER,
        strikeouts INTEGER,
        home_runs INTEGER,
        pitches_thrown INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ players_games_records table created\n');

    // Seed test data
    console.log('🌱 Seeding test data...');
    
    // Insert test coach
    await pool.query(`
      INSERT INTO coaches_credentials (username, password, team_name)
      VALUES 
        ('test@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', 'Boston Red Sox'),
        ('coach2@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', 'New York Yankees');
    `);
    
    // Insert test players
    await pool.query(`
      INSERT INTO players (first_name, last_name, coach_id)
      VALUES 
        ('John', 'Doe', 1),
        ('Jane', 'Smith', 1),
        ('Bob', 'Johnson', 2);
    `);

    // Insert player info
    await pool.query(`
      INSERT INTO players_personal_info (player_id, bats, throws, height, weight, date_of_birth, level, school)
      VALUES 
        (1, 'R', 'R', '6''2"', 185, '2000-01-15', 'High School', 'Lincoln High'),
        (2, 'L', 'L', '5''10"', 165, '2001-03-20', 'High School', 'Washington High');
    `);

    // Insert game records
    await pool.query(`
      INSERT INTO players_games_records 
        (player_id, game_date, pitch_type, release_speed, spin_rate, opponent, innings_pitched, hits, runs, earned_runs, walks, strikeouts)
      VALUES 
        (1, '2024-01-15', 'Fastball', 92.5, 2200, 'Chicago Cubs', 7.0, 5, 2, 2, 3, 9),
        (1, '2024-01-20', 'Curveball', 85.0, 2500, 'St. Louis Cardinals', 6.0, 7, 3, 3, 2, 7),
        (2, '2024-01-18', 'Slider', 87.5, 2300, 'Milwaukee Brewers', 5.2, 6, 4, 4, 4, 6);
    `);

    console.log('✅ Test data seeded\n');

    // Verify setup
    const coachCount = await pool.query('SELECT COUNT(*) FROM coaches_credentials');
    const playerCount = await pool.query('SELECT COUNT(*) FROM players');
    const gameCount = await pool.query('SELECT COUNT(*) FROM players_games_records');

    console.log('📊 Database Statistics:');
    console.log(`   Coaches: ${coachCount.rows[0].count}`);
    console.log(`   Players: ${playerCount.rows[0].count}`);
    console.log(`   Game Records: ${gameCount.rows[0].count}\n`);

    console.log('✅ Test database setup complete!\n');
    console.log('You can now run: npm test\n');

  } catch (error) {
    console.error('❌ Error setting up test database:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure PostgreSQL is running');
    console.error('   2. Check your .env.test file');
    console.error('   3. Verify database credentials');
    console.error('   4. Create database if it doesn\'t exist: createdb pitchsafe_test_db\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup
setupTestDatabase();
