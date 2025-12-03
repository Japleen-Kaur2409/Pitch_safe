import MLViewModel from '../../../src/interface-adapters/view-models/MLViewModel';

describe('MLViewModel', () => {
  let mlViewModel;

  beforeEach(() => {
    mlViewModel = new MLViewModel();
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      expect(mlViewModel.getState()).toEqual({
        data: null,
        error: null,
        loading: false
      });
    });
  });

  describe('setSuccess', () => {
    it('should set success data', () => {
      const data = { playerRiskMap: {} };
      mlViewModel.setSuccess(data);

      expect(mlViewModel.getState()).toEqual({
        data,
        error: null,
        loading: false
      });
    });
  });

  describe('setError', () => {
    it('should set error', () => {
      mlViewModel.setError('Error message');

      expect(mlViewModel.getState()).toEqual({
        error: 'Error message',
        data: null,
        loading: false
      });
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      mlViewModel.setLoading(true);

      expect(mlViewModel.getState().loading).toBe(true);
    });
  });

  describe('subscribe', () => {
    it('should notify listeners on state change', () => {
      const listener = jest.fn();
      mlViewModel.subscribe(listener);

      mlViewModel.setLoading(true);

      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        loading: true
      }));
    });

    it('should return unsubscribe function', () => {
      const listener = jest.fn();
      const unsubscribe = mlViewModel.subscribe(listener);

      unsubscribe();
      mlViewModel.setLoading(true);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('getData', () => {
    it('should return data', () => {
      const data = { test: 'data' };
      mlViewModel.setSuccess(data);

      expect(mlViewModel.getData()).toEqual(data);
    });
  });

  describe('getError', () => {
    it('should return error', () => {
      mlViewModel.setError('Test error');

      expect(mlViewModel.getError()).toBe('Test error');
    });
  });

  describe('isLoading', () => {
    it('should return loading state', () => {
      mlViewModel.setLoading(true);

      expect(mlViewModel.isLoading()).toBe(true);
    });
  });
});
