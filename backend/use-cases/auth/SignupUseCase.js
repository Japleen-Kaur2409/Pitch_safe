// backend/use-cases/auth/SignupUseCase.js
const bcrypt = require('bcrypt');

class SignupUseCase {
  constructor(userDataAccess, outputBoundary) {
    this.userDataAccess = userDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(inputData) {
    try {
      // Validate input
      this.validateInput(inputData);

      // Check if user already exists
      const existingUser = await this.userDataAccess.getUserByEmail(inputData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(inputData.password, 10);

      // Create user
      const user = await this.userDataAccess.createUser(
        inputData.email,
        hashedPassword,
        inputData.teamName
      );

      // Present success
      this.outputBoundary.presentSignupSuccess({
        userId: user.coach_id,
        email: user.username,
        teamName: user.team_name
      });

    } catch (error) {
      this.outputBoundary.presentSignupError(error.message);
    }
  }

  validateInput(inputData) {
    const errors = [];

    if (!inputData.email || !inputData.email.includes('@')) {
      errors.push('Valid email is required');
    }

    if (!inputData.password || inputData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    if (!inputData.teamName) {
      errors.push('Team name is required');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }
}

module.exports = SignupUseCase;