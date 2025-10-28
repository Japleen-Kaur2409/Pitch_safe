// backend/data/userDataAccessSQL.js

const pool = require('../db');
const UserDataAccessInterface = require('./userDataAccessInterface');

class UserDataAccessSQL extends UserDataAccessInterface {
  async createUser(email, hashedPassword, teamName) {
    const result = await pool.query(
      `INSERT INTO coaches_credentials (username, password, team_name)
       VALUES ($1, $2, $3)
       RETURNING coach_id, username, team_name`,
      [email, hashedPassword, teamName]
    );
    return result.rows[0];
  }

  async getUserByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM coaches_credentials WHERE username = $1',
      [email]
    );
    return result.rows[0];
  }

  async getAllUsers() {
    const result = await pool.query('SELECT * FROM coaches_credentials');
    return result.rows;
  }
}

module.exports = UserDataAccessSQL;
