import { authService } from '../../../src/frameworks-drivers/services/authService';

// Mock the apiService
jest.mock('../../../src/frameworks-drivers/services/apiService', () => ({
  apiService: {
    post: jest.fn()
  }
}));

import { apiService } from '../../../src/frameworks-drivers/services/apiService';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        user: { user_id: 1, email: 'test@example.com' },
        token: 'abc123'
      };
      apiService.post.mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password123');

      expect(apiService.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when no user in response', async () => {
      apiService.post.mockResolvedValue({});

      await expect(authService.login('test@example.com', 'password'))
        .rejects.toThrow('Invalid response from server');
    });

    it('should propagate API errors', async () => {
      apiService.post.mockRejectedValue(new Error('Network error'));

      await expect(authService.login('test@example.com', 'password'))
        .rejects.toThrow('Network error');
    });
  });

  describe('signup', () => {
    it('should signup successfully', async () => {
      const mockResponse = {
        user: { user_id: 1, email: 'new@example.com', teamName: 'Toronto Blue Jays' }
      };
      apiService.post.mockResolvedValue(mockResponse);

      const result = await authService.signup('new@example.com', 'password123', 'Toronto Blue Jays');

      expect(apiService.post).toHaveBeenCalledWith('/api/auth/signup', {
        email: 'new@example.com',
        password: 'password123',
        teamName: 'Toronto Blue Jays'
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when no user in response', async () => {
      apiService.post.mockResolvedValue({});

      await expect(authService.signup('test@example.com', 'password', 'Team'))
        .rejects.toThrow('Invalid response from server');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const result = await authService.logout();

      expect(result).toBeUndefined();
    });
  });
});
