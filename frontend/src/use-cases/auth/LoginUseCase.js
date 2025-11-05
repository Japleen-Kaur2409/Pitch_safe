// frontend/src/use-cases/auth/LoginUseCase.js
class LoginUseCase {
  constructor(authDataAccess, outputBoundary) {
    this.authDataAccess = authDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Call data access layer
      const userData = await this.authDataAccess.login(email, password);
      
      // Present success
      this.outputBoundary.presentLoginSuccess(userData);
    } catch (error) {
      this.outputBoundary.presentLoginError(error.message);
    }
  }
}

export default LoginUseCase;