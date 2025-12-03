// __tests__/interface-adapters/controllers/AuthController.test.js
import AuthController from '../../../src/interface-adapters/controllers/AuthController';

describe('AuthController', () => {
  let controller;
  let mockLoginUseCase;
  let mockSignupUseCase;
  let mockLogoutUseCase;

  beforeEach(() => {
    mockLoginUseCase = { execute: jest.fn() };
    mockSignupUseCase = { execute: jest.fn() };
    mockLogoutUseCase = { execute: jest.fn() };
    
    controller = new AuthController(
      mockLoginUseCase,
      mockSignupUseCase,
      mockLogoutUseCase
    );
  });

  describe('handleLogin', () => {
    test('calls login use case with correct parameters', async () => {
      await controller.handleLogin('test@example.com', 'password123');
      
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });

    test('handles login errors', async () => {
      mockLoginUseCase.execute.mockRejectedValue(new Error('Login failed'));
      
      await expect(
        controller.handleLogin('test@example.com', 'wrong')
      ).rejects.toThrow('Login failed');
    });
  });

  describe('handleSignup', () => {
    test('calls signup use case with correct parameters', async () => {
      await controller.handleSignup(
        'test@example.com',
        'password123',
        'password123',
        'New York Yankees'
      );
      
      expect(mockSignupUseCase.execute).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'password123',
        'New York Yankees'
      );
    });
  });

  describe('handleLogout', () => {
    test('calls logout use case', async () => {
      await controller.handleLogout();
      expect(mockLogoutUseCase.execute).toHaveBeenCalled();
    });
  });
});
