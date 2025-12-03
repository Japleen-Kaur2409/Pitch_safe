import GameViewModel from '../../../src/interface-adapters/view-models/GameViewModel';

describe('GameViewModel', () => {
  let gameViewModel;

  beforeEach(() => {
    gameViewModel = new GameViewModel();
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      expect(gameViewModel.getState()).toEqual({
        gameRecords: [],
        addGameRecordLoading: false,
        addGameRecordError: null,
        getGameRecordsLoading: false,
        getGameRecordsError: null,
        listeners: []
      });
    });
  });

  describe('update', () => {
    it('should update state', () => {
      gameViewModel.update({ gameRecords: [{ record_id: 1 }] });

      expect(gameViewModel.getState().gameRecords).toHaveLength(1);
    });

    it('should notify listeners', () => {
      const listener = jest.fn();
      gameViewModel.subscribe(listener);

      gameViewModel.update({ addGameRecordLoading: true });

      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        addGameRecordLoading: true
      }));
    });
  });

  describe('subscribe', () => {
    it('should add listener and return unsubscribe function', () => {
      const listener = jest.fn();
      const unsubscribe = gameViewModel.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');
      
      gameViewModel.update({ addGameRecordLoading: true });
      expect(listener).toHaveBeenCalled();

      unsubscribe();
      listener.mockClear();
      
      gameViewModel.update({ addGameRecordLoading: false });
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('helper methods', () => {
    it('setAddGameRecordLoading should update loading state', () => {
      gameViewModel.setAddGameRecordLoading(true);
      expect(gameViewModel.getState().addGameRecordLoading).toBe(true);
    });

    it('setAddGameRecordError should set error', () => {
      gameViewModel.setAddGameRecordError('Error message');
      expect(gameViewModel.getState().addGameRecordError).toBe('Error message');
    });

    it('clearAddGameRecordError should clear error', () => {
      gameViewModel.setAddGameRecordError('Error');
      gameViewModel.clearAddGameRecordError();
      expect(gameViewModel.getState().addGameRecordError).toBeNull();
    });

    it('setGetGameRecordsLoading should update loading state', () => {
      gameViewModel.setGetGameRecordsLoading(true);
      expect(gameViewModel.getState().getGameRecordsLoading).toBe(true);
    });

    it('setGetGameRecordsError should set error', () => {
      gameViewModel.setGetGameRecordsError('Error');
      expect(gameViewModel.getState().getGameRecordsError).toBe('Error');
    });

    it('clearGetGameRecordsError should clear error', () => {
      gameViewModel.setGetGameRecordsError('Error');
      gameViewModel.clearGetGameRecordsError();
      expect(gameViewModel.getState().getGameRecordsError).toBeNull();
    });
  });
});
