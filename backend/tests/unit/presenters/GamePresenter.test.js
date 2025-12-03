// tests/unit/presenters/GamePresenter.test.js
const GamePresenter = require('../../../interface-adapters/presenters/GamePresenter');

describe('GamePresenter', () => {
  let presenter;
  let mockViewModel;

  beforeEach(() => {
    mockViewModel = {
      setResponse: jest.fn()
    };
    presenter = new GamePresenter(mockViewModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('presentSuccess', () => {
    it('should present game record success with 201 status', () => {
      const outputData = {
        message: 'Game record added successfully',
        recordId: 1,
        playerId: 100,
        gameDate: '2024-01-15',
        pitchType: 'Fastball',
        releaseSpeed: 92.5,
        spinRate: 2400
      };

      presenter.presentSuccess(outputData);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 201,
        body: {
          message: 'Game record added successfully',
          record: {
            record_id: 1,
            player_id: 100,
            game_date: '2024-01-15',
            pitch_type: 'Fastball',
            release_speed: 92.5,
            spin_rate: 2400
          }
        }
      });
    });

    it('should format Date object to ISO string', () => {
      const dateObj = new Date('2024-01-15T10:30:00Z');
      const outputData = {
        message: 'Game record added successfully',
        recordId: 1,
        playerId: 100,
        gameDate: dateObj,
        pitchType: 'Curveball',
        releaseSpeed: 85.0,
        spinRate: 2500
      };

      presenter.presentSuccess(outputData);

      const call = mockViewModel.setResponse.mock.calls[0][0];
      expect(call.body.record.game_date).toBe('2024-01-15');
    });

    it('should include injury risk data when provided', () => {
      const outputData = {
        message: 'Game record added successfully',
        recordId: 1,
        playerId: 100,
        gameDate: '2024-01-15',
        pitchType: 'Fastball',
        releaseSpeed: 92.5,
        spinRate: 2400,
        injuryRiskData: {
          'Player Name': {
            player_name: 'Player Name',
            injury_risk_prob: 0.75,
            risk_level: 'High',
            game_date: '2024-01-15'
          }
        }
      };

      presenter.presentSuccess(outputData);

      const call = mockViewModel.setResponse.mock.calls[0][0];
      expect(call.body.injuryRiskData).toBeDefined();
      expect(call.body.injuryRiskData['Player Name'].injury_risk_prob).toBe(0.75);
    });

    it('should not include injury risk data when not provided', () => {
      const outputData = {
        message: 'Game record added successfully',
        recordId: 1,
        playerId: 100,
        gameDate: '2024-01-15',
        pitchType: 'Fastball',
        releaseSpeed: 92.5,
        spinRate: 2400
      };

      presenter.presentSuccess(outputData);

      const call = mockViewModel.setResponse.mock.calls[0][0];
      expect(call.body.injuryRiskData).toBeUndefined();
    });

    it('should handle various pitch types', () => {
      const pitchTypes = ['Fastball', 'Curveball', 'Slider', 'Changeup'];

      pitchTypes.forEach(pitchType => {
        presenter.presentSuccess({
          message: 'Game record added successfully',
          recordId: 1,
          playerId: 100,
          gameDate: '2024-01-15',
          pitchType,
          releaseSpeed: 90.0,
          spinRate: 2200
        });

        const call = mockViewModel.setResponse.mock.calls[mockViewModel.setResponse.mock.calls.length - 1][0];
        expect(call.body.record.pitch_type).toBe(pitchType);
      });
    });
  });

  describe('presentError', () => {
    it('should present error with 400 status for string error', () => {
      const error = 'Validation failed';

      presenter.presentError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 400,
        body: { error: 'Validation failed' }
      });
    });

    it('should present error with 400 status for Error object', () => {
      const error = new Error('Database error');

      presenter.presentError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 400,
        body: { error: 'Database error' }
      });
    });

    it('should use default error message when error object has no message', () => {
      const error = {};

      presenter.presentError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 400,
          body: { error: 'Failed to add game record' }
        })
      );
    });
  });

  describe('presentPlayerGamesSuccess', () => {
    it('should present player games with 200 status', () => {
      const games = [
        { record_id: 1, pitch_type: 'Fastball', release_speed: 92.5 },
        { record_id: 2, pitch_type: 'Curveball', release_speed: 85.0 }
      ];

      presenter.presentPlayerGamesSuccess(games);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 200,
        body: games
      });
    });

    it('should handle empty games list', () => {
      presenter.presentPlayerGamesSuccess([]);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 200,
        body: []
      });
    });
  });

  describe('presentPlayerGamesError', () => {
    it('should present error with 400 status', () => {
      const error = 'Player not found';

      presenter.presentPlayerGamesError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 400,
        body: { error: 'Player not found' }
      });
    });
  });

  describe('presentUpdateSuccess', () => {
    it('should present update success with 200 status', () => {
      const updatedRecord = {
        record_id: 1,
        player_id: 100,
        pitch_type: 'Slider',
        release_speed: 88.0
      };

      presenter.presentUpdateSuccess(updatedRecord);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 200,
        body: {
          message: 'Game record updated successfully',
          record: updatedRecord
        }
      });
    });
  });

  describe('presentUpdateError', () => {
    it('should present update error with 400 status', () => {
      const error = 'Record not found';

      presenter.presentUpdateError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 400,
        body: { error: 'Record not found' }
      });
    });
  });

  describe('presentDeleteSuccess', () => {
    it('should present delete success with 200 status', () => {
      const outputData = {
        message: 'Game record deleted successfully',
        recordId: 1
      };

      presenter.presentDeleteSuccess(outputData);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 200,
        body: {
          message: 'Game record deleted successfully',
          recordId: 1
        }
      });
    });
  });

  describe('presentDeleteError', () => {
    it('should present delete error with 400 status', () => {
      const error = 'Cannot delete record';

      presenter.presentDeleteError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 400,
        body: { error: 'Cannot delete record' }
      });
    });
  });

  describe('formatDate', () => {
    it('should format Date object to ISO string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = presenter.formatDate(date);

      expect(result).toBe('2024-01-15');
    });

    it('should return string date as is', () => {
      const date = '2024-01-15';
      const result = presenter.formatDate(date);

      expect(result).toBe('2024-01-15');
    });

    it('should handle different date formats', () => {
      const dates = [
        new Date('2024-12-25T00:00:00Z'),
        '2024-12-25',
        new Date('2025-06-30T23:59:59Z')
      ];

      const results = dates.map(d => presenter.formatDate(d));

      expect(results[0]).toBe('2024-12-25');
      expect(results[1]).toBe('2024-12-25');
      expect(results[2]).toBe('2025-06-30');
    });
  });
});