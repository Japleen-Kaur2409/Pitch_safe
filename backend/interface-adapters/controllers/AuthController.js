// backend/interface-adapters/controllers/AuthController.js
const AuthInputData = require('../../use-cases/data-transfer/AuthInputData');

class AuthController {
  constructor(loginUseCase, signupUseCase, viewModel) {
    this.loginUseCase = loginUseCase;
    this.signupUseCase = signupUseCase;
    this.viewModel = viewModel;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const inputData = new AuthInputData(email, password);
      
      await this.loginUseCase.execute(inputData);

      const response = this.viewModel.getResponse();
      if (response) {
        res.status(response.status).json(response.body);
        this.viewModel.clear();
      } else {
        res.status(500).json({ error: 'No response generated' });
      }
    } catch (error) {
      console.error('AuthController login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async signup(req, res) {
    try {
      const { email, password, teamName } = req.body;
      const inputData = new AuthInputData(email, password, teamName);
      
      await this.signupUseCase.execute(inputData);

      const response = this.viewModel.getResponse();
      if (response) {
        res.status(response.status).json(response.body);
        this.viewModel.clear();
      } else {
        res.status(500).json({ error: 'No response generated' });
      }
    } catch (error) {
      console.error('AuthController signup error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = AuthController;