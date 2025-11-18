// frontend/src/frameworks-drivers/views/RosterView.jsx
import React, { useState } from 'react';
import PlayerCard from '../components/PlayerCard';

// RosterView Component: Displays fatigue spectrum and list of players
const RosterView = ({
  players, // Array of player objects returned from backend
  loading, // Boolean indicating whether data is still loading
  error, // Error message if loading failed
  playerMLBIds, // Mapping: app player_id -> MLB API player_id
  onPlayerClick, // Callback when clicking on a player card or marker
  getPlayerImage, // Function that fetches the player's MLB profile image
  injuryRiskData // ML risk predictions keyed by "FirstName, LastName"
}) => {
  // --- LOADING STATE ---
  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        Loading players...
      </div>
    );
  }
  // --- ERROR STATE ---
  if (error) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        Error loading players: {error}
      </div>
    );
  }
  // --- NO PLAYERS IN ROSTER ---
  if (players.length === 0) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        No players found. Please add players to your roster.
      </div>
    );
  }
  
  // Calculate position on spectrum based on fatigue score
  // 0-100 fatigue scale maps to 0-100% position
  // Lower scores (better) = right side, Higher scores (worse) = left side
  const calculatePosition = (fatigueScore) => {
    // Normalize to 0-100 range
    const normalizedScore = Math.max(0, Math.min(100, fatigueScore || 0));
    // Convert to position percentage (0 = left/critical, 100 = right/good)
    // Invert so: high fatigue = left (0%), low fatigue = right (100%)
    const positionPercent = 100 - normalizedScore;
    
    return positionPercent;
  };

  // Get color for player marker based on fatigue
  const getMarkerColor = (fatigueScore) => {
    if (fatigueScore >= 50) return '#e74c3c'; // Critical - Red
    if (fatigueScore >= 30) return '#f39c12'; // High - Orange
    if (fatigueScore >= 15) return '#f1c40f'; // Moderate - Yellow
    return '#2ecc71'; // Good - Green
  };

  // --- MAIN VIEW CONTENT ---
  return (
    <div> 
      {/* ---- FATIGUE SPECTRUM SECTION ---- */}
      <div style={{ marginBottom: "24px", paddingTop: "10px" }}>
        <h2 style={{
          fontSize: "22px",
          fontWeight: 700,
          marginBottom: "20px",
          textAlign: "center",
          color: "white",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}>
          Fatigue Spectrum
        </h2>
        
        {/* Container that holds arrows, gradient bar, and player markers */}
        <div style={{ 
          position: "relative", 
          height: "120px",
          padding: "0 40px",
          marginBottom: "10px"
        }}>
          {/* LEFT ARROW (High fatigue) */}
          <div style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
          }}>
            <svg width="80" height="80" viewBox="0 0 100 100">
              <path d="M 80 20 L 20 50 L 80 80 Z" fill="#e74c3c" />
            </svg>
          </div>

          {/* Gradient Line with Zone Labels */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "110px",
            right: "110px",
            height: "24px",
            background: "linear-gradient(to right, #e74c3c 0%, #f39c12 30%, #f1c40f 50%, #2ecc71 100%)",
            borderRadius: "12px",
            transform: "translateY(-50%)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          }}>
            {/* Zone markers */}
            <div style={{
              position: "absolute",
              left: "5%",
              top: "-32px",
              fontSize: "11px",
              color: "white",
              fontWeight: 700,
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
              whiteSpace: "nowrap",
            }}>
              Critical
            </div>
            <div style={{
              position: "absolute",
              right: "5%",
              top: "-32px",
              fontSize: "11px",
              color: "white",
              fontWeight: 700,
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
              whiteSpace: "nowrap",
            }}>
              Optimal
            </div>
          </div>
          
          {/* Right Arrow (Low/Good fatigue) */}
          <div style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
          }}>
            <svg width="80" height="80" viewBox="0 0 100 100">
              <path d="M 20 20 L 80 50 L 20 80 Z" fill="#2ecc71" />
            </svg>
          </div>
          
          {/* ==== PLAYER MARKERS ON FATIGUE LINE ==== */}
          {players.map((player, index) => {
            // Calculate risk data for each player
            const playerFullName = `${player.first_name}, ${player.last_name}`;
            const riskData = injuryRiskData?.[playerFullName];
            const fatigueScore = player.fatigue_score || 0;
            const positionPercent = calculatePosition(fatigueScore);
            const mlbId = playerMLBIds[player.player_id];
            const imageUrls = mlbId ? getPlayerImage(mlbId) : null;
            const markerColor = getMarkerColor(fatigueScore);
            
            // Calculate actual left position
            // Spectrum goes from left: 100px to right: calc(100% - 100px)
            // We use percentage within that range
            const leftPosition = `calc(100px + ${positionPercent}% * (100% - 200px) / 100)`;
            
            return (
              <div
                key={player.player_id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: leftPosition,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  zIndex: 10,
                }}
                onClick={() => onPlayerClick(player, players.indexOf(player))}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.15)";
                  e.currentTarget.style.zIndex = "20";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                  e.currentTarget.style.zIndex = "10";
                }}
                title={`${player.first_name} ${player.last_name} - Fatigue: ${fatigueScore.toFixed(1)}%`}
              >
                <div style={{
                  width: "56px",
                  height: "56px",
                  background: "white",
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
                        e.currentTarget.nextSibling.style.display = "flex";
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
                    background: "linear-gradient(135deg, #e8d5d5 0%, #d5c8e8 100%)",
                  }}>
                    👤
                  </div>
                </div>

                {/* Player ID below marker */}
                <div style={{
                  fontSize: "11px",
                  marginTop: "6px",
                  textAlign: "center",
                  fontWeight: 700,
                  color: "white",
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                  whiteSpace: "nowrap",
                }}>
                  #{player.player_id}
                </div>

                {/* Fatigue score label */}
                <div style={{
                  fontSize: "10px",
                  marginTop: "2px",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "white",
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "4px",
                  padding: "2px 4px",
                }}>
                  {fatigueScore.toFixed(0)}%
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
        marginBottom: "120px", // Extra space before navigation bar
      }}>
        {players
          .sort((a, b) => (b.fatigue_score || 0) - (a.fatigue_score || 0)) // Sort by fatigue score, highest first
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
                riskData={playerRiskData}  // Pass the specific player's ML risk data
              />
            );
          })}
      </div>
    </div>
  );
};

export default RosterView;