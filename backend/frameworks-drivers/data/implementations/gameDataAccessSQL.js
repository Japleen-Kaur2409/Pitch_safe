// backend/frameworks-drivers/data/implementations/gameDataAccessSQL.js
const pool = require('../../database/db');

class GameDataAccessSQL {
  async addGameRecord(gameRecord) {
    try {
      const {
        player_id,
        game_date,
        pitch_type,
        release_speed,
        spin_rate,
        release_pos_x,
        release_pos_y,
        release_pos_z
      } = gameRecord;

      const result = await pool.query(
        `INSERT INTO players_games_records 
         (player_id, game_date, pitch_type, release_speed, spin_rate, release_pos_x, release_pos_y, release_pos_z)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          player_id,
          game_date,
          pitch_type,
          release_speed,
          spin_rate,
          release_pos_x,
          release_pos_y,
          release_pos_z
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error adding game record:', error);
      throw new Error(`Failed to add game record: ${error.message}`);
    }
  }

  async getPlayerGames(playerId) {
    try {
      const result = await pool.query(
        'SELECT * FROM players_games_records WHERE player_id = $1 ORDER BY game_date DESC',
        [playerId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching player games:', error);
      throw new Error(`Failed to fetch player games: ${error.message}`);
    }
  }

  async updateGameRecord(recordId, gameData) {
    try {
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

      if (result.rows.length === 0) {
        throw new Error('Game record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating game record:', error);
      throw new Error(`Failed to update game record: ${error.message}`);
    }
  }

  // this is not used yet
  async deleteGameRecord(recordId) {
    try {
      const result = await pool.query(
        'DELETE FROM players_games_records WHERE record_id = $1 RETURNING *',
        [recordId]
      );

      if (result.rows.length === 0) {
        throw new Error('Game record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting game record:', error);
      throw new Error(`Failed to delete game record: ${error.message}`);
    }
  }
}

module.exports = GameDataAccessSQL;