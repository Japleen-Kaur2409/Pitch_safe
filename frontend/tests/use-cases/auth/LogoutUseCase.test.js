// frontend/src/use-cases/__tests__/LogoutUseCase.test.js
import LogoutUseCase from '../../../src/use-cases/auth/LogoutUseCase';

describe('LogoutUseCase', () => {
  let outputBoundary;
  let logoutUseCase;

  beforeEach(() => {
    // Mock outputBoundary
    outputBoundary = {
      presentLogoutSuccess: jest.fn(),
      presentLogoutError: jest.fn(),
    };

    // Mock localStorage and sessionStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        clear: jest.fn(),
        setItem: jest.fn(),
        getItem: jest.fn(),
      },
      writable: true,
    });

    // Mock console.warn
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    logoutUseCase = new LogoutUseCase(outputBoundary);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should clear localStorage and sessionStorage and present success', async () => {
    // Set some dummy data
    localStorage.setItem('currentUser', 'user');
    localStorage.setItem('authToken', 'token');
    sessionStorage.setItem('key', 'value');

    await logoutUseCase.execute();

    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(outputBoundary.presentLogoutSuccess).toHaveBeenCalled();
    expect(outputBoundary.presentLogoutError).not.toHaveBeenCalled();
  });

  it('should still present success if localStorage.removeItem throws', async () => {
    localStorage.removeItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    await logoutUseCase.execute();

    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Could not clear storage:'), expect.any(Error));
    expect(outputBoundary.presentLogoutSuccess).toHaveBeenCalled();
    expect(outputBoundary.presentLogoutError).not.toHaveBeenCalled();
  });

  it('should present logout error if outputBoundary.presentLogoutSuccess throws', async () => {
    outputBoundary.presentLogoutSuccess.mockImplementation(() => {
      throw new Error('Presenter failed');
    });

    await logoutUseCase.execute();

    expect(outputBoundary.presentLogoutError).toHaveBeenCalledWith('Presenter failed');
  });
});
