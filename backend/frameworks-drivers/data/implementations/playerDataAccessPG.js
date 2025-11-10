// backend/frameworks-drivers/data/implementations/playerDataAccessPG.js
const pool = require('../../database/db');

class PlayerDataAccessPG {
  async getAllPlayers() {
    try {
      const result = await pool.query('SELECT * FROM players');
      return result.rows;
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  }

  async getPlayerInfoById(playerId) {
    try {
      const result = await pool.query(
        'SELECT * FROM players_personal_info WHERE player_id = $1', 
        [playerId]
      );
      
      // Return no record object if player info is not found
      if (result.rows.length === 0) {
        return {
          player_id: parseInt(playerId),
          bats: 'No record',
          throws: 'No record',
          height: 'No record',
          weight: 'No record',
          date_of_birth: 'No record',
          level: 'No record',
          school: 'No record'
        };
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching player info:', error);
    }
  }
  // For filtering players by coach ID in Roster View
  async getPlayersByCoachId(coachId) {
  try {
    const result = await pool.query(
      'SELECT * FROM players WHERE coach_id = $1',
      [coachId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching players by coach:', error);
    throw new Error(`Failed to fetch players: ${error.message}`);
  }
}

  // Update player personal info -- used in Player Profile Edit
  async updatePlayerInfo(playerId, playerData) {
    try {
      const {
        bats,
        throws,
        height,
        weight,
        date_of_birth,
        level,
        school
      } = playerData;

      // Check if player info exists
      const existingCheck = await pool.query(
        'SELECT * FROM players_personal_info WHERE player_id = $1',
        [playerId]
      );

      if (existingCheck.rows.length === 0) {
        // Insert new record if it doesn't exist
        const result = await pool.query(
          `INSERT INTO players_personal_info 
           (player_id, bats, throws, height, weight, date_of_birth, level, school)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [playerId, bats, throws, height, weight, date_of_birth, level, school]
        );
        return result.rows[0];
      } else {
        // Update existing record
        const result = await pool.query(
          `UPDATE players_personal_info 
           SET bats = $1, throws = $2, height = $3, weight = $4, 
               date_of_birth = $5, level = $6, school = $7
           WHERE player_id = $8
           RETURNING *`,
          [bats, throws, height, weight, date_of_birth, level, school, playerId]
        );
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error updating player info:', error);
      throw new Error(`Failed to update player info: ${error.message}`);
    }
  }
}

module.exports = PlayerDataAccessPG;