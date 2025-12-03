
import PlayerPresenter from '../../../src/interface-adapters/presenters/PlayerPresenter';

describe('PlayerPresenter', () => {
  let mockViewModel;
  let playerPresenter;

  beforeEach(() => {
    mockViewModel = {
      update: jest.fn(),
      getState: jest.fn(() => ({
        players: [],
        selectedPlayer: null,
        playerMLBIds: {}
      }))
    };
    playerPresenter = new PlayerPresenter(mockViewModel);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
    console.warn.mockRestore();
  });

  describe('presentPlayersSuccess', () => {
    it('should update view model with players', () => {
      const players = [
        { player_id: 1, first_name: 'John', last_name: 'Doe' },
        { player_id: 2, first_name: 'Jane', last_name: 'Smith' }
      ];

      playerPresenter.presentPlayersSuccess(players);

      expect(mockViewModel.update).toHaveBeenCalledWith({
        players,
        playersLoading: false,
        playersError: null
      });
    });

    it('should handle empty players array', () => {
      playerPresenter.presentPlayersSuccess([]);

      expect(mockViewModel.update).toHaveBeenCalledWith({
        players: [],
        playersLoading: false,
        playersError: null
      });
    });
  });

  describe('presentPlayersError', () => {
    it('should update view model with error', () => {
      playerPresenter.presentPlayersError('Failed to load players');

      expect(mockViewModel.update).toHaveBeenCalledWith({
        players: [],
        playersLoading: false,
        playersError: 'Failed to load players'
      });
    });
  });

  describe('presentPlayerDetailSuccess', () => {
    it('should update view model with player detail', () => {
      const player = { 
        player_id: 1, 
        first_name: 'John', 
        last_name: 'Doe',
        height: '6\'2"',
        weight: 200
      };

      playerPresenter.presentPlayerDetailSuccess(player);

      expect(mockViewModel.update).toHaveBeenCalledWith({
        selectedPlayer: player,
        playerDetailLoading: false,
        playerDetailError: null
      });
    });
  });

  describe('presentPlayerDetailError', () => {
    it('should update view model with error', () => {
      playerPresenter.presentPlayerDetailError('Player not found');

      expect(mockViewModel.update).toHaveBeenCalledWith({
        selectedPlayer: null,
        playerDetailLoading: false,
        playerDetailError: 'Player not found'
      });
    });
  });

  describe('presentMLBPlayerIdSuccess', () => {
    it('should update view model with MLB ID mapping', () => {
      const data = {
        playerId: 1,
        mlbId: 543037,
        details: {
          height: '6\'2"',
          weight: 200,
          bats: 'R',
          throws: 'R'
        }
      };

      mockViewModel.getState.mockReturnValue({
        players: [{ player_id: 1, first_name: 'John', last_name: 'Doe' }],
        selectedPlayer: null,
        playerMLBIds: {}
      });

      playerPresenter.presentMLBPlayerIdSuccess(data);

      expect(mockViewModel.update).toHaveBeenCalled();
      const updateCall = mockViewModel.update.mock.calls[0][0];
      expect(updateCall.playerMLBIds[1]).toBe(543037);
    });

    it('should handle snake_case format', () => {
      const data = {
        player_id: 1,
        mlb_id: 543037,
        details: { height: '6\'0"' }
      };

      mockViewModel.getState.mockReturnValue({
        players: [],
        selectedPlayer: null,
        playerMLBIds: {}
      });

      playerPresenter.presentMLBPlayerIdSuccess(data);

      expect(mockViewModel.update).toHaveBeenCalled();
    });

    it('should update selectedPlayer if it matches', () => {
      const data = {
        playerId: 1,
        mlbId: 543037,
        details: {
          height: '6\'2"',
          weight: 200
        }
      };

      mockViewModel.getState.mockReturnValue({
        players: [{ player_id: 1, first_name: 'John', last_name: 'Doe' }],
        selectedPlayer: { player_id: 1, first_name: 'John', last_name: 'Doe' },
        playerMLBIds: {}
      });

      playerPresenter.presentMLBPlayerIdSuccess(data);

      const updateCall = mockViewModel.update.mock.calls[0][0];
      expect(updateCall.selectedPlayer.height).toBe('6\'2"');
      expect(updateCall.selectedPlayer.weight).toBe(200);
    });

    it('should handle invalid data structure', () => {
      playerPresenter.presentMLBPlayerIdSuccess({});
      
      expect(console.error).toHaveBeenCalled();
      expect(mockViewModel.update).not.toHaveBeenCalled();
    });

    it('should handle non-object data', () => {
      playerPresenter.presentMLBPlayerIdSuccess('invalid');
      
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle data without details', () => {
      const data = {
        playerId: 1,
        mlbId: 543037
      };

      mockViewModel.getState.mockReturnValue({
        players: [],
        selectedPlayer: null,
        playerMLBIds: {}
      });

      playerPresenter.presentMLBPlayerIdSuccess(data);

      expect(mockViewModel.update).toHaveBeenCalled();
    });
  });

  describe('presentMLBPlayerIdError', () => {
    it('should log warning but not update state', () => {
      playerPresenter.presentMLBPlayerIdError('Player not found in MLB');

      expect(console.warn).toHaveBeenCalled();
      expect(mockViewModel.update).not.toHaveBeenCalled();
    });
  });
});
