// frontend/src/interface-adapters/view-models/RosterViewModel.js
class RosterViewModel {
  constructor() {
    this.state = {
      currentView: 'roster', // 'roster', 'stats', 'download'
      selectedPlayer: null,
      showAddPlayerForm: false,
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
  navigateToRoster() {
    this.update({ currentView: 'roster', selectedPlayer: null });
  }

  navigateToStats() {
    this.update({ currentView: 'stats', selectedPlayer: null });
  }

  navigateToDownload() {
    this.update({ currentView: 'download', selectedPlayer: null });
  }

  selectPlayer(player) {
    this.update({ selectedPlayer: player });
  }

  showAddPlayerForm(show) {
    this.update({ showAddPlayerForm: show });
  }
}

export default RosterViewModel;