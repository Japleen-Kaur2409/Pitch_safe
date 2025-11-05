// frontend/src/interface-adapters/view-models/AuthViewModel.js
class AuthViewModel {
  constructor() {
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      authError: null,
      isLoading: false,
      listeners: []
    };
  }

  update(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  getState() {
    return { ...this.state };
  }

  subscribe(listener) {
    this.state.listeners.push(listener);
    return () => {
      this.state.listeners = this.state.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.state.listeners.forEach(listener => listener(this.state));
  }

  // Helper methods
  setLoading(isLoading) {
    this.update({ isLoading });
  }

  setError(error) {
    this.update({ authError: error });
  }

  clearError() {
    this.update({ authError: null });
  }
}

export default AuthViewModel;