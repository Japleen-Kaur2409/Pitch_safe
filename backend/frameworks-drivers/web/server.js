// backend/frameworks-drivers/web/server.js
const express = require('express');
const cors = require('cors');
const configureDependencies = require('../../config/dependencies');

const app = express();
app.use(cors());
app.use(express.json());

// Configure dependencies
const { gameController, playerController, authController } = configureDependencies();

/* -----------------------------------
   ROUTES
----------------------------------- */

// Basic test route
app.get('/', (req, res) => {
  res.send('SafePitch API is running with Clean Architecture...');
});

// Auth routes
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/signup', (req, res) => authController.signup(req, res));

// Player routes
app.get('/api/players', (req, res) => playerController.getAllPlayers(req, res));
app.get('/api/players/:id/info', (req, res) => playerController.getPlayerInfo(req, res));

// Game routes
app.post('/api/games', (req, res) => gameController.addGameRecord(req, res));
app.get('/api/games/player/:playerId', (req, res) => gameController.getPlayerGames(req, res));
app.put('/api/games/:recordId', (req, res) => gameController.updateGameRecord(req, res));
app.delete('/api/games/:recordId', (req, res) => gameController.deleteGameRecord(req, res));

/* -----------------------------------
   SERVER START
----------------------------------- */

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API endpoints available:');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/signup');
  console.log('  GET  /api/players');
  console.log('  GET  /api/players/:id/info');
  console.log('  POST /api/games');
  console.log('  GET  /api/games/player/:playerId');
  console.log('  PUT  /api/games/:recordId');
  console.log('  DELETE /api/games/:recordId');
});