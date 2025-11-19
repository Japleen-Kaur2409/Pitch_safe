// tests/unit/use-cases/game/AddGameRecordUseCase.test.js
const AddGameRecordUseCase = require('../../../../use-cases/game/AddGameRecordUseCase');
const GameInputData = require('../../../../use-cases/data-transfer/GameInputData');

describe('AddGameRecordUseCase', () => {
  let useCase;
  let mockGameDataAccess;
  let mockOutputBoundary;

  beforeEach(() => {
    // Mock data access
    mockGameDataAccess = {
      addGameRecord: jest.fn()
    };

    // Mock output boundary
    mockOutputBoundary = {
      presentSuccess: jest.fn(),
      presentError: jest.fn()
    };

    useCase = new AddGameRecordUseCase(mockGameDataAccess, mockOutputBoundary);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Game Record Addition', () => {
    it('should add a game record successfully', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        2200
      );

      const savedRecord = {
        record_id: 1,
        player_id: 100,
        game_date: '2024-01-15',
        pitch_type: 'Fastball',
        release_speed: 92.5,
        spin_rate: 2200
      };

      mockGameDataAccess.addGameRecord.mockResolvedValue(savedRecord);

      await useCase.execute(inputData);

      expect(mockGameDataAccess.addGameRecord).toHaveBeenCalledWith({
        player_id: 100,
        game_date: inputData.gameDate,
        pitch_type: 'Fastball',
        release_speed: 92.5,
        spin_rate: 2200,
        release_pos_x: null,
        release_pos_y: null,
        release_pos_z: null
      });

      expect(mockOutputBoundary.presentSuccess).toHaveBeenCalledWith({
        message: 'Game record added successfully',
        recordId: 1,
        playerId: 100,
        gameDate: '2024-01-15',
        pitchType: 'Fastball',
        releaseSpeed: 92.5,
        spinRate: 2200
      });

      expect(mockOutputBoundary.presentError).not.toHaveBeenCalled();
    });

    it('should add game record with release positions', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Curveball',
        85.0,
        2500,
        2.5,
        5.0,
        6.0
      );

      const savedRecord = {
        record_id: 2,
        player_id: 100,
        game_date: '2024-01-15',
        pitch_type: 'Curveball',
        release_speed: 85.0,
        spin_rate: 2500,
        release_pos_x: 2.5,
        release_pos_y: 5.0,
        release_pos_z: 6.0
      };

      mockGameDataAccess.addGameRecord.mockResolvedValue(savedRecord);

      await useCase.execute(inputData);

      expect(mockGameDataAccess.addGameRecord).toHaveBeenCalledWith({
        player_id: 100,
        game_date: inputData.gameDate,
        pitch_type: 'Curveball',
        release_speed: 85.0,
        spin_rate: 2500,
        release_pos_x: 2.5,
        release_pos_y: 5.0,
        release_pos_z: 6.0
      });

      expect(mockOutputBoundary.presentSuccess).toHaveBeenCalled();
    });

    it('should handle various pitch types', async () => {
      const pitchTypes = ['Fastball', 'Curveball', 'Slider', 'Changeup'];

      for (const pitchType of pitchTypes) {
        const inputData = new GameInputData(
          100,
          new Date('2024-01-15'),
          pitchType,
          90.0,
          2200
        );

        mockGameDataAccess.addGameRecord.mockResolvedValue({
          record_id: 1,
          player_id: 100,
          pitch_type: pitchType,
          game_date: '2024-01-15',
          release_speed: 90.0,
          spin_rate: 2200
        });

        await useCase.execute(inputData);

        expect(mockGameDataAccess.addGameRecord).toHaveBeenCalled();
        expect(mockOutputBoundary.presentSuccess).toHaveBeenCalled();

        jest.clearAllMocks();
      }
    });
  });

  describe('Validation Errors', () => {
    it('should fail when player_id is missing', async () => {
      const inputData = new GameInputData(
        null,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        2200
      );

      await useCase.execute(inputData);

      expect(mockGameDataAccess.addGameRecord).not.toHaveBeenCalled();
      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Valid player ID is required')
      );
      expect(mockOutputBoundary.presentSuccess).not.toHaveBeenCalled();
    });

    it('should fail when player_id is zero', async () => {
      const inputData = new GameInputData(
        0,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        2200
      );

      await useCase.execute(inputData);

      expect(mockGameDataAccess.addGameRecord).not.toHaveBeenCalled();
      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Valid player ID is required')
      );
    });

    it('should fail when player_id is negative', async () => {
      const inputData = new GameInputData(
        -1,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        2200
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Valid player ID is required')
      );
    });

    it('should fail when game_date is missing', async () => {
      const inputData = new GameInputData(
        100,
        null,
        'Fastball',
        92.5,
        2200
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Game date is required')
      );
    });

    it('should fail when pitch_type is missing', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        null,
        92.5,
        2200
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Pitch type is required')
      );
    });

    it('should fail when pitch_type is empty string', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        '',
        92.5,
        2200
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Pitch type is required')
      );
    });

    it('should fail when release_speed is missing', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        null,
        2200
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Valid release speed is required')
      );
    });

    it('should fail when release_speed is zero', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        0,
        2200
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Valid release speed is required')
      );
    });

    it('should fail when release_speed is negative', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        -10,
        2200
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Valid release speed is required')
      );
    });

    it('should fail when spin_rate is missing', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        null
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Valid spin rate is required')
      );
    });

    it('should fail when spin_rate is zero', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        0
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Valid spin rate is required')
      );
    });

    it('should fail when spin_rate is negative', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        -100
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringContaining('Valid spin rate is required')
      );
    });

    it('should report all validation errors', async () => {
      const inputData = new GameInputData(
        0,
        null,
        '',
        0,
        0
      );

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith(
        expect.stringMatching(/Validation failed:/)
      );

      const errorMessage = mockOutputBoundary.presentError.mock.calls[0][0];
      expect(errorMessage).toContain('Valid player ID is required');
      expect(errorMessage).toContain('Game date is required');
      expect(errorMessage).toContain('Pitch type is required');
      expect(errorMessage).toContain('Valid release speed is required');
      expect(errorMessage).toContain('Valid spin rate is required');
    });
  });

  describe('Data Access Layer Errors', () => {
    it('should handle database errors gracefully', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        2200
      );

      const dbError = new Error('Database connection failed');
      mockGameDataAccess.addGameRecord.mockRejectedValue(dbError);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith('Database connection failed');
      expect(mockOutputBoundary.presentSuccess).not.toHaveBeenCalled();
    });

    it('should handle constraint violation errors', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        2200
      );

      const constraintError = new Error('Foreign key constraint violation');
      mockGameDataAccess.addGameRecord.mockRejectedValue(constraintError);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith('Foreign key constraint violation');
    });

    it('should handle timeout errors', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        2200
      );

      const timeoutError = new Error('Query timeout');
      mockGameDataAccess.addGameRecord.mockRejectedValue(timeoutError);

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentError).toHaveBeenCalledWith('Query timeout');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very high release speeds', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        105.0,
        2200
      );

      mockGameDataAccess.addGameRecord.mockResolvedValue({
        record_id: 1,
        player_id: 100,
        game_date: '2024-01-15',
        pitch_type: 'Fastball',
        release_speed: 105.0,
        spin_rate: 2200
      });

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentSuccess).toHaveBeenCalled();
    });

    it('should handle very low (but valid) release speeds', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Eephus',
        55.0,
        800
      );

      mockGameDataAccess.addGameRecord.mockResolvedValue({
        record_id: 1,
        player_id: 100,
        game_date: '2024-01-15',
        pitch_type: 'Eephus',
        release_speed: 55.0,
        spin_rate: 800
      });

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentSuccess).toHaveBeenCalled();
    });

    it('should handle very high spin rates', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Curveball',
        80.0,
        3500
      );

      mockGameDataAccess.addGameRecord.mockResolvedValue({
        record_id: 1,
        player_id: 100,
        game_date: '2024-01-15',
        pitch_type: 'Curveball',
        release_speed: 80.0,
        spin_rate: 3500
      });

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentSuccess).toHaveBeenCalled();
    });

    it('should handle future dates', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const inputData = new GameInputData(
        100,
        futureDate,
        'Fastball',
        92.5,
        2200
      );

      mockGameDataAccess.addGameRecord.mockResolvedValue({
        record_id: 1,
        player_id: 100,
        game_date: futureDate.toISOString().split('T')[0],
        pitch_type: 'Fastball',
        release_speed: 92.5,
        spin_rate: 2200
      });

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentSuccess).toHaveBeenCalled();
    });

    it('should handle negative release positions', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        2200,
        -2.5,
        -5.0,
        -6.0
      );

      mockGameDataAccess.addGameRecord.mockResolvedValue({
        record_id: 1,
        player_id: 100,
        game_date: '2024-01-15',
        pitch_type: 'Fastball',
        release_speed: 92.5,
        spin_rate: 2200,
        release_pos_x: -2.5,
        release_pos_y: -5.0,
        release_pos_z: -6.0
      });

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentSuccess).toHaveBeenCalled();
    });

    it('should handle decimal precision in measurements', async () => {
      const inputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        92.123456,
        2200.789,
        2.123,
        5.456,
        6.789
      );

      mockGameDataAccess.addGameRecord.mockResolvedValue({
        record_id: 1,
        player_id: 100,
        game_date: '2024-01-15',
        pitch_type: 'Fastball',
        release_speed: 92.123456,
        spin_rate: 2200.789,
        release_pos_x: 2.123,
        release_pos_y: 5.456,
        release_pos_z: 6.789
      });

      await useCase.execute(inputData);

      expect(mockOutputBoundary.presentSuccess).toHaveBeenCalled();
    });
  });

  describe('Input Validation Method', () => {
    it('should throw error with validation message', () => {
      const invalidInputData = new GameInputData(
        0,
        null,
        '',
        0,
        0
      );

      expect(() => {
        useCase.validateInput(invalidInputData);
      }).toThrow('Validation failed:');
    });

    it('should not throw for valid input', () => {
      const validInputData = new GameInputData(
        100,
        new Date('2024-01-15'),
        'Fastball',
        92.5,
        2200
      );

      expect(() => {
        useCase.validateInput(validInputData);
      }).not.toThrow();
    });
  });
});
