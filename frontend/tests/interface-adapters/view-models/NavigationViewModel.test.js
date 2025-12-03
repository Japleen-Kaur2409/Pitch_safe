import NavigationViewModel from '../../../src/interface-adapters/view-models/NavigationViewModel';

describe('NavigationViewModel', () => {
  let navViewModel;

  beforeEach(() => {
    navViewModel = new NavigationViewModel();
  });

  it('should initialize with roster view', () => {
    expect(navViewModel.getState().currentView).toBe('roster');
  });

  it('should update state', () => {
    navViewModel.update({ currentView: 'stats' });
    expect(navViewModel.getState().currentView).toBe('stats');
  });

  it('should subscribe and unsubscribe', () => {
    const listener = jest.fn();
    const unsub = navViewModel.subscribe(listener);
    navViewModel.update({ currentView: 'download' });
    expect(listener).toHaveBeenCalled();
    unsub();
    listener.mockClear();
    navViewModel.update({ currentView: 'roster' });
    expect(listener).not.toHaveBeenCalled();
  });
});
