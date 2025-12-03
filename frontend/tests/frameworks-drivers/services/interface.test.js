// DATA ACCESS INTERFACES TESTS
import GameDataAccessInterface from '../../../src/frameworks-drivers/services/interfaces/GameDataAccessInterface';
import PlayerDataAccessInterface from '../../../src/frameworks-drivers/services/interfaces/PlayerDataAccessInterface';

describe('Data Access Interfaces', () => {
  describe('GameDataAccessInterface', () => {
    it('should throw not implemented errors', async () => {
      const dataAccess = new GameDataAccessInterface();

      await expect(dataAccess.addGameRecord({})).rejects.toThrow('Method not implemented');
      await expect(dataAccess.getPlayerGames(1)).rejects.toThrow('Method not implemented');
      await expect(dataAccess.getGameRecord(1)).rejects.toThrow('Method not implemented');
      await expect(dataAccess.updateGameRecord(1, {})).rejects.toThrow('Method not implemented');
      await expect(dataAccess.deleteGameRecord(1)).rejects.toThrow('Method not implemented');
    });
  });

  describe('PlayerDataAccessInterface', () => {
    it('should throw not implemented errors', async () => {
      const dataAccess = new PlayerDataAccessInterface();

      await expect(dataAccess.getAllPlayers()).rejects.toThrow('Method not implemented');
      await expect(dataAccess.getPlayerInfo(1)).rejects.toThrow('Method not implemented');
      await expect(dataAccess.addPlayer({})).rejects.toThrow('Method not implemented');
      await expect(dataAccess.updatePlayer(1, {})).rejects.toThrow('Method not implemented');
      await expect(dataAccess.deletePlayer(1)).rejects.toThrow('Method not implemented');
    });
  });
});
