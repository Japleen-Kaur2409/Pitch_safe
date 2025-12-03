import GamePresenter from '../../../src/interface-adapters/presenters/GamePresenter';

describe('GamePresenter', () => {
  let mockViewModel;
  let mockMLPresenter;
  let gamePresenter;

  beforeEach(() => {
    mockViewModel = {
      update: jest.fn(),
      getState: jest.fn(() => ({
        gameRecords: []
      }))
    };
    mockMLPresenter = {
      presentInjuryRiskSuccess: jest.fn()
    };
    gamePresenter = new GamePresenter(mockViewModel, mockMLPresenter);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    console.warn.mockRestore();
  });

  describe('presentAddGameRecordSuccess', () => {
    it('should add game record to state', () => {
      const response = {
        record: { record_id: 1, player_id: 1, game_date: '2024-01-01' }
      };

      gamePresenter.presentAddGameRecordSuccess(response);

      expect(mockViewModel.update).toHaveBeenCalledWith({
        gameRecords: [response.record],
        addGameRecordLoading: false,
        addGameRecordError: null
      });
    });

    it('should forward injury risk data to ML presenter', () => {
      const response = {
        record: { record_id: 1 },
        injuryRiskData: { 'Player, Test': { riskScore: 0.5 } }
      };

      gamePresenter.presentAddGameRecordSuccess(response);

      expect(mockMLPresenter.presentInjuryRiskSuccess).toHaveBeenCalledWith(response.injuryRiskData);
    });

    it('should handle response without record wrapper', () => {
      const record = { record_id: 1, player_id: 1 };

      gamePresenter.presentAddGameRecordSuccess(record);

      expect(mockViewModel.update).toHaveBeenCalled();
    });

    it('should handle ML presenter error gracefully', () => {
      mockMLPresenter.presentInjuryRiskSuccess.mockImplementation(() => {
        throw new Error('ML error');
      });

      const response = {
        record: { record_id: 1 },
        injuryRiskData: {}
      };

      gamePresenter.presentAddGameRecordSuccess(response);

      expect(console.warn).toHaveBeenCalled();
    });

    it('should handle null ML presenter', () => {
      gamePresenter = new GamePresenter(mockViewModel, null);
      const response = {
        record: { record_id: 1 },
        injuryRiskData: {}
      };

      gamePresenter.presentAddGameRecordSuccess(response);

      expect(mockViewModel.update).toHaveBeenCalled();
    });
  });

  describe('presentAddGameRecordError', () => {
    it('should update view model with error', () => {
      gamePresenter.presentAddGameRecordError('Failed to add record');

      expect(mockViewModel.update).toHaveBeenCalledWith({
        addGameRecordLoading: false,
        addGameRecordError: 'Failed to add record'
      });
    });
  });

  describe('presentPlayerGameRecordsSuccess', () => {
    it('should update view model with game records', () => {
      const records = [
        { record_id: 1, player_id: 1 },
        { record_id: 2, player_id: 1 }
      ];

      gamePresenter.presentPlayerGameRecordsSuccess(records);

      expect(mockViewModel.update).toHaveBeenCalledWith({
        gameRecords: records,
        getGameRecordsLoading: false,
        getGameRecordsError: null
      });
    });
  });

  describe('presentPlayerGameRecordsError', () => {
    it('should update view model with error', () => {
      gamePresenter.presentPlayerGameRecordsError('Failed to load records');

      expect(mockViewModel.update).toHaveBeenCalledWith({
        gameRecords: [],
        getGameRecordsLoading: false,
        getGameRecordsError: 'Failed to load records'
      });
    });
  });
});
