import GetPlayersByCoachUseCase from '../../../src/use-cases/player/GetPlayersByCoachUseCase';

describe('GetPlayersByCoachUseCase', () => {
  let mockPlayerService;
  let mockPlayerPresenter;
  let getPlayersByCoachUseCase;

  beforeEach(() => {
    mockPlayerService = {
      getPlayersByCoach: jest.fn()
    };
    mockPlayerPresenter = {
      presentPlayersSuccess: jest.fn(),
      presentPlayersError: jest.fn()
    };
    getPlayersByCoachUseCase = new GetPlayersByCoachUseCase(mockPlayerService, mockPlayerPresenter);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('execute', () => {
    it('should fetch and present players by coach', async () => {
      const players = [{ player_id: 1, first_name: 'John', last_name: 'Doe' }];
      mockPlayerService.getPlayersByCoach.mockResolvedValue(players);

      await getPlayersByCoachUseCase.execute(1);

      expect(mockPlayerService.getPlayersByCoach).toHaveBeenCalledWith(1);
      expect(mockPlayerPresenter.presentPlayersSuccess).toHaveBeenCalledWith(players);
    });

    it('should handle service error', async () => {
      mockPlayerService.getPlayersByCoach.mockRejectedValue(new Error('Service error'));

      await getPlayersByCoachUseCase.execute(1);

      expect(mockPlayerPresenter.presentPlayersError).toHaveBeenCalledWith('Service error');
    });
  });
});
