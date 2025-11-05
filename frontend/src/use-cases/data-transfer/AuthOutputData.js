// frontend/src/use-cases/data-transfer/AuthOutputData.js
class AuthOutputData {
  constructor(user, token = null) {
    this.user = user;
    this.token = token;
  }
}

export default AuthOutputData;