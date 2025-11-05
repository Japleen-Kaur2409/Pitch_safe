// frontend/src/interface-adapters/presenters/RosterPresenter.js
class RosterPresenter {
  constructor(viewModel) {
    this.viewModel = viewModel;
  }

  presentNavigationSuccess(view) {
    this.viewModel.update({ currentView: view });
  }

  presentPlayerSelectionSuccess(player) {
    this.viewModel.update({ selectedPlayer: player });
  }

  presentAddPlayerFormVisibility(show) {
    this.viewModel.update({ showAddPlayerForm: show });
  }
}

export default RosterPresenter;