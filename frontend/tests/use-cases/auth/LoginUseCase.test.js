// __tests__/use-cases/auth/LoginUseCase.test.js
import LoginUseCase from '../../../src/use-cases/auth/LoginUseCase';

describe('LoginUseCase', () => {
  let useCase;
  let mockAuthDataAccess;
  let mockOutputBoundary;

  beforeEach(() => {
    mockAuthDataAccess = {
      login: jest.fn()
    };
    mockOutputBoundary = {
      presentLoginSuccess: jest.fn(),
      presentLoginError: jest.fn()
    };
    
    useCase = new LoginUseCase(mockAuthDataAccess, mockOutputBoundary);
  });

  test('successfully logs in user', async () => {
    const mockUser = { 
      user: { id: 1, email: 'test@example.com' },
      token: 'abc123'
    };
    mockAuthDataAccess.login.mockResolvedValue(mockUser);

    await useCase.execute('test@example.com', 'password123');

    expect(mockAuthDataAccess.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalledWith(mockUser);
  });

  test('validates email is required', async () => {
    await useCase.execute('', 'password123');

    expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith(
      'Email and password are required'
    );
  });

  test('validates password is required', async () => {
    await useCase.execute('test@example.com', '');

    expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith(
      'Email and password are required'
    );
  });

  test('handles authentication errors', async () => {
    mockAuthDataAccess.login.mockRejectedValue(
      new Error('Invalid credentials')
    );

    await useCase.execute('test@example.com', 'wrong');

    expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith(
      'Invalid credentials'
    );
  });
});
