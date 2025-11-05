// backend/interface-adapters/presenters/AuthPresenter.js
const { AuthOutputBoundary } = require('../../use-cases/auth/interfaces/AuthInputBoundary');

class AuthPresenter extends AuthOutputBoundary {
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  presentLoginSuccess(userData) {
    this.viewModel.setResponse({
      status: 200,
      body: {
        user: {
          coach_id: userData.userId,
          email: userData.email,
          teamName: userData.teamName
        }
      }
    });
  }

  presentLoginError(error) {
    this.viewModel.setResponse({
      status: 401,
      body: { error }
    });
  }

  presentSignupSuccess(userData) {
    this.viewModel.setResponse({
      status: 201,
      body: {
        user: {
          coach_id: userData.userId,
          email: userData.email,
          teamName: userData.teamName
        }
      }
    });
  }

  presentSignupError(error) {
    this.viewModel.setResponse({
      status: 400,
      body: { error }
    });
  }
}

module.exports = AuthPresenter;