// backend/use-cases/data-transfer/AuthOutputData.js
class AuthOutputData {
  constructor(userId, email, teamName) {
    this.userId = userId;
    this.email = email;
    this.teamName = teamName;
  }
}

module.exports = AuthOutputData;