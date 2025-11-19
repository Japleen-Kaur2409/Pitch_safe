// backend/use-cases/ml/GetInjuryRiskUseCase.js
class GetInjuryRiskUseCase {
  constructor(mlDataAccess, outputBoundary) {
    this.mlDataAccess = mlDataAccess;
    this.outputBoundary = outputBoundary;
  }

  /**
   * Convert Mac path to Docker path
   * /Users/pongpnag8848/Desktop/Pitch_safe/backend/... -> /app/backend/...
   */
  convertPathToDocker(csvPath) {
    // If running in Docker, convert Mac paths to Docker paths
    if (process.env.NODE_ENV === 'development' || process.env.DOCKER_PATH_CONVERSION === 'true') {
      // Match pattern: /Users/.../Pitch_safe/backend/...
      const match = csvPath.match(/Pitch_safe(\/backend\/.+)/);
      if (match) {
        const dockerPath = `/app${match[1]}`;
        console.log(`Path conversion: ${csvPath} -> ${dockerPath}`);
        return dockerPath;
      }
    }
    return csvPath;
  }

  async execute(inputData) {
    try {
      let { csvPath, topKRatio, startDate } = inputData;

      // Validate input
      if (!csvPath) {
        throw new Error('CSV path is required for injury risk prediction');
      }

      // Convert Mac path to Docker path
      csvPath = this.convertPathToDocker(csvPath);
      console.log(`Using CSV path: ${csvPath}`);

      // Get predictions from ML service
      const predictions = await this.mlDataAccess.getInjuryRiskPredictions(
        csvPath,
        topKRatio || 0.10,
        startDate || '2024-04-01'
      );

      // Transform predictions into a player-keyed format
      const playerRiskMap = {};
      predictions.forEach(pred => {
        const playerName = pred.player_name;
        if (!playerRiskMap[playerName]) {
          playerRiskMap[playerName] = {
            player_name: playerName,
            injury_risk_prob: pred.injury_risk_prob,
            risk_level: pred.risk_level,
            game_date: pred.game_date
          };
        } else {
          // Keep the most recent prediction if multiple games
          const existingDate = new Date(playerRiskMap[playerName].game_date);
          const newDate = new Date(pred.game_date);
          if (newDate > existingDate) {
            playerRiskMap[playerName] = {
              player_name: playerName,
              injury_risk_prob: pred.injury_risk_prob,
              risk_level: pred.risk_level,
              game_date: pred.game_date
            };
          }
        }
      });

      // Present success
      this.outputBoundary.presentInjuryRiskSuccess(playerRiskMap);

    } catch (error) {
      this.outputBoundary.presentInjuryRiskError(error.message);
    }
  }
}

module.exports = GetInjuryRiskUseCase;