import GetPlayerDetailUseCase from '../../../src/use-cases/player/GetPlayerDetailUseCase';

describe('GetPlayerDetailUseCase', () => {
  let mockPlayerDataAccess;
  let mockMLBDataAccess;
  let mockOutputBoundary;
  let getPlayerDetailUseCase;

  beforeEach(() => {
    mockPlayerDataAccess = {
      getPlayerInfo: jest.fn()
    };
    mockMLBDataAccess = {
      getPlayerId: jest.fn()
    };
    mockOutputBoundary = {
      presentPlayerDetailSuccess: jest.fn(),
      presentPlayerDetailError: jest.fn()
    };
    getPlayerDetailUseCase = new GetPlayerDetailUseCase(
      mockPlayerDataAccess,
      mockMLBDataAccess,
      mockOutputBoundary
    );
  });

  describe('execute', () => {
    it('should fetch and combine player details', async () => {
      const playerData = { player_id: 1, first_name: 'John', last_name: 'Doe' };
      const playerInfo = { school: 'UCLA', level: 'College' };
      const mlbPlayerId = 543037;

      mockPlayerDataAccess.getPlayerInfo.mockResolvedValue(playerInfo);
      mockMLBDataAccess.getPlayerId.mockResolvedValue(mlbPlayerId);

      await getPlayerDetailUseCase.execute(1, playerData);

      expect(mockPlayerDataAccess.getPlayerInfo).toHaveBeenCalledWith(1);
      expect(mockMLBDataAccess.getPlayerId).toHaveBeenCalledWith('John', 'Doe');
      expect(mockOutputBoundary.presentPlayerDetailSuccess).toHaveBeenCalledWith({
        ...playerData,
        ...playerInfo,
        mlbPlayerId
      });
    });

    it('should handle MLB ID not found', async () => {
      const playerData = { player_id: 1, first_name: 'John', last_name: 'Doe' };
      mockPlayerDataAccess.getPlayerInfo.mockResolvedValue({});
      mockMLBDataAccess.getPlayerId.mockResolvedValue(null);

      await getPlayerDetailUseCase.execute(1, playerData);

      expect(mockOutputBoundary.presentPlayerDetailSuccess).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      mockPlayerDataAccess.getPlayerInfo.mockRejectedValue(new Error('Database error'));

      await getPlayerDetailUseCase.execute(1, {});

      expect(mockOutputBoundary.presentPlayerDetailError).toHaveBeenCalledWith('Database error');
    });
  });
});
