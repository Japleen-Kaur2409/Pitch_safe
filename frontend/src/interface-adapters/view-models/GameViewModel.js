// frontend/src/interface-adapters/view-models/GameViewModel.js
class GameViewModel {
  constructor() {
    this.state = {
      gameRecords: [],
      addGameRecordLoading: false,
      addGameRecordError: null,
      getGameRecordsLoading: false,
      getGameRecordsError: null,
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
  setAddGameRecordLoading(loading) {
    this.update({ addGameRecordLoading: loading });
  }

  setAddGameRecordError(error) {
    this.update({ addGameRecordError: error });
  }

  clearAddGameRecordError() {
    this.update({ addGameRecordError: null });
  }

  setGetGameRecordsLoading(loading) {
    this.update({ getGameRecordsLoading: loading });
  }

  setGetGameRecordsError(error) {
    this.update({ getGameRecordsError: error });
  }

  clearGetGameRecordsError() {
    this.update({ getGameRecordsError: null });
  }
}

export default GameViewModel;