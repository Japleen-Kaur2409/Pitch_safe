// backend/frameworks-drivers/data/implementations/mlDataAccessHTTP.js
const axios = require('axios');

class MLDataAccessHTTP {
  constructor(baseURL = 'http://localhost:5002') {
    this.baseURL = baseURL;
  }

  async getInjuryRiskPredictions(csvPath, topKRatio = 0.10, startDate = '2024-04-01') {
    try {
      const response = await axios.post(`${this.baseURL}/predict`, {
        csv_path: csvPath,
        top_k_ratio: topKRatio,
        start_date: startDate
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'ML prediction failed');
      }
    } catch (error) {
      if (error.response) {
        throw new Error(`ML Service Error: ${error.response.data.error || error.message}`);
      }
      throw new Error(`ML Service Error: ${error.message}`);
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}

module.exports = MLDataAccessHTTP;