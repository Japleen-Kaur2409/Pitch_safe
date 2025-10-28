// backend/data/gameDataAccessSQL.js

const pool = require('../db');
const GameDataAccessInterface = require('./gameDataAccessInterface');

class GameDataAccessSQL extends GameDataAccessInterface {
  async getAllGames() {
    const result = await pool.query(
      'SELECT * FROM players_games_records ORDER BY game_date DESC'
    );
    return result.rows;
  }

  async getGamesByPlayerId(playerId) {
    const result = await pool.query(
      'SELECT * FROM players_games_records WHERE player_id = $1 ORDER BY game_date DESC',
      [playerId]
    );
    return result.rows;
  }

  async addGameRecord(gameData) {
    const {
      player_id,
      game_date,
      pitch_type,
      release_speed,
      spin_rate,
      release_pos_x,
      release_pos_y,
      release_pos_z
    } = gameData;

    const result = await pool.query(
      `INSERT INTO players_games_records 
       (player_id, game_date, pitch_type, release_speed, spin_rate, release_pos_x, release_pos_y, release_pos_z)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        player_id,
        game_date,
        pitch_type,
        parseFloat(release_speed),
        parseInt(spin_rate),
        release_pos_x || null,
        release_pos_y || null,
        release_pos_z || null
      ]
    );
    return result.rows[0];
  }

  async updateGameRecord(recordId, gameData) {
    const {
      game_date,
      pitch_type,
      release_speed,
      spin_rate,
      release_pos_x,
      release_pos_y,
      release_pos_z
    } = gameData;

    const result = await pool.query(
      `UPDATE players_games_records 
       SET game_date = $1, pitch_type = $2, release_speed = $3, spin_rate = $4,
           release_pos_x = $5, release_pos_y = $6, release_pos_z = $7
       WHERE record_id = $8
       RETURNING *`,
      [game_date, pitch_type, release_speed, spin_rate, release_pos_x, release_pos_y, release_pos_z, recordId]
    );

    return result.rows[0];
  }

  async deleteGameRecord(recordId) {
    const result = await pool.query(
      'DELETE FROM players_games_records WHERE record_id = $1 RETURNING *',
      [recordId]
    );
    return result.rows[0];
  }
}

module.exports = GameDataAccessSQL;
