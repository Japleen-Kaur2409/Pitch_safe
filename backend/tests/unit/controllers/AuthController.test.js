// tests/unit/controllers/AuthController.test.js
const AuthController = require('../../../interface-adapters/controllers/AuthController');
const AuthInputData = require('../../../use-cases/data-transfer/AuthInputData');

jest.mock('../../../use-cases/data-transfer/AuthInputData');

describe('AuthController', () => {
  let authController;
  let mockLoginUseCase;
  let mockSignupUseCase;
  let mockViewModel;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Mock use cases
    mockLoginUseCase = {
      execute: jest.fn()
    };
    mockSignupUseCase = {
      execute: jest.fn()
    };

    // Mock ViewModel
    mockViewModel = {
      getResponse: jest.fn(),
      clear: jest.fn()
    };

    // Mock Express req/res
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Create controller instance
    authController = new AuthController(mockLoginUseCase, mockSignupUseCase, mockViewModel);
  });

  describe('login', () => {
    it('should successfully login a user and return response', async () => {
      // Arrange
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { status: 200, body: { token: 'jwt-token', userId: 1 } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await authController.login(mockReq, mockRes);

      // Assert
      expect(AuthInputData).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockLoginUseCase.execute).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ token: 'jwt-token', userId: 1 });
      expect(mockViewModel.clear).toHaveBeenCalled();
    });

    it('should handle login with invalid credentials', async () => {
      // Arrange
      mockReq.body = { email: 'wrong@example.com', password: 'wrongpass' };
      const mockResponse = { status: 401, body: { error: 'Invalid credentials' } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await authController.login(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should handle use case error during login', async () => {
      // Arrange
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      mockLoginUseCase.execute.mockRejectedValue(new Error('Database error'));

      // Act
      await authController.login(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });

    it('should handle when viewModel returns no response', async () => {
      // Arrange
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      mockViewModel.getResponse.mockReturnValue(null);

      // Act
      await authController.login(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No response generated' });
    });
  });

  describe('signup', () => {
    it('should successfully signup a user and return response', async () => {
      // Arrange
      mockReq.body = {
        email: 'newuser@example.com',
        password: 'password123',
        teamName: 'Team A'
      };
      const mockResponse = { status: 201, body: { userId: 2, email: 'newuser@example.com' } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await authController.signup(mockReq, mockRes);

      // Assert
      expect(AuthInputData).toHaveBeenCalledWith('newuser@example.com', 'password123', 'Team A');
      expect(mockSignupUseCase.execute).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ userId: 2, email: 'newuser@example.com' });
      expect(mockViewModel.clear).toHaveBeenCalled();
    });

    it('should handle duplicate email during signup', async () => {
      // Arrange
      mockReq.body = {
        email: 'existing@example.com',
        password: 'password123',
        teamName: 'Team B'
      };
      const mockResponse = { status: 409, body: { error: 'Email already exists' } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await authController.signup(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });

    it('should handle use case error during signup', async () => {
      // Arrange
      mockReq.body = {
        email: 'newuser@example.com',
        password: 'password123',
        teamName: 'Team A'
      };
      mockSignupUseCase.execute.mockRejectedValue(new Error('Validation error'));

      // Act
      await authController.signup(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });

    it('should handle when viewModel returns no response during signup', async () => {
      // Arrange
      mockReq.body = {
        email: 'newuser@example.com',
        password: 'password123',
        teamName: 'Team A'
      };
      mockViewModel.getResponse.mockReturnValue(null);

      // Act
      await authController.signup(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No response generated' });
    });
  });
});