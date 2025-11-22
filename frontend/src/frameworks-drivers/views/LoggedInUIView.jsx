// frontend/src/frameworks-drivers/views/LoggedInUIView.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { configureDependencies } from '../../config/dependencies';
import { getTeamLogo } from '../../utils/teamUtils';

// Import Views
import RosterView from './RosterView';
import PlayerDetailView from './PlayerDetailView';
import StatsView from './StatsView';
import DownloadView from './DownloadView';

// Import Components
import LogoutButton from '../components/LogoutButton';
import NavigationBar from '../components/NavigationBar';

const LoggedInUIView = ({ 
  currentUser, 
  onLogout, 
  authLoading,
  injuryRiskData,  // NEW: Receive injury risk data from App.jsx
  mlLoading,       // NEW: ML loading state
  mlError          // NEW: ML error state
}) => {
  console.log('🔵 LoggedInUIView received injuryRiskData:', injuryRiskData);
  console.log('🔵 Keys:', injuryRiskData ? Object.keys(injuryRiskData) : 'undefined');
  console.log('🔵 mlLoading:', mlLoading);
  console.log('🔵 mlError:', mlError);
  const dependencies = useMemo(() => configureDependencies(), []);
  
  const { 
    playerViewModel, 
    navigationViewModel,
    gameViewModel,
    playerController, 
    navigationController,
    gameController,
    mlbApiService 
  } = dependencies;

  // Local state
  const [playerState, setPlayerState] = useState(playerViewModel.getState());
  const [navigationState, setNavigationState] = useState(navigationViewModel.getState());
  const [gameState, setGameState] = useState(gameViewModel.getState());

  // Subscribe to state changes
  useEffect(() => {
    console.log('Setting up subscriptions');
    
    const playerUnsubscribe = playerViewModel.subscribe((newState) => {
      console.log('Player state updated:', newState);
      setPlayerState(newState);
      
      // IMPORTANT: Sync selectedPlayer to navigationViewModel
      // This ensures MLB data updates are reflected in the detail view
      const currentNavState = navigationViewModel.getState();
      if (currentNavState.selectedPlayer && newState.selectedPlayer && 
          currentNavState.selectedPlayer.player_id === newState.selectedPlayer.player_id) {
        console.log('Syncing updated player data to navigation state');
        navigationViewModel.update({
          selectedPlayer: newState.selectedPlayer
        });
      }
    });
    
    const navUnsubscribe = navigationViewModel.subscribe((newState) => {
      console.log('Navigation state updated:', newState);
      setNavigationState(newState);
    });

    const gameUnsubscribe = gameViewModel.subscribe((newState) => {
      console.log('Game state updated:', newState);
      setGameState(newState);
    });

    // Load players on mount and fetch MLB IDs for all players
    const loadPlayersAndMLBData = async () => {
      const coachId = currentUser?.coach_id;
      
      // Fetch players for this specific coach
      if (coachId) {
        await playerController.handleGetPlayersByCoach(coachId);
      } else {
        await playerController.handleGetAllPlayers();
      }
      
      // Wait a bit for state to update, then get current players
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const currentPlayers = playerViewModel.getState().players;
      console.log('Preloading MLB data for', currentPlayers.length, 'players');
      
      // Fetch MLB IDs for all players in parallel
      const mlbIdPromises = currentPlayers.map(player => 
        playerController.handleFetchMLBPlayerId(
          player.player_id,
          player.first_name,
          player.last_name
        ).catch(error => {
          console.warn(`Failed to fetch MLB ID for ${player.first_name} ${player.last_name}:`, error);
          return null; // Don't let one failure stop others
        })
      );
      
      await Promise.all(mlbIdPromises);
      console.log('MLB data preloading complete');
    };
    
    loadPlayersAndMLBData();

    return () => {
      console.log('Cleaning up subscriptions');
      playerUnsubscribe();
      navUnsubscribe();
      gameUnsubscribe();
    };
  }, [playerViewModel, navigationViewModel, gameViewModel, playerController, currentUser?.coach_id]);

  // Log ML data when it arrives
  useEffect(() => {
    if (injuryRiskData) {
      console.log('Injury risk data available:', injuryRiskData);
    }
    if (mlError) {
      console.error('ML Error:', mlError);
    }
  }, [injuryRiskData, mlError]);

  const teamLogo = getTeamLogo(currentUser?.teamName || "Toronto Blue Jays");

  const getPlayerImage = (mlbPlayerId) => {
    if (!mlbPlayerId) {
      console.warn('getPlayerImage called with no MLB ID');
      return null;
    }
    
    // Returns an object with multiple image URLs for fallback
    const imageUrls = mlbApiService.getPlayerImage(mlbPlayerId);
    console.log('Getting image URLs for MLB ID:', mlbPlayerId);
    return imageUrls;
  };

  // Event handlers
  const handlePlayerClick = async (player, index) => {
    console.log('Player clicked:', player, index);
    
    const playerFullName = `${player.first_name}, ${player.last_name}`;
    const playerRiskData = injuryRiskData?.[playerFullName];
    
    console.log('🔍 Looking for player:', playerFullName);
    console.log('🔍 Available players:', injuryRiskData ? Object.keys(injuryRiskData) : 'none');
    console.log('🔍 Player risk data found:', playerRiskData);
    
    // Use ML-based risk score if available, otherwise use placeholder
    const fatigueScore = playerRiskData 
      ? Math.round(playerRiskData.injury_risk_prob * 100)
      : [33, 28, 19, 14, 8][index % 5];
    
    const riskLevel = playerRiskData?.risk_level || 'unknown';
    
    console.log('🔍 Calculated fatigueScore:', fatigueScore);
    console.log('🔍 Calculated riskLevel:', riskLevel);
    
    // Define placeholder arrays for velocity and spin rate
    const velocities = [92.5, 94.2, 90.8, 95.1, 91.3];
    const spinRates = [2350, 2420, 2280, 2510, 2390];

    const playerWithStats = {
      ...player,
      fatigue_score: fatigueScore,  // Use fatigue_score to match what PlayerDetailView expects
      riskLevel,
      velocity: velocities[index % velocities.length],
      spin_rate: spinRates[index % spinRates.length],
    };

    console.log('🔍 Final playerWithStats:', playerWithStats);

    // Navigate to player detail immediately
    navigationController.navigateToPlayerDetail(playerWithStats);

    // Fetch detailed player info in background
    try {
      await playerController.handleGetPlayerDetail(player.player_id, playerWithStats);
    } catch (error) {
      console.error('Error fetching player detail:', error);
    }
    
    // MLB IDs are already preloaded at login, no need to fetch again
    console.log('Using preloaded MLB ID:', playerState.playerMLBIds[player.player_id]);
  };

  const handleBackClick = () => {
    console.log('Back button clicked');
    navigationController.navigateBack();
    playerViewModel.clearSelectedPlayer();
  };

  const handleNavClick = (view) => {
    console.log('Navigation clicked:', view);
    
    // Clear selected player when navigating away from detail view
    if (navigationState.currentView === 'playerDetail') {
      playerViewModel.clearSelectedPlayer();
    }
    
    switch (view) {
      case 'stats':
        navigationController.navigateToStats();
        break;
      case 'roster':
        navigationController.navigateToRoster();
        break;
      case 'download':
        navigationController.navigateToDownload();
        break;
      default:
        navigationController.navigateToRoster();
    }
  };

  const renderCurrentView = () => {
    console.log('Rendering view:', navigationState.currentView);
    
    switch (navigationState.currentView) {
      case 'playerDetail':
        return (
          <PlayerDetailView
            selectedPlayer={navigationState.selectedPlayer}
            playerMLBIds={playerState.playerMLBIds}
            loading={playerState.playerDetailLoading}
            onBackClick={handleBackClick}
            getPlayerImage={getPlayerImage}
            gameState={gameState}
            gameController={gameController}
            injuryRiskData={injuryRiskData}  // NEW: Pass injury risk data
          />
        );

      case 'stats':
        return (
          <StatsView
            players={playerState.players}
            onPlayerClick={handlePlayerClick}
            injuryRiskData={injuryRiskData}  // NEW: Pass injury risk data
          />
        );

      case 'download':
        return (
          <DownloadView
            players={playerState.players}
            selectedPlayer={playerState.selectedPlayer}
            onPlayerSelect={(player) => {
              console.log('Player selected for download:', player);
              playerViewModel.update({ selectedPlayer: player });
            }}
            injuryRiskData={injuryRiskData}
            gameState={gameState}
          />
        );

      case 'roster':
      default:
        return (
          <RosterView
            players={playerState.players}
            loading={playerState.playersLoading}
            error={playerState.playersError}
            playerMLBIds={playerState.playerMLBIds}
            onPlayerClick={handlePlayerClick}
            getPlayerImage={getPlayerImage}
            currentCoachId={currentUser?.coach_id}
            injuryRiskData={injuryRiskData}
          />
        );
    }
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      background: "linear-gradient(180deg, #a85f6f 0%, #8b6b9e 30%, #6b7cb8 50%, #7b6ca8 70%, #b8697a 100%)",
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "20px",
      paddingTop: "40px",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: "auto",
    }}>
      <LogoutButton 
        onLogout={onLogout} 
        isLoading={authLoading}
        userEmail={currentUser?.email}
      />

      <div style={{
        width: "100%",
        maxWidth: "800px",
        paddingBottom: "100px",
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "30px",
        }}>
          <img
            src={teamLogo}
            alt="Team Logo"
            style={{
              width: "100px",
              height: "100px",
              margin: "0 auto 15px",
              borderRadius: "12px",
              objectFit: "contain",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
            }}
            onError={(e) => {
              console.error('Team logo failed to load');
              e.currentTarget.src = "/default-team.png";
            }}
          />
          <div style={{
            color: "white",
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}>
            {currentUser?.teamName || "Toronto Blue Jays"}
          </div>
          
          {/* NEW: ML Loading/Error Indicator */}
          {mlLoading && (
            <div style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "12px",
              marginTop: "8px",
              fontStyle: "italic"
            }}>
              Loading injury risk predictions...
            </div>
          )}
          {mlError && (
            <div style={{
              color: "rgba(255, 100, 100, 0.9)",
              fontSize: "12px",
              marginTop: "8px",
              fontStyle: "italic"
            }}>
              Warning: ML predictions unavailable
            </div>
          )}
        </div>

        {/* Main Content */}
        {renderCurrentView()}

        {/* Navigation */}
        <NavigationBar
          currentView={navigationState.currentView}
          onNavigate={handleNavClick}
        />
      </div>
    </div>
  );
};

export default LoggedInUIView;