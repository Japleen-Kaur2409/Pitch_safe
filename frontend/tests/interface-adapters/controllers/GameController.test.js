import GameController from '../../../src/interface-adapters/controllers/GameController';

describe('GameController', () => {
  let mockAddGameRecordUseCase;
  let gameController;

  beforeEach(() => {
    mockAddGameRecordUseCase = { execute: jest.fn() };
    gameController = new GameController(mockAddGameRecordUseCase);
  });

  it('should handle add game record', async () => {
    const gameData = {
      playerId: 1,
      date: '2024-01-01',
      opponent: 'Team B',
      inningsPitched: 7,
      hits: 5,
      runs: 2,
      earnedRuns: 2,
      walks: 2,
      strikeouts: 8,
      homeRuns: 1,
      pitchesThrown: 100,
      notes: 'Good game'
    };

    await gameController.handleAddGameRecord(gameData);

    expect(mockAddGameRecordUseCase.execute).toHaveBeenCalled();
  });
});
