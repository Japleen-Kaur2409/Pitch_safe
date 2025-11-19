// frontend/src/config/dependencies.js
// Auth Use Cases
import LoginUseCase from '../use-cases/auth/LoginUseCase';
import SignupUseCase from '../use-cases/auth/SignupUseCase';
import LogoutUseCase from '../use-cases/auth/LogoutUseCase';
import MLDataAccess from '../frameworks-drivers/data/mlDataAccess';

// Player Use Cases
import GetAllPlayersUseCase from '../use-cases/player/GetAllPlayersUseCase';
import GetPlayerDetailUseCase from '../use-cases/player/GetPlayerDetailUseCase';
import FetchMLBPlayerIdUseCase from '../use-cases/player/FetchMLBPlayerIdUseCase';
import GetPlayersByCoachUseCase from '../use-cases/player/GetPlayersByCoachUseCase';

// Game Use Cases
import AddGameRecordUseCase from '../use-cases/game/AddGameRecordUseCase';
import GetInjuryRiskUseCase from '../use-cases/ml/GetInjuryRiskUseCase';

// Presenters
import AuthPresenter from '../interface-adapters/presenters/AuthPresenter';
import PlayerPresenter from '../interface-adapters/presenters/PlayerPresenter';
import GamePresenter from '../interface-adapters/presenters/GamePresenter';
import MLPresenter from '../interface-adapters/presenters/MLPresenter';

// Controllers
import AuthController from '../interface-adapters/controllers/AuthController';
import PlayerController from '../interface-adapters/controllers/PlayerController';
import NavigationController from '../interface-adapters/controllers/NavigationController';
import GameController from '../interface-adapters/controllers/GameController';
import MLController from '../interface-adapters/controllers/MLController';

// View Models
import AuthViewModel from '../interface-adapters/view-models/AuthViewModel';
import PlayerViewModel from '../interface-adapters/view-models/PlayerViewModel';
import NavigationViewModel from '../interface-adapters/view-models/NavigationViewModel';
import GameViewModel from '../interface-adapters/view-models/GameViewModel';
import MLViewModel from '../interface-adapters/view-models/MLViewModel';

// Services
import { authService } from '../frameworks-drivers/services/authService';
import { playerService } from '../frameworks-drivers/services/playerService';
import { mlbApiService } from '../frameworks-drivers/services/mlbApiService';
import { gameRecordService } from '../frameworks-drivers/services/gameRecordService';

// Configure all dependencies
export function configureDependencies() {
  // View Models
  const authViewModel = new AuthViewModel();
  const playerViewModel = new PlayerViewModel();
  const navigationViewModel = new NavigationViewModel();
  const gameViewModel = new GameViewModel();
  const mlViewModel = new MLViewModel();

  const mlDataAccess = new MLDataAccess();
  
  // Presenters
  const authPresenter = new AuthPresenter(authViewModel);
  const playerPresenter = new PlayerPresenter(playerViewModel);
  const gamePresenter = new GamePresenter(gameViewModel);
  const mlPresenter = new MLPresenter(mlViewModel);

  // Use Cases
  const loginUseCase = new LoginUseCase(authService, authPresenter);
  const signupUseCase = new SignupUseCase(authService, authPresenter);
  const logoutUseCase = new LogoutUseCase(authPresenter);
  const getInjuryRiskUseCase = new GetInjuryRiskUseCase(mlDataAccess, mlPresenter);
  
  const getAllPlayersUseCase = new GetAllPlayersUseCase(playerService, playerPresenter);
  const getPlayerDetailUseCase = new GetPlayerDetailUseCase(playerService, mlbApiService, playerPresenter);
  const fetchMLBPlayerIdUseCase = new FetchMLBPlayerIdUseCase(mlbApiService, playerPresenter);
  const getPlayersByCoachUseCase = new GetPlayersByCoachUseCase(playerService, playerPresenter);
  
  const addGameRecordUseCase = new AddGameRecordUseCase(gameRecordService, gamePresenter);

  // Controllers
  const authController = new AuthController(loginUseCase, signupUseCase, logoutUseCase);
  const playerController = new PlayerController(
    getAllPlayersUseCase, 
    getPlayerDetailUseCase, 
    fetchMLBPlayerIdUseCase,
    getPlayersByCoachUseCase
  );
  const navigationController = new NavigationController(navigationViewModel);
  const gameController = new GameController(addGameRecordUseCase);
  const mlController = new MLController(getInjuryRiskUseCase, mlViewModel);

  return {
    // View Models
    authViewModel,
    playerViewModel,
    navigationViewModel,
    gameViewModel,
    mlViewModel,

    // Controllers
    authController,
    playerController,
    navigationController,
    gameController,
    mlController,

    // Services (for direct access if needed)
    mlbApiService
  };
}