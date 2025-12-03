import RosterViewModel from '../../../src/interface-adapters/view-models/RosterViewModel';

describe('RosterViewModel', () => {
  let rosterViewModel;

  beforeEach(() => {
    rosterViewModel = new RosterViewModel();
  });

  it('should navigate to roster', () => {
    rosterViewModel.navigateToRoster();
    expect(rosterViewModel.getState().currentView).toBe('roster');
  });

  it('should navigate to stats', () => {
    rosterViewModel.navigateToStats();
    expect(rosterViewModel.getState().currentView).toBe('stats');
  });

  it('should navigate to download', () => {
    rosterViewModel.navigateToDownload();
    expect(rosterViewModel.getState().currentView).toBe('download');
  });

  it('should select player', () => {
    const player = { player_id: 1 };
    rosterViewModel.selectPlayer(player);
    expect(rosterViewModel.getState().selectedPlayer).toBe(player);
  });

  it('should show add player form', () => {
    rosterViewModel.showAddPlayerForm(true);
    expect(rosterViewModel.getState().showAddPlayerForm).toBe(true);
  });
});
