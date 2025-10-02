// backend/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

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