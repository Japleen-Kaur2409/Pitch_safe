// frontend/src/frameworks-drivers/components/PlayerCard.jsx
import React, { useState } from 'react';

const PlayerCard = ({ 
  player, 
  index, 
  playerMLBIds, 
  onPlayerClick, 
  getPlayerImage,
  riskData  // ADD THIS
}) => {
  const [imageAttempt, setImageAttempt] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Use ML risk data if available, otherwise use database fatigue_score, or fallback to 0
  const injuryRiskScore = riskData 
    ? Math.round(riskData.injury_risk_prob * 100)
    : player.fatigue_score || 0;
  
  const riskLevel = riskData?.risk_level || 'unknown';
  const velocity = player.velocity || 0;
  const spinRate = player.spin_rate || 0;
  
  // Determine border color based on risk level from ML model
  let borderColor;
  if (riskLevel === 'high') {
    borderColor = "rgba(231, 76, 60, 0.6)";  // Red for high risk
  } else if (riskLevel === 'medium') {
    borderColor = "rgba(155, 89, 182, 0.6)";  // Purple for medium risk
  } else if (riskLevel === 'low') {
    borderColor = "rgba(52, 152, 219, 0.6)";  // Blue for low risk
  } else {
    // Fallback to old logic if no ML data
    if (injuryRiskScore > 20) {
      borderColor = "rgba(231, 76, 60, 0.4)";
    } else if (injuryRiskScore > 10) {
      borderColor = "rgba(155, 89, 182, 0.4)";
    } else {
      borderColor = "rgba(52, 152, 219, 0.4)";
    }
  }

  // Color for the risk score number
  const scoreColor = riskLevel === 'high' ? "#e74c3c" : 
                     riskLevel === 'medium' ? "#9b59b6" : 
                     riskLevel === 'low' ? "#3498db" : 
                     injuryRiskScore > 20 ? "#e74c3c" : 
                     injuryRiskScore > 10 ? "#9b59b6" : "#3498db";

  const handleClick = () => {
    console.log('PlayerCard clicked:', player, index);
    onPlayerClick(player, index);
  };

  const mlbPlayerId = playerMLBIds[player.player_id];
  const imageUrls = mlbPlayerId ? getPlayerImage(mlbPlayerId) : null;
  
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
        {/* Placeholder avatar */}
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
          
          {/* NEW: Risk Level Badge */}
          {riskData && (
            <div style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              backgroundColor: riskLevel === 'high' ? 'rgba(231, 76, 60, 0.2)' : 
                              riskLevel === 'medium' ? 'rgba(155, 89, 182, 0.2)' : 
                              'rgba(52, 152, 219, 0.2)',
              color: riskLevel === 'high' ? '#c0392b' : 
                     riskLevel === 'medium' ? '#8e44ad' : 
                     '#2980b9',
              marginTop: "4px",
              width: "fit-content",
            }}>
              {riskLevel} Risk
            </div>
          )}
          
          <div 
            style={{
              color: "#3498db",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
              marginTop: "4px",
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

      {/* Injury Risk Score */}
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
          color: scoreColor,
          lineHeight: "1",
          marginBottom: "4px",
        }}>
          {injuryRiskScore}%
        </div>
        <div style={{
          fontSize: "11px",
          color: "#95a5a6",
          fontWeight: 600,
          textAlign: "center",
        }}>
          Injury Risk
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;