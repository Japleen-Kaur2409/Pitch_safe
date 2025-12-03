import FetchMLBPlayerIdUseCase from '../../../src/use-cases/player/FetchMLBPlayerIdUseCase';

describe('FetchMLBPlayerIdUseCase', () => {
  let mockMLBApiService;
  let mockOutputBoundary;
  let fetchMLBPlayerIdUseCase;

  beforeEach(() => {
    mockMLBApiService = {
      getPlayerId: jest.fn(),
      getPlayerDetails: jest.fn()
    };
    mockOutputBoundary = {
      presentMLBPlayerIdSuccess: jest.fn(),
      presentMLBPlayerIdError: jest.fn()
    };
    fetchMLBPlayerIdUseCase = new FetchMLBPlayerIdUseCase(mockMLBApiService, mockOutputBoundary);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('execute', () => {
    it('should fetch MLB ID and details', async () => {
      const mlbId = 543037;
      const playerDetails = { height: '6\'2"', weight: 200 };

      mockMLBApiService.getPlayerId.mockResolvedValue(mlbId);
      mockMLBApiService.getPlayerDetails.mockResolvedValue(playerDetails);

      await fetchMLBPlayerIdUseCase.execute(1, 'John', 'Doe');

      expect(mockMLBApiService.getPlayerId).toHaveBeenCalledWith('John', 'Doe');
      expect(mockMLBApiService.getPlayerDetails).toHaveBeenCalledWith(mlbId);
      expect(mockOutputBoundary.presentMLBPlayerIdSuccess).toHaveBeenCalledWith({
        playerId: 1,
        mlbId: mlbId,
        details: playerDetails
      });
    });

    it('should handle player not found in MLB', async () => {
      mockMLBApiService.getPlayerId.mockResolvedValue(null);

      await fetchMLBPlayerIdUseCase.execute(1, 'John', 'Doe');

      expect(mockOutputBoundary.presentMLBPlayerIdError).toHaveBeenCalled();
      expect(mockMLBApiService.getPlayerDetails).not.toHaveBeenCalled();
    });

    it('should handle MLB API error', async () => {
      mockMLBApiService.getPlayerId.mockRejectedValue(new Error('API error'));

      await fetchMLBPlayerIdUseCase.execute(1, 'John', 'Doe');

      expect(mockOutputBoundary.presentMLBPlayerIdError).toHaveBeenCalledWith('API error');
    });

    it('should handle error without message', async () => {
      mockMLBApiService.getPlayerId.mockRejectedValue({});

      await fetchMLBPlayerIdUseCase.execute(1, 'John', 'Doe');

      expect(mockOutputBoundary.presentMLBPlayerIdError).toHaveBeenCalledWith('Failed to fetch MLB player ID');
    });
  });
});
