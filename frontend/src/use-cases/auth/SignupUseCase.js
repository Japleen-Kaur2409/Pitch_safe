// frontend/src/use-cases/auth/SignupUseCase.js
class SignupUseCase {
  constructor(authDataAccess, outputBoundary) {
    this.authDataAccess = authDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(email, password, confirmPassword, teamName) {
    try {
      // Validate input
      if (!email || !password || !confirmPassword || !teamName) {
        throw new Error('All fields are required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Call data access layer
      const userData = await this.authDataAccess.signup(email, password, teamName);
      
      // Present success
      this.outputBoundary.presentSignupSuccess(userData);
    } catch (error) {
      this.outputBoundary.presentSignupError(error.message);
    }
  }
}

export default SignupUseCase;