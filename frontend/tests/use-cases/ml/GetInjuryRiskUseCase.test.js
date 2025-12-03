// GetInjuryRiskUseCase.test.js
import GetInjuryRiskUseCase from '../../../src/use-cases/ml/GetInjuryRiskUseCase';

describe('GetInjuryRiskUseCase', () => {
  let mockMLDataAccess;
  let mockOutputBoundary;
  let getInjuryRiskUseCase;

  beforeEach(() => {
    mockMLDataAccess = {
      getInjuryRisk: jest.fn(),
    };

    mockOutputBoundary = {
      presentInjuryRiskSuccess: jest.fn(),
      presentInjuryRiskError: jest.fn(),
    };

    getInjuryRiskUseCase = new GetInjuryRiskUseCase(mockMLDataAccess, mockOutputBoundary);
  });

  describe('execute', () => {
    it('should successfully fetch injury risk data', async () => {
      const mockPlayerRiskMap = {
        'Judge, Aaron': {
          injury_risk_prob: 0.25,
          risk_level: 'low',
          riskScore: 25,
        },
        'Cole, Gerrit': {
          injury_risk_prob: 0.65,
          risk_level: 'high',
          riskScore: 65,
        },
      };

      mockMLDataAccess.getInjuryRisk.mockResolvedValue(mockPlayerRiskMap);

      const result = await getInjuryRiskUseCase.execute('/yankees.csv', 0.10, '2024-04-01');

      expect(mockMLDataAccess.getInjuryRisk).toHaveBeenCalledWith(
        '/yankees.csv',
        0.10,
        '2024-04-01'
      );
      expect(mockOutputBoundary.presentInjuryRiskSuccess).toHaveBeenCalledWith(mockPlayerRiskMap);
      expect(result).toEqual(mockPlayerRiskMap);
    });

    it('should fail when csvPath is missing', async () => {
      await expect(getInjuryRiskUseCase.execute(null, 0.10, '2024-04-01')).rejects.toThrow(
        'CSV path is required'
      );

      expect(mockMLDataAccess.getInjuryRisk).not.toHaveBeenCalled();
      expect(mockOutputBoundary.presentInjuryRiskError).toHaveBeenCalledWith(
        'CSV path is required'
      );
    });

    it('should fail when csvPath is empty string', async () => {
      await expect(getInjuryRiskUseCase.execute('', 0.10, '2024-04-01')).rejects.toThrow(
        'CSV path is required'
      );

      expect(mockMLDataAccess.getInjuryRisk).not.toHaveBeenCalled();
    });

    it('should handle empty player risk map', async () => {
      mockMLDataAccess.getInjuryRisk.mockResolvedValue({});

      const result = await getInjuryRiskUseCase.execute('/yankees.csv', 0.10, '2024-04-01');

      expect(mockOutputBoundary.presentInjuryRiskSuccess).toHaveBeenCalledWith({});
      expect(result).toEqual({});
    });

    it('should handle ML service errors', async () => {
      const error = new Error('ML service unavailable');
      mockMLDataAccess.getInjuryRisk.mockRejectedValue(error);

      await expect(
        getInjuryRiskUseCase.execute('/yankees.csv', 0.10, '2024-04-01')
      ).rejects.toThrow('ML service unavailable');

      expect(mockOutputBoundary.presentInjuryRiskError).toHaveBeenCalledWith(
        'ML service unavailable'
      );
    });

    it('should handle CSV parsing errors', async () => {
      const error = new Error('Invalid CSV format');
      mockMLDataAccess.getInjuryRisk.mockRejectedValue(error);

      await expect(
        getInjuryRiskUseCase.execute('/yankees.csv', 0.10, '2024-04-01')
      ).rejects.toThrow('Invalid CSV format');
    });

    it('should handle network timeout errors', async () => {
      const error = new Error('Network timeout');
      mockMLDataAccess.getInjuryRisk.mockRejectedValue(error);

      await expect(
        getInjuryRiskUseCase.execute('/yankees.csv', 0.10, '2024-04-01')
      ).rejects.toThrow('Network timeout');
    });

    it('should accept different topKRatio values', async () => {
      mockMLDataAccess.getInjuryRisk.mockResolvedValue({});

      await getInjuryRiskUseCase.execute('/yankees.csv', 0.20, '2024-04-01');

      expect(mockMLDataAccess.getInjuryRisk).toHaveBeenCalledWith(
        '/yankees.csv',
        0.20,
        '2024-04-01'
      );
    });

    it('should accept different start dates', async () => {
      mockMLDataAccess.getInjuryRisk.mockResolvedValue({});

      await getInjuryRiskUseCase.execute('/yankees.csv', 0.10, '2024-05-01');

      expect(mockMLDataAccess.getInjuryRisk).toHaveBeenCalledWith(
        '/yankees.csv',
        0.10,
        '2024-05-01'
      );
    });
  });
});
