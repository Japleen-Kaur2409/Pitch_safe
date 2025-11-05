// backend/use-cases/auth/LoginUseCase.js
const bcrypt = require('bcrypt');

class LoginUseCase {
  constructor(userDataAccess, outputBoundary) {
    this.userDataAccess = userDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(inputData) {
    try {
      // Validate input
      this.validateInput(inputData);

      // Find user
      const user = await this.userDataAccess.getUserByEmail(inputData.email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isValid = await bcrypt.compare(inputData.password, user.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Present success
      this.outputBoundary.presentLoginSuccess({
        userId: user.coach_id,
        email: user.username,
        teamName: user.team_name
      });

    } catch (error) {
      this.outputBoundary.presentLoginError(error.message);
    }
  }

  validateInput(inputData) {
    if (!inputData.email || !inputData.password) {
      throw new Error('Email and password are required');
    }
  }
}

module.exports = LoginUseCase;