import GetAllPlayersUseCase from '../../../src/use-cases/player/GetAllPlayersUseCase';

describe('GetAllPlayersUseCase', () => {
  let mockPlayerDataAccess;
  let mockOutputBoundary;
  let getAllPlayersUseCase;

  beforeEach(() => {
    mockPlayerDataAccess = {
      getAllPlayers: jest.fn()
    };
    mockOutputBoundary = {
      presentPlayersSuccess: jest.fn(),
      presentPlayersError: jest.fn()
    };
    getAllPlayersUseCase = new GetAllPlayersUseCase(mockPlayerDataAccess, mockOutputBoundary);
  });

  describe('execute', () => {
    it('should fetch and present all players', async () => {
      const players = [
        { player_id: 1, first_name: 'John', last_name: 'Doe' },
        { player_id: 2, first_name: 'Jane', last_name: 'Smith' }
      ];
      mockPlayerDataAccess.getAllPlayers.mockResolvedValue(players);

      await getAllPlayersUseCase.execute();

      expect(mockPlayerDataAccess.getAllPlayers).toHaveBeenCalled();
      expect(mockOutputBoundary.presentPlayersSuccess).toHaveBeenCalledWith(players);
      expect(mockOutputBoundary.presentPlayersError).not.toHaveBeenCalled();
    });

    it('should handle empty player list', async () => {
      mockPlayerDataAccess.getAllPlayers.mockResolvedValue([]);

      await getAllPlayersUseCase.execute();

      expect(mockOutputBoundary.presentPlayersSuccess).toHaveBeenCalledWith([]);
    });

    it('should handle data access error', async () => {
      mockPlayerDataAccess.getAllPlayers.mockRejectedValue(new Error('Database error'));

      await getAllPlayersUseCase.execute();

      expect(mockOutputBoundary.presentPlayersError).toHaveBeenCalledWith('Database error');
      expect(mockOutputBoundary.presentPlayersSuccess).not.toHaveBeenCalled();
    });
  });
});
