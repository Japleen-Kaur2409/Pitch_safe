/**
 * Authentication View Model
 * 
 * Manages authentication-related state for the UI.
 * Implements the Observable pattern for state change notifications.
 * 
 * This view model acts as a bridge between use cases and UI components,
 * maintaining the current authentication state and notifying listeners
 * of any changes.
 * 
 * @class AuthViewModel
 */
class AuthViewModel {
  /**
   * Creates a new AuthViewModel instance with initial state
   */
  constructor() {
    this.state = {
      currentUser: null,           // Currently logged-in user object
      isAuthenticated: false,      // Authentication status flag
      authError: null,             // Error message from auth operations
      isLoading: false,            // Loading state for async operations
      listeners: []                // Array of subscriber functions
    };
  }

  /**
   * Updates the view model state and notifies all listeners
   * 
   * @param {Object} newState - Partial state object to merge with current state
   */
  update(newState) {
    // Merge new state with existing state
    this.state = { ...this.state, ...newState };
    
    // Notify all subscribed components of the state change
    this.notifyListeners();
  }

  /**
   * Gets a copy of the current state
   * 
   * Returns a shallow copy to prevent direct state mutation.
   * 
   * @returns {Object} Current state object
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Subscribes a listener function to state changes
   * 
   * Implements the Observer pattern. Listeners are called whenever
   * the state changes via the update() method.
   * 
   * @param {Function} listener - Callback function to invoke on state changes
   * @returns {Function} Unsubscribe function to remove the listener
   */
  subscribe(listener) {
    this.state.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.state.listeners = this.state.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notifies all subscribed listeners of state changes
   * 
   * @private
   */
  notifyListeners() {
    this.state.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Sets the loading state
   * 
   * @param {boolean} isLoading - Whether an async operation is in progress
   */
  setLoading(isLoading) {
    this.update({ isLoading });
  }

  /**
   * Sets an error message
   * 
   * @param {string} error - Error message to display
   */
  setError(error) {
    this.update({ authError: error });
  }

  /**
   * Clears the current error message
   */
  clearError() {
    this.update({ authError: null });
  }

  /**
   * Completely resets the auth state
   * 
   * Used when logging out to clear all user data while
   * preserving the listener subscriptions.
   */
  reset() {
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      authError: null,
      isLoading: false,
      listeners: this.state.listeners // Preserve listeners
    };
    this.notifyListeners();
  }
}

export default AuthViewModel;