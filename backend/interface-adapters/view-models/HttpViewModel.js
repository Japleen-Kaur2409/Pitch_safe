class HttpViewModel {
  constructor() {
    this.response = null;
  }

  setResponse(responseData) {
    this.response = responseData;
  }

  getResponse() {
    return this.response;
  }

  hasResponse() {
    return this.response !== null;
  }

  clear() {
    this.response = null;
  }
}

module.exports = HttpViewModel;