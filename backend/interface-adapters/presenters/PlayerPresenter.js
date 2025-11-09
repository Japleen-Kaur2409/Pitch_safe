// backend/interface-adapters/presenters/PlayerPresenter.js
class PlayerPresenter {
  constructor(viewModel) {
    this.viewModel = viewModel;
  }

  presentPlayers(players) {
    this.viewModel.setResponse({
      status: 200,
      body: players
    });
  }

  presentSuccess(outputData) {
    this.viewModel.setResponse({
      status: 200,
      body: outputData
    });
  }

  presentError(error) {
    this.viewModel.setResponse({
      status: 400,
      body: {
        error: typeof error === 'string' ? error : error.message || 'Player operation failed'
      }
    });
  }
}

module.exports = PlayerPresenter;