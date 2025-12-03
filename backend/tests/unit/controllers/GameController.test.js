// tests/unit/controllers/GameController.test.js
const GameController = require('../../../interface-adapters/controllers/GameController');
const GameInputData = require('../../../use-cases/data-transfer/GameInputData');

jest.mock('../../../use-cases/data-transfer/GameInputData');

describe('GameController', () => {
  let gameController;
  let mockAddGameRecordUseCase;
  let mockGetPlayerGamesUseCase;
  let mockUpdateGameRecordUseCase;
  let mockDeleteGameRecordUseCase;
  let mockViewModel;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockAddGameRecordUseCase = { execute: jest.fn() };
    mockGetPlayerGamesUseCase = { execute: jest.fn() };
    mockUpdateGameRecordUseCase = { execute: jest.fn() };
    mockDeleteGameRecordUseCase = { execute: jest.fn() };

    mockViewModel = {
      getResponse: jest.fn(),
      clear: jest.fn()
    };

    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    gameController = new GameController(
      mockAddGameRecordUseCase,
      mockGetPlayerGamesUseCase,
      mockUpdateGameRecordUseCase,
      mockDeleteGameRecordUseCase,
      mockViewModel
    );
  });

  describe('addGameRecord', () => {
    it('should successfully add a game record', async () => {
      // Arrange
      mockReq.body = {
        player_id: '1',
        game_date: '2024-01-15T10:00:00Z',
        pitch_type: 'Fastball',
        release_speed: '95.5',
        spin_rate: '2400'
      };
      const mockResponse = { status: 201, body: { recordId: 10, playerId: 1 } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await gameController.addGameRecord(mockReq, mockRes);

      // Assert
      expect(GameInputData).toHaveBeenCalledWith(
        1,
        new Date('2024-01-15T10:00:00Z'),
        'Fastball',
        95.5,
        2400
      );
      expect(mockAddGameRecordUseCase.execute).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ recordId: 10, playerId: 1 });
      expect(mockViewModel.clear).toHaveBeenCalled();
    });

    it('should handle invalid numeric values gracefully', async () => {
      // Arrange
      mockReq.body = {
        player_id: 'invalid',
        game_date: '2024-01-15T10:00:00Z',
        pitch_type: 'Fastball',
        release_speed: 'invalid',
        spin_rate: 'invalid'
      };
      mockAddGameRecordUseCase.execute.mockRejectedValue(new Error('Invalid data'));

      // Act
      await gameController.addGameRecord(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });

    it('should handle use case error during add', async () => {
      // Arrange
      mockReq.body = {
        player_id: '1',
        game_date: '2024-01-15T10:00:00Z',
        pitch_type: 'Fastball',
        release_speed: '95.5',
        spin_rate: '2400'
      };
      mockAddGameRecordUseCase.execute.mockRejectedValue(new Error('Database error'));

      // Act
      await gameController.addGameRecord(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('getPlayerGames', () => {
    it('should successfully retrieve player games', async () => {
      // Arrange
      mockReq.params = { playerId: '5' };
      const mockResponse = {
        status: 200,
        body: { games: [{ id: 1, pitch_type: 'Fastball' }] }
      };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await gameController.getPlayerGames(mockReq, mockRes);

      // Assert
      expect(mockGetPlayerGamesUseCase.execute).toHaveBeenCalledWith(5);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ games: [{ id: 1, pitch_type: 'Fastball' }] });
      expect(mockViewModel.clear).toHaveBeenCalled();
    });

    it('should handle player not found', async () => {
      // Arrange
      mockReq.params = { playerId: '999' };
      const mockResponse = { status: 404, body: { error: 'Player not found' } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await gameController.getPlayerGames(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Player not found' });
    });

    it('should handle use case error during retrieval', async () => {
      // Arrange
      mockReq.params = { playerId: '5' };
      mockGetPlayerGamesUseCase.execute.mockRejectedValue(new Error('Database error'));

      // Act
      await gameController.getPlayerGames(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('updateGameRecord', () => {
    it('should successfully update a game record', async () => {
      // Arrange
      mockReq.params = { recordId: '10' };
      mockReq.body = {
        game_date: '2024-01-20T10:00:00Z',
        pitch_type: 'Curveball',
        release_speed: '87.5',
        spin_rate: '2200'
      };
      const mockResponse = { status: 200, body: { recordId: 10, updated: true } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await gameController.updateGameRecord(mockReq, mockRes);

      // Assert
      expect(GameInputData).toHaveBeenCalledWith(
        null,
        new Date('2024-01-20T10:00:00Z'),
        'Curveball',
        87.5,
        2200
      );
      expect(mockUpdateGameRecordUseCase.execute).toHaveBeenCalledWith(10, expect.any(Object));
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ recordId: 10, updated: true });
    });

    it('should handle record not found during update', async () => {
      // Arrange
      mockReq.params = { recordId: '999' };
      mockReq.body = {
        game_date: '2024-01-20T10:00:00Z',
        pitch_type: 'Curveball',
        release_speed: '87.5',
        spin_rate: '2200'
      };
      const mockResponse = { status: 404, body: { error: 'Record not found' } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await gameController.updateGameRecord(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Record not found' });
    });

    it('should handle use case error during update', async () => {
      // Arrange
      mockReq.params = { recordId: '10' };
      mockReq.body = {
        game_date: '2024-01-20T10:00:00Z',
        pitch_type: 'Curveball',
        release_speed: '87.5',
        spin_rate: '2200'
      };
      mockUpdateGameRecordUseCase.execute.mockRejectedValue(new Error('Update failed'));

      // Act
      await gameController.updateGameRecord(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('deleteGameRecord', () => {
    it('should successfully delete a game record', async () => {
      // Arrange
      mockReq.params = { recordId: '10' };
      const mockResponse = { status: 200, body: { deleted: true } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await gameController.deleteGameRecord(mockReq, mockRes);

      // Assert
      expect(mockDeleteGameRecordUseCase.execute).toHaveBeenCalledWith(10);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ deleted: true });
      expect(mockViewModel.clear).toHaveBeenCalled();
    });

    it('should handle record not found during delete', async () => {
      // Arrange
      mockReq.params = { recordId: '999' };
      const mockResponse = { status: 404, body: { error: 'Record not found' } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await gameController.deleteGameRecord(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Record not found' });
    });

    it('should handle use case error during delete', async () => {
      // Arrange
      mockReq.params = { recordId: '10' };
      mockDeleteGameRecordUseCase.execute.mockRejectedValue(new Error('Delete failed'));

      // Act
      await gameController.deleteGameRecord(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });
});