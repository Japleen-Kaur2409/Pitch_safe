// backend/data/userDataAccessInterface.js

class UserDataAccessInterface {
  async createUser(email, hashedPassword, teamName) {
    throw new Error('createUser() not implemented');
  }

  async getUserByEmail(email) {
    throw new Error('getUserByEmail() not implemented');
  }

  async getAllUsers() {
    throw new Error('getAllUsers() not implemented');
  }
}

module.exports = UserDataAccessInterface;
