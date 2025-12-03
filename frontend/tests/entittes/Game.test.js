// __tests__/entities/Game.test.js
import Game from '../../src/entities/Game';

describe('Game Entity', () => {
  const mockGameData = {
    record_id: 1,
    player_id: 1,
    game_date: '2024-06-15',
    pitch_type: 'Fastball',
    release_speed: 95.5,
    spin_rate: 2400,
    release_pos_x: 1.5,
    release_pos_y: 5.5,
    release_pos_z: 6.0,
    opponent: 'Boston Red Sox',
    innings_pitched: 6,
    hits: 5,
    runs: 2,
    earned_runs: 2,
    walks: 2,
    strikeouts: 8,
    home_runs: 1,
    pitches_thrown: 95,
    notes: 'Great performance'
  };

  describe('constructor', () => {
    it('should create a game with all properties', () => {
      const game = new Game(mockGameData);

      expect(game.record_id).toBe(1);
      expect(game.player_id).toBe(1);
      expect(game.game_date).toBe('2024-06-15');
      expect(game.pitch_type).toBe('Fastball');
      expect(game.release_speed).toBe(95.5);
      expect(game.spin_rate).toBe(2400);
      expect(game.release_pos_x).toBe(1.5);
      expect(game.release_pos_y).toBe(5.5);
      expect(game.release_pos_z).toBe(6.0);
      expect(game.opponent).toBe('Boston Red Sox');
      expect(game.innings_pitched).toBe(6);
      expect(game.hits).toBe(5);
      expect(game.runs).toBe(2);
      expect(game.earned_runs).toBe(2);
      expect(game.walks).toBe(2);
      expect(game.strikeouts).toBe(8);
      expect(game.home_runs).toBe(1);
      expect(game.pitches_thrown).toBe(95);
      expect(game.notes).toBe('Great performance');
    });
  });

  describe('getFormattedDate', () => {
    it('should format date correctly', () => {
      const game = new Game(mockGameData);
      const formatted = game.getFormattedDate();
      
      expect(formatted).toMatch(/Jun \d{1,2}, 2024/);
    });

    it('should return empty string if game_date is missing', () => {
      const game = new Game({ ...mockGameData, game_date: null });
      expect(game.getFormattedDate()).toBe('');
    });

    it('should handle different date formats', () => {
      const game = new Game({
        ...mockGameData,
        game_date: new Date('2024-12-25')
      });
      
      const formatted = game.getFormattedDate();
      expect(formatted).toMatch("Dec 24, 2024");
    });
  });

  describe('calculateStrikePercentage', () => {
    it('should calculate strike percentage correctly', () => {
      const game = new Game(mockGameData);
      const percentage = game.calculateStrikePercentage();
      
      // 8 strikeouts / 95 pitches = 8.42%
      expect(percentage).toBeCloseTo(8.42, 1);
    });

    it('should return 0 if pitches_thrown is 0', () => {
      const game = new Game({
        ...mockGameData,
        pitches_thrown: 0
      });
      
      expect(game.calculateStrikePercentage()).toBe(0);
    });

    it('should return 0 if strikeouts is 0', () => {
      const game = new Game({
        ...mockGameData,
        strikeouts: 0
      });
      
      expect(game.calculateStrikePercentage()).toBe(0);
    });

    it('should return 0 if pitches_thrown is null', () => {
      const game = new Game({
        ...mockGameData,
        pitches_thrown: null
      });
      
      expect(game.calculateStrikePercentage()).toBe(0);
    });

    it('should calculate 100% for all strikeouts', () => {
      const game = new Game({
        ...mockGameData,
        strikeouts: 100,
        pitches_thrown: 100
      });
      
      expect(game.calculateStrikePercentage()).toBe(100);
    });
  });

  describe('getEarnedRunAverage', () => {
    it('should calculate ERA correctly', () => {
      const game = new Game(mockGameData);
      const era = game.getEarnedRunAverage();
      
      // (2 earned runs / 6 innings) * 9 = 3.0
      expect(era).toBeCloseTo(3.0, 1);
    });

    it('should return 0 if innings_pitched is 0', () => {
      const game = new Game({
        ...mockGameData,
        innings_pitched: 0
      });
      
      expect(game.getEarnedRunAverage()).toBe(0);
    });

    it('should return 0 if earned_runs is 0', () => {
      const game = new Game({
        ...mockGameData,
        earned_runs: 0
      });
      
      expect(game.getEarnedRunAverage()).toBe(0);
    });

    it('should calculate ERA for 9 innings', () => {
      const game = new Game({
        ...mockGameData,
        innings_pitched: 9,
        earned_runs: 3
      });
      
      // (3 / 9) * 9 = 3.0
      expect(game.getEarnedRunAverage()).toBeCloseTo(3.0, 1);
    });

    it('should calculate ERA for less than 1 inning', () => {
      const game = new Game({
        ...mockGameData,
        innings_pitched: 0.33,
        earned_runs: 1
      });
      
      // (1 / 0.33) * 9 = 27.27
      expect(game.getEarnedRunAverage()).toBeGreaterThan(25);
    });

    it('should handle perfect game (0.00 ERA)', () => {
      const game = new Game({
        ...mockGameData,
        innings_pitched: 9,
        earned_runs: 0
      });
      
      expect(game.getEarnedRunAverage()).toBe(0);
    });
  });
});
