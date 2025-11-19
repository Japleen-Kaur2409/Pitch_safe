// backend/use-cases/ml/GetInjuryRiskUseCase.js
class GetInjuryRiskUseCase {
  constructor(mlDataAccess, outputBoundary) {
    this.mlDataAccess = mlDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(inputData) {
    try {
      const { csvPath, topKRatio, startDate } = inputData;

      // Validate input
      if (!csvPath) {
        throw new Error('CSV path is required for injury risk prediction');
      }

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