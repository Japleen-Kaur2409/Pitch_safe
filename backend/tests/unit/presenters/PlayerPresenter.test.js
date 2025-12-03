// tests/unit/presenters/PlayerPresenter.test.js
const PlayerPresenter = require('../../../interface-adapters/presenters/PlayerPresenter');

describe('PlayerPresenter', () => {
  let presenter;
  let mockViewModel;

  beforeEach(() => {
    mockViewModel = {
      setResponse: jest.fn()
    };
    presenter = new PlayerPresenter(mockViewModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('presentPlayers', () => {
    it('should present players list with 200 status', () => {
      const players = [
        { player_id: 1, first_name: 'John', last_name: 'Doe' },
        { player_id: 2, first_name: 'Jane', last_name: 'Smith' }
      ];

      presenter.presentPlayers(players);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 200,
        body: players
      });
    });

    it('should handle empty players list', () => {
      presenter.presentPlayers([]);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 200,
        body: []
      });
    });

    it('should preserve player data structure', () => {
      const players = [
        {
          player_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          age: 25,
          bats: 'Right',
          throws: 'Right'
        }
      ];

      presenter.presentPlayers(players);

      const call = mockViewModel.setResponse.mock.calls[0][0];
      expect(call.body[0]).toEqual(players[0]);
    });
  });

  describe('presentSuccess', () => {
    it('should present success with 200 status and output data', () => {
      const outputData = {
        player_id: 1,
        first_name: 'John',
        last_name: 'Doe'
      };

      presenter.presentSuccess(outputData);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 200,
        body: outputData
      });
    });

    it('should handle different output data types', () => {
      const outputs = [
        { player_id: 1, first_name: 'John' },
        { success: true, message: 'Operation completed' },
        { data: { id: 1, name: 'Test' } }
      ];

      outputs.forEach(output => {
        presenter.presentSuccess(output);

        const call = mockViewModel.setResponse.mock.calls[mockViewModel.setResponse.mock.calls.length - 1][0];
        expect(call.status).toBe(200);
        expect(call.body).toEqual(output);
      });
    });
  });

  describe('presentError', () => {
    it('should present error with 400 status for string error', () => {
      const error = 'Player not found';

      presenter.presentError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 400,
        body: { error: 'Player not found' }
      });
    });

    it('should present error with 400 status for Error object', () => {
      const error = new Error('Database connection failed');

      presenter.presentError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 400,
        body: { error: 'Database connection failed' }
      });
    });

    it('should use default error message when no message available', () => {
      const error = {};

      presenter.presentError(error);

      expect(mockViewModel.setResponse).toHaveBeenCalledWith({
        status: 400,
        body: { error: 'Player operation failed' }
      });
    });

    it('should handle different error scenarios', () => {
      const errors = [
        'Player not found',
        'Validation failed',
        'Unauthorized access'
      ];

      errors.forEach(err => {
        presenter.presentError(err);

        const call = mockViewModel.setResponse.mock.calls[mockViewModel.setResponse.mock.calls.length - 1][0];
        expect(call.status).toBe(400);
        expect(call.body.error).toBe(err);
      });
    });
  });
});