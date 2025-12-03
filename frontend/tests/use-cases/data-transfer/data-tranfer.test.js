// DATA TRANSFER OBJECTS TESTS
import AuthOutputData from '../../../src/use-cases/data-transfer/AuthOutputData';
import GameInputData from '../../../src/use-cases/data-transfer/GameInputData';
import PlayerInputData from '../../../src/use-cases/data-transfer/PlayerInputData';
import PlayerOutputData from '../../../src/use-cases/data-transfer/PlayerOutputData';

describe('Data Transfer Objects', () => {
  describe('AuthOutputData', () => {
    it('should create auth output data', () => {
      const user = { user_id: 1, email: 'test@example.com' };
      const token = 'abc123';
      const data = new AuthOutputData(user, token);

      expect(data.user).toBe(user);
      expect(data.token).toBe(token);
    });

    it('should create auth output data without token', () => {
      const user = { user_id: 1 };
      const data = new AuthOutputData(user);

      expect(data.user).toBe(user);
      expect(data.token).toBeNull();
    });
  });

  describe('GameInputData', () => {
    it('should create game input data', () => {
      const data = new GameInputData(1, '2024-01-01', 'Team B', 7, 5, 2, 2, 2, 8, 1, 100, 'notes');

      expect(data.playerId).toBe(1);
      expect(data.date).toBe('2024-01-01');
      expect(data.opponent).toBe('Team B');
    });
  });

  describe('PlayerInputData', () => {
    it('should create player input data', () => {
      const data = new PlayerInputData(1, 'John', 'Doe');

      expect(data.playerId).toBe(1);
      expect(data.firstName).toBe('John');
      expect(data.lastName).toBe('Doe');
    });

    it('should create player input data without names', () => {
      const data = new PlayerInputData(1);

      expect(data.playerId).toBe(1);
      expect(data.firstName).toBeNull();
      expect(data.lastName).toBeNull();
    });
  });

  describe('PlayerOutputData', () => {
    it('should create player output data', () => {
      const players = [{ player_id: 1 }];
      const playerDetail = { player_id: 1, height: '6\'2"' };
      const mlbPlayerId = 543037;

      const data = new PlayerOutputData(players, playerDetail, mlbPlayerId);

      expect(data.players).toBe(players);
      expect(data.playerDetail).toBe(playerDetail);
      expect(data.mlbPlayerId).toBe(mlbPlayerId);
    });

    it('should create player output data with defaults', () => {
      const data = new PlayerOutputData();

      expect(data.players).toBeNull();
      expect(data.playerDetail).toBeNull();
      expect(data.mlbPlayerId).toBeNull();
    });
  });
});
