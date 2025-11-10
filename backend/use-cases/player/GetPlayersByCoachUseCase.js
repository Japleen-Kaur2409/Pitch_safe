// backend/application/use-cases/player/GetPlayersByCoachUseCase.js
class GetPlayersByCoachUseCase {
  constructor(playerRepository, viewModel) {
    this.playerRepository = playerRepository;
    this.viewModel = viewModel;
  }

  async execute(coachId) {
    try {
      const players = await this.playerRepository.getPlayersByCoachId(coachId);
      this.viewModel.presentPlayers(players);
    } catch (error) {
      this.viewModel.presentError(error.message);
    }
  }
}

module.exports = GetPlayersByCoachUseCase;