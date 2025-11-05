// frontend/src/frameworks-drivers/services/authService.js
import { apiService } from './apiService';

class AuthService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async login(email, password) {
    const response = await this.apiService.post('/api/auth/login', {
      email,
      password
    });

    if (!response.user) {
      throw new Error('Invalid response from server');
    }

    return response;
  }

  async signup(email, password, teamName) {
    const response = await this.apiService.post('/api/auth/signup', {
      email,
      password,
      teamName
    });

    if (!response.user) {
      throw new Error('Invalid response from server');
    }

    return response;
  }

  async logout() {
    // For now, we'll just clear local state
    // In a real app, you might call a logout endpoint
    return Promise.resolve();
  }
}

// Create and export singleton instance
export const authService = new AuthService(apiService);