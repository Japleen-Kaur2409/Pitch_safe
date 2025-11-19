// tests/unit/use-cases/auth/LoginUseCase.test.js
const LoginUseCase = require('../../../../use-cases/auth/LoginUseCase');
const AuthInputData = require('../../../../use-cases/data-transfer/AuthInputData');
const bcrypt = require('bcrypt');

// Mock bcrypt
jest.mock('bcrypt');

describe('LoginUseCase', () => {
  let useCase;
  let mockUserDataAccess;
  let mockOutputBoundary;

  beforeEach(() => {
    mockUserDataAccess = {
      getUserByEmail: jest.fn()
    };

    mockOutputBoundary = {
      presentLoginSuccess: jest.fn(),
      presentLoginError: jest.fn()
    };

    useCase = new LoginUseCase(mockUserDataAccess, mockOutputBoundary);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Login', () => {
    it('should login successfully with correct credentials', async () => {
      const inputData = new AuthInputData('coach@example.com', 'password123');
      
      const mockUser = {
        coach_id: 1,
        username: 'coach@example.com',
        password: await bcrypt.hash('password123', 10),
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await useCase.execute(inputData);

      expect(mockUserDataAccess.getUserByEmail).toHaveBeenCalledWith('coach@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
      expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalledWith({
        userId: 1,
        email: 'coach@example.com',
        teamName: 'Boston Red Sox'
      });
      expect(mockOutputBoundary.presentLoginError).not.toHaveBeenCalled();
    });

    it('should handle case-sensitive emails', async () => {
      const inputData = new AuthInputData('Coach@Example.COM', 'password123');
      
      const mockUser = {
        coach_id: 1,
        username: 'Coach@Example.COM',
        password: await bcrypt.hash('password123', 10),
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalled();
    });

    it('should work with long passwords', async () => {
      const longPassword = 'a'.repeat(100);
      const inputData = new AuthInputData('coach@example.com', longPassword);
      
      const mockUser = {
        coach_id: 1,
        username: 'coach@example.com',
        password: await bcrypt.hash(longPassword, 10),
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalled();
    });

    it('should work with special characters in password', async () => {
      const specialPassword = 'P@$$w0rd!#%^&*()';
      const inputData = new AuthInputData('coach@example.com', specialPassword);
      
      const mockUser = {
        coach_id: 1,
        username: 'coach@example.com',
        password: await bcrypt.hash(specialPassword, 10),
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalled();
    });
  });

  describe('Login Failures - Invalid Credentials', () => {
    it('should fail when user does not exist', async () => {
      const inputData = new AuthInputData('nonexistent@example.com', 'password123');
      
      mockUserDataAccess.getUserByEmail.mockResolvedValue(null);

      await useCase.execute(inputData);

      expect(mockUserDataAccess.getUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Invalid credentials');
      expect(mockOutputBoundary.presentLoginSuccess).not.toHaveBeenCalled();
    });

    it('should fail when password is incorrect', async () => {
      const inputData = new AuthInputData('coach@example.com', 'wrongpassword');
      
      const mockUser = {
        coach_id: 1,
        username: 'coach@example.com',
        password: await bcrypt.hash('correctpassword', 10),
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await useCase.execute(inputData);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Invalid credentials');
      expect(mockOutputBoundary.presentLoginSuccess).not.toHaveBeenCalled();
    });

    it('should not reveal whether email or password is wrong', async () => {
      const nonExistentEmailInput = new AuthInputData('nonexistent@example.com', 'password123');
      mockUserDataAccess.getUserByEmail.mockResolvedValue(null);

      await useCase.execute(nonExistentEmailInput);
      const errorForNonExistentUser = mockOutputBoundary.presentLoginError.mock.calls[0][0];

      jest.clearAllMocks();

      const wrongPasswordInput = new AuthInputData('coach@example.com', 'wrongpassword');
      const mockUser = {
        coach_id: 1,
        username: 'coach@example.com',
        password: await bcrypt.hash('correctpassword', 10),
        team_name: 'Boston Red Sox'
      };
      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await useCase.execute(wrongPasswordInput);
      const errorForWrongPassword = mockOutputBoundary.presentLoginError.mock.calls[0][0];

      expect(errorForNonExistentUser).toBe(errorForWrongPassword);
      expect(errorForNonExistentUser).toBe('Invalid credentials');
    });
  });

  describe('Input Validation', () => {
    it('should fail when email is missing', async () => {
      const inputData = new AuthInputData(null, 'password123');

      await useCase.execute(inputData);

      expect(mockUserDataAccess.getUserByEmail).not.toHaveBeenCalled();
      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Email and password are required');
    });

    it('should fail when email is empty string', async () => {
      const inputData = new AuthInputData('', 'password123');

      await useCase.execute(inputData);

      expect(mockUserDataAccess.getUserByEmail).not.toHaveBeenCalled();
      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Email and password are required');
    });

    it('should fail when password is missing', async () => {
      const inputData = new AuthInputData('coach@example.com', null);

      await useCase.execute(inputData);

      expect(mockUserDataAccess.getUserByEmail).not.toHaveBeenCalled();
      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Email and password are required');
    });

    it('should fail when password is empty string', async () => {
      const inputData = new AuthInputData('coach@example.com', '');

      await useCase.execute(inputData);

      expect(mockUserDataAccess.getUserByEmail).not.toHaveBeenCalled();
      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Email and password are required');
    });

    it('should fail when both email and password are missing', async () => {
      const inputData = new AuthInputData(null, null);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Email and password are required');
    });

    it('should accept whitespace-only password (validation check only)', async () => {
      const inputData = new AuthInputData('coach@example.com', '   ');

      const mockUser = {
        coach_id: 1,
        username: 'coach@example.com',
        password: await bcrypt.hash('   ', 10),
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalled();
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection errors', async () => {
      const inputData = new AuthInputData('coach@example.com', 'password123');
      
      const dbError = new Error('Database connection failed');
      mockUserDataAccess.getUserByEmail.mockRejectedValue(dbError);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Database connection failed');
      expect(mockOutputBoundary.presentLoginSuccess).not.toHaveBeenCalled();
    });

    it('should handle query timeout errors', async () => {
      const inputData = new AuthInputData('coach@example.com', 'password123');
      
      const timeoutError = new Error('Query timeout');
      mockUserDataAccess.getUserByEmail.mockRejectedValue(timeoutError);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Query timeout');
    });

    it('should handle bcrypt comparison errors', async () => {
      const inputData = new AuthInputData('coach@example.com', 'password123');
      
      const mockUser = {
        coach_id: 1,
        username: 'coach@example.com',
        password: 'hashedpassword',
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Bcrypt error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined userData from database', async () => {
      const inputData = new AuthInputData('coach@example.com', 'password123');
      
      mockUserDataAccess.getUserByEmail.mockResolvedValue(undefined);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Invalid credentials');
    });

    it('should handle user object with missing fields', async () => {
      const inputData = new AuthInputData('coach@example.com', 'password123');
      
      const incompleteUser = {
        coach_id: 1,
        username: 'coach@example.com',
        password: await bcrypt.hash('password123', 10)
        // missing team_name
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(incompleteUser);
      bcrypt.compare.mockResolvedValue(true);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalledWith({
        userId: 1,
        email: 'coach@example.com',
        teamName: undefined
      });
    });

    it('should handle user with null password in database', async () => {
      const inputData = new AuthInputData('coach@example.com', 'password123');
      
      const mockUser = {
        coach_id: 1,
        username: 'coach@example.com',
        password: null,
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalledWith('Invalid credentials');
    });

    it('should handle extremely long email addresses', async () => {
      const longEmail = 'a'.repeat(200) + '@example.com';
      const inputData = new AuthInputData(longEmail, 'password123');
      
      mockUserDataAccess.getUserByEmail.mockResolvedValue(null);

      await useCase.execute(inputData);

      expect(mockUserDataAccess.getUserByEmail).toHaveBeenCalledWith(longEmail);
      expect(mockOutputBoundary.presentLoginError).toHaveBeenCalled();
    });

    it('should handle emails with unusual but valid characters', async () => {
      const unusualEmail = 'user+tag@sub.domain.example.com';
      const inputData = new AuthInputData(unusualEmail, 'password123');
      
      const mockUser = {
        coach_id: 1,
        username: unusualEmail,
        password: await bcrypt.hash('password123', 10),
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalled();
    });

    it('should handle password with null bytes', async () => {
      const passwordWithNull = 'pass\0word';
      const inputData = new AuthInputData('coach@example.com', passwordWithNull);
      
      const mockUser = {
        coach_id: 1,
        username: 'coach@example.com',
        password: await bcrypt.hash(passwordWithNull, 10),
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalled();
    });

    it('should handle numeric coach_id', async () => {
      const inputData = new AuthInputData('coach@example.com', 'password123');
      
      const mockUser = {
        coach_id: 999999,
        username: 'coach@example.com',
        password: await bcrypt.hash('password123', 10),
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalledWith({
        userId: 999999,
        email: 'coach@example.com',
        teamName: 'Boston Red Sox'
      });
    });

    it('should handle string coach_id', async () => {
      const inputData = new AuthInputData('coach@example.com', 'password123');
      
      const mockUser = {
        coach_id: '1',
        username: 'coach@example.com',
        password: await bcrypt.hash('password123', 10),
        team_name: 'Boston Red Sox'
      };

      mockUserDataAccess.getUserByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentLoginSuccess).toHaveBeenCalledWith({
        userId: '1',
        email: 'coach@example.com',
        teamName: 'Boston Red Sox'
      });
    });
  });

  describe('Validation Method', () => {
    it('should throw error when validation fails', () => {
      const inputData = new AuthInputData(null, null);

      expect(() => {
        useCase.validateInput(inputData);
      }).toThrow('Email and password are required');
    });

    it('should not throw when validation passes', () => {
      const inputData = new AuthInputData('coach@example.com', 'password123');

      expect(() => {
        useCase.validateInput(inputData);
      }).not.toThrow();
    });
  });
});
