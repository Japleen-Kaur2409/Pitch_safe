import NavigationController from '../../../src/interface-adapters/controllers/NavigationController';

describe('NavigationController', () => {
  let mockViewModel;
  let navController;

  beforeEach(() => {
    mockViewModel = { update: jest.fn() };
    navController = new NavigationController(mockViewModel);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it('should navigate to roster', () => {
    navController.navigateToRoster();
    expect(mockViewModel.update).toHaveBeenCalledWith({
      currentView: 'roster',
      selectedPlayer: null
    });
  });

  it('should navigate to player detail', () => {
    const player = { player_id: 1 };
    navController.navigateToPlayerDetail(player);
    expect(mockViewModel.update).toHaveBeenCalledWith({
      currentView: 'playerDetail',
      selectedPlayer: player
    });
  });

  it('should navigate to stats', () => {
    navController.navigateToStats();
    expect(mockViewModel.update).toHaveBeenCalledWith({
      currentView: 'stats',
      selectedPlayer: null
    });
  });

  it('should navigate to download', () => {
    navController.navigateToDownload();
    expect(mockViewModel.update).toHaveBeenCalledWith({
      currentView: 'download',
      selectedPlayer: null
    });
  });

  it('should navigate back', () => {
    navController.navigateBack();
    expect(mockViewModel.update).toHaveBeenCalledWith({
      currentView: 'roster',
      selectedPlayer: null
    });
  });
});
