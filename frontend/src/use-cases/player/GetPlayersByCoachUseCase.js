// frontend/src/use-cases/player/GetPlayersByCoachUseCase.js
class GetPlayersByCoachUseCase {
  constructor(playerService, playerPresenter) {
    this.playerService = playerService;
    this.playerPresenter = playerPresenter;
  }

  async execute(coachId) {
    try {
      console.log('GetPlayersByCoachUseCase: Fetching players for coach', coachId);
      
      const players = await this.playerService.getPlayersByCoach(coachId);
      
      console.log('GetPlayersByCoachUseCase: Retrieved', players.length, 'players');
      
      // Use the correct presenter method
      this.playerPresenter.presentPlayersSuccess(players);
      
      console.log('GetPlayersByCoachUseCase: Successfully presented players');
    } catch (error) {
      console.error('GetPlayersByCoachUseCase: Error fetching players:', error);
      this.playerPresenter.presentPlayersError(error.message);
    }
  }
}

export default GetPlayersByCoachUseCase;