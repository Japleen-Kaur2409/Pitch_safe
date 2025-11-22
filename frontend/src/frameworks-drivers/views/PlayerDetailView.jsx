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
  const [selectedMetric, setSelectedMetric] = useState('');
  const [showMetricChart, setShowMetricChart] = useState(false);
  const [showGameForm, setShowGameForm] = useState(false);

   // DEBUG LOGGING
  console.log('=== PlayerDetailView DEBUG ===');
  console.log('selectedPlayer:', selectedPlayer);
  console.log('selectedPlayer keys:', selectedPlayer ? Object.keys(selectedPlayer) : 'none');
  console.log('height:', selectedPlayer?.height);
  console.log('weight:', selectedPlayer?.weight);
  console.log('bats:', selectedPlayer?.bats);
  console.log('throws:', selectedPlayer?.throws);
  console.log('date_of_birth:', selectedPlayer?.date_of_birth);
  console.log('fatigue_score:', selectedPlayer?.fatigue_score);
  console.log('spin_rate:', selectedPlayer?.spin_rate);
  console.log('==============================');

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

  const playerName = `${selectedPlayer.last_name}, ${selectedPlayer.first_name}`;
  const riskData = injuryRiskData?.[playerName] || null;
  
  console.log('=== PlayerDetailView DEBUG ===');
  console.log('🔍 injuryRiskData:', injuryRiskData);
  console.log('🔍 Available keys:', injuryRiskData ? Object.keys(injuryRiskData) : 'none');
  console.log('🔍 Looking for playerName:', playerName);
  console.log('🔍 riskData found:', riskData);
  console.log('🔍 selectedPlayer:', selectedPlayer);
  console.log('==============================');
  
  
  // Use ML injury_risk_prob if available, fallback to database fatigue_score
  const displayRiskScore = riskData 
    ? Math.round(riskData.injury_risk_prob * 100) 
    : selectedPlayer.fatigue_score || 0;
  
  
  const riskLevel = riskData?.risk_level || selectedPlayer.riskLevel || 'high';


  const mlbPlayerId = playerMLBIds[selectedPlayer.player_id];
  const imageUrls = mlbPlayerId ? getPlayerImage(mlbPlayerId) : null;
  
  // Get real fatigue score from database (for gauge display)
  const fatigueScore = selectedPlayer.fatigue_score || 0;
  
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
    if (imageAttempt < 3) {
      setImageAttempt(imageAttempt + 1);
    } else {
      setImageLoaded(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const currentImageUrl = getCurrentImageUrl();

  // Calculate gauge rotation (0-180 degrees based on fatigue score)
  const calculateGaugeRotation = () => {
  if (!injuryRiskData) return -90; // fallback

  const allRiskValues = Object.values(injuryRiskData)
    .map(p => p.injury_risk_prob * 100)
    .filter(v => !isNaN(v));

  if (allRiskValues.length === 0) return -90;

  const minRisk = Math.min(...allRiskValues);
  const maxRisk = Math.max(...allRiskValues);

  let playerRisk = displayRiskScore; // already percentage 0–100

  // Avoid division error
  if (maxRisk === minRisk) {
    return 0; // center gauge since no variation
  }

  // Normalize 0 → 1
  const normalized = (playerRisk - minRisk) / (maxRisk - minRisk);

  // Convert [0,1] → [-90°, +90°]
  const angle = -90 + normalized * 180;

  return angle;
};


  const getInjuryProbability = () => {
    // Use ML model probability if available
    if (riskData?.injury_risk_prob) {
      return `${(riskData.injury_risk_prob * 100).toFixed(2)}%`;
    }
    // Fallback to fatigue-based estimate
    if (fatigueScore >= 50) return "0.75%";
    if (fatigueScore >= 30) return "0.45%";
    if (fatigueScore >= 15) return "0.25%";
    return "0.10%";
  };

  const getRecommendationText = () => {
    // Use ML risk level if available
    if (riskLevel === 'high') {
      return "HIGH RISK: Early injury risk is showing up first as changes in release point + pitch movement + consistency. Immediate attention recommended.";
    } else if (riskLevel === 'medium') {
      return "MODERATE RISK: Moderate fatigue detected. Monitor closely for changes in mechanics and reduce workload if needed.";
    } else if (riskLevel === 'low') {
      return "LOW RISK: Player is in optimal condition. Continue current training and recovery schedule.";
    }
    
    // Fallback to fatigue-based recommendations
    if (fatigueScore >= 50) {
      return "Early injury risk is showing up first as changes in release point + pitch movement + consistency.";
    } else if (fatigueScore >= 30) {
      return "Moderate fatigue detected. Monitor closely for changes in mechanics and reduce workload if needed.";
    } else if (fatigueScore >= 15) {
      return "Minor fatigue indicators present. Continue standard monitoring and rest protocols.";
    } else {
      return "Player is in optimal condition. Continue current training and recovery schedule.";
    }
  };

  const metrics = [
    { id: 'metric1', name: 'Metric 1 - Release Speed' },
    { id: 'metric2', name: 'Metric 2 - Spin Rate' },
    { id: 'metric3', name: 'Metric 3 - Release Height' },
    { id: 'metric4', name: 'Metric 4 - Vertical Break' },
    { id: 'metric5', name: 'Metric 5 - Horizontal Movement' },
    { id: 'full', name: 'Full Representation - All Metrics' },
  ];

  const handleMetricChange = (e) => {
    const value = e.target.value;
    setSelectedMetric(value);
    setShowMetricChart(value !== '');
  };

  // Helper function to safely format player data with better fallbacks
  const formatHeight = () => {
    if (selectedPlayer.height) return selectedPlayer.height;
    return 'N/A';
  };

  const formatWeight = () => {
    if (selectedPlayer.weight) return `${selectedPlayer.weight}lbs`;
    return 'N/A';
  };

  const formatBats = () => {
    return selectedPlayer.bats || 'N/A';
  };

  const formatThrows = () => {
    return selectedPlayer.throws || 'N/A';
  };

  const formatAge = () => {
    if (selectedPlayer.date_of_birth) {
      try {
        const age = Math.floor((new Date() - new Date(selectedPlayer.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000));
        return age;
      } catch (e) {
        console.error('Error calculating age:', e);
        return 'N/A';
      }
    }
    return 'N/A';
  };

  const formatDOB = () => {
    if (selectedPlayer.date_of_birth) {
      try {
        return new Date(selectedPlayer.date_of_birth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch (e) {
        console.error('Error formatting DOB:', e);
        return 'N/A';
      }
    }
    return 'N/A';
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

      {/* Main Player Card */}
      <div style={{
        background: "linear-gradient(135deg, #8B4C54 0%, #6B4C7A 50%, #4C5C8B 100%)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "20px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
        color: "white",
        display: "flex",
        gap: "24px",
      }}>
        {/* Left Side - Player Photo and Info */}
        <div style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Player Photo */}
          <div style={{
            width: "200px",
            height: "250px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "3px solid rgba(255, 255, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
            marginBottom: "16px",
          }}>
            {currentImageUrl && (
              <img
                key={`${mlbPlayerId}-${imageAttempt}`}
                src={currentImageUrl}
                alt={`${selectedPlayer.first_name} ${selectedPlayer.last_name}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: imageLoaded ? "block" : "none",
                }}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            )}
            <div style={{
              width: "100%",
              height: "100%",
              display: (!currentImageUrl || !imageLoaded) ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "72px",
              position: "absolute",
              top: 0,
              left: 0,
            }}>
              👤
            </div>
          </div>

          {/* Player Name and Number */}
          <div style={{
            fontSize: "32px",
            fontWeight: 800,
            marginBottom: "8px",
            textAlign: "center",
          }}>
            #{selectedPlayer.player_id}
          </div>
          <div style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "20px",
            textAlign: "center",
          }}>
            {selectedPlayer.first_name} {selectedPlayer.last_name}
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
          {riskData && (
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
          )}

          {/* Player Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            width: "100%",
            maxWidth: "300px",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>Height:</div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>{formatHeight()}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>Weight:</div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>{formatWeight()}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>Bats:</div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>{formatBats()}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>Throws:</div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>{formatThrows()}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>Age:</div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>{formatAge()}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>DOB:</div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>{formatDOB()}</div>
            </div>
          </div>
        </div>

        {/* Right Side - Gauge Chart */}
        <div style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "20px",
        }}>
          {/* Gauge Chart Container */}
          <div style={{
            position: "relative",
            width: "300px",
            height: "200px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Semi-circle gauge background */}
            <svg width="300" height="150" viewBox="0 0 300 150" style={{ 
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
            }}>
              {/* Background arc - gradient from green to red */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: "#2ecc71", stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: "#f39c12", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#e74c3c", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              {/* Gauge arc - centered */}
              <path
                d="M 50 130 A 100 100 0 0 1 250 130"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="30"
                strokeLinecap="round"
              />
            </svg>

            {/* Needle */}
            <div style={{
              position: "absolute",
              bottom: "60px",
              left: "50%",
              width: "4px",
              height: "90px",
              background: "white",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${calculateGaugeRotation()}deg)`,
              borderRadius: "2px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
              transition: "transform 1s ease-out",
            }}>
              {/* Needle tip */}
              <div style={{
                position: "absolute",
                top: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "0",
                height: "0",
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "16px solid white",
              }} />
            </div>

            {/* Center circle */}
            <div style={{
              position: "absolute",
              bottom: "50px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "white",
              border: "3px solid #2c3e50",
              zIndex: 10,
            }} />

            {/* Percentage display */}
            <div style={{
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "48px",
              fontWeight: 800,
              color: "white",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
            }}>
              {displayRiskScore}%
            </div>

            {/* "Risk score" label */}
            <div style={{
              position: "absolute",
              bottom: "-15px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "14px",
              fontWeight: 600,
              color: "white",
              opacity: 0.9,
            }}>
              Risk score
            </div>
          </div>

          {/* Injury Probability */}
          <div style={{
            background: "rgba(0, 0, 0, 0.2)",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "center",
            marginTop: "10px",
            maxWidth: "350px",
          }}>
            <div style={{
              fontSize: "24px",
              fontWeight: 800,
              marginBottom: "4px",
            }}>
              {getInjuryProbability()} probability
            </div>
            <div style={{
              fontSize: "13px",
              opacity: 0.9,
              lineHeight: "1.4",
            }}>
              {riskData 
                ? "Our ML model predicts injury risk from over 20 biomechanical metrics including release point, pitch movement, and consistency."
                : "Our model predicts from over 20 metrics that this player is fatigued, and has a higher score of injury."}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Observations */}
      <div style={{
        background: "rgba(255, 255, 255, 0.15)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        color: "white",
      }}>
        <div style={{
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "12px",
          textAlign: "center",
        }}>
          Recommended observations
        </div>
        <div style={{
          fontSize: "14px",
          lineHeight: "1.6",
          textAlign: "center",
        }}>
          {getRecommendationText()}
        </div>
      </div>

      {/* Curveball Vertical Break Changes */}
      <div style={{
        background: "rgba(255, 255, 255, 0.15)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        color: "white",
      }}>
        <div style={{
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "12px",
          textAlign: "center",
        }}>
          Curveball Vertical Break Changes
        </div>
        <div style={{
          fontSize: "13px",
          lineHeight: "1.6",
          textAlign: "center",
          opacity: 0.9,
        }}>
          If his curveball stops snapping down the same way = red flag.
        </div>
      </div>

      {/* Visual Representations of Metrics - WITH DROPDOWN */}
      <div style={{
        background: "rgba(255, 255, 255, 0.15)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        color: "white",
      }}>
        <div style={{
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "16px",
          textAlign: "center",
        }}>
          {riskLevel === 'high' ? 'HIGH RISK WARNING' : 
           riskLevel === 'medium' ? 'MODERATE RISK' : 
           riskLevel === 'low' ? 'LOW RISK' :
           'Visual Representations of Metrics'}
        </div>
        
        {/* Risk description */}
        <div style={{
          fontSize: "14px",
          marginBottom: "16px",
          textAlign: "center",
          lineHeight: "1.5",
        }}>
          {riskLevel === 'high'
            ? "This pitcher is presenting similar signs of fatigue that leads to Rotator Cuff injury. Immediate attention recommended."
            : riskLevel === 'medium'
            ? "This pitcher is showing moderate signs of fatigue. Monitor closely and consider rest."
            : riskLevel === 'low'
            ? "This pitcher is in good condition with minimal injury risk indicators."
            : "Select a metric below to visualize performance trends."}
        </div>
        
        {/* Dropdown */}
        <div style={{
          marginBottom: "16px",
        }}>
          <select
            value={selectedMetric}
            onChange={handleMetricChange}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "rgba(255, 255, 255, 0.9)",
              color: "#2c3e50",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="">Select a metric to visualize...</option>
            {metrics.map(metric => (
              <option key={metric.id} value={metric.id}>
                {metric.name}
              </option>
            ))}
          </select>
        </div>

        {/* Placeholder Chart */}
        {showMetricChart && (
          <div style={{
            width: "100%",
            height: "300px",
            background: "rgba(0, 0, 0, 0.3)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 600,
            color: "white",
            textAlign: "center",
            padding: "20px",
          }}>
            <div>
              <div style={{ marginBottom: "10px", fontSize: "18px" }}>
                📊 Chart Placeholder
              </div>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>
                {metrics.find(m => m.id === selectedMetric)?.name}
              </div>
              <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.6 }}>
                Line graph visualization will appear here
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Record Form - COLLAPSIBLE */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}>
        {/* Dropdown Button */}
        <button
          onClick={() => setShowGameForm(!showGameForm)}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #6B4C7A 0%, #4C5C8B 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>Add Game Record</span>
          <span style={{
            fontSize: "20px",
            transition: "transform 0.3s ease",
            transform: showGameForm ? "rotate(180deg)" : "rotate(0deg)",
          }}>
            ▼
          </span>
        </button>

        {/* Collapsible Form */}
        {showGameForm && (
          <div style={{
            marginTop: "20px",
            animation: "slideDown 0.3s ease-out",
          }}>
            <GameRecordForm 
              playerId={selectedPlayer.player_id} 
              onSuccess={() => {
                console.log('Game record added successfully');
                setShowGameForm(false); // Close form after successful submission
              }}
              gameState={gameState}
              gameController={gameController}
            />
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default PlayerDetailView;