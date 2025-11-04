// backend/data/playerDataAccessSQL.js

const pool = require('../db');
const PlayerDataAccessInterface = require('./playerDataAccessInterface');

class PlayerDataAccessSQL extends PlayerDataAccessInterface {
  async getAllPlayers() {
    const result = await pool.query(
      'SELECT player_id, first_name, last_name, team_name FROM players'
    );
    return result.rows;
  }

  async getPlayerInfoById(id) {
    const result = await pool.query(
      'SELECT * FROM players_personal_info WHERE player_id = $1',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = PlayerDataAccessSQL;
