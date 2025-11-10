/**
 * Login Use Case
 * 
 * Handles the business logic for user authentication.
 * Validates credentials and communicates with the auth service.
 * 
 * This follows the Clean Architecture pattern where use cases contain
 * application-specific business rules.
 * 
 * @class LoginUseCase
 */
class LoginUseCase {
  /**
   * Creates a new LoginUseCase instance
   * 
   * @param {Object} authDataAccess - Data access layer for authentication
   * @param {Object} outputBoundary - Presenter for formatting output
   */
  constructor(authDataAccess, outputBoundary) {
    this.authDataAccess = authDataAccess;
    this.outputBoundary = outputBoundary;
  }

  /**
   * Executes the login use case
   * 
   * Validates input, attempts authentication, and presents result.
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<void>}
   */
  async execute(email, password) {
    try {
      // Validate input before making API call
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Call data access layer to authenticate user
      const userData = await this.authDataAccess.login(email, password);
      
      // Present success to the UI through the output boundary
      this.outputBoundary.presentLoginSuccess(userData);
    } catch (error) {
      // Present error to the UI through the output boundary
      this.outputBoundary.presentLoginError(error.message);
    }
  }
}

export default LoginUseCase;