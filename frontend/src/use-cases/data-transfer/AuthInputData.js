// frontend/src/use-cases/data-transfer/AuthInputData.js
class AuthInputData {
  constructor(email, password, confirmPassword = null, teamName = null) {
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.teamName = teamName;
  }
}

export default AuthInputData;