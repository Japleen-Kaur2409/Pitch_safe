// tests/unit/presenters/MLPresenter.test.js
const MLPresenter = require('../../../interface-adapters/presenters/MLPresenter');

describe('MLPresenter', () => {
  let presenter;
  let mockViewModel;

  beforeEach(() => {
    mockViewModel = {
      setSuccess: jest.fn(),
      setError: jest.fn()
    };
    presenter = new MLPresenter(mockViewModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('presentInjuryRiskSuccess', () => {
    it('should present injury risk success with player risk map', () => {
      const playerRiskMap = {
        'Player 1': { injury_risk_prob: 0.75, risk_level: 'High' },
        'Player 2': { injury_risk_prob: 0.35, risk_level: 'Low' }
      };

      presenter.presentInjuryRiskSuccess(playerRiskMap);

      expect(mockViewModel.setSuccess).toHaveBeenCalledWith({
        playerRiskMap,
        message: 'Injury risk predictions retrieved successfully'
      });
    });

    it('should handle empty player risk map', () => {
      const playerRiskMap = {};

      presenter.presentInjuryRiskSuccess(playerRiskMap);

      expect(mockViewModel.setSuccess).toHaveBeenCalledWith({
        playerRiskMap: {},
        message: 'Injury risk predictions retrieved successfully'
      });
    });

    it('should handle multiple players with different risk levels', () => {
      const playerRiskMap = {
        'John Doe': { injury_risk_prob: 0.85, risk_level: 'High' },
        'Jane Smith': { injury_risk_prob: 0.45, risk_level: 'Medium' },
        'Bob Johnson': { injury_risk_prob: 0.15, risk_level: 'Low' }
      };

      presenter.presentInjuryRiskSuccess(playerRiskMap);

      const call = mockViewModel.setSuccess.mock.calls[0][0];
      expect(Object.keys(call.playerRiskMap).length).toBe(3);
      expect(call.message).toBe('Injury risk predictions retrieved successfully');
    });

    it('should preserve injury risk data structure', () => {
      const playerRiskMap = {
        'Player 1': {
          injury_risk_prob: 0.75,
          risk_level: 'High',
          game_date: '2024-01-15',
          additional_info: 'Test'
        }
      };

      presenter.presentInjuryRiskSuccess(playerRiskMap);

      const call = mockViewModel.setSuccess.mock.calls[0][0];
      expect(call.playerRiskMap['Player 1']).toEqual(playerRiskMap['Player 1']);
    });
  });

  describe('presentInjuryRiskError', () => {
    it('should present injury risk error with error message', () => {
      const errorMessage = 'CSV file not found';

      presenter.presentInjuryRiskError(errorMessage);

      expect(mockViewModel.setError).toHaveBeenCalledWith({
        error: 'CSV file not found',
        message: 'Failed to retrieve injury risk predictions'
      });
    });

    it('should handle different error messages', () => {
      const errors = [
        'CSV file not found',
        'Model inference failed',
        'Invalid CSV format',
        'Timeout error'
      ];

      errors.forEach(err => {
        presenter.presentInjuryRiskError(err);

        const call = mockViewModel.setError.mock.calls[mockViewModel.setError.mock.calls.length - 1][0];
        expect(call.error).toBe(err);
        expect(call.message).toBe('Failed to retrieve injury risk predictions');
      });
    });

    it('should handle error objects converted to strings', () => {
      const error = 'Connection timeout';

      presenter.presentInjuryRiskError(error);

      expect(mockViewModel.setError).toHaveBeenCalledWith({
        error: 'Connection timeout',
        message: 'Failed to retrieve injury risk predictions'
      });
    });
  });
});