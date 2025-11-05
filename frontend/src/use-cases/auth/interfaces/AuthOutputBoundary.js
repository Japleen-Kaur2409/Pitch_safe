// frontend/src/use-cases/auth/interfaces/AuthOutputBoundary.js
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

  presentLogoutSuccess() {
    throw new Error('Method not implemented');
  }

  presentLogoutError(error) {
    throw new Error('Method not implemented');
  }
}

export default AuthOutputBoundary;