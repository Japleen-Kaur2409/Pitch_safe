import MLController from '../../../src/interface-adapters/controllers/MLController';

describe('MLController', () => {
  let mockGetInjuryRiskUseCase;
  let mockViewModel;
  let mlController;

  beforeEach(() => {
    mockGetInjuryRiskUseCase = { execute: jest.fn() };
    mockViewModel = {
      setLoading: jest.fn(),
      setSuccess: jest.fn(),
      setError: jest.fn()
    };
    mlController = new MLController(mockGetInjuryRiskUseCase, mockViewModel);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  it('should get injury risk successfully', async () => {
    const mockResult = { 'Player, Test': { riskScore: 0.5 } };
    mockGetInjuryRiskUseCase.execute.mockResolvedValue(mockResult);

    await mlController.getInjuryRisk('/path/to/csv', 0.1, '2024-01-01');

    expect(mockViewModel.setLoading).toHaveBeenCalledWith(true);
    expect(mockGetInjuryRiskUseCase.execute).toHaveBeenCalled();
    expect(mockViewModel.setSuccess).toHaveBeenCalled();
  });

  it('should handle error', async () => {
    mockGetInjuryRiskUseCase.execute.mockRejectedValue(new Error('ML error'));

    await expect(mlController.getInjuryRisk('/path', 0.1, '2024-01-01'))
      .rejects.toThrow('ML error');

    expect(mockViewModel.setError).toHaveBeenCalledWith('ML error');
  });
});
