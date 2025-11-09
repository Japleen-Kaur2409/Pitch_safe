// frontend/src/config/dependencies.js
// Auth Use Cases
import LoginUseCase from '../use-cases/auth/LoginUseCase';
import SignupUseCase from '../use-cases/auth/SignupUseCase';
import LogoutUseCase from '../use-cases/auth/LogoutUseCase';

// Player Use Cases
import GetAllPlayersUseCase from '../use-cases/player/GetAllPlayersUseCase';
import GetPlayerDetailUseCase from '../use-cases/player/GetPlayerDetailUseCase';
import FetchMLBPlayerIdUseCase from '../use-cases/player/FetchMLBPlayerIdUseCase';
import GetPlayersByCoachUseCase from '../use-cases/player/GetPlayersByCoachUseCase';

// Game Use Cases
import AddGameRecordUseCase from '../use-cases/game/AddGameRecordUseCase';

// Presenters
import AuthPresenter from '../interface-adapters/presenters/AuthPresenter';
import PlayerPresenter from '../interface-adapters/presenters/PlayerPresenter';
import GamePresenter from '../interface-adapters/presenters/GamePresenter';

// Controllers
import AuthController from '../interface-adapters/controllers/AuthController';
import PlayerController from '../interface-adapters/controllers/PlayerController';
import NavigationController from '../interface-adapters/controllers/NavigationController';
import GameController from '../interface-adapters/controllers/GameController';

// View Models
import AuthViewModel from '../interface-adapters/view-models/AuthViewModel';
import PlayerViewModel from '../interface-adapters/view-models/PlayerViewModel';
import NavigationViewModel from '../interface-adapters/view-models/NavigationViewModel';
import GameViewModel from '../interface-adapters/view-models/GameViewModel';

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

  // Presenters
  const authPresenter = new AuthPresenter(authViewModel);
  const playerPresenter = new PlayerPresenter(playerViewModel);
  const gamePresenter = new GamePresenter(gameViewModel);

  // Use Cases
  const loginUseCase = new LoginUseCase(authService, authPresenter);
  const signupUseCase = new SignupUseCase(authService, authPresenter);
  const logoutUseCase = new LogoutUseCase(authPresenter);
  
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

  return {
    // View Models
    authViewModel,
    playerViewModel,
    navigationViewModel,
    gameViewModel,

    // Controllers
    authController,
    playerController,
    navigationController,
    gameController,

    // Services (for direct access if needed)
    mlbApiService
  };
}