// frontend/src/frameworks-drivers/data/mlDataAccess.js
import { apiService } from '../services/apiService';

class MLDataAccess {
  async getInjuryRisk(csvPath, topKRatio = 0.10, startDate = '2024-04-01') {
    try {
      const response = await apiService.post('/api/ml/injury-risk', {
        csvPath,
        topKRatio,
        startDate
      });
      
      if (response.success) {
        const playerRiskMap = response.data.playerRiskMap;
        
        // Log first few rows of data
        console.log('📊 Raw API Response:', response);
        console.log('📊 Player Risk Map Keys:', Object.keys(playerRiskMap));
        
        const entries = Object.entries(playerRiskMap).slice(0, 5);
        console.log('📊 First 5 Players Data:');
        entries.forEach(([playerName, riskData], index) => {
          console.log(`  ${index + 1}. ${playerName}:`, riskData);
        });
        
        return playerRiskMap;
      } else {
        throw new Error(response.error || 'Failed to get injury risk data');
      }
    } catch (error) {
      throw new Error(`Injury Risk Error: ${error.message}`);
    }
  }
}

export default MLDataAccess;