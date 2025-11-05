// frontend/src/interface-adapters/view-models/PlayerViewModel.js
class PlayerViewModel {
  constructor() {
    this.state = {
      players: [],
      selectedPlayer: null,
      playersLoading: true,
      playerDetailLoading: false,
      playersError: null,
      playerDetailError: null,
      playerMLBIds: {},
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
  setPlayersLoading(loading) {
    this.update({ playersLoading: loading });
  }

  setPlayerDetailLoading(loading) {
    this.update({ playerDetailLoading: loading });
  }

  clearSelectedPlayer() {
    this.update({ selectedPlayer: null });
  }

  clearErrors() {
    this.update({ playersError: null, playerDetailError: null });
  }
}

export default PlayerViewModel;