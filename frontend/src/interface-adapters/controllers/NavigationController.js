// frontend/src/interface-adapters/controllers/NavigationController.js
class NavigationController {
  constructor(navigationViewModel) {
    this.navigationViewModel = navigationViewModel;
  }

  navigateToRoster() {
    console.log('NavigationController: Navigating to roster');
    this.navigationViewModel.update({ 
      currentView: 'roster',
      selectedPlayer: null 
    });
  }

  navigateToPlayerDetail(player = null) {
    console.log('NavigationController: Navigating to player detail', player);
    this.navigationViewModel.update({ 
      currentView: 'playerDetail',
      selectedPlayer: player 
    });
  }

  navigateToStats() {
    console.log('NavigationController: Navigating to stats');
    this.navigationViewModel.update({ 
      currentView: 'stats',
      selectedPlayer: null 
    });
  }

  navigateToDownload() {
    console.log('NavigationController: Navigating to download');
    this.navigationViewModel.update({ 
      currentView: 'download',
      selectedPlayer: null 
    });
  }

  navigateBack() {
    console.log('NavigationController: Navigating back to roster');
    this.navigationViewModel.update({ 
      currentView: 'roster',
      selectedPlayer: null 
    });
  }
}

export default NavigationController;