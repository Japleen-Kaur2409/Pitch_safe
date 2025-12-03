// OUTPUT BOUNDARY INTERFACES TESTS
import AuthOutputBoundary from '../../../src/use-cases/auth/interfaces/AuthOutputBoundary';
import GameOutputBoundary from '../../../src/use-cases/game/interfaces/GameOutputBoundary';
import PlayerOutputBoundary from '../../../src/use-cases/player/interfaces/PlayerOutputBoundary';

describe('Output Boundary Interfaces', () => {
  describe('AuthOutputBoundary', () => {
    it('should throw not implemented errors', () => {
      const boundary = new AuthOutputBoundary();

      expect(() => boundary.presentLoginSuccess({})).toThrow('Method not implemented');
      expect(() => boundary.presentLoginError('')).toThrow('Method not implemented');
      expect(() => boundary.presentSignupSuccess({})).toThrow('Method not implemented');
      expect(() => boundary.presentSignupError('')).toThrow('Method not implemented');
      expect(() => boundary.presentLogoutSuccess()).toThrow('Method not implemented');
      expect(() => boundary.presentLogoutError('')).toThrow('Method not implemented');
    });
  });

  describe('GameOutputBoundary', () => {
    it('should throw not implemented errors', () => {
      const boundary = new GameOutputBoundary();

      expect(() => boundary.presentAddGameRecordSuccess({})).toThrow('Method not implemented');
      expect(() => boundary.presentAddGameRecordError('')).toThrow('Method not implemented');
      expect(() => boundary.presentPlayerGameRecordsSuccess([])).toThrow('Method not implemented');
      expect(() => boundary.presentPlayerGameRecordsError('')).toThrow('Method not implemented');
    });
  });

  describe('PlayerOutputBoundary', () => {
    it('should throw not implemented errors', () => {
      const boundary = new PlayerOutputBoundary();

      expect(() => boundary.presentPlayersSuccess([])).toThrow('Method not implemented');
      expect(() => boundary.presentPlayersError('')).toThrow('Method not implemented');
      expect(() => boundary.presentPlayerDetailSuccess({})).toThrow('Method not implemented');
      expect(() => boundary.presentPlayerDetailError('')).toThrow('Method not implemented');
      expect(() => boundary.presentMLBPlayerIdSuccess(0)).toThrow('Method not implemented');
      expect(() => boundary.presentMLBPlayerIdError('')).toThrow('Method not implemented');
    });
  });
});
