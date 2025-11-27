// frontend/src/frameworks-drivers/views/RosterView.jsx
import React, { useState } from 'react';
import PlayerCard from '../components/PlayerCard';

const RosterView = ({
  players, // Array of player objects returned from backend
  loading, // Boolean indicating whether data is still loading
  error, // Error message if loading failed
  playerMLBIds, // Mapping: app player_id -> MLB API player_id
  onPlayerClick, // Callback when clicking on a player card or marker
  getPlayerImage, // Function that fetches the player's MLB profile image
  injuryRiskData // ML risk predictions keyed by "FirstName, LastName"
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

  // Helper function to get injury risk score for a player
  const getInjuryRisk = (player) => {
    const playerFullName = `${player.first_name}, ${player.last_name}`;
    const playerRiskData = injuryRiskData?.[playerFullName];
    return playerRiskData ? Math.round(playerRiskData.injury_risk_prob * 100) : 0;
  };

  // Calculate min and max injury risk scores for the team
  const injuryRiskScores = players.map(p => getInjuryRisk(p));
  const minRisk = Math.min(...injuryRiskScores);
  const maxRisk = Math.max(...injuryRiskScores);
  const riskRange = maxRisk - minRisk || 1; // Avoid division by zero

  // Helper function to calculate marker color based on injury risk
  const getMarkerColor = (injuryRisk) => {
    if (injuryRisk >= 8) return "#e74c3c"; // High risk - red
    if (injuryRisk >= 4) return "#f1c40f"; // Medium risk - yellow
    return "#2ecc71"; // Low risk - green
  };

  // Helper function to get position on spectrum (0-100%)
  const getSpectrumPosition = (injuryRisk) => {
    // Normalize the score to 0-100% based on team's min/max
    const normalized = ((injuryRisk - minRisk) / riskRange) * 100;
    // Invert so high risk is on the left
    return 100 - normalized;
  };

  return (
    <div>
      {/* ---- INJURY RISK SPECTRUM SECTION ---- */}
      <div style={{ marginBottom: "24px", paddingTop: "10px" }}>
        <h2 style={{
          fontSize: "22px",
          fontWeight: 700,
          marginTop: "-20px",
          marginBottom: "20px",
          textAlign: "center",
          color: "white",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}>
          Injury Risk Spectrum
        </h2>

        {/* Main container with extra height for player markers below */}
        <div style={{
          position: "relative",
          height: "400px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "none",
          margin: "0 auto 20px auto",
        }}>
          {/* LEFT ARROW (High risk) */}
          <div style={{
            position: "absolute",
            left: "-100px",
            top: "15px",
            width: "100px",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="100" height="100" viewBox="0 0 100 100" style={{
              filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))",
            }}>
              <path d="M 80 20 L 20 50 L 80 80 Z" fill="#e74c3c" />
            </svg>
          </div>

          {/* Gradient Line with Zone Labels */}
          <div style={{
            position: "absolute",
            top: "55px",
            left: "-30px",
            right: "-30px",
            height: "24px",
            background: "linear-gradient(to right, #e74c3c 0%, #f1c40f 50%, #2ecc71 100%)",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          }}>
          </div>

          {/* Right Arrow (Low risk) */}
          <div style={{
            position: "absolute",
            right: "-100px",
            top: "15px",
            width: "100px",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="100" height="100" viewBox="0 0 100 100" style={{
              filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))",
            }}>
              <path d="M 20 20 L 80 50 L 20 80 Z" fill="#2ecc71" />
            </svg>
          </div>

          {/* ==== PLAYER MARKERS ON INJURY RISK LINE ==== */}
          {players.map((player, playerIndex) => {
            const injuryRisk = getInjuryRisk(player);
            const mlbId = playerMLBIds[player.player_id];
            const imageUrls = mlbId ? getPlayerImage(mlbId) : null;
            const markerColor = getMarkerColor(injuryRisk);

            // Position based on team's min/max range
            const leftPosition = `${getSpectrumPosition(injuryRisk)}%`;

            // Check how many players share this exact risk score and came before this one
            const playersWithSameRisk = players.filter(p => getInjuryRisk(p) === injuryRisk);
            const indexInGroup = playersWithSameRisk.findIndex(p => p.player_id === player.player_id);
            const totalInGroup = playersWithSameRisk.length;
            
            // Calculate vertical offset for stacking
            let verticalOffset = 0;
            if (totalInGroup > 1) {
              // Stack alternately above and below the line
              if (indexInGroup % 2 === 0) {
                // Even indices go above
                verticalOffset = -75 * Math.floor(indexInGroup / 2);
              } else {
                // Odd indices go below
                verticalOffset = 75 * Math.ceil(indexInGroup / 2);
              }
            }

            return (
              <div
                key={player.player_id}
                style={{
                  position: "absolute",
                  left: leftPosition,
                  top: `${30 + verticalOffset}px`,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                onClick={() => onPlayerClick(player, players.indexOf(player))}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(-50%) scale(1.15)";
                  e.currentTarget.style.zIndex = "20";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(-50%) scale(1)";
                  e.currentTarget.style.zIndex = "10";
                }}
                title={`${player.first_name} ${player.last_name} - Injury Risk: ${injuryRisk.toFixed(1)}%`}
              >
                {/* Player Image Marker */}
                <div style={{
                  width: "56px",
                  height: "56px",
                  background: markerColor,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 4px 12px ${markerColor}80`,
                  border: `3px solid ${markerColor}`,
                  overflow: "hidden",
                }}>
                  {imageUrls?.primary ? (
                    <img
                      src={imageUrls.primary}
                      alt={`${player.first_name} ${player.last_name}`}
                      style={{
                        width: "56px",
                        height: "56px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div style={{
                    width: "56px",
                    height: "56px",
                    display: imageUrls?.primary ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    background: markerColor,
                  }}>
                    👤
                  </div>
                </div>

                {/* Player ID below marker */}
                <div style={{
                  fontSize: "11px",
                  marginTop: "0px",
                  textAlign: "center",
                  fontWeight: 700,
                  color: "white",
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                  whiteSpace: "nowrap",
                }}>
                  #{player.player_id} ({injuryRisk.toFixed(0)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Player List */}
      <div style={{
        maxWidth: "420px",
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "120px",
        marginTop: "-300px"
      }}>
        {players
          .sort((a, b) => getInjuryRisk(b) - getInjuryRisk(a))
          .map((player, index) => {
            // Get the ML risk data for this specific player
            const playerFullName = `${player.first_name}, ${player.last_name}`;
            const playerRiskData = injuryRiskData?.[playerFullName];
            
            return (
              <PlayerCard
                key={player.player_id}
                player={player}
                index={index}
                playerMLBIds={playerMLBIds}
                onPlayerClick={onPlayerClick}
                getPlayerImage={getPlayerImage}
                riskData={playerRiskData}
              />
            );
          })}
      </div>
    </div>
  );
};

export default RosterView;