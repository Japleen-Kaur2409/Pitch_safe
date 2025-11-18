// frontend/src/frameworks-drivers/components/PlayerCard.jsx
import React, { useState } from 'react';

const PlayerCard = ({ 
  player, 
  index, 
  playerMLBIds, 
  onPlayerClick, 
  getPlayerImage 
}) => {
  const [imageAttempt, setImageAttempt] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Placeholder stats (to be replaced with real data)
  // const velocities = ["-3%", "-2%", "-2%", "+1%", "+1%"];
  // const spinRates = ["-0%", "-0%", "-4%", "-2%", "-1%"];
  // calling items from the list based on index
  // const velocity = velocities[index % velocities.length];
  // const spinRate = spinRates[index % spinRates.length];

  // Get fatigue score from database
  const fatigueScore = player.fatigue_score || 0;
  
  // Determine border color based on fatigue score
  const getBackgroundGradient = () => {
    if (fatigueScore >= 50) {
      return "linear-gradient(135deg, rgba(231, 76, 60, 0.85) 0%, rgba(192, 57, 43, 0.85) 100%)";
    } else if (fatigueScore >= 30) {
      return "linear-gradient(135deg, rgba(243, 156, 18, 0.85) 0%, rgba(230, 126, 34, 0.85) 100%)";
    } else if (fatigueScore >= 15) {
      return "linear-gradient(135deg, rgba(241, 196, 15, 0.85) 0%, rgba(243, 156, 18, 0.85) 100%)";
    } else {
      return "linear-gradient(135deg, rgba(46, 204, 113, 0.85) 0%, rgba(39, 174, 96, 0.85) 100%)";
    }
  };
  
  const getFatigueLabel = () => {
    if (fatigueScore >= 50) return "CRITICAL";
    if (fatigueScore >= 30) return "HIGH";
    if (fatigueScore >= 15) return "MODERATE";
    return "GOOD";
  };

  const getFatigueLabelColor = () => {
    if (fatigueScore >= 50) return "#e74c3c";
    if (fatigueScore >= 30) return "#f39c12";
    if (fatigueScore >= 15) return "#f1c40f";
    return "#2ecc71";
  };

  const handleClick = () => {
    console.log('PlayerCard clicked:', player, index);
    onPlayerClick(player, index);
  };

  const mlbPlayerId = playerMLBIds[player.player_id];
  const imageUrls = mlbPlayerId ? getPlayerImage(mlbPlayerId) : null;
  
  // Get the current image URL to try
  const getCurrentImageUrl = () => {
    if (!imageUrls) return null;
    
    const urls = [
      imageUrls.primary,
      imageUrls.fallback1,
      imageUrls.fallback2,
      imageUrls.fallback3
    ];
    
    return urls[imageAttempt] || null;
  };

  const handleImageError = () => {
    console.log(`Image attempt ${imageAttempt} failed for player ${player.player_id}, trying next...`);
    if (imageAttempt < 3) {
      setImageAttempt(imageAttempt + 1);
    } else {
      console.log(`All image URLs failed for player ${player.player_id}`);
      setImageLoaded(false);
    }
  };

  const handleImageLoad = () => {
    console.log(`Image loaded successfully for player ${player.player_id}`);
    setImageLoaded(true);
  };
  
  const currentImageUrl = getCurrentImageUrl();
  
  return (
    <div
      onClick={() => onPlayerClick(player, index)}
      style={{
        background: getBackgroundGradient(),
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        border: `2px solid ${
          fatigueScore >= 50 ? 'rgba(231, 76, 60, 0.5)' :
          fatigueScore >= 30 ? 'rgba(243, 156, 18, 0.5)' :
          fatigueScore >= 15 ? 'rgba(241, 196, 15, 0.5)' :
          'rgba(46, 204, 113, 0.5)'
        }`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";
      }}
    >
      {/* Player Photo */}
      <div style={{
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.3)",
        border: "3px solid rgba(255, 255, 255, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "36px",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
      }}>
        {currentImageUrl && (
          <img
            key={`${mlbPlayerId}-${imageAttempt}`}
            src={currentImageUrl}
            alt={`${player.first_name} ${player.last_name}`}
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              objectFit: "cover",
              display: imageLoaded ? "block" : "none",
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        <div style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          display: (!currentImageUrl || !imageLoaded) ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          position: "absolute",
          top: 0,
          left: 0,
        }}>
          👤
        </div>
      </div>

      {/* Player Info */}
      <div style={{ 
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}>
        <div style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "white",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}>
          #{player.player_id} {player.first_name} {player.last_name}
        </div>
        <div style={{
          fontSize: "13px",
          color: "rgba(255, 255, 255, 0.9)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{
            background: "rgba(0, 0, 0, 0.2)",
            padding: "2px 8px",
            borderRadius: "6px",
            fontWeight: 600,
          }}>
            Fatigue: {fatigueScore.toFixed(1)}%
          </span>
          <span style={{
            background: getFatigueLabelColor(),
            color: "white",
            padding: "2px 8px",
            borderRadius: "6px",
            fontWeight: 700,
            fontSize: "11px",
          }}>
            {getFatigueLabel()}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div style={{
        fontSize: "24px",
        color: "rgba(255, 255, 255, 0.8)",
        flexShrink: 0,
      }}>
        →
      </div>
    </div>
  );
};

export default PlayerCard;