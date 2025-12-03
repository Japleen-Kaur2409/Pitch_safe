// tests/unit/presenters/AuthPresenter.test.js
const AuthPresenter = require('../../../interface-adapters/presenters/AuthPresenter');

describe('AuthPresenter', () => {
  let presenter;
  let mockViewModel;

  beforeEach(() => {
    mockViewModel = {
      setResponse: jest.fn()
    };
    presenter = new AuthPresenter(mockViewModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('presentLoginSuccess', () => {
    it('should present login success with correct status and user data', () => {
      const userData = {
        userId: 1,
        email: 'user@example.com',
        teamName: 'Team A'
      };

      presenter.presentLoginSuccess(userData);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 200,
        body: {
          user: {
            coach_id: 1,
            email: 'user@example.com',
            teamName: 'Team A'
          }
        }
      });
    });

    it('should handle user data with special characters', () => {
      const userData = {
        userId: 2,
        email: 'user+tag@example.com',
        teamName: 'Team @ League'
      };

      presenter.presentLoginSuccess(userData);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 200,
          body: expect.objectContaining({
            user: expect.objectContaining({
              email: 'user+tag@example.com',
              teamName: 'Team @ League'
            })
          })
        })
      );
    });

    it('should handle null teamName', () => {
      const userData = {
        userId: 3,
        email: 'user@example.com',
        teamName: null
      };

      presenter.presentLoginSuccess(userData);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            user: expect.objectContaining({
              teamName: null
            })
          })
        })
      );
    });
  });

  describe('presentLoginError', () => {
    it('should present login error with 401 status', () => {
      const error = 'Invalid credentials';

      presenter.presentLoginError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 401,
        body: { error: 'Invalid credentials' }
      });
    });

    it('should handle different error messages', () => {
      const errors = [
        'User not found',
        'Password incorrect',
        'Account locked'
      ];

      errors.forEach(error => {
        presenter.presentLoginError(error);
        expect(mockViewModel.setResponse).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 401,
            body: { error }
          })
        );
      });
    });
  });

  describe('presentSignupSuccess', () => {
    it('should present signup success with correct status', () => {
      const userData = {
        userId: 4,
        email: 'newuser@example.com',
        teamName: 'New Team'
      };

      presenter.presentSignupSuccess(userData);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 201,
        body: {
          user: {
            coach_id: 4,
            email: 'newuser@example.com',
            teamName: 'New Team'
          }
        }
      });
    });

    it('should return 201 status for successful signup', () => {
      presenter.presentSignupSuccess({
        userId: 5,
        email: 'test@example.com',
        teamName: 'Test Team'
      });

      const call = mockViewModel.setResponse.mock.calls[0][0];
      expect(call.status).toBe(201);
    });
  });

  describe('presentSignupError', () => {
    it('should present signup error with 400 status', () => {
      const error = 'Email already exists';

      presenter.presentSignupError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 400,
        body: { error: 'Email already exists' }
      });
    });

    it('should handle validation errors', () => {
      const errors = [
        'Email already exists',
        'Password too weak',
        'Invalid email format'
      ];

      errors.forEach(error => {
        presenter.presentSignupError(error);
        expect(mockViewModel.setResponse).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 400,
            body: { error }
          })
        );
      });
    });
  });
});