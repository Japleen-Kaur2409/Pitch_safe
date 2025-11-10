/**
 * Player Presenter
 * 
 * Transforms player use case output into view model updates.
 * Handles presentation logic for player roster, details, and MLB data.
 * 
 * This presenter manages three types of player data:
 * 1. Player list (roster view)
 * 2. Player details (detail view)
 * 3. MLB API data (images and stats)
 * 
 * @class PlayerPresenter
 */
import PlayerOutputBoundary from '../../use-cases/player/interfaces/PlayerOutputBoundary';

class PlayerPresenter extends PlayerOutputBoundary {
  /**
   * Creates a new PlayerPresenter instance
   * 
   * @param {PlayerViewModel} viewModel - View model to update
   */
  constructor(viewModel) {
    super();
    this.viewModel = viewModel;
  }

  /**
   * Presents successful player list retrieval
   * 
   * Called after fetching all players from the database.
   * Updates the roster view with the complete player list.
   * 
   * @param {Array<Object>} players - Array of player objects
   */
  presentPlayersSuccess(players) {
    console.log('PlayerPresenter: Presenting players success', players.length, 'players');
    
    this.viewModel.update({
      players,                       // Store player array
      playersLoading: false,         // Stop loading indicator
      playersError: null             // Clear any previous errors
    });
  }

  /**
   * Presents player list retrieval error
   * 
   * Common errors:
   * - Database connection failure
   * - No players found for team
   * - API timeout
   * 
   * @param {string} error - Error message to display
   */
  presentPlayersError(error) {
    console.error('PlayerPresenter: Presenting players error', error);
    
    this.viewModel.update({
      players: [],                   // Clear player list
      playersLoading: false,         // Stop loading indicator
      playersError: error            // Show error message
    });
  }

  /**
   * Presents successful player detail retrieval
   * 
   * Updates the selected player with comprehensive information
   * including database details and MLB API data.
   * 
   * @param {Object} player - Complete player object with all details
   */
  presentPlayerDetailSuccess(player) {
    console.log('PlayerPresenter: Presenting player detail success', player);
    
    this.viewModel.update({
      selectedPlayer: player,        // Store detailed player data
      playerDetailLoading: false,    // Stop loading indicator
      playerDetailError: null        // Clear any previous errors
    });
  }

  /**
   * Presents player detail retrieval error
   * 
   * @param {string} error - Error message to display
   */
  presentPlayerDetailError(error) {
    console.error('PlayerPresenter: Presenting player detail error', error);
    
    this.viewModel.update({
      selectedPlayer: null,          // Clear selected player
      playerDetailLoading: false,    // Stop loading indicator
      playerDetailError: error       // Show error message
    });
  }

  /**
   * Presents successful MLB player ID retrieval
   * 
   * This is a complex presenter method that:
   * 1. Maps internal player ID to MLB official ID
   * 2. Merges MLB data with existing player data
   * 3. Updates both roster and selected player if applicable
   * 
   * Data Flow:
   * - Receives: {playerId, mlbId, details}
   * - Updates: playerMLBIds mapping
   * - Merges: MLB details into player objects
   * - Syncs: selectedPlayer if it's the same player
   * 
   * @param {Object} data - MLB player data
   * @param {number} data.playerId - Internal player ID
   * @param {number} data.mlbId - MLB official player ID
   * @param {Object} data.details - Detailed player info from MLB API
   */
  presentMLBPlayerIdSuccess(data) {
    const currentState = this.viewModel.getState();
    console.log('PlayerPresenter: Presenting MLB player ID success', data);
    
    // Validate data structure
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
    
    // Prepare updated player data with MLB details
    let updatedPlayers = currentState.players;
    let updatedSelectedPlayer = currentState.selectedPlayer;
    
    if (details) {
      // Create merged data object with MLB information
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
      
      // Update in players array for roster view
      updatedPlayers = currentState.players.map(player => {
        if (player.player_id === playerId) {
          return { ...player, ...mergedData };
        }
        return player;
      });
      
      // Update selectedPlayer if it's the same player (for detail view)
      if (updatedSelectedPlayer && updatedSelectedPlayer.player_id === playerId) {
        updatedSelectedPlayer = { ...updatedSelectedPlayer, ...mergedData };
        console.log('Updated selectedPlayer with MLB data:', updatedSelectedPlayer);
      }
    }
    
    // Update view model with MLB ID mapping and merged data
    this.viewModel.update({
      playerMLBIds: {
        ...currentState.playerMLBIds,
        [playerId]: mlbId              // Map internal ID to MLB ID
      },
      players: updatedPlayers,         // Update roster with MLB data
      selectedPlayer: updatedSelectedPlayer // Update detail view if applicable
    });
    
    console.log('Updated playerMLBIds:', this.viewModel.getState().playerMLBIds);
  }

  /**
   * Presents MLB player ID retrieval error
   * 
   * This is a non-critical error - the app continues to function
   * with internal data only. MLB data is supplementary.
   * 
   * Common causes:
   * - Player name not found in MLB database
   * - MLB API rate limit exceeded
   * - Network timeout
   * 
   * @param {string} error - Error message (logged but not shown to user)
   */
  presentMLBPlayerIdError(error) {
    console.warn('PlayerPresenter: Failed to fetch MLB player ID:', error);
    // Don't update state - MLB data is non-critical
    // App continues to work with internal data only
  }
}

export default PlayerPresenter;