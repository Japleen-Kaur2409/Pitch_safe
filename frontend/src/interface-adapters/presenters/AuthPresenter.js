// frontend/src/interface-adapters/presenters/AuthPresenter.js
import AuthOutputBoundary from '../../use-cases/auth/interfaces/AuthOutputBoundary';

class AuthPresenter extends AuthOutputBoundary {
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  presentLoginSuccess(userData) {
    this.viewModel.update({
      currentUser: userData.user,
      isAuthenticated: true,
      authError: null,
      isLoading: false
    });
  }

  presentLoginError(error) {
    this.viewModel.update({
      authError: error,
      isLoading: false,
      isAuthenticated: false,
      currentUser: null
    });
  }

  presentSignupSuccess(userData) {
    this.viewModel.update({
      currentUser: userData.user,
      isAuthenticated: true,
      authError: null,
      isLoading: false
    });
  }

  presentSignupError(error) {
    this.viewModel.update({
      authError: error,
      isLoading: false,
      isAuthenticated: false,
      currentUser: null
    });
  }

  presentLogoutSuccess() {
    this.viewModel.update({
      currentUser: null,
      isAuthenticated: false,
      authError: null,
      isLoading: false
    });
  }

  presentLogoutError(error) {
    this.viewModel.update({
      authError: error,
      isLoading: false
    });
  }
}

export default AuthPresenter;