const HttpViewModel = require('../../../interface-adapters/view-models/HttpViewModel');

describe('HttpViewModel', () => {
  let viewModel;

  beforeEach(() => {
    viewModel = new HttpViewModel();
  });

  describe('Initialization', () => {
    test('should initialize with null response', () => {
      expect(viewModel.getResponse()).toBeNull();
    });

    test('should not have response initially', () => {
      expect(viewModel.hasResponse()).toBe(false);
    });
  });

  describe('setResponse', () => {
    test('should set response data directly', () => {
      const data = { id: 1, name: 'Test' };
      viewModel.setResponse(data);
      expect(viewModel.getResponse()).toEqual(data);
    });

    test('should overwrite previous response', () => {
      viewModel.setResponse({ id: 1 });
      viewModel.setResponse({ id: 2 });
      expect(viewModel.getResponse()).toEqual({ id: 2 });
    });

    test('should handle null response data', () => {
      viewModel.setResponse(null);
      expect(viewModel.getResponse()).toBeNull();
    });

    test('should handle empty object', () => {
      viewModel.setResponse({});
      expect(viewModel.getResponse()).toEqual({});
    });
  });

  describe('setSuccess', () => {
    test('should set success response with data', () => {
      const data = { id: 1, name: 'John' };
      viewModel.setSuccess(data);
      expect(viewModel.getResponse()).toEqual({
        success: true,
        data: data
      });
    });

    test('should set success flag to true', () => {
      viewModel.setSuccess({ value: 'test' });
      expect(viewModel.getResponse().success).toBe(true);
    });

    test('should handle success with undefined data', () => {
      viewModel.setSuccess(undefined);
      expect(viewModel.getResponse()).toEqual({
        success: true,
        data: undefined
      });
    });

    test('should handle success with array data', () => {
      const data = [1, 2, 3];
      viewModel.setSuccess(data);
      expect(viewModel.getResponse().data).toEqual(data);
    });

    test('should overwrite previous response', () => {
      viewModel.setSuccess({ id: 1 });
      viewModel.setSuccess({ id: 2 });
      expect(viewModel.getResponse()).toEqual({
        success: true,
        data: { id: 2 }
      });
    });
  });

  describe('setError', () => {
    test('should set error response with string error', () => {
      viewModel.setError('User not found');
      expect(viewModel.getResponse()).toEqual({
        success: false,
        error: 'User not found'
      });
    });

    test('should set success flag to false for string error', () => {
      viewModel.setError('Invalid input');
      expect(viewModel.getResponse().success).toBe(false);
    });

    test('should set error response with object error', () => {
      const errorObj = { error: 'Validation failed', message: 'Email is invalid' };
      viewModel.setError(errorObj);
      expect(viewModel.getResponse()).toEqual({
        success: false,
        error: 'Validation failed',
        message: 'Email is invalid'
      });
    });

    test('should handle error object with additional properties', () => {
      const errorObj = { error: 'DB Error', message: 'Connection failed', code: 'ECONNREFUSED' };
      viewModel.setError(errorObj);
      expect(viewModel.getResponse()).toEqual({
        success: false,
        error: 'DB Error',
        message: 'Connection failed',
        code: 'ECONNREFUSED'
      });
    });

    test('should overwrite previous response on error', () => {
      viewModel.setSuccess({ id: 1 });
      viewModel.setError('Failed');
      expect(viewModel.getResponse()).toEqual({
        success: false,
        error: 'Failed'
      });
    });

    test('should handle empty string error', () => {
      viewModel.setError('');
      expect(viewModel.getResponse()).toEqual({
        success: false,
        error: ''
      });
    });
  });

  describe('setLoading', () => {
    test('should add loading flag to empty response', () => {
      viewModel.setLoading(true);
      expect(viewModel.getResponse()).toEqual({ loading: true });
    });

    test('should set loading to false', () => {
      viewModel.setLoading(false);
      expect(viewModel.getResponse()).toEqual({ loading: false });
    });

    test('should preserve existing response when setting loading true', () => {
      viewModel.setSuccess({ id: 1 });
      viewModel.setLoading(true);
      expect(viewModel.getResponse()).toEqual({
        success: true,
        data: { id: 1 },
        loading: true
      });
    });

    test('should preserve existing response when setting loading false', () => {
      viewModel.setSuccess({ id: 1 });
      viewModel.setLoading(false);
      expect(viewModel.getResponse()).toEqual({
        success: true,
        data: { id: 1 },
        loading: false
      });
    });

    test('should update loading flag on subsequent calls', () => {
      viewModel.setLoading(true);
      viewModel.setLoading(false);
      expect(viewModel.getResponse().loading).toBe(false);
    });

    test('should coerce truthy values to boolean', () => {
      viewModel.setLoading('yes');
      expect(viewModel.getResponse().loading).toBe(true);
    });

    test('should coerce falsy values to boolean', () => {
      viewModel.setLoading(0);
      expect(viewModel.getResponse().loading).toBe(false);
    });
  });

  describe('getResponse', () => {
    test('should return null when no response is set', () => {
      expect(viewModel.getResponse()).toBeNull();
    });

    test('should return the current response', () => {
      const data = { test: 'data' };
      viewModel.setResponse(data);
      expect(viewModel.getResponse()).toBe(data);
    });

    test('should return updated response after modification', () => {
      viewModel.setSuccess({ id: 1 });
      const response = viewModel.getResponse();
      expect(response.success).toBe(true);
    });
  });

  describe('hasResponse', () => {
    test('should return false when response is null', () => {
      expect(viewModel.hasResponse()).toBe(false);
    });

    test('should return true when response is set', () => {
      viewModel.setResponse({ data: 'test' });
      expect(viewModel.hasResponse()).toBe(true);
    });

    test('should return true after setSuccess', () => {
      viewModel.setSuccess({ id: 1 });
      expect(viewModel.hasResponse()).toBe(true);
    });

    test('should return true after setError', () => {
      viewModel.setError('Error');
      expect(viewModel.hasResponse()).toBe(true);
    });

    test('should return true even with empty object', () => {
      viewModel.setResponse({});
      expect(viewModel.hasResponse()).toBe(true);
    });
  });

  describe('clear', () => {
    test('should set response to null', () => {
      viewModel.setSuccess({ id: 1 });
      viewModel.clear();
      expect(viewModel.getResponse()).toBeNull();
    });

    test('should set hasResponse to false after clear', () => {
      viewModel.setSuccess({ id: 1 });
      viewModel.clear();
      expect(viewModel.hasResponse()).toBe(false);
    });

    test('should handle clearing already cleared response', () => {
      viewModel.clear();
      viewModel.clear();
      expect(viewModel.getResponse()).toBeNull();
    });
  });

  describe('Integration scenarios', () => {
    test('should handle complete workflow: set success, then error, then clear', () => {
      viewModel.setSuccess({ id: 1 });
      expect(viewModel.hasResponse()).toBe(true);

      viewModel.setError('Operation failed');
      expect(viewModel.getResponse().success).toBe(false);

      viewModel.clear();
      expect(viewModel.hasResponse()).toBe(false);
    });

    test('should handle combining multiple methods', () => {
      viewModel.setSuccess({ id: 1, name: 'Test' });
      viewModel.setLoading(true);
      expect(viewModel.getResponse()).toEqual({
        success: true,
        data: { id: 1, name: 'Test' },
        loading: true
      });

      viewModel.setLoading(false);
      expect(viewModel.getResponse().loading).toBe(false);
    });

    test('should handle error with loading state', () => {
      viewModel.setError('Failed to fetch');
      viewModel.setLoading(true);
      expect(viewModel.getResponse()).toEqual({
        success: false,
        error: 'Failed to fetch',
        loading: true
      });
    });
  });
});