// tests/unit/controllers/MLController.test.js
const MLController = require('../../../interface-adapters/controllers/MLController');

describe('MLController', () => {
  let mlController;
  let mockGetInjuryRiskUseCase;
  let mockViewModel;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockGetInjuryRiskUseCase = { execute: jest.fn() };
    mockViewModel = {
      getResponse: jest.fn()
    };

    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mlController = new MLController(mockGetInjuryRiskUseCase, mockViewModel);
  });

  describe('getInjuryRisk', () => {
    it('should successfully get injury risk predictions', async () => {
      // Arrange
      mockReq.body = {
        csvPath: '/path/to/data.csv',
        topKRatio: 0.10,
        startDate: '2024-01-01'
      };
      const mockResponse = {
        success: true,
        data: [
          { player_id: 1, injury_risk: 0.85 },
          { player_id: 2, injury_risk: 0.45 }
        ]
      };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await mlController.getInjuryRisk(mockReq, mockRes);

      // Assert
      expect(mockGetInjuryRiskUseCase.execute).toHaveBeenCalledWith({
        csvPath: '/path/to/data.csv',
        topKRatio: 0.10,
        startDate: '2024-01-01'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle CSV file not found error', async () => {
      // Arrange
      mockReq.body = {
        csvPath: '/invalid/path/data.csv',
        topKRatio: 0.10,
        startDate: '2024-01-01'
      };
      const mockResponse = {
        success: false,
        error: 'CSV file not found'
      };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await mlController.getInjuryRisk(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle inference error', async () => {
      // Arrange
      mockReq.body = {
        csvPath: '/path/to/data.csv',
        topKRatio: 0.10,
        startDate: '2024-01-01'
      };
      const mockResponse = {
        success: false,
        error: 'Inference failed: model error'
      };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await mlController.getInjuryRisk(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should use default topKRatio if not provided', async () => {
      // Arrange
      mockReq.body = {
        csvPath: '/path/to/data.csv',
        startDate: '2024-01-01'
        // topKRatio not provided
      };
      const mockResponse = {
        success: true,
        data: []
      };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await mlController.getInjuryRisk(mockReq, mockRes);

      // Assert
      expect(mockGetInjuryRiskUseCase.execute).toHaveBeenCalledWith({
        csvPath: '/path/to/data.csv',
        topKRatio: undefined,
        startDate: '2024-01-01'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle empty results from inference', async () => {
      // Arrange
      mockReq.body = {
        csvPath: '/path/to/data.csv',
        topKRatio: 0.10,
        startDate: '2024-01-01'
      };
      const mockResponse = {
        success: true,
        data: []
      };
      mockViewModel.getResponse.mockReturnValue(mockResponse);

      // Act
      await mlController.getInjuryRisk(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResponse);
    });
  });
});