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
  const fatigueScores = [33, 28, 19, 14, 8];
  const velocities = ["-3%", "-2%", "-2%", "+1%", "+1%"];
  const spinRates = ["-0%", "-0%", "-4%", "-2%", "-1%"];
  
  const fatigueScore = fatigueScores[index % fatigueScores.length];
  const velocity = velocities[index % velocities.length];
  const spinRate = spinRates[index % spinRates.length];
  
  // Determine border color based on fatigue score
  let borderColor;
  if (fatigueScore > 20) {
    borderColor = "rgba(231, 76, 60, 0.4)";
  } else if (fatigueScore > 10) {
    borderColor = "rgba(155, 89, 182, 0.4)";
  } else {
    borderColor = "rgba(52, 152, 219, 0.4)";
  }

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
      onClick={handleClick}
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        border: `5px solid ${borderColor}`,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
    >
      {/* Player Photo */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        {currentImageUrl && (
          <img
            key={`${mlbPlayerId}-${imageAttempt}`}
            src={currentImageUrl}
            alt={`${player.first_name} ${player.last_name}`}
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "12px",
              objectFit: "cover",
              backgroundColor: "#e9ecef",
              display: imageLoaded ? "block" : "none",
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        {/* Placeholder avatar - shown when no image or image loading */}
        <div style={{
          width: "70px",
          height: "70px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #e8d5d5 0%, #d5c8e8 100%)",
          display: (!currentImageUrl || !imageLoaded) ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          flexShrink: 0,
        }}>
          👤
        </div>
      </div>

      {/* Player Info */}
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{
          color: "#2c3e50",
          fontSize: "15px",
          fontWeight: 700,
          marginBottom: "8px",
        }}>
          #{player.player_id} {player.first_name} {player.last_name}
        </div>
        
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          fontSize: "13px",
          color: "#7f8c8d",
        }}>
          <div>
            <span style={{ fontWeight: 600 }}>Velocity:</span> {velocity}
          </div>
          <div>
            <span style={{ fontWeight: 600 }}>Spin Rate:</span> {spinRate}
          </div>
          <div 
            style={{
              color: "#3498db",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            See More
          </div>
        </div>
      </div>

      {/* Fatigue Score */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        marginRight: "8px",
      }}>
        <div style={{
          fontSize: "28px",
          fontWeight: 700,
          color: fatigueScore > 20 ? "#e74c3c" : fatigueScore > 10 ? "#9b59b6" : "#3498db",
          lineHeight: "1",
          marginBottom: "4px",
        }}>
          {fatigueScore}
        </div>
        <div style={{
          fontSize: "11px",
          color: "#95a5a6",
          fontWeight: 600,
          textAlign: "center",
        }}>
          Fatigue Score
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;