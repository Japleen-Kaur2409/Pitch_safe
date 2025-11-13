/**
 * Authentication Presenter
 * 
 * Transforms use case output into view model updates.
 * Implements the Output Boundary interface for authentication operations.
 * 
 * Responsibilities:
 * - Format authentication results for UI consumption
 * - Update view model with success/error states
 * - Transform domain data into UI-friendly format
 * 
 * This presenter follows the Dependency Inversion Principle:
 * - Use cases depend on OutputBoundary interface
 * - Presenter implements the interface
 * - Use cases don't know about view models
 * 
 * @class AuthPresenter
 */
import AuthOutputBoundary from '../../use-cases/auth/interfaces/AuthOutputBoundary';

class AuthPresenter extends AuthOutputBoundary {
  /**
   * Creates a new AuthPresenter instance
   * 
   * @param {AuthViewModel} viewModel - View model to update with presentation data
   */
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  /**
   * Presents successful login result to the UI
   * 
   * Transforms user data from use case into UI state:
   * - Sets authenticated flag to true
   * - Stores current user information
   * - Clears any previous errors
   * - Stops loading indicator
   * 
   * @param {Object} userData - User data from login use case
   * @param {Object} userData.user - User object with profile info
   */
  presentLoginSuccess(userData) {
    this.viewModel.update({
      currentUser: userData.user,    // Store logged-in user
      isAuthenticated: true,         // Set auth flag
      authError: null,               // Clear any previous errors
      isLoading: false               // Stop loading spinner
    });
  }

  /**
   * Presents login error to the UI
   * 
   * Updates view model to show error message and reset auth state.
   * 
   * @param {string} error - Error message to display
   */
  presentLoginError(error) {
    this.viewModel.update({
      authError: error,              // Show error message
      isLoading: false,              // Stop loading spinner
      isAuthenticated: false,        // Ensure not authenticated
      currentUser: null              // Clear any partial user data
    });
  }

  /**
   * Presents successful signup result to the UI
   * 
   * After successful registration, automatically log the user in
   * by setting their authenticated state.
   * 
   * @param {Object} userData - User data from signup use case
   * @param {Object} userData.user - Newly created user object
   */
  presentSignupSuccess(userData) {
    this.viewModel.update({
      currentUser: userData.user,    // Store new user
      isAuthenticated: true,         // Auto-login after signup
      authError: null,               // Clear any previous errors
      isLoading: false               // Stop loading spinner
    });
  }

  /**
   * Presents signup error to the UI
   * 
   * Common signup errors:
   * - Email already exists
   * - Password too weak
   * - Invalid team selection
   * 
   * @param {string} error - Error message to display
   */
  presentSignupError(error) {
    this.viewModel.update({
      authError: error,              // Show error message
      isLoading: false,              // Stop loading spinner
      isAuthenticated: false,        // Ensure not authenticated
      currentUser: null              // Clear any partial user data
    });
  }

  /**
   * Presents successful logout result to the UI
   * 
   * Clears all user session data and resets to unauthenticated state.
   */
  presentLogoutSuccess() {
    this.viewModel.update({
      currentUser: null,             // Clear user data
      isAuthenticated: false,        // Set to unauthenticated
      authError: null,               // Clear any errors
      isLoading: false               // Stop loading spinner
    });
  }

  /**
   * Presents logout error to the UI
   * 
   * Rare case - logout should almost never fail.
   * If it does, still clear critical auth state for security.
   * 
   * @param {string} error - Error message to display
   */
  presentLogoutError(error) {
    this.viewModel.update({
      authError: error,              // Show error message
      isLoading: false               // Stop loading spinner
      // Note: Don't clear auth state on logout error for security
    });
  }
}

export default AuthPresenter;