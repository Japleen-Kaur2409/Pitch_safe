// backend/frameworks-drivers/data/implementations/userDataAccessSQL.js
const pool = require('../../database/db');

class UserDataAccessSQL {
  async createUser(email, hashedPassword, teamName) {
    try {
      const result = await pool.query(
        `INSERT INTO coaches_credentials (username, password, team_name)
         VALUES ($1, $2, $3)
         RETURNING coach_id, username, team_name`,
        [email, hashedPassword, teamName]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM coaches_credentials WHERE username = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      const result = await pool.query('SELECT * FROM coaches_credentials');
      return result.rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }
}

module.exports = UserDataAccessSQL;