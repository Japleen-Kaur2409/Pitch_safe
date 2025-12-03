import RosterPresenter from '../../../src/interface-adapters/presenters/RosterPresenter';

describe('RosterPresenter', () => {
  let mockViewModel;
  let rosterPresenter;

  beforeEach(() => {
    mockViewModel = { update: jest.fn() };
    rosterPresenter = new RosterPresenter(mockViewModel);
  });

  it('should present navigation success', () => {
    rosterPresenter.presentNavigationSuccess('stats');
    expect(mockViewModel.update).toHaveBeenCalledWith({ currentView: 'stats' });
  });

  it('should present player selection success', () => {
    const player = { player_id: 1 };
    rosterPresenter.presentPlayerSelectionSuccess(player);
    expect(mockViewModel.update).toHaveBeenCalledWith({ selectedPlayer: player });
  });

  it('should present add player form visibility', () => {
    rosterPresenter.presentAddPlayerFormVisibility(true);
    expect(mockViewModel.update).toHaveBeenCalledWith({ showAddPlayerForm: true });
  });
});
