// frontend/src/interface-adapters/presenters/PlayerPresenter.js
import PlayerOutputBoundary from '../../use-cases/player/interfaces/PlayerOutputBoundary';

class PlayerPresenter extends PlayerOutputBoundary {
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  presentPlayersSuccess(players) {
    console.log('PlayerPresenter: Presenting players success', players.length, 'players');
    this.viewModel.update({
      players,
      playersLoading: false,
      playersError: null
    });
  }

  presentPlayersError(error) {
    console.error('PlayerPresenter: Presenting players error', error);
    this.viewModel.update({
      players: [],
      playersLoading: false,
      playersError: error
    });
  }

  presentPlayerDetailSuccess(player) {
    console.log('PlayerPresenter: Presenting player detail success', player);
    this.viewModel.update({
      selectedPlayer: player,
      playerDetailLoading: false,
      playerDetailError: null
    });
  }

  presentPlayerDetailError(error) {
    console.error('PlayerPresenter: Presenting player detail error', error);
    this.viewModel.update({
      selectedPlayer: null,
      playerDetailLoading: false,
      playerDetailError: error
    });
  }

  presentMLBPlayerIdSuccess(data) {
    const currentState = this.viewModel.getState();
    console.log('PlayerPresenter: Presenting MLB player ID success', data);
    
    // Handle both object format {playerId: X, mlbId: Y} and direct format
    let playerId, mlbId, details;
    
    if (typeof data === 'object' && data !== null) {
      if (data.playerId && data.mlbId) {
        // Expected format: {playerId: 1, mlbId: 122434, details: {...}}
        playerId = data.playerId;
        mlbId = data.mlbId;
        details = data.details;
      } else if (data.player_id && data.mlb_id) {
        // Alternative snake_case format
        playerId = data.player_id;
        mlbId = data.mlb_id;
        details = data.details;
      } else {
        console.error('Invalid MLB player ID data structure:', data);
        return;
      }
    } else {
      console.error('Invalid MLB player ID data (not an object):', data);
      return;
    }
    
    console.log(`Mapping player ${playerId} to MLB ID ${mlbId}`);
    if (details) {
      console.log('Player details from MLB:', details);
    }
    
    // Update the player with MLB details if available
    let updatedPlayers = currentState.players;
    let updatedSelectedPlayer = currentState.selectedPlayer;
    
    if (details) {
      // Create the merged player data
      const mergedData = {
        height: details.height,
        weight: details.weight,
        bats: details.bats,
        throws: details.throws,
        date_of_birth: details.birthDate,
        age: details.age,
        mlb_team: details.currentTeam,
        position: details.primaryPosition,
        mlb_debut: details.mlbDebutDate
      };
      
      // Update in players array
      updatedPlayers = currentState.players.map(player => {
        if (player.player_id === playerId) {
          return { ...player, ...mergedData };
        }
        return player;
      });
      
      // Update selectedPlayer if it matches
      if (updatedSelectedPlayer && updatedSelectedPlayer.player_id === playerId) {
        updatedSelectedPlayer = { ...updatedSelectedPlayer, ...mergedData };
        console.log('Updated selectedPlayer with MLB data:', updatedSelectedPlayer);
      }
    }
    
    this.viewModel.update({
      playerMLBIds: {
        ...currentState.playerMLBIds,
        [playerId]: mlbId
      },
      players: updatedPlayers,
      selectedPlayer: updatedSelectedPlayer
    });
    
    console.log('Updated playerMLBIds:', this.viewModel.getState().playerMLBIds);
  }

  presentMLBPlayerIdError(error) {
    console.warn('PlayerPresenter: Failed to fetch MLB player ID:', error);
    // We don't update state for MLB ID errors since they're non-critical
  }
}

export default PlayerPresenter;