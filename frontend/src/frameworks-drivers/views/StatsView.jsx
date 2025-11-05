// frontend/src/frameworks-drivers/views/StatsView.jsx
import React from 'react';

const StatsView = ({ players, onPlayerClick }) => {
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
        Team Performance Map
      </h3>
      
      {/* Chart Container with Labels */}
      <div style={{ position: "relative", paddingLeft: "50px", paddingBottom: "50px", paddingTop: "10px" }}>
        {/* Y-Axis Label */}
        <div style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          color: "white",
          fontSize: "18px",
          fontWeight: 700,
          letterSpacing: "0.5px",
          whiteSpace: "nowrap",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}>
          Spin Rate →
        </div>

        {/* Chart Area */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "500px",
          background: "linear-gradient(to top right, #e74c3c 0%, #c0392b 15%, #9b59b6 35%, #8e44ad 50%, #3498db 70%, #2980b9 100%)",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
        }}>
          {/* Player Pins */}
          {players.map((player, index) => {
            const positions = [
              { x: 15, y: 75 },
              { x: 30, y: 60 },
              { x: 50, y: 50 },
              { x: 70, y: 30 },
              { x: 85, y: 15 },
            ];
            
            const position = positions[index % positions.length];
            
            return (
              <div
                key={player.player_id}
                onClick={() => onPlayerClick(player, index)}
                style={{
                  position: "absolute",
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.15)";
                  e.currentTarget.style.zIndex = "20";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                  e.currentTarget.style.zIndex = "10";
                }}
              >
                <svg width="60" height="70" viewBox="0 0 60 70" style={{
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
                }}>
                  <path
                    d="M30 0C20.335 0 12.5 7.835 12.5 17.5c0 9.665 17.5 52.5 17.5 52.5s17.5-42.835 17.5-52.5C47.5 7.835 39.665 0 30 0z"
                    fill="#ffffff"
                    stroke="rgba(0, 0, 0, 0.15)"
                    strokeWidth="1.5"
                  />
                  <circle cx="30" cy="17.5" r="14" fill="rgba(44, 62, 80, 0.95)" />
                  <text
                    x="30"
                    y="23.5"
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="700"
                  >
                    #{player.player_id}
                  </text>
                </svg>
              </div>
            );
          })}

          {/* Legend */}
          <div style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "14px 16px",
            fontSize: "13px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{ width: "16px", height: "16px", background: "#2980b9", borderRadius: "3px", border: "1px solid rgba(255, 255, 255, 0.3)" }}></div>
              <span style={{ color: "white", fontWeight: 600 }}>Performance Normal</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{ width: "16px", height: "16px", background: "#9b59b6", borderRadius: "3px", border: "1px solid rgba(255, 255, 255, 0.3)" }}></div>
              <span style={{ color: "white", fontWeight: 600 }}>Signs of Fatigue</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "16px", height: "16px", background: "#e74c3c", borderRadius: "3px", border: "1px solid rgba(255, 255, 255, 0.3)" }}></div>
              <span style={{ color: "white", fontWeight: 600 }}>Fatigued</span>
            </div>
          </div>
        </div>

        {/* X-Axis Label */}
        <div style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontSize: "18px",
          fontWeight: 700,
          letterSpacing: "0.5px",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}>
          Velocity →
        </div>
      </div>

      <p style={{ 
        color: "white", 
        fontSize: "15px", 
        marginTop: "20px",
        textAlign: "center",
        lineHeight: "1.6",
        fontWeight: 500,
        textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
      }}>
        Click on any player to view detailed performance metrics
      </p>
    </div>
  );
};

export default StatsView;