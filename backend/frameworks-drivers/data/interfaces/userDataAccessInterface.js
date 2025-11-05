// backend/frameworks-drivers/data/interfaces/userDataAccessInterface.js
class UserDataAccessInterface {
  async createUser(email, hashedPassword, teamName) {
    throw new Error('Method not implemented');
  }

  async getUserByEmail(email) {
    throw new Error('Method not implemented');
  }

  async getAllUsers() {
    throw new Error('Method not implemented');
  }
}

module.exports = UserDataAccessInterface;