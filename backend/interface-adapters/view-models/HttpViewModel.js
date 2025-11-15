class HttpViewModel {
  constructor() {
    this.response = null;
  }

  setResponse(responseData) {
    this.response = responseData;
  }

  // Backward-compatible methods expected by presenters
  setSuccess(data) {
    this.response = {
      success: true,
      data: data
    };
  }

  setError(errorObj) {
    // errorObj may be a string or an object { error, message }
    if (typeof errorObj === 'string') {
      this.response = {
        success: false,
        error: errorObj
      };
    } else {
      this.response = Object.assign({ success: false }, errorObj);
    }
  }

  setLoading(isLoading) {
    // Keep existing response but add loading flag
    const current = this.response || {};
    this.response = Object.assign({}, current, { loading: !!isLoading });
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
