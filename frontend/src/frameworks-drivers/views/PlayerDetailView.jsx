// frontend/src/frameworks-drivers/views/PlayerDetailView.jsx
import React, { useState } from 'react';
import GameRecordForm from '../components/GameRecordForm';

const PlayerDetailView = ({ 
  selectedPlayer, 
  playerMLBIds, 
  loading,
  onBackClick,
  getPlayerImage,
  gameState,
  gameController,
  injuryRiskData
}) => {
  const [imageAttempt, setImageAttempt] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        Loading player details...
      </div>
    );
  }

  if (!selectedPlayer) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
        No player selected.
      </div>
    );
  }

  const playerName = `${selectedPlayer.first_name}, ${selectedPlayer.last_name}`;
  const riskData = injuryRiskData?.[playerName] || null;

  console.log('=== PlayerDetailView DEBUG ===');
  console.log('🔍 injuryRiskData:', injuryRiskData);
  console.log('🔍 Available keys:', injuryRiskData ? Object.keys(injuryRiskData) : 'none');
  console.log('🔍 Looking for playerName:', playerName);
  console.log('🔍 riskData found:', riskData);
  console.log('🔍 selectedPlayer:', selectedPlayer);
  console.log('==============================');
  
  // Use injury_risk_prob if available, fallback to fatigueScore
  const displayRiskScore = riskData 
  ? Math.round(riskData.injury_risk_prob * 100) 
  : selectedPlayer.fatigueScore || 0;
  
  const riskLevel = riskData?.risk_level || selectedPlayer.riskLevel || 'high';

  console.log('=== DEBUG ===');
  console.log('injuryRiskData:', injuryRiskData);
  console.log('playerName:', playerName);
  console.log('riskData:', riskData);
  console.log('============');

  const mlbPlayerId = playerMLBIds[selectedPlayer.player_id];
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
    console.log(`Detail view: Image attempt ${imageAttempt} failed, trying next...`);
    if (imageAttempt < 3) {
      setImageAttempt(imageAttempt + 1);
    } else {
      console.log('All image URLs failed in detail view');
      setImageLoaded(false);
    }
  };

  const handleImageLoad = () => {
    console.log('Detail view: Image loaded successfully');
    setImageLoaded(true);
  };

  const currentImageUrl = getCurrentImageUrl();

  // NEW: Function to get background gradient based on risk level
  const getBackgroundGradient = () => {
    if (riskLevel === 'high') {
      return "linear-gradient(180deg, rgba(231, 76, 60, 0.85) 0%, rgba(192, 57, 43, 0.85) 100%)";
    } else if (riskLevel === 'medium') {
      return "linear-gradient(180deg, rgba(155, 89, 182, 0.85) 0%, rgba(142, 68, 173, 0.85) 100%)";
    } else {
      return "linear-gradient(180deg, rgba(52, 152, 219, 0.85) 0%, rgba(41, 128, 185, 0.85) 100%)";
    }
  };

  return (
    <>
      {/* Back Button */}
      <button
        onClick={onBackClick}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          color: "#7b6ca8",
          border: "none",
          borderRadius: "10px",
          padding: "12px 20px",
          marginBottom: "20px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        ← Back to Roster
      </button>

      {/* Player Card with Photo and Name */}
      <div style={{
        background: getBackgroundGradient(),
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        color: "white",
      }}>
        {/* Player Header */}
        <div style={{
          fontSize: "20px",
          fontWeight: 700,
          marginBottom: "16px",
        }}>
          #{selectedPlayer.player_id} {selectedPlayer.first_name} {selectedPlayer.last_name}
        </div>

        {/* Player Photo */}
        <div style={{
          width: "140px",
          height: "140px",
          margin: "0 auto 16px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.3)",
          border: "4px solid rgba(255, 255, 255, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "64px",
          overflow: "hidden",
          position: "relative",
        }}>
          {currentImageUrl && (
            <img
              key={`${mlbPlayerId}-${imageAttempt}`}
              src={currentImageUrl}
              alt={`${selectedPlayer.first_name} ${selectedPlayer.last_name}`}
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                objectFit: "cover",
                display: imageLoaded ? "block" : "none",
              }}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
          <div style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            display: (!currentImageUrl || !imageLoaded) ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "64px",
            position: "absolute",
            top: 0,
            left: 0,
          }}>
            👤
          </div>
        </div>

        {/* Injury Risk Score */}
        <div style={{
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "8px",
        }}>
          Injury Risk Score: {displayRiskScore}%
        </div>
        
        {/* Risk Level Badge */}
        <div style={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: 700,
          textTransform: "uppercase",
          backgroundColor: riskLevel === 'high' ? 'rgba(192, 57, 43, 0.9)' : 
                          riskLevel === 'medium' ? 'rgba(142, 68, 173, 0.9)' : 
                          'rgba(41, 128, 185, 0.9)',
          marginBottom: "24px",
        }}>
          {riskLevel} Risk
        </div>

        {/* Stats Row */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          paddingTop: "16px",
          borderTop: "2px solid rgba(255, 255, 255, 0.3)",
        }}>
          <div>
            <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}>B/T</div>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>
              {selectedPlayer.bats}/{selectedPlayer.throws}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}>Height</div>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>{selectedPlayer.height}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}>Weight</div>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>{selectedPlayer.weight}lbs</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}>Age</div>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>
              {Math.floor(
                (new Date() - new Date(selectedPlayer.date_of_birth)) /
                  (365.25 * 24 * 60 * 60 * 1000)
              )}yo
            </div>
          </div>
        </div>
      </div>

      {/* Player Details List */}
      <div style={{
        background: "rgba(255, 255, 255, 0.75)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        fontSize: "15px",
        color: "#2c3e50",
      }}>
        <div style={{ marginBottom: "12px" }}>
          <strong>Level:</strong> {selectedPlayer.level || 'N/A'}
        </div>
        <div style={{ marginBottom: "12px" }}>
          <strong>School:</strong> {selectedPlayer.school || 'N/A'}
        </div>
        <div style={{ marginBottom: "12px" }}>
          <strong>Bats:</strong> {selectedPlayer.bats === 'R' ? 'Right' : selectedPlayer.bats === 'L' ? 'Left' : 'N/A'}
        </div>
        <div>
          <strong>Throws:</strong> {selectedPlayer.throws === 'R' ? 'Right' : selectedPlayer.throws === 'L' ? 'Left' : 'N/A'}
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{
        background: "rgba(255, 255, 255, 0.75)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <div style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#2c3e50",
          marginBottom: "12px",
          textAlign: "center",
        }}>
          Effective Speed
        </div>
        <div style={{
          fontSize: "14px",
          color: "#555",
          lineHeight: "1.6",
          textAlign: "center",
        }}>
         {selectedPlayer.velocity < 0
          ? `${Math.abs(selectedPlayer.velocity)}% decrease over the last 5 games compared to year average.`
          : selectedPlayer.velocity > 0
          ? `${Math.abs(selectedPlayer.velocity)}% increase over the last 5 games compared to year average.`
          : "No change in velocity over the last 5 games compared to year average."}
        </div>
      </div>

      {/* Spin Rate Card */}
      <div style={{
        background: "rgba(255, 255, 255, 0.75)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
      }}>
        <div style={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#2c3e50",
          marginBottom: "12px",
          textAlign: "center",
        }}>
          Spin Rate
        </div>
        <div style={{
          fontSize: "14px",
          color: "#555",
          lineHeight: "1.6",
          textAlign: "center",
        }}>
          {selectedPlayer.spin_rate < 0
          ? `${Math.abs(selectedPlayer.spin_rate)}% decrease over the last 5 games compared to year average.`
          : selectedPlayer.spin_rate > 0
          ? `${Math.abs(selectedPlayer.spin_rate)}% increase over the last 5 games compared to year average.`
          : "No change in spin rate over the last 5 games compared to year average."}
        </div>
      </div>

      {/* Warning Card */}
      <div style={{
        background: riskLevel === 'high' ? "rgba(231, 76, 60, 0.75)" :
                   riskLevel === 'medium' ? "rgba(155, 89, 182, 0.75)" :
                   "rgba(52, 152, 219, 0.75)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        color: "white",
      }}>
        <div style={{
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "12px",
          textAlign: "center",
        }}>
          {riskLevel === 'high' ? 'HIGH RISK WARNING' : 
           riskLevel === 'medium' ? 'MODERATE RISK' : 
           'LOW RISK'}
        </div>
        <div style={{
          fontSize: "14px",
          lineHeight: "1.6",
          textAlign: "center",
        }}>
          {riskLevel === 'high'
            ? "This pitcher is presenting similar signs of fatigue that leads to Rotator Cuff injury. Immediate attention recommended."
            : riskLevel === 'medium'
            ? "This pitcher is showing moderate signs of fatigue. Monitor closely and consider rest."
            : "This pitcher is in good condition with minimal injury risk indicators."}
        </div>
      </div>

      {/* Game Record Form */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}>
        <GameRecordForm 
          playerId={selectedPlayer.player_id} 
          onSuccess={() => {
            console.log('Game record added successfully');
          }}
          gameState={gameState}
          gameController={gameController}
        />
      </div>
    </>
  );
};

export default PlayerDetailView;