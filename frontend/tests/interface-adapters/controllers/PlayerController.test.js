import PlayerController from '../../../src/interface-adapters/controllers/PlayerController';

describe('PlayerController', () => {
  let mockGetAllPlayersUseCase;
  let mockGetPlayerDetailUseCase;
  let mockFetchMLBPlayerIdUseCase;
  let mockGetPlayersByCoachUseCase;
  let playerController;

  beforeEach(() => {
    mockGetAllPlayersUseCase = { execute: jest.fn() };
    mockGetPlayerDetailUseCase = { execute: jest.fn() };
    mockFetchMLBPlayerIdUseCase = { execute: jest.fn() };
    mockGetPlayersByCoachUseCase = { execute: jest.fn() };
    playerController = new PlayerController(
      mockGetAllPlayersUseCase,
      mockGetPlayerDetailUseCase,
      mockFetchMLBPlayerIdUseCase,
      mockGetPlayersByCoachUseCase
    );
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  describe('handleGetAllPlayers', () => {
    it('should call get all players use case', async () => {
      await playerController.handleGetAllPlayers();

      expect(mockGetAllPlayersUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('handleGetPlayersByCoach', () => {
    it('should call get players by coach use case', async () => {
      await playerController.handleGetPlayersByCoach(1);

      expect(mockGetPlayersByCoachUseCase.execute).toHaveBeenCalledWith(1);
    });
  });

  describe('handleGetPlayerDetail', () => {
    it('should call get player detail use case', async () => {
      const playerData = { player_id: 1, first_name: 'John' };
      
      await playerController.handleGetPlayerDetail(1, playerData);

      expect(mockGetPlayerDetailUseCase.execute).toHaveBeenCalledWith(1, playerData);
    });
  });

  describe('handleFetchMLBPlayerId', () => {
    it('should call fetch MLB player ID use case', async () => {
      await playerController.handleFetchMLBPlayerId(1, 'John', 'Doe');

      expect(mockFetchMLBPlayerIdUseCase.execute).toHaveBeenCalledWith(1, 'John', 'Doe');
    });
  });
});
