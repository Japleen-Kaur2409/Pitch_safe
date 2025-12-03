//tests/entities/Player.test.js
import Player from '../../src/entities/Player';

describe('Player Entity', () => {
  const mockPlayerData = {
    player_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    team_id: 1,
    position: 'P',
    bats: 'R',
    throws: 'R',
    height: '6\'2"',
    weight: 200,
    date_of_birth: '1995-05-15',
    school: 'University of Baseball',
    level: 'College'
  };

  describe('constructor', () => {
    it('should create a player with all properties', () => {
      const player = new Player(mockPlayerData);

      expect(player.player_id).toBe(1);
      expect(player.first_name).toBe('John');
      expect(player.last_name).toBe('Doe');
      expect(player.team_id).toBe(1);
      expect(player.position).toBe('P');
      expect(player.bats).toBe('R');
      expect(player.throws).toBe('R');
      expect(player.height).toBe('6\'2"');
      expect(player.weight).toBe(200);
      expect(player.date_of_birth).toBe('1995-05-15');
      expect(player.school).toBe('University of Baseball');
      expect(player.level).toBe('College');
    });
  });

  describe('getFullName', () => {
    it('should return full name correctly', () => {
      const player = new Player(mockPlayerData);
      expect(player.getFullName()).toBe('John Doe');
    });

    it('should handle names with spaces', () => {
      const player = new Player({
        ...mockPlayerData,
        first_name: 'Mary Jane',
        last_name: 'Smith Wilson'
      });
      expect(player.getFullName()).toBe('Mary Jane Smith Wilson');
    });
  });

  describe('getAge', () => {
    it('should calculate age correctly', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      
      const player = new Player({
        ...mockPlayerData,
        date_of_birth: birthDate.toISOString()
      });

      const age = player.getAge();
      expect(age).toBeGreaterThanOrEqual(24);
      expect(age).toBeLessThanOrEqual(25);
    });

    it('should return null if date_of_birth is missing', () => {
      const player = new Player({
        ...mockPlayerData,
        date_of_birth: null
      });

      expect(player.getAge()).toBeNull();
    });

    it('should handle future birth dates (edge case)', () => {
      const futureBirthDate = new Date();
      futureBirthDate.setFullYear(futureBirthDate.getFullYear() + 1);
      
      const player = new Player({
        ...mockPlayerData,
        date_of_birth: futureBirthDate.toISOString()
      });

      expect(player.getAge()).toBeLessThan(0);
    });

    it('should calculate age for player born today', () => {
      const today = new Date().toISOString().split('T')[0];
      
      const player = new Player({
        ...mockPlayerData,
        date_of_birth: today
      });

      expect(player.getAge()).toBe(0);
    });
  });

  describe('getBattingHand', () => {
    it('should return Right for R', () => {
      const player = new Player({ ...mockPlayerData, bats: 'R' });
      expect(player.getBattingHand()).toBe('Right');
    });

    it('should return Left for L', () => {
      const player = new Player({ ...mockPlayerData, bats: 'L' });
      expect(player.getBattingHand()).toBe('Left');
    });

    it('should return Switch for S', () => {
      const player = new Player({ ...mockPlayerData, bats: 'S' });
      expect(player.getBattingHand()).toBe('Switch');
    });

    it('should return Switch for other values', () => {
      const player = new Player({ ...mockPlayerData, bats: 'X' });
      expect(player.getBattingHand()).toBe('Switch');
    });
  });

  describe('getThrowingHand', () => {
    it('should return Right for R', () => {
      const player = new Player({ ...mockPlayerData, throws: 'R' });
      expect(player.getThrowingHand()).toBe('Right');
    });

    it('should return Left for L', () => {
      const player = new Player({ ...mockPlayerData, throws: 'L' });
      expect(player.getThrowingHand()).toBe('Left');
    });

    it('should return Unknown for other values', () => {
      const player = new Player({ ...mockPlayerData, throws: 'X' });
      expect(player.getThrowingHand()).toBe('Unknown');
    });
  });
});
