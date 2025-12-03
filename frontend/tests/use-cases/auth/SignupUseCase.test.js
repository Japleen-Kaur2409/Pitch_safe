// frontend/src/use-cases/__tests__/SignupUseCase.test.js
import SignupUseCase from '../../../src/use-cases/auth/SignupUseCase';

describe('SignupUseCase', () => {
  let authDataAccess;
  let outputBoundary;
  let signupUseCase;

  beforeEach(() => {
    authDataAccess = {
      signup: jest.fn(),
    };
    outputBoundary = {
      presentSignupSuccess: jest.fn(),
      presentSignupError: jest.fn(),
    };
    signupUseCase = new SignupUseCase(authDataAccess, outputBoundary);
  });

  it('should throw error if email is missing', async () => {
    await signupUseCase.execute('', 'pass', 'pass', 'Team A');
    expect(outputBoundary.presentSignupError).toHaveBeenCalledWith('All fields are required');
  });

  it('should throw error if password is missing', async () => {
    await signupUseCase.execute('test@example.com', '', 'pass', 'Team A');
    expect(outputBoundary.presentSignupError).toHaveBeenCalledWith('All fields are required');
  });

  it('should throw error if confirmPassword is missing', async () => {
    await signupUseCase.execute('test@example.com', 'pass', '', 'Team A');
    expect(outputBoundary.presentSignupError).toHaveBeenCalledWith('All fields are required');
  });

  it('should throw error if teamName is missing', async () => {
    await signupUseCase.execute('test@example.com', 'pass', 'pass', '');
    expect(outputBoundary.presentSignupError).toHaveBeenCalledWith('All fields are required');
  });

  it('should throw error if passwords do not match', async () => {
    await signupUseCase.execute('test@example.com', 'pass1', 'pass2', 'Team A');
    expect(outputBoundary.presentSignupError).toHaveBeenCalledWith('Passwords do not match');
  });

  it('should call authDataAccess.signup and present success on valid input', async () => {
    const mockUserData = { id: 1, email: 'test@example.com' };
    authDataAccess.signup.mockResolvedValue(mockUserData);

    await signupUseCase.execute('test@example.com', 'pass', 'pass', 'Team A');

    expect(authDataAccess.signup).toHaveBeenCalledWith('test@example.com', 'pass', 'Team A');
    expect(outputBoundary.presentSignupSuccess).toHaveBeenCalledWith(mockUserData);
    expect(outputBoundary.presentSignupError).not.toHaveBeenCalled();
  });

  it('should present error if authDataAccess.signup throws', async () => {
    authDataAccess.signup.mockRejectedValue(new Error('Signup failed'));

    await signupUseCase.execute('test@example.com', 'pass', 'pass', 'Team A');

    expect(outputBoundary.presentSignupError).toHaveBeenCalledWith('Signup failed');
    expect(outputBoundary.presentSignupSuccess).not.toHaveBeenCalled();
  });
});
