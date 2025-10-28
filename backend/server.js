// backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

// Data access layer imports
const UserDataAccessSQL = require('./data/userDataAccessSQL');
const PlayerDataAccessSQL = require('./data/playerDataAccessSQL');
const GameDataAccessSQL = require('./data/gameDataAccessSQL');

// Initialize data access classes
const userDAO = new UserDataAccessSQL();
const playerDAO = new PlayerDataAccessSQL();
const gameDAO = new GameDataAccessSQL();

const app = express();
app.use(cors());
app.use(express.json());

/* -----------------------------------
   AUTH ROUTES
----------------------------------- */

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, teamName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await userDAO.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultTeamName = teamName || 'Unassigned';

    // Create user
    const newUser = await userDAO.createUser(email, hashedPassword, defaultTeamName);
    res.status(201).json({ message: 'User created successfully', user: newUser });
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
    const user = await userDAO.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        coach_id: user.coach_id,
        username: user.username,
        team_name: user.team_name,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* -----------------------------------
   BASIC TEST ROUTE
----------------------------------- */

app.get('/', (req, res) => {
  res.send('SafePitch API is running...');
});

/* -----------------------------------
   COACH ROUTES
----------------------------------- */

app.get('/api/coaches', async (req, res) => {
  try {
    const coaches = await userDAO.getAllUsers();
    res.json(coaches);
  } catch (err) {
    console.error('Error fetching coaches:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* -----------------------------------
   PLAYER ROUTES
----------------------------------- */

// Get all players
app.get('/api/players', async (req, res) => {
  try {
    const players = await playerDAO.getAllPlayers();
    res.json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get player personal info by ID
app.get('/api/players/:id/info', async (req, res) => {
  try {
    const { id } = req.params;
    const playerInfo = await playerDAO.getPlayerInfoById(id);

    if (!playerInfo) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(playerInfo);
  } catch (err) {
    console.error('Error fetching player info:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* -----------------------------------
   GAME ROUTES
----------------------------------- */

// Get all game records
app.get('/api/games', async (req, res) => {
  try {
    const games = await gameDAO.getAllGames();
    res.json(games);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get game records for a specific player
app.get('/api/games/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const games = await gameDAO.getGamesByPlayerId(playerId);
    res.json(games);
  } catch (err) {
    console.error('Error fetching player games:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new game record
app.post('/api/games', async (req, res) => {
  try {
    const gameData = req.body;

    if (!gameData.player_id || !gameData.game_date || !gameData.pitch_type ||
        gameData.release_speed === '' || gameData.spin_rate === '') {
      return res.status(400).json({
        error: 'Missing required fields: player_id, game_date, pitch_type, release_speed, spin_rate',
      });
    }

    // Validate player existence using playerDAO
    const player = await playerDAO.getPlayerInfoById(gameData.player_id);
    if (!player) {
      return res.status(404).json({ error: `Player with ID ${gameData.player_id} not found` });
    }

    const newRecord = await gameDAO.addGameRecord(gameData);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('Error adding game record:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a game record
app.put('/api/games/:recordId', async (req, res) => {
  try {
    const { recordId } = req.params;
    const gameData = req.body;

    const updatedRecord = await gameDAO.updateGameRecord(recordId, gameData);
    if (!updatedRecord) {
      return res.status(404).json({ error: 'Game record not found' });
    }

    res.json(updatedRecord);
  } catch (err) {
    console.error('Error updating game record:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a game record
app.delete('/api/games/:recordId', async (req, res) => {
  try {
    const { recordId } = req.params;

    const deletedRecord = await gameDAO.deleteGameRecord(recordId);
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Game record not found' });
    }

    res.json({ message: 'Game record deleted', deleted: deletedRecord });
  } catch (err) {
    console.error('Error deleting game record:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* -----------------------------------
   SERVER START
----------------------------------- */

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
