// AuthPresenter.test.js
import AuthPresenter from '../../../src/interface-adapters/presenters/AuthPresenter';

describe('AuthPresenter', () => {
  let mockViewModel;
  let authPresenter;

  beforeEach(() => {
    mockViewModel = {
      update: jest.fn()
    };
    authPresenter = new AuthPresenter(mockViewModel);
  });

  describe('presentLoginSuccess', () => {
    it('should update view model with login success', () => {
      const userData = {
        user: { user_id: 1, email: 'test@example.com', teamName: 'Toronto Blue Jays' }
      };

      authPresenter.presentLoginSuccess(userData);

      expect(mockViewModel.update).toHaveBeenCalledWith({
        currentUser: userData.user,
        isAuthenticated: true,
        authError: null,
        isLoading: false
      });
    });

    it('should handle userData with token', () => {
      const userData = {
        user: { user_id: 1, email: 'test@example.com' },
        token: 'abc123'
      };

      authPresenter.presentLoginSuccess(userData);

      expect(mockViewModel.update).toHaveBeenCalledWith({
        currentUser: userData.user,
        isAuthenticated: true,
        authError: null,
        isLoading: false
      });
    });
  });

  describe('presentLoginError', () => {
    it('should update view model with login error', () => {
      authPresenter.presentLoginError('Invalid credentials');

      expect(mockViewModel.update).toHaveBeenCalledWith({
        authError: 'Invalid credentials',
        isLoading: false,
        isAuthenticated: false,
        currentUser: null
      });
    });

    it('should handle empty error message', () => {
      authPresenter.presentLoginError('');

      expect(mockViewModel.update).toHaveBeenCalledWith({
        authError: '',
        isLoading: false,
        isAuthenticated: false,
        currentUser: null
      });
    });
  });

  describe('presentSignupSuccess', () => {
    it('should update view model with signup success', () => {
      const userData = {
        user: { user_id: 2, email: 'newuser@example.com', teamName: 'New York Yankees' }
      };

      authPresenter.presentSignupSuccess(userData);

      expect(mockViewModel.update).toHaveBeenCalledWith({
        currentUser: userData.user,
        isAuthenticated: true,
        authError: null,
        isLoading: false
      });
    });
  });

  describe('presentSignupError', () => {
    it('should update view model with signup error', () => {
      authPresenter.presentSignupError('Email already exists');

      expect(mockViewModel.update).toHaveBeenCalledWith({
        authError: 'Email already exists',
        isLoading: false,
        isAuthenticated: false,
        currentUser: null
      });
    });
  });

  describe('presentLogoutSuccess', () => {
    it('should update view model with logout success', () => {
      authPresenter.presentLogoutSuccess();

      expect(mockViewModel.update).toHaveBeenCalledWith({
        currentUser: null,
        isAuthenticated: false,
        authError: null,
        isLoading: false
      });
    });
  });

  describe('presentLogoutError', () => {
    it('should update view model with logout error', () => {
      authPresenter.presentLogoutError('Logout failed');

      expect(mockViewModel.update).toHaveBeenCalledWith({
        authError: 'Logout failed',
        isLoading: false
      });
    });

    it('should not clear auth state on logout error', () => {
      authPresenter.presentLogoutError('Network error');

      const updateCall = mockViewModel.update.mock.calls[0][0];
      expect(updateCall).not.toHaveProperty('currentUser');
      expect(updateCall).not.toHaveProperty('isAuthenticated');
    });
  });
});
