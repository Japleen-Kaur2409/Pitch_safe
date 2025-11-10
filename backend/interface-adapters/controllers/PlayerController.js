// backend/interface-adapters/controllers/PlayerController.js
class PlayerController {
  constructor(getAllPlayersUseCase, getPlayerInfoUseCase, getPlayersByCoachUseCase, viewModel) {
    this.getAllPlayersUseCase = getAllPlayersUseCase;
    this.getPlayerInfoUseCase = getPlayerInfoUseCase;
    this.getPlayersByCoachUseCase = getPlayersByCoachUseCase;
    this.viewModel = viewModel;
  }

  async getAllPlayers(req, res) {
    try {
      await this.getAllPlayersUseCase.execute();

      const response = this.viewModel.getResponse();
      if (response) {
        res.status(response.status).json(response.body);
        this.viewModel.clear();
      } else {
        res.status(500).json({ error: 'No response generated' });
      }
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getPlayerInfo(req, res) {
    try {
      const { id } = req.params;
      await this.getPlayerInfoUseCase.execute(id);

      const response = this.viewModel.getResponse();
      if (response) {
        res.status(response.status).json(response.body);
        this.viewModel.clear();
      } else {
        res.status(500).json({ error: 'No response generated' });
      }
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getPlayersByCoach(req, res) {
    try {
      const { coachId } = req.params;
      
      await this.getPlayersByCoachUseCase.execute(coachId);

      const response = this.viewModel.getResponse();
      if (response) {
        res.status(response.status).json(response.body);
        this.viewModel.clear();
      } else {
        res.status(500).json({ error: 'No response generated' });
      }
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = PlayerController;