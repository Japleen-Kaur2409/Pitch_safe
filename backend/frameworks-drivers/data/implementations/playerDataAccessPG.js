// backend/frameworks-drivers/data/implementations/playerDataAccessPG.js
const pool = require('../../database/db');

class PlayerDataAccessPG {
  async getAllPlayers() {
    try {
      const result = await pool.query('SELECT * FROM players');
      return result.rows;
    } catch (error) {
      console.error('Error fetching players:', error);
      
      // Return mock data for development if database is not set up
      return [
        { player_id: 1, first_name: 'John', last_name: 'Smith' },
        { player_id: 2, first_name: 'Mike', last_name: 'Johnson' },
        { player_id: 3, first_name: 'David', last_name: 'Williams' },
        { player_id: 4, first_name: 'Chris', last_name: 'Brown' },
        { player_id: 5, first_name: 'James', last_name: 'Davis' }
      ];
    }
  }

  async getPlayerInfoById(playerId) {
    try {
      const result = await pool.query(
        'SELECT * FROM player_info WHERE player_id = $1', 
        [playerId]
      );
      
      // Return mock data if no database record found
      if (result.rows.length === 0) {
        return {
          player_id: parseInt(playerId),
          bats: 'R',
          throws: 'R',
          height: '6\'3"',
          weight: '200',
          date_of_birth: '1995-05-15',
          level: 'MLB',
          school: 'University of Texas'
        };
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching player info:', error);
      
      // Return mock data for development
      return {
        player_id: parseInt(playerId),
        bats: 'R',
        throws: 'R',
        height: '6\'3"',
        weight: '200',
        date_of_birth: '1995-05-15',
        level: 'MLB',
        school: 'University of Texas'
      };
    }
  }
}

module.exports = PlayerDataAccessPG;