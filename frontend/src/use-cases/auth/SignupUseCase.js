/**
 * Signup Use Case
 * 
 * Handles the business logic for new user registration.
 * Validates input data and creates new user accounts.
 * 
 * @class SignupUseCase
 */
class SignupUseCase {
  /**
   * Creates a new SignupUseCase instance
   * 
   * @param {Object} authDataAccess - Data access layer for authentication
   * @param {Object} outputBoundary - Presenter for formatting output
   */
  constructor(authDataAccess, outputBoundary) {
    this.authDataAccess = authDataAccess;
    this.outputBoundary = outputBoundary;
  }

  /**
   * Executes the signup use case
   * 
   * Validates all input fields, checks password confirmation,
   * and creates a new user account.
   * 
   * @param {string} email - User's email address
   * @param {string} password - Desired password
   * @param {string} confirmPassword - Password confirmation
   * @param {string} teamName - Associated MLB team name
   * @returns {Promise<void>}
   */
  async execute(email, password, confirmPassword, teamName) {
    try {
      // Validate all required fields are present
      if (!email || !password || !confirmPassword || !teamName) {
        throw new Error('All fields are required');
      }

      // Business rule: Passwords must match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Call data access layer to create new user
      const userData = await this.authDataAccess.signup(email, password, teamName);
      
      // Present success to the UI
      this.outputBoundary.presentSignupSuccess(userData);
    } catch (error) {
      // Present error to the UI
      this.outputBoundary.presentSignupError(error.message);
    }
  }
}

export default SignupUseCase;