import { mlbApiService } from '../../../src/frameworks-drivers/services/mlbApiService';

describe('MLBApiService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
    console.warn.mockRestore();
  });

  describe('getPlayerId', () => {
    it('should find exact player match', async () => {
      const mockResponse = {
        people: [
          { id: 543037, fullName: 'John Doe', firstName: 'John', lastName: 'Doe' }
        ]
      };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await mlbApiService.getPlayerId('John', 'Doe');

      expect(result).toBe(543037);
    });

    it('should return first result when no exact match', async () => {
      const mockResponse = {
        people: [
          { id: 543037, fullName: 'Johnny Doe', firstName: 'Johnny', lastName: 'Doe' }
        ]
      };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await mlbApiService.getPlayerId('John', 'Doe');

      expect(result).toBe(543037);
    });

    it('should return null when no players found', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ people: [] })
      });

      const result = await mlbApiService.getPlayerId('Unknown', 'Player');

      expect(result).toBeNull();
    });

    it('should handle API error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const result = await mlbApiService.getPlayerId('John', 'Doe');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle fetch error', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await mlbApiService.getPlayerId('John', 'Doe');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getPlayerDetails', () => {
    it('should get player details and format them', async () => {
      const mockResponse = {
        people: [{
          height: '74',
          weight: 200,
          batSide: { code: 'R' },
          pitchHand: { code: 'R' },
          birthDate: '1990-01-01',
          currentTeam: { name: 'Toronto Blue Jays' },
          primaryPosition: { abbreviation: 'P' },
          mlbDebutDate: '2015-04-01'
        }]
      };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await mlbApiService.getPlayerDetails(543037);

      expect(result.height).toBe('6\'2"');
      expect(result.weight).toBe(200);
      expect(result.age).toBeGreaterThan(0);
    });

    it('should handle missing height', async () => {
      const mockResponse = {
        people: [{
          height: null,
          weight: 200
        }]
      };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await mlbApiService.getPlayerDetails(543037);

      expect(result.height).toBeNull();
    });

    it('should return null when no people found', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ people: [] })
      });

      const result = await mlbApiService.getPlayerDetails(543037);

      expect(result).toBeNull();
    });

    it('should handle API error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404
      });

      const result = await mlbApiService.getPlayerDetails(543037);

      expect(result).toBeNull();
    });

    it('should handle fetch error', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await mlbApiService.getPlayerDetails(543037);

      expect(result).toBeNull();
    });
  });

  describe('getPlayerImage', () => {
    it('should return image URLs', () => {
      const result = mlbApiService.getPlayerImage(543037);

      expect(result).toHaveProperty('primary');
      expect(result).toHaveProperty('fallback1');
      expect(result).toHaveProperty('fallback2');
      expect(result).toHaveProperty('fallback3');
      expect(result.primary).toContain('543037');
    });

    it('should return null when no player ID', () => {
      const result = mlbApiService.getPlayerImage(null);

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalled();
    });

    it('should return null for undefined player ID', () => {
      const result = mlbApiService.getPlayerImage(undefined);

      expect(result).toBeNull();
    });
  });
});
