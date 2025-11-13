/**
 * Logout Use Case
 * 
 * Handles the business logic for user logout.
 * Clears user session and any stored credentials.
 * 
 * @class LogoutUseCase
 */
class LogoutUseCase {
  /**
   * Creates a new LogoutUseCase instance
   * 
   * @param {Object} outputBoundary - Presenter for formatting output
   */
  constructor(outputBoundary) {
    this.outputBoundary = outputBoundary;
  }

  /**
   * Executes the logout use case
   * 
   * Clears local storage and session data, then presents success.
   * 
   * @returns {Promise<void>}
   */
  async execute() {
    try {
      // Clear any stored credentials from browser storage
      try {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        sessionStorage.clear();
      } catch (e) {
        console.warn('Could not clear storage:', e);
      }
      
      // Present logout success to the UI
      this.outputBoundary.presentLogoutSuccess();
    } catch (error) {
      // Present error to the UI
      this.outputBoundary.presentLogoutError(error.message);
    }
  }
}

export default LogoutUseCase;