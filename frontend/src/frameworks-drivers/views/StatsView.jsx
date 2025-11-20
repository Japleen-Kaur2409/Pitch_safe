import React from 'react';

const StatsView = ({ players, onPlayerClick, injuryRiskData }) => {
  console.log('=== StatsView DEBUG ===');
  console.log('Players received:', players?.length);
  console.log('Players array:', players);
  console.log('injuryRiskData received:', injuryRiskData);
  console.log('injuryRiskData type:', typeof injuryRiskData);
  console.log('Is injuryRiskData null?', injuryRiskData === null);
  console.log('Is injuryRiskData undefined?', injuryRiskData === undefined);
  console.log('Available keys:', injuryRiskData ? Object.keys(injuryRiskData) : 'none');
  
  if (players && players.length > 0) {
    const firstPlayer = players[0];
    console.log('First player:', firstPlayer);
    console.log('First player name format:', `${firstPlayer.first_name}, ${firstPlayer.last_name}`);
  }
  
  // Helper function to get injury risk score for a player
  // This is the EXACT same logic as RosterView
  const getInjuryRisk = (player) => {
    const playerFullName = `${player.first_name}, ${player.last_name}`;
    const playerRiskData = injuryRiskData?.[playerFullName];
    const riskScore = playerRiskData ? Math.round(playerRiskData.injury_risk_prob * 100) : 0;
    console.log(`Risk for ${playerFullName}:`, {
      playerRiskData,
      injury_risk_prob: playerRiskData?.injury_risk_prob,
      riskScore
    });
    return riskScore;
  };

  // Helper function to get risk level
  const getRiskLevel = (player) => {
    const playerFullName = `${player.first_name}, ${player.last_name}`;
    const playerRiskData = injuryRiskData?.[playerFullName];
    return playerRiskData?.risk_level || 'unknown';
  };

  // Sort players by injury risk score (highest to lowest)
  const sortedPlayers = [...players].sort((a, b) => getInjuryRisk(b) - getInjuryRisk(a));

  // Categorize players into zones based on injury risk
  // Low risk: < 4%, Medium risk: 4-7%, High risk: 8+%
  const highRiskPlayers = sortedPlayers.filter(p => {
    const risk = getInjuryRisk(p);
    return risk >= 8;
  });
  
  const mediumRiskPlayers = sortedPlayers.filter(p => {
    const risk = getInjuryRisk(p);
    return risk >= 4 && risk < 8;
  });
  
  const lowRiskPlayers = sortedPlayers.filter(p => {
    const risk = getInjuryRisk(p);
    return risk < 4 && risk >=0;
  });

  const PlayerRow = ({ player, index, backgroundColor, textColor = "white" }) => {
    const injuryRisk = getInjuryRisk(player);
    const riskLevel = getRiskLevel(player);
    
    return (
      <div
        key={player.player_id}
        onClick={() => onPlayerClick(player, index)}
        style={{
          background: backgroundColor,
          padding: "16px 20px",
          marginBottom: "8px",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateX(8px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateX(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{
            fontSize: "20px",
            fontWeight: 800,
            color: textColor,
            minWidth: "50px",
          }}>
            #{player.player_id}
          </div>
          <div style={{
            fontSize: "18px",
            fontWeight: 700,
            color: textColor,
          }}>
            {player.first_name} {player.last_name}
          </div>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          {/* Risk Level Badge */}
          {riskLevel !== 'unknown' && (
            <div style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "white",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "4px 8px",
              borderRadius: "6px",
              textTransform: "uppercase",
            }}>
              {riskLevel}
            </div>
          )}
          <div style={{
            fontSize: "24px",
            fontWeight: 800,
            color: textColor,
            minWidth: "70px",
            textAlign: "right",
          }}>
            {injuryRisk}%
          </div>
          <div style={{
            fontSize: "20px",
            color: textColor,
          }}>
            →
          </div>
        </div>
      </div>
    );
  };

  const ZoneSection = ({ title, players, color, icon }) => {
    if (players.length === 0) return null;
    
    return (
      <div style={{
        marginBottom: "32px",
      }}>
        {/* Zone Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
          padding: "12px 20px",
          background: `${color}30`,
          borderLeft: `6px solid ${color}`,
          borderRadius: "8px",
        }}>
          <div style={{
            fontSize: "32px",
          }}>
            {icon}
          </div>
          <div>
            <div style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "white",
            }}>
              {title}
            </div>
            <div style={{
              fontSize: "14px",
              color: "white",
              opacity: 0.9,
            }}>
              {players.length} player{players.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Player List */}
        <div>
          {players.map((player, index) => (
            <PlayerRow
              key={player.player_id}
              player={player}
              index={sortedPlayers.indexOf(player)}
              backgroundColor={color}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h3 style={{ 
        color: "white", 
        fontSize: "28px", 
        fontWeight: 700,
        marginBottom: "8px",
        textAlign: "center",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
      }}>
        Team Injury Risk Overview
      </h3>
      
      <p style={{ 
        color: "white", 
        fontSize: "15px", 
        marginBottom: "32px",
        textAlign: "center",
        opacity: 0.9,
        textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
      }}>
        Players organized by injury risk level
      </p>

      {/* Risk Spectrum Visual */}
      <div style={{
        display: "flex",
        marginBottom: "40px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
        height: "60px",
      }}>
        {/* Red Zone - High Risk */}
        <div style={{
          flex: highRiskPlayers.length || 1,
          background: "#e74c3c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minWidth: "60px",
        }}>
          <div style={{
            fontSize: "32px",
          }}>
            🔴
          </div>
          {highRiskPlayers.length > 0 && (
            <div style={{
              position: "absolute",
              top: "4px",
              right: "8px",
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: "12px",
              padding: "2px 8px",
              fontSize: "12px",
              fontWeight: 700,
              color: "white",
            }}>
              {highRiskPlayers.length}
            </div>
          )}
        </div>

        {/* Yellow Zone - Medium Risk */}
        <div style={{
          flex: mediumRiskPlayers.length || 1,
          background: "#f1c40f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minWidth: "60px",
        }}>
          <div style={{
            fontSize: "32px",
          }}>
            🟡
          </div>
          {mediumRiskPlayers.length > 0 && (
            <div style={{
              position: "absolute",
              top: "4px",
              right: "8px",
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: "12px",
              padding: "2px 8px",
              fontSize: "12px",
              fontWeight: 700,
              color: "white",
            }}>
              {mediumRiskPlayers.length}
            </div>
          )}
        </div>

        {/* Green Zone - Low Risk */}
        <div style={{
          flex: lowRiskPlayers.length || 1,
          background: "#2ecc71",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minWidth: "60px",
        }}>
          <div style={{
            fontSize: "32px",
          }}>
            🟢
          </div>
          {lowRiskPlayers.length > 0 && (
            <div style={{
              position: "absolute",
              top: "4px",
              right: "8px",
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: "12px",
              padding: "2px 8px",
              fontSize: "12px",
              fontWeight: 700,
              color: "white",
            }}>
              {lowRiskPlayers.length}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
        marginBottom: "32px",
      }}>
        <div style={{
          background: "rgba(231, 76, 60, 0.2)",
          border: "2px solid #e74c3c",
          borderRadius: "12px",
          padding: "12px",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#e74c3c",
          }}>
            {highRiskPlayers.length}
          </div>
          <div style={{
            fontSize: "11px",
            color: "white",
            fontWeight: 600,
            marginTop: "4px",
          }}>
            HIGH RISK
          </div>
        </div>

        <div style={{
          background: "rgba(241, 196, 15, 0.2)",
          border: "2px solid #f1c40f",
          borderRadius: "12px",
          padding: "12px",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#f1c40f",
          }}>
            {mediumRiskPlayers.length}
          </div>
          <div style={{
            fontSize: "11px",
            color: "white",
            fontWeight: 600,
            marginTop: "4px",
          }}>
            MEDIUM RISK
          </div>
        </div>

        <div style={{
          background: "rgba(46, 204, 113, 0.2)",
          border: "2px solid #2ecc71",
          borderRadius: "12px",
          padding: "12px",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#2ecc71",
          }}>
            {lowRiskPlayers.length}
          </div>
          <div style={{
            fontSize: "11px",
            color: "white",
            fontWeight: 600,
            marginTop: "4px",
          }}>
            LOW RISK
          </div>
        </div>
      </div>

      {/* Player Lists by Zone */}
      <div style={{
        marginBottom: "120px",
      }}>
        <ZoneSection
          title="High Risk"
          players={highRiskPlayers}
          color="#e74c3c"
          icon="🔴"
        />

        <ZoneSection
          title="Medium Risk"
          players={mediumRiskPlayers}
          color="#f1c40f"
          icon="🟡"
        />

        <ZoneSection
          title="Low Risk"
          players={lowRiskPlayers}
          color="#2ecc71"
          icon="🟢"
        />
      </div>

      {/* No players message */}
      {players.length === 0 && (
        <div style={{
          textAlign: "center",
          color: "white",
          padding: "40px",
          fontSize: "16px",
        }}>
          No players to display
        </div>
      )}
    </div>
  );
};

export default StatsView;