/**
 * Authentication Controller
 * 
 * Interface adapter that converts user input from the UI into
 * use case input data. Part of the Clean Architecture pattern.
 * 
 * This controller handles all authentication-related user actions
 * and delegates to the appropriate use cases.
 * 
 * @class AuthController
 */
import AuthInputData from '../../use-cases/data-transfer/AuthInputData';

class AuthController {
  /**
   * Creates a new AuthController instance
   * 
   * @param {LoginUseCase} loginUseCase - Use case for login logic
   * @param {SignupUseCase} signupUseCase - Use case for signup logic
   * @param {LogoutUseCase} logoutUseCase - Use case for logout logic
   */
  constructor(loginUseCase, signupUseCase, logoutUseCase) {
    this.loginUseCase = loginUseCase;
    this.signupUseCase = signupUseCase;
    this.logoutUseCase = logoutUseCase;
  }

  /**
   * Handles login request from the UI
   * 
   * Converts raw input into structured input data and
   * passes it to the login use case.
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<void>}
   */
  async handleLogin(email, password) {
    // Convert UI input into use case input data structure
    const inputData = new AuthInputData(email, password);
    
    // Execute the login use case
    await this.loginUseCase.execute(inputData.email, inputData.password);
  }

  /**
   * Handles signup request from the UI
   * 
   * Converts raw input into structured input data and
   * passes it to the signup use case.
   * 
   * @param {string} email - User's email address
   * @param {string} password - Desired password
   * @param {string} confirmPassword - Password confirmation
   * @param {string} teamName - Associated MLB team name
   * @returns {Promise<void>}
   */
  async handleSignup(email, password, confirmPassword, teamName) {
    // Convert UI input into use case input data structure
    const inputData = new AuthInputData(email, password, confirmPassword, teamName);
    
    // Execute the signup use case
    await this.signupUseCase.execute(
      inputData.email, 
      inputData.password, 
      inputData.confirmPassword, 
      inputData.teamName
    );
  }

  /**
   * Handles logout request from the UI
   * 
   * Delegates to the logout use case to clear session.
   * 
   * @returns {Promise<void>}
   */
  async handleLogout() {
    await this.logoutUseCase.execute();
  }
}

export default AuthController;