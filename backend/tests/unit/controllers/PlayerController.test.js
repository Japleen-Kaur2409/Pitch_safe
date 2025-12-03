// tests/unit/controllers/PlayerController.test.js
const PlayerController = require('../../../interface-adapters/controllers/PlayerController');

describe('PlayerController', () => {
  let playerController;
  let mockGetAllPlayersUseCase;
  let mockGetPlayerInfoUseCase;
  let mockGetPlayersByCoachUseCase;
  let mockViewModel;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockGetAllPlayersUseCase = { execute: jest.fn() };
    mockGetPlayerInfoUseCase = { execute: jest.fn() };
    mockGetPlayersByCoachUseCase = { execute: jest.fn() };

    mockViewModel = {
      getResponse: jest.fn(),
      clear: jest.fn()
    };

    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    playerController = new PlayerController(
      mockGetAllPlayersUseCase,
      mockGetPlayerInfoUseCase,
      mockGetPlayersByCoachUseCase,
      mockViewModel
    );
  });

  describe('getAllPlayers', () => {
    it('should successfully retrieve all players', async () => {
      // Arrange
      const mockResponse = {
        status: 200,
        body: { players: [{ id: 1, name: 'Player 1' }] }
      };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await playerController.getAllPlayers(mockReq, mockRes);

      // Assert
      expect(mockGetAllPlayersUseCase.execute).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ players: [{ id: 1, name: 'Player 1' }] });
      expect(mockViewModel.clear).toHaveBeenCalled();
    });

    it('should handle use case error during getAllPlayers', async () => {
      // Arrange
      mockGetAllPlayersUseCase.execute.mockRejectedValue(new Error('Database error'));

      // Act
      await playerController.getAllPlayers(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });

    it('should handle when viewModel returns no response', async () => {
      // Arrange
      mockViewModel.getResponse.mockReturnValue(null);

      // Act
      await playerController.getAllPlayers(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No response generated' });
    });
  });

  describe('getPlayerInfo', () => {
    it('should successfully retrieve player info', async () => {
      // Arrange
      mockReq.params = { id: '5' };
      const mockResponse = {
        status: 200,
        body: { player: { id: 5, name: 'John Doe', email: 'john@example.com' } }
      };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await playerController.getPlayerInfo(mockReq, mockRes);

      // Assert
      expect(mockGetPlayerInfoUseCase.execute).toHaveBeenCalledWith('5');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        player: { id: 5, name: 'John Doe', email: 'john@example.com' }
      });
      expect(mockViewModel.clear).toHaveBeenCalled();
    });

    it('should handle player not found', async () => {
      // Arrange
      mockReq.params = { id: '999' };
      const mockResponse = { status: 404, body: { error: 'Player not found' } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await playerController.getPlayerInfo(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Player not found' });
    });

    it('should handle use case error during getPlayerInfo', async () => {
      // Arrange
      mockReq.params = { id: '5' };
      mockGetPlayerInfoUseCase.execute.mockRejectedValue(new Error('Database error'));

      // Act
      await playerController.getPlayerInfo(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('getPlayersByCoach', () => {
    it('should successfully retrieve players by coach', async () => {
      // Arrange
      mockReq.params = { coachId: '3' };
      const mockResponse = {
        status: 200,
        body: { players: [{ id: 1, name: 'Player 1', coachId: 3 }] }
      };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await playerController.getPlayersByCoach(mockReq, mockRes);

      // Assert
      expect(mockGetPlayersByCoachUseCase.execute).toHaveBeenCalledWith('3');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        players: [{ id: 1, name: 'Player 1', coachId: 3 }]
      });
      expect(mockViewModel.clear).toHaveBeenCalled();
    });

    it('should handle coach not found', async () => {
      // Arrange
      mockReq.params = { coachId: '999' };
      const mockResponse = { status: 404, body: { error: 'Coach not found' } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await playerController.getPlayersByCoach(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Coach not found' });
    });

    it('should return empty players list when coach has no players', async () => {
      // Arrange
      mockReq.params = { coachId: '3' };
      const mockResponse = { status: 200, body: { players: [] } };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await playerController.getPlayersByCoach(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ players: [] });
    });

    it('should handle use case error during getPlayersByCoach', async () => {
      // Arrange
      mockReq.params = { coachId: '3' };
      mockGetPlayersByCoachUseCase.execute.mockRejectedValue(new Error('Database error'));

      // Act
      await playerController.getPlayersByCoach(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });
});