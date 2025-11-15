// frontend/src/interface-adapters/view-models/MLViewModel.js
class MLViewModel {
  constructor() {
    this.state = {
      data: null,
      error: null,
      loading: false
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  setSuccess(data) {
    this.state = {
      data,
      error: null,
      loading: false
    };
    this.notify();
  }

  setError(error) {
    this.state = {
      error,
      data: null,
      loading: false
    };
    this.notify();
  }

  setLoading(loading) {
    this.state = {
      ...this.state,
      loading
    };
    this.notify();
  }

  getState() {
    return this.state;
  }

  getData() {
    return this.state.data;
  }

  getError() {
    return this.state.error;
  }

  isLoading() {
    return this.state.loading;
  }
}

export default MLViewModel;