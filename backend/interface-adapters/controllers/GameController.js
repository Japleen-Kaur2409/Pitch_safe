// backend/interface-adapters/controllers/GameController.js
const GameInputData = require('../../use-cases/data-transfer/GameInputData');

class GameController {
  constructor(
    addGameRecordUseCase, 
    getPlayerGamesUseCase, 
    updateGameRecordUseCase, 
    deleteGameRecordUseCase, 
    viewModel
  ) {
    this.addGameRecordUseCase = addGameRecordUseCase;
    this.getPlayerGamesUseCase = getPlayerGamesUseCase;
    this.updateGameRecordUseCase = updateGameRecordUseCase;
    this.deleteGameRecordUseCase = deleteGameRecordUseCase;
    this.viewModel = viewModel;
  }

  async addGameRecord(req, res) {
    try {
      const { player_id, game_date, pitch_type, release_speed, spin_rate } = req.body;

      const inputData = new GameInputData(
        parseInt(player_id),
        new Date(game_date),
        pitch_type,
        parseFloat(release_speed),
        parseFloat(spin_rate)
      );

      await this.addGameRecordUseCase.execute(inputData);

      const response = this.viewModel.getResponse();
      if (response) {
        res.status(response.status).json(response.body);
        this.viewModel.clear();
      } else {
        res.status(500).json({ error: 'No response generated' });
      }
    } catch (error) {
      console.error('GameController addGameRecord error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getPlayerGames(req, res) {
    try {
      const { playerId } = req.params;
      await this.getPlayerGamesUseCase.execute(parseInt(playerId));

      const response = this.viewModel.getResponse();
      if (response) {
        res.status(response.status).json(response.body);
        this.viewModel.clear();
      } else {
        res.status(500).json({ error: 'No response generated' });
      }
    } catch (error) {
      console.error('GameController getPlayerGames error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async updateGameRecord(req, res) {
    try {
      const { recordId } = req.params;
      const { game_date, pitch_type, release_speed, spin_rate } = req.body;

      const inputData = new GameInputData(
        null, // playerId not needed for update
        new Date(game_date),
        pitch_type,
        parseFloat(release_speed),
        parseFloat(spin_rate)
      );

      await this.updateGameRecordUseCase.execute(parseInt(recordId), inputData);

      const response = this.viewModel.getResponse();
      if (response) {
        res.status(response.status).json(response.body);
        this.viewModel.clear();
      } else {
        res.status(500).json({ error: 'No response generated' });
      }
    } catch (error) {
      console.error('GameController updateGameRecord error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async deleteGameRecord(req, res) {
    try {
      const { recordId } = req.params;
      await this.deleteGameRecordUseCase.execute(parseInt(recordId));

      const response = this.viewModel.getResponse();
      if (response) {
        res.status(response.status).json(response.body);
        this.viewModel.clear();
      } else {
        res.status(500).json({ error: 'No response generated' });
      }
    } catch (error) {
      console.error('GameController deleteGameRecord error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = GameController;