// __tests__/frameworks-drivers/views/LoggedInUIView.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoggedInUIView from '../../../src/frameworks-drivers/views/LoggedInUIView';
import { configureDependencies } from '../../../src/config/dependencies';
import { getTeamLogo } from '../../../src/utils/teamUtils';

jest.mock('../../../src/config/dependencies');
jest.mock('../../../src/utils/teamUtils');
jest.mock('../../../src/frameworks-drivers/views/RosterView', () => {
  return function RosterView({ players, onPlayerClick }) {
    return (
      <div data-testid="roster-view">
        {players.map((player, idx) => (
          <button 
            key={player.player_id} 
            onClick={() => onPlayerClick(player, idx)}
          >
            {player.first_name} {player.last_name}
          </button>
        ))}
      </div>
    );
  };
});
jest.mock('../../../src/frameworks-drivers/views/PlayerDetailView', () => {
  return function PlayerDetailView({ selectedPlayer, onBackClick }) {
    return (
      <div data-testid="player-detail-view">
        <button onClick={onBackClick}>Back</button>
        <div>{selectedPlayer?.first_name} {selectedPlayer?.last_name}</div>
      </div>
    );
  };
});
jest.mock('../../../src/frameworks-drivers/views/StatsView', () => {
  return function StatsView() {
    return <div data-testid="stats-view">Stats</div>;
  };
});
jest.mock('../../../src/frameworks-drivers/views/DownloadView', () => {
  return function DownloadView() {
    return <div data-testid="download-view">Download</div>;
  };
});
jest.mock('../../../src/frameworks-drivers/components/LogoutButton', () => {
  return function LogoutButton({ onLogout }) {
    return <button onClick={onLogout}>Logout</button>;
  };
});
jest.mock('../../../src/frameworks-drivers/components/NavigationBar', () => {
  return function NavigationBar({ onNavigate }) {
    return (
      <div data-testid="navigation-bar">
        <button onClick={() => onNavigate('roster')}>Roster</button>
        <button onClick={() => onNavigate('stats')}>Stats</button>
        <button onClick={() => onNavigate('download')}>Download</button>
      </div>
    );
  };
});

describe('LoggedInUIView', () => {
  let mockDependencies;
  let mockPlayerViewModel;
  let mockNavigationViewModel;
  let mockGameViewModel;
  
  const mockCurrentUser = {
    coach_id: 'coach123',
    email: 'coach@test.com',
    teamName: 'Toronto Blue Jays'
  };

  const mockPlayers = [
    {
      player_id: '1',
      first_name: 'John',
      last_name: 'Doe',
      height: '6-2',
      weight: 200
    },
    {
      player_id: '2',
      first_name: 'Jane',
      last_name: 'Smith',
      height: '6-0',
      weight: 190
    }
  ];

  const mockInjuryRiskData = {
    'John, Doe': { injury_risk_prob: 0.33, risk_level: 'high' },
    'Jane, Smith': { injury_risk_prob: 0.15, risk_level: 'low' }
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockPlayerViewModel = {
      getState: jest.fn(() => ({
        players: mockPlayers,
        selectedPlayer: null,
        playersLoading: false,
        playersError: null,
        playerMLBIds: { '1': 'mlb123', '2': 'mlb456' }
      })),
      subscribe: jest.fn((callback) => jest.fn()),
      update: jest.fn(),
      clearSelectedPlayer: jest.fn()
    };

    mockNavigationViewModel = {
      getState: jest.fn(() => ({
        currentView: 'roster',
        selectedPlayer: null
      })),
      subscribe: jest.fn((callback) => jest.fn()),
      update: jest.fn()
    };

    mockGameViewModel = {
      getState: jest.fn(() => ({ games: [], loading: false })),
      subscribe: jest.fn((callback) => jest.fn())
    };

    mockDependencies = {
      playerViewModel: mockPlayerViewModel,
      navigationViewModel: mockNavigationViewModel,
      gameViewModel: mockGameViewModel,
      playerController: {
        handleGetPlayersByCoach: jest.fn().mockResolvedValue(),
        handleGetAllPlayers: jest.fn().mockResolvedValue(),
        handleFetchMLBPlayerId: jest.fn().mockResolvedValue(),
        handleGetPlayerDetail: jest.fn().mockResolvedValue()
      },
      navigationController: {
        navigateToPlayerDetail: jest.fn(),
        navigateBack: jest.fn(),
        navigateToStats: jest.fn(),
        navigateToRoster: jest.fn(),
        navigateToDownload: jest.fn()
      },
      gameController: { addGameRecord: jest.fn() },
      mlbApiService: {
        getPlayerImage: jest.fn((mlbId) => ({
          primary: `https://img.mlbstatic.com/${mlbId}/primary.png`,
          fallback1: `https://img.mlbstatic.com/${mlbId}/fallback1.png`,
          fallback2: `https://securea.mlb.com/${mlbId}.jpg`,
          fallback3: `https://img.mlbstatic.com/${mlbId}/fallback3.png`
        }))
      }
    };

    configureDependencies.mockReturnValue(mockDependencies);
    getTeamLogo.mockReturnValue('/logos/blue-jays.png');
  });

  test('renders team name and logo', () => {
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    expect(screen.getByText('Toronto Blue Jays')).toBeInTheDocument();
    expect(screen.getByAltText('Team Logo')).toHaveAttribute('src', '/logos/blue-jays.png');
  });

  test('displays ML loading indicator', () => {
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={null}
        mlLoading={true}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    expect(screen.getByText(/loading injury risk predictions/i)).toBeInTheDocument();
  });

  test('displays ML error message', () => {
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={null}
        mlLoading={false}
        mlError="Failed to load"
        onGameRecordSuccess={jest.fn()}
      />
    );

    expect(screen.getByText(/warning: ml predictions unavailable/i)).toBeInTheDocument();
  });

  test('loads players by coach on mount', async () => {
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(mockDependencies.playerController.handleGetPlayersByCoach).toHaveBeenCalledWith('coach123');
    });
  });

  test('preloads MLB IDs for players', async () => {
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(mockDependencies.playerController.handleFetchMLBPlayerId).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  test('handles player click with ML data', async () => {
    const user = userEvent.setup();
    
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    const playerButton = screen.getByText('John Doe');
    await user.click(playerButton);

    await waitFor(() => {
      expect(mockDependencies.navigationController.navigateToPlayerDetail).toHaveBeenCalledWith(
        expect.objectContaining({
          player_id: '1',
          fatigue_score: 33,
          riskLevel: 'high'
        })
      );
    });
  });

  test('handles player click without ML data', async () => {
    const user = userEvent.setup();
    
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={null}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    const playerButton = screen.getByText('John Doe');
    await user.click(playerButton);

    await waitFor(() => {
      expect(mockDependencies.navigationController.navigateToPlayerDetail).toHaveBeenCalledWith(
        expect.objectContaining({
          player_id: '1',
          fatigue_score: 33,
          riskLevel: 'unknown'
        })
      );
    });
  });

  test('navigates back from player detail', async () => {
    const user = userEvent.setup();
    
    mockNavigationViewModel.getState.mockReturnValue({
      currentView: 'playerDetail',
      selectedPlayer: mockPlayers[0]
    });

    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    const backButton = screen.getByText('Back');
    await user.click(backButton);

    expect(mockDependencies.navigationController.navigateBack).toHaveBeenCalled();
    expect(mockPlayerViewModel.clearSelectedPlayer).toHaveBeenCalled();
  });

  test('navigates to stats view', async () => {
    const user = userEvent.setup();
    
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    const statsButton = screen.getByText('Stats');
    await user.click(statsButton);

    expect(mockDependencies.navigationController.navigateToStats).toHaveBeenCalled();
  });

  test('navigates to download view', async () => {
    const user = userEvent.setup();
    
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    const downloadButton = screen.getByText('Download');
    await user.click(downloadButton);

    expect(mockDependencies.navigationController.navigateToDownload).toHaveBeenCalled();
  });

  test('handles logout', async () => {
    const user = userEvent.setup();
    const mockOnLogout = jest.fn();
    
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={mockOnLogout}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalled();
  });

  test('renders roster view by default', () => {
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    expect(screen.getByTestId('roster-view')).toBeInTheDocument();
  });

  test('renders player detail view when selected', () => {
    mockNavigationViewModel.getState.mockReturnValue({
      currentView: 'playerDetail',
      selectedPlayer: mockPlayers[0]
    });

    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    expect(screen.getByTestId('player-detail-view')).toBeInTheDocument();
  });

  test('renders stats view', () => {
    mockNavigationViewModel.getState.mockReturnValue({
      currentView: 'stats',
      selectedPlayer: null
    });

    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    expect(screen.getByTestId('stats-view')).toBeInTheDocument();
  });

  test('renders download view', () => {
    mockNavigationViewModel.getState.mockReturnValue({
      currentView: 'download',
      selectedPlayer: null
    });

    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    expect(screen.getByTestId('download-view')).toBeInTheDocument();
  });

  test('handles team logo load error', () => {
    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    const logo = screen.getByAltText('Team Logo');
    fireEvent.error(logo);
    
    expect(logo).toHaveAttribute('src', '/default-team.png');
  });

  test('uses default team name when not provided', () => {
    render(
      <LoggedInUIView
        currentUser={{ ...mockCurrentUser, teamName: undefined }}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    expect(screen.getByText('Toronto Blue Jays')).toBeInTheDocument();
  });

  test('loads all players when coach_id not provided', async () => {
    render(
      <LoggedInUIView
        currentUser={{ ...mockCurrentUser, coach_id: undefined }}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(mockDependencies.playerController.handleGetAllPlayers).toHaveBeenCalled();
    });
  });

  test('clears selected player when navigating away from detail', async () => {
    const user = userEvent.setup();
    
    mockNavigationViewModel.getState.mockReturnValue({
      currentView: 'playerDetail',
      selectedPlayer: mockPlayers[0]
    });

    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    const statsButton = screen.getByText('Stats');
    await user.click(statsButton);

    expect(mockPlayerViewModel.clearSelectedPlayer).toHaveBeenCalled();
  });

  test('handles player detail fetch error', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockDependencies.playerController.handleGetPlayerDetail.mockRejectedValue(
      new Error('Fetch failed')
    );

    render(
      <LoggedInUIView
        currentUser={mockCurrentUser}
        onLogout={jest.fn()}
        authLoading={false}
        injuryRiskData={mockInjuryRiskData}
        mlLoading={false}
        mlError={null}
        onGameRecordSuccess={jest.fn()}
      />
    );

    const playerButton = screen.getByText('John Doe');
    await user.click(playerButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
