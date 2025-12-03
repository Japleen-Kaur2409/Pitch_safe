import AddGameRecordUseCase from '../../../src/use-cases/game/AddGameRecordUseCase';

describe('AddGameRecordUseCase', () => {
  let mockGameDataAccess;
  let mockOutputBoundary;
  let addGameRecordUseCase;

  beforeEach(() => {
    mockGameDataAccess = { addGameRecord: jest.fn() };
    mockOutputBoundary = {
      presentAddGameRecordSuccess: jest.fn(),
      presentAddGameRecordError: jest.fn()
    };
    addGameRecordUseCase = new AddGameRecordUseCase(mockGameDataAccess, mockOutputBoundary);
  });

  it('should add game record successfully', async () => {
    const gameRecord = {
      playerId: 1,
      date: '2024-01-01',
      opponent: 'Team B'
    };
    mockGameDataAccess.addGameRecord.mockResolvedValue(gameRecord);

    await addGameRecordUseCase.execute(gameRecord);

    expect(mockGameDataAccess.addGameRecord).toHaveBeenCalledWith(gameRecord);
    expect(mockOutputBoundary.presentAddGameRecordSuccess).toHaveBeenCalledWith(gameRecord);
  });

  it('should handle missing player ID', async () => {
    await addGameRecordUseCase.execute({ date: '2024-01-01' });

    expect(mockOutputBoundary.presentAddGameRecordError).toHaveBeenCalledWith(
      'Player ID, date, and opponent are required'
    );
  });

  it('should handle missing date', async () => {
    await addGameRecordUseCase.execute({ playerId: 1, opponent: 'Team B' });

    expect(mockOutputBoundary.presentAddGameRecordError).toHaveBeenCalled();
  });

  it('should handle missing opponent', async () => {
    await addGameRecordUseCase.execute({ playerId: 1, date: '2024-01-01' });

    expect(mockOutputBoundary.presentAddGameRecordError).toHaveBeenCalled();
  });

  it('should handle data access error', async () => {
    mockGameDataAccess.addGameRecord.mockRejectedValue(new Error('DB error'));

    await addGameRecordUseCase.execute({ playerId: 1, date: '2024-01-01', opponent: 'Team B' });

    expect(mockOutputBoundary.presentAddGameRecordError).toHaveBeenCalledWith('DB error');
  });
});
