// __tests__/frameworks-drivers/services/apiService.test.js
import { apiService } from '../../../src/frameworks-drivers/services/apiService';

describe('ApiService', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('get', () => {
    test('makes GET request successfully', async () => {
      const mockData = { data: 'test' };
      fetch.mockResponseOnce(JSON.stringify(mockData));

      const result = await apiService.get('/api/test');

      expect(fetch).toHaveBeenCalledWith('http://localhost:5001/api/test');
      expect(result).toEqual(mockData);
    });

    test('handles HTTP errors', async () => {
      fetch.mockResponseOnce('', { status: 404 });

      await expect(apiService.get('/api/test')).rejects.toThrow(
        'HTTP error! status: 404'
      );
    });

    test('handles network errors', async () => {
      fetch.mockReject(new Error('Network error'));

      await expect(apiService.get('/api/test')).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('post', () => {
    test('makes POST request successfully', async () => {
      const mockData = { success: true };
      const postData = { name: 'test' };
      
      fetch.mockResponseOnce(JSON.stringify(mockData));

      const result = await apiService.post('/api/test', postData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/test',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        })
      );
      expect(result).toEqual(mockData);
    });

    test('handles POST errors with error message', async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ error: 'Validation failed' }),
        { status: 400 }
      );

      await expect(
        apiService.post('/api/test', {})
      ).rejects.toThrow('Validation failed');
    });
  });
});
