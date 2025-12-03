import MLPresenter from '../../../src/interface-adapters/presenters/MLPresenter';

describe('MLPresenter', () => {
  let mockViewModel;
  let mlPresenter;

  beforeEach(() => {
    mockViewModel = {
      setSuccess: jest.fn(),
      setError: jest.fn(),
      getState: jest.fn(() => ({}))
    };
    mlPresenter = new MLPresenter(mockViewModel);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('presentInjuryRiskSuccess', () => {
    it('should call setSuccess with player risk map', () => {
      const playerRiskMap = {
        'Doe, John': { riskScore: 0.5, riskLevel: 'medium' },
        'Smith, Jane': { riskScore: 0.3, riskLevel: 'low' }
      };

      mlPresenter.presentInjuryRiskSuccess(playerRiskMap);

      expect(mockViewModel.setSuccess).toHaveBeenCalledWith({
        playerRiskMap,
        message: 'Injury risk data loaded successfully'
      });
    });

    it('should handle error during setSuccess', () => {
      mockViewModel.setSuccess.mockImplementation(() => {
        throw new Error('View model error');
      });

      mlPresenter.presentInjuryRiskSuccess({});

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('presentInjuryRiskError', () => {
    it('should call setError with error message', () => {
      mlPresenter.presentInjuryRiskError('ML model failed');

      expect(mockViewModel.setError).toHaveBeenCalledWith({
        error: 'ML model failed',
        message: 'Failed to load injury risk data'
      });
    });
  });
});
