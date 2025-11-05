// frontend/src/frameworks-drivers/views/DownloadView.jsx
import React from 'react';

const DownloadView = ({ players, selectedPlayer, onPlayerSelect }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3 style={{ 
        color: "white", 
        fontSize: "28px", 
        fontWeight: 700,
        marginBottom: "25px",
        textAlign: "center",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
      }}>
        Download Report
      </h3>

      {/* Team Summary Section */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}>
        <h4 style={{
          color: "#2c3e50",
          fontSize: "20px",
          fontWeight: 700,
          marginBottom: "12px",
        }}>
          Team Summary Report
        </h4>
        <p style={{
          color: "#7f8c8d",
          fontSize: "14px",
          marginBottom: "20px",
          lineHeight: "1.6",
        }}>
          Download a comprehensive PDF report containing all player data, fatigue scores, warnings, and performance metrics.
        </p>
        <button
          onClick={() => console.log('Team data download clicked')}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(52, 152, 219, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(52, 152, 219, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(52, 152, 219, 0.3)";
          }}
        >
          📄 Download Team Data
        </button>
      </div>

      {/* Individual Player Section */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}>
        <h4 style={{
          color: "#2c3e50",
          fontSize: "20px",
          fontWeight: 700,
          marginBottom: "12px",
        }}>
          Individual Player Report
        </h4>
        <p style={{
          color: "#7f8c8d",
          fontSize: "14px",
          marginBottom: "20px",
          lineHeight: "1.6",
        }}>
          Select a player to download their individual performance report.
        </p>
        
        <select
          value={selectedPlayer?.player_id || ''}
          onChange={(e) => {
            const playerId = e.target.value;
            if (playerId) {
              const player = players.find(p => p.player_id.toString() === playerId);
              if (player) {
                onPlayerSelect(player);
              }
            }
          }}
          style={{
            width: "100%",
            padding: "14px 16px",
            border: "2px solid #e0e0e0",
            borderRadius: "10px",
            fontSize: "15px",
            background: "white",
            color: selectedPlayer ? "#2c3e50" : "#999",
            outline: "none",
            cursor: "pointer",
            marginBottom: "16px",
            transition: "all 0.3s ease",
          }}
        >
          <option value="">Select a Player</option>
          {players.map((player) => (
            <option key={player.player_id} value={player.player_id}>
              #{player.player_id} - {player.first_name} {player.last_name}
            </option>
          ))}
        </select>

        {selectedPlayer && (
          <button
            onClick={() => console.log(`Download clicked for ${selectedPlayer.first_name} ${selectedPlayer.last_name}`)}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(155, 89, 182, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(155, 89, 182, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(155, 89, 182, 0.3)";
            }}
          >
            📊 Download {selectedPlayer.first_name} {selectedPlayer.last_name}'s Report
          </button>
        )}
      </div>
    </div>
  );
};

export default DownloadView;