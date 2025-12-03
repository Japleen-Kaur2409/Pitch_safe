// __tests__/interface-adapters/view-models/PlayerViewModel.test.js
import PlayerViewModel from '../../../src/interface-adapters/view-models/PlayerViewModel';

describe('PlayerViewModel', () => {
  let viewModel;

  beforeEach(() => {
    viewModel = new PlayerViewModel();
  });

  test('initializes with correct default state', () => {
    const state = viewModel.getState();
    expect(state.players).toEqual([]);
    expect(state.selectedPlayer).toBeNull();
    expect(state.playersLoading).toBe(true);
    expect(state.playerDetailLoading).toBe(false);
    expect(state.playersError).toBeNull();
    expect(state.playerDetailError).toBeNull();
    expect(state.playerMLBIds).toEqual({});
  });

  test('updates state correctly', () => {
    const players = [{ player_id: 1, first_name: 'John', last_name: 'Doe' }];
    viewModel.update({ players, playersLoading: false });
    
    const state = viewModel.getState();
    expect(state.players).toEqual(players);
    expect(state.playersLoading).toBe(false);
  });

  test('subscribes and notifies listeners', () => {
    const listener = jest.fn();
    viewModel.subscribe(listener);
    
    viewModel.update({ playersLoading: false });
    expect(listener).toHaveBeenCalled();
  });

  test('setPlayersLoading updates loading state', () => {
    viewModel.setPlayersLoading(false);
    expect(viewModel.getState().playersLoading).toBe(false);
  });

  test('setPlayerDetailLoading updates detail loading state', () => {
    viewModel.setPlayerDetailLoading(true);
    expect(viewModel.getState().playerDetailLoading).toBe(true);
  });

  test('clearSelectedPlayer removes selected player', () => {
    viewModel.update({ selectedPlayer: { player_id: 1 } });
    viewModel.clearSelectedPlayer();
    expect(viewModel.getState().selectedPlayer).toBeNull();
  });

  test('clearErrors removes all error messages', () => {
    viewModel.update({ 
      playersError: 'Error 1', 
      playerDetailError: 'Error 2' 
    });
    viewModel.clearErrors();
    
    const state = viewModel.getState();
    expect(state.playersError).toBeNull();
    expect(state.playerDetailError).toBeNull();
  });
});
