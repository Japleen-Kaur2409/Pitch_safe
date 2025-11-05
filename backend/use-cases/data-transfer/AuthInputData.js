// backend/use-cases/data-transfer/AuthInputData.js
class AuthInputData {
  constructor(email, password, teamName = null) {
    this.email = email;
    this.password = password;
    this.teamName = teamName;
  }
}

module.exports = AuthInputData;