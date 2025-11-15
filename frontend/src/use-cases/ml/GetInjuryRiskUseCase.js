// frontend/src/use-cases/ml/GetInjuryRiskUseCase.js
class GetInjuryRiskUseCase {
  constructor(mlDataAccess, outputBoundary) {
    this.mlDataAccess = mlDataAccess;
    this.outputBoundary = outputBoundary;
  }

  async execute(csvPath, topKRatio, startDate) {
    try {
      if (!csvPath) {
        throw new Error('CSV path is required');
      }

      const playerRiskMap = await this.mlDataAccess.getInjuryRisk(csvPath, topKRatio, startDate);
      
      const playerCount = Object.keys(playerRiskMap).length;
      console.log(`✅ Successfully loaded ${playerCount} players`);
      const entries = Object.entries(playerRiskMap).slice(0, 3);
      console.log('📋 First 3 Players (Detailed):');
      entries.forEach(([playerName, riskData]) => {
        console.log(`\n  Player: ${playerName}`);
        console.log(`    Risk Score: ${riskData.riskScore}`);
        console.log(`    Risk Level: ${riskData.riskLevel}`);
        console.log(`    Full Data:`, riskData);
      });
      this.outputBoundary.presentInjuryRiskSuccess(playerRiskMap);
      return playerRiskMap;
    } catch (error) {
      this.outputBoundary.presentInjuryRiskError(error.message);
      throw error;
    }
  }
}

export default GetInjuryRiskUseCase;