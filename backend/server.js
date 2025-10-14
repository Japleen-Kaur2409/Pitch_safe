// backend/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// Sign up route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, teamName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM coaches_credentials WHERE username = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new coach with default team_name if not provided
    const defaultTeamName = teamName || 'Unassigned';
    
    const result = await pool.query(
      'INSERT INTO coaches_credentials (username, password, team_name) VALUES ($1, $2, $3) RETURNING coach_id, username, team_name',
      [email, hashedPassword, defaultTeamName]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM coaches_credentials WHERE username = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        coach_id: user.coach_id,
        username: user.username,
        team_name: user.team_name
      }
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('SafePitch API is running...');
});

// Get all coaches
app.get('/api/coaches', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM coaches_credentials');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all players
app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query('SELECT player_id, first_name, last_name, team_name FROM players');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get player personal info by ID
app.get('/api/players/:id/info', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Query to get player personal info
    const result = await pool.query(
      'SELECT * FROM players_personal_info WHERE player_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching player info:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all game records
app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players_games_records');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});