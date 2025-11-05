// frontend/src/interface-adapters/view-models/NavigationViewModel.js
class NavigationViewModel {
  constructor() {
    this.state = {
      currentView: 'roster', // 'roster', 'playerDetail', 'stats', 'download'
      selectedPlayer: null,
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
}

export default NavigationViewModel;