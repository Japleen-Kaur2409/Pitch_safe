// frontend/src/frameworks-drivers/views/RosterView.jsx
import React from 'react';
import PlayerCard from '../components/PlayerCard';

const RosterView = ({ 
  players, 
  loading, 
  error, 
  playerMLBIds,
  onPlayerClick,
  getPlayerImage,
  injuryRiskData  // ADD THIS
}) => {
  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        Loading players...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        Error loading players: {error}
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        No players found. Please add players to your roster.
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      marginBottom: "20px",
    }}>
      {players.map((player, index) => {
        // Calculate risk data for each player
        const playerFullName = `${player.first_name}, ${player.last_name}`;
        const riskData = injuryRiskData?.[playerFullName];
        
        return (
          <PlayerCard
            key={player.player_id}
            player={player}
            index={index}
            playerMLBIds={playerMLBIds}
            onPlayerClick={onPlayerClick}
            getPlayerImage={getPlayerImage}
            riskData={riskData}  // ADD THIS
          />
        );
      })}
    </div>
  );
};

export default RosterView;