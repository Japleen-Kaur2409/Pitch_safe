import React from 'react';

const StatsView = ({ players, onPlayerClick }) => {
  // Sort players by fatigue score (highest to lowest)
  const sortedPlayers = [...players].sort((a, b) => (b.fatigue_score || 0) - (a.fatigue_score || 0));

  // Categorize players into zones
  const criticalPlayers = sortedPlayers.filter(p => (p.fatigue_score || 0) >= 50);
  const highPlayers = sortedPlayers.filter(p => (p.fatigue_score || 0) >= 30 && (p.fatigue_score || 0) < 50);
  const moderatePlayers = sortedPlayers.filter(p => (p.fatigue_score || 0) >= 15 && (p.fatigue_score || 0) < 30);
  const goodPlayers = sortedPlayers.filter(p => (p.fatigue_score || 0) < 15);

  const PlayerRow = ({ player, index, backgroundColor, textColor = "white" }) => (
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
        <div style={{
          fontSize: "24px",
          fontWeight: 800,
          color: textColor,
          minWidth: "70px",
          textAlign: "right",
        }}>
          {(player.fatigue_score || 0).toFixed(0)}%
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
        Team Fatigue Overview
      </h3>
      
      <p style={{ 
        color: "white", 
        fontSize: "15px", 
        marginBottom: "32px",
        textAlign: "center",
        opacity: 0.9,
        textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
      }}>
        Players organized by risk level
      </p>

      {/* Traffic Light Spectrum Visual */}
      <div style={{
        display: "flex",
        marginBottom: "40px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
        height: "60px",
      }}>
        {/* Red Zone */}
        <div style={{
          flex: criticalPlayers.length || 1,
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
          {criticalPlayers.length > 0 && (
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
              {criticalPlayers.length}
            </div>
          )}
        </div>

        {/* Orange Zone */}
        <div style={{
          flex: highPlayers.length || 1,
          background: "#f39c12",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minWidth: "60px",
        }}>
          <div style={{
            fontSize: "32px",
          }}>
            🟠
          </div>
          {highPlayers.length > 0 && (
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
              {highPlayers.length}
            </div>
          )}
        </div>

        {/* Yellow Zone */}
        <div style={{
          flex: moderatePlayers.length || 1,
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
          {moderatePlayers.length > 0 && (
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
              {moderatePlayers.length}
            </div>
          )}
        </div>

        {/* Green Zone */}
        <div style={{
          flex: goodPlayers.length || 1,
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
          {goodPlayers.length > 0 && (
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
              {goodPlayers.length}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
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
            {criticalPlayers.length}
          </div>
          <div style={{
            fontSize: "11px",
            color: "white",
            fontWeight: 600,
            marginTop: "4px",
          }}>
            CRITICAL
          </div>
        </div>

        <div style={{
          background: "rgba(243, 156, 18, 0.2)",
          border: "2px solid #f39c12",
          borderRadius: "12px",
          padding: "12px",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#f39c12",
          }}>
            {highPlayers.length}
          </div>
          <div style={{
            fontSize: "11px",
            color: "white",
            fontWeight: 600,
            marginTop: "4px",
          }}>
            HIGH
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
            {moderatePlayers.length}
          </div>
          <div style={{
            fontSize: "11px",
            color: "white",
            fontWeight: 600,
            marginTop: "4px",
          }}>
            MODERATE
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
            {goodPlayers.length}
          </div>
          <div style={{
            fontSize: "11px",
            color: "white",
            fontWeight: 600,
            marginTop: "4px",
          }}>
            GOOD
          </div>
        </div>
      </div>

      {/* Player Lists by Zone */}
      <div style={{
        marginBottom: "120px",
      }}>
        <ZoneSection
          title="Critical Risk"
          players={criticalPlayers}
          color="#e74c3c"
          icon="🔴"
        />

        <ZoneSection
          title="High Risk"
          players={highPlayers}
          color="#f39c12"
          icon="🟠"
        />

        <ZoneSection
          title="Moderate Risk"
          players={moderatePlayers}
          color="#f1c40f"
          icon="🟡"
        />

        <ZoneSection
          title="Good Condition"
          players={goodPlayers}
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