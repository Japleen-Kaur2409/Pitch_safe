// frontend/src/use-cases/auth/LogoutUseCase.js
class LogoutUseCase {
  constructor(outputBoundary) {
    this.outputBoundary = outputBoundary;
  }

  async execute() {
    try {
      // Clear local state
      this.outputBoundary.presentLogoutSuccess();
    } catch (error) {
      this.outputBoundary.presentLogoutError(error.message);
    }
  }
}

export default LogoutUseCase;