// __tests__/interface-adapters/view-models/AuthViewModel.test.js
import AuthViewModel from '../../../src/interface-adapters/view-models/AuthViewModel';

describe('AuthViewModel', () => {
  let viewModel;

  beforeEach(() => {
    viewModel = new AuthViewModel();
  });

  describe('constructor', () => {
    it('should initialize with default state', () => {
      const state = viewModel.getState();

      expect(state.currentUser).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.authError).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.listeners).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update state with new values', () => {
      viewModel.update({ isLoading: true });

      const state = viewModel.getState();
      expect(state.isLoading).toBe(true);
    });

    it('should merge new state with existing state', () => {
      viewModel.update({ isLoading: true });
      viewModel.update({ authError: 'Test error' });

      const state = viewModel.getState();
      expect(state.isLoading).toBe(true);
      expect(state.authError).toBe('Test error');
    });

    it('should notify listeners when state changes', () => {
      const listener = jest.fn();
      viewModel.subscribe(listener);

      viewModel.update({ isLoading: true });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        isLoading: true
      }));
    });

    it('should notify all listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      viewModel.subscribe(listener1);
      viewModel.subscribe(listener2);

      viewModel.update({ isLoading: true });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('getState', () => {
    it('should return a copy of the state', () => {
      const state1 = viewModel.getState();
      const state2 = viewModel.getState();

      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2); // Different objects
    });

    it('should not allow direct state mutation', () => {
      const state = viewModel.getState();
      state.isLoading = true;

      const actualState = viewModel.getState();
      expect(actualState.isLoading).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('should add listener to listeners array', () => {
      const listener = jest.fn();
      viewModel.subscribe(listener);

      const state = viewModel.getState();
      expect(state.listeners).toContain(listener);
    });

    it('should return unsubscribe function', () => {
      const listener = jest.fn();
      const unsubscribe = viewModel.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should remove listener when unsubscribe is called', () => {
      const listener = jest.fn();
      const unsubscribe = viewModel.subscribe(listener);

      unsubscribe();

      viewModel.update({ isLoading: true });
      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle multiple subscriptions and unsubscriptions', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const listener3 = jest.fn();

      const unsub1 = viewModel.subscribe(listener1);
      const unsub2 = viewModel.subscribe(listener2);
      viewModel.subscribe(listener3);

      unsub1();
      unsub2();

      viewModel.update({ isLoading: true });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
      expect(listener3).toHaveBeenCalledTimes(1);
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      viewModel.setLoading(true);

      const state = viewModel.getState();
      expect(state.isLoading).toBe(true);
    });

    it('should set loading to false', () => {
      viewModel.setLoading(false);

      const state = viewModel.getState();
      expect(state.isLoading).toBe(false);
    });

    it('should notify listeners', () => {
      const listener = jest.fn();
      viewModel.subscribe(listener);

      viewModel.setLoading(true);

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      viewModel.setError('Test error');

      const state = viewModel.getState();
      expect(state.authError).toBe('Test error');
    });

    it('should notify listeners', () => {
      const listener = jest.fn();
      viewModel.subscribe(listener);

      viewModel.setError('Test error');

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      viewModel.setError('Test error');
      viewModel.clearError();

      const state = viewModel.getState();
      expect(state.authError).toBeNull();
    });

    it('should notify listeners', () => {
      const listener = jest.fn();
      viewModel.subscribe(listener);

      viewModel.setError('Test error');
      listener.mockClear();
      
      viewModel.clearError();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset', () => {
    it('should reset all state except listeners', () => {
      const listener = jest.fn();
      viewModel.subscribe(listener);

      viewModel.update({
        currentUser: { id: 1, email: 'test@example.com' },
        isAuthenticated: true,
        authError: 'Test error',
        isLoading: true
      });

      viewModel.reset();

      const state = viewModel.getState();
      expect(state.currentUser).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.authError).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.listeners).toContain(listener);
    });

    it('should notify listeners after reset', () => {
      const listener = jest.fn();
      viewModel.subscribe(listener);

      listener.mockClear();
      viewModel.reset();

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('notifyListeners', () => {
    it('should call all listeners with current state', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      viewModel.subscribe(listener1);
      viewModel.subscribe(listener2);

      viewModel.update({ isLoading: true });

      const expectedState = expect.objectContaining({
        isLoading: true
      });

      expect(listener1).toHaveBeenCalledWith(expectedState);
      expect(listener2).toHaveBeenCalledWith(expectedState);
    });

    it('should not throw if listeners array is empty', () => {
      expect(() => {
        viewModel.update({ isLoading: true });
      }).not.toThrow();
    });
  });
});
