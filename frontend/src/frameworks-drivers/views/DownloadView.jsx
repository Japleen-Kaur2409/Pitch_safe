// frontend/src/frameworks-drivers/views/DownloadView.jsx
import React from 'react';

const DownloadView = ({ players, selectedPlayer, onPlayerSelect, injuryRiskData, gameState }) => {
  
  // Helper function to convert array of objects to CSV
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          const escaped = String(value).replace(/"/g, '""');
          return escaped.includes(',') ? `"${escaped}"` : escaped;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  // Download CSV file
  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Team CSV Report
  const handleTeamDownload = () => {
    const teamData = players.map((player, index) => {
      const playerFullName = `${player.last_name}, ${player.first_name}`;
      const playerRiskData = injuryRiskData?.[playerFullName];
      
      // Calculate age from date of birth
      const age = player.date_of_birth 
        ? Math.floor((new Date() - new Date(player.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
        : 'N/A';
      
      return {
        'Player ID': player.player_id,
        'First Name': player.first_name,
        'Last Name': player.last_name,
        'Position': player.position,
        'Level': player.level || 'N/A',
        'School': player.school || 'N/A',
        'Height': player.height,
        'Weight (lbs)': player.weight,
        'Age': age,
        'Date of Birth': player.date_of_birth,
        'Bats': player.bats === 'R' ? 'Right' : player.bats === 'L' ? 'Left' : 'N/A',
        'Throws': player.throws === 'R' ? 'Right' : player.throws === 'L' ? 'Left' : 'N/A',
        'Injury Risk Probability (%)': playerRiskData 
          ? (playerRiskData.injury_risk_prob * 100).toFixed(2)
          : 'N/A',
        'Risk Level': playerRiskData?.risk_level || 'unknown',
        'Velocity Change (%)': player.velocity || 'N/A',
        'Spin Rate Change (%)': player.spin_rate || 'N/A',
      };
    });

    const csv = convertToCSV(teamData);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csv, `team_injury_risk_report_${timestamp}.csv`);
  };

  // Generate Individual Player CSV Report
  const handlePlayerDownload = () => {
    if (!selectedPlayer) return;

    const playerFullName = `${selectedPlayer.last_name}, ${selectedPlayer.first_name}`;
    const playerRiskData = injuryRiskData?.[playerFullName];
    const playerGames = gameState?.games?.[selectedPlayer.player_id] || [];

    // Calculate age
    const age = selectedPlayer.date_of_birth 
      ? Math.floor((new Date() - new Date(selectedPlayer.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
      : 'N/A';

    // Section 1: Player Demographics
    const demographics = [{
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'Player ID',
      'Value': selectedPlayer.player_id
    }, {
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'Full Name',
      'Value': `${selectedPlayer.first_name} ${selectedPlayer.last_name}`
    }, {
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'Position',
      'Value': selectedPlayer.position
    }, {
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'Level',
      'Value': selectedPlayer.level || 'N/A'
    }, {
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'School',
      'Value': selectedPlayer.school || 'N/A'
    }, {
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'Height',
      'Value': selectedPlayer.height
    }, {
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'Weight (lbs)',
      'Value': selectedPlayer.weight
    }, {
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'Age',
      'Value': age
    }, {
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'Date of Birth',
      'Value': selectedPlayer.date_of_birth
    }, {
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'Bats',
      'Value': selectedPlayer.bats === 'R' ? 'Right' : selectedPlayer.bats === 'L' ? 'Left' : 'N/A'
    }, {
      'Section': 'PLAYER DEMOGRAPHICS',
      'Field': 'Throws',
      'Value': selectedPlayer.throws === 'R' ? 'Right' : selectedPlayer.throws === 'L' ? 'Left' : 'N/A'
    }];

    // Section 2: ML Prediction Results
    const predictionData = [{
      'Section': 'INJURY RISK PREDICTION',
      'Field': 'Risk Probability (%)',
      'Value': playerRiskData ? (playerRiskData.injury_risk_prob * 100).toFixed(2) : 'N/A'
    }, {
      'Section': 'INJURY RISK PREDICTION',
      'Field': 'Risk Level',
      'Value': playerRiskData?.risk_level || 'unknown'
    }, {
      'Section': 'INJURY RISK PREDICTION',
      'Field': 'Risk Score',
      'Value': playerRiskData?.riskScore || 'N/A'
    }, {
      'Section': 'INJURY RISK PREDICTION',
      'Field': 'Velocity Change (%)',
      'Value': selectedPlayer.velocity || 'N/A'
    }, {
      'Section': 'INJURY RISK PREDICTION',
      'Field': 'Spin Rate Change (%)',
      'Value': selectedPlayer.spin_rate || 'N/A'
    }];

    // Section 3: Game Performance Data (for graphs)
    const gamePerformanceHeader = [{
      'Section': 'GAME PERFORMANCE DATA',
      'Field': 'Description',
      'Value': 'Historical game data used for performance trends and graphs'
    }, {
      'Section': 'GAME PERFORMANCE DATA',
      'Field': 'Total Games',
      'Value': playerGames.length
    }];

    // Game-by-game data
    const gameData = playerGames.map((game, index) => ({
      'Section': 'GAME DETAILS',
      'Game Number': index + 1,
      'Game Date': game.game_date ? new Date(game.game_date).toLocaleDateString() : 'N/A',
      'Opponent': game.opponent || 'N/A',
      'Pitch Type': game.pitch_type || 'N/A',
      'Release Speed (MPH)': game.release_speed || 'N/A',
      'Spin Rate (RPM)': game.spin_rate || 'N/A',
      'Innings Pitched': game.innings_pitched || 'N/A',
      'Pitches Thrown': game.pitches_thrown || 'N/A',
      'Strikeouts': game.strikeouts || 'N/A',
      'Walks': game.walks || 'N/A',
      'Hits': game.hits || 'N/A',
      'Runs': game.runs || 'N/A',
      'Earned Runs': game.earned_runs || 'N/A',
      'Home Runs': game.home_runs || 'N/A',
      'Notes': game.notes || ''
    }));

    // Section 4: ML Model Features (the variables used for prediction)
    const mlFeaturesHeader = [{
      'Section': 'ML MODEL FEATURES',
      'Field': 'Description',
      'Value': 'Key variables used by the injury prediction model'
    }];

    const mlFeatures = [{
      'Section': 'ML MODEL FEATURES',
      'Feature': 'Release Speed Trend',
      'Description': 'Average pitch velocity over recent games',
      'Importance': 'High - Primary indicator of fatigue'
    }, {
      'Section': 'ML MODEL FEATURES',
      'Feature': 'Spin Rate Trend',
      'Description': 'Average spin rate over recent games',
      'Importance': 'High - Indicates arm mechanics and fatigue'
    }, {
      'Section': 'ML MODEL FEATURES',
      'Feature': 'Workload (Pitches Thrown)',
      'Description': 'Total pitches thrown in recent games',
      'Importance': 'High - Direct measure of arm stress'
    }, {
      'Section': 'ML MODEL FEATURES',
      'Feature': 'Innings Pitched',
      'Description': 'Total innings pitched',
      'Importance': 'Medium - Correlates with fatigue accumulation'
    }, {
      'Section': 'ML MODEL FEATURES',
      'Feature': 'Strikeout Rate',
      'Description': 'Strikeouts per inning',
      'Importance': 'Medium - Performance efficiency metric'
    }, {
      'Section': 'ML MODEL FEATURES',
      'Feature': 'Walk Rate',
      'Description': 'Walks per inning',
      'Importance': 'Medium - Control and fatigue indicator'
    }, {
      'Section': 'ML MODEL FEATURES',
      'Feature': 'Performance Consistency',
      'Description': 'Variance in release speed and spin rate',
      'Importance': 'High - Detects declining mechanics'
    }, {
      'Section': 'ML MODEL FEATURES',
      'Feature': 'Fatigue Indicators',
      'Description': 'Decline in velocity and spin rate over time',
      'Importance': 'Critical - Primary injury risk signal'
    }, {
      'Section': 'ML MODEL FEATURES',
      'Feature': 'Release Position Consistency',
      'Description': 'Variance in release point (X, Y, Z coordinates)',
      'Importance': 'Medium - Indicates mechanical breakdown'
    }, {
      'Section': 'ML MODEL FEATURES',
      'Feature': 'Pitch Mix Diversity',
      'Description': 'Variety of pitch types thrown',
      'Importance': 'Low - Secondary factor'
    }];

    // Combine all sections
    const allData = [
      ...demographics,
      {}, // Empty row for separation
      ...predictionData,
      {}, // Empty row for separation
      ...gamePerformanceHeader,
      ...gameData,
      {}, // Empty row for separation
      ...mlFeaturesHeader,
      ...mlFeatures
    ];

    const csv = convertToCSV(allData);
    const timestamp = new Date().toISOString().split('T')[0];
    const playerName = `${selectedPlayer.first_name}_${selectedPlayer.last_name}`.replace(/\s+/g, '_');
    downloadCSV(csv, `${playerName}_injury_risk_report_${timestamp}.csv`);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3 style={{ 
        color: "white", 
        fontSize: "28px", 
        fontWeight: 700,
        marginBottom: "10px",
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
          Download a comprehensive CSV report containing all player data, injury risk scores, demographics, and performance metrics.
        </p>
        <button
          onClick={handleTeamDownload}
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
          📄 Download Team Data (CSV)
        </button>
      </div>

      {/* Individual Player Section */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "120px",
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
          Select a player to download their detailed CSV report including demographics, ML prediction data, and game performance history for graphs.
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
            onClick={handlePlayerDownload}
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
            📊 Download {selectedPlayer.first_name} {selectedPlayer.last_name}'s Report (CSV)
          </button>
        )}
      </div>
    </div>
  );
};

export default DownloadView;
