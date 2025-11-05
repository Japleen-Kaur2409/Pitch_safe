// backend/use-cases/auth/interfaces/AuthInputBoundary.js
class AuthInputBoundary {
  async execute(inputData) {
    throw new Error('Method not implemented');
  }
}

class AuthOutputBoundary {
  presentLoginSuccess(userData) {
    throw new Error('Method not implemented');
  }

  presentLoginError(error) {
    throw new Error('Method not implemented');
  }

  presentSignupSuccess(userData) {
    throw new Error('Method not implemented');
  }

  presentSignupError(error) {
    throw new Error('Method not implemented');
  }
}

module.exports = {
  AuthInputBoundary,
  AuthOutputBoundary
};