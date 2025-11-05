// frontend/src/interface-adapters/controllers/AuthController.js
import AuthInputData from '../../use-cases/data-transfer/AuthInputData';

class AuthController {
  constructor(loginUseCase, signupUseCase, logoutUseCase) {
    this.loginUseCase = loginUseCase;
    this.signupUseCase = signupUseCase;
    this.logoutUseCase = logoutUseCase;
  }

  async handleLogin(email, password) {
    const inputData = new AuthInputData(email, password);
    await this.loginUseCase.execute(inputData.email, inputData.password);
  }

  async handleSignup(email, password, confirmPassword, teamName) {
    const inputData = new AuthInputData(email, password, confirmPassword, teamName);
    await this.signupUseCase.execute(
      inputData.email, 
      inputData.password, 
      inputData.confirmPassword, 
      inputData.teamName
    );
  }

  async handleLogout() {
    await this.logoutUseCase.execute();
  }
}

export default AuthController;