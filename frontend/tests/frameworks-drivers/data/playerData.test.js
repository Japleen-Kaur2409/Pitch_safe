import { PLAYER_PERSONAL_INFO, getPlayerInfo, hasPlayerInfo } from '../../../src/frameworks-drivers/data/playerData';

describe('Player Data', () => {
  describe('PLAYER_PERSONAL_INFO', () => {
    it('should contain player data', () => {
      expect(typeof PLAYER_PERSONAL_INFO).toBe('object');
      expect(Object.keys(PLAYER_PERSONAL_INFO).length).toBeGreaterThan(0);
    });

    it('should have correct structure for players', () => {
      const player = PLAYER_PERSONAL_INFO[81]; // Luis Gil
      if (player) {
        expect(player).toHaveProperty('player_id');
        expect(player).toHaveProperty('date_of_birth');
      }
    });
  });

  describe('getPlayerInfo', () => {
    it('should return player info when exists', () => {
      const info = getPlayerInfo(81);
      if (info) {
        expect(info.player_id).toBe(81);
      }
    });

    it('should return null when player does not exist', () => {
      const info = getPlayerInfo(99999);
      expect(info).toBeNull();
    });
  });

  describe('hasPlayerInfo', () => {
    it('should return true when player exists', () => {
      expect(hasPlayerInfo(81)).toBe(true);
    });

    it('should return false when player does not exist', () => {
      expect(hasPlayerInfo(99999)).toBe(false);
    });
  });
});
