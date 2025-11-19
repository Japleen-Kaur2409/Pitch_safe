// tests/unit/entities/Game.test.js
const Game = require('../../../entities/Game');

describe('Game Entity', () => {
  const validGameData = {
    record_id: 1,
    player_id: 100,
    game_date: '2024-01-15',
    pitch_type: 'Fastball',
    release_speed: 92.5,
    spin_rate: 2200,
    release_pos_x: 2.5,
    release_pos_y: 5.0,
    release_pos_z: 6.0,
    opponent: 'Chicago Cubs',
    innings_pitched: 7.0,
    hits: 5,
    runs: 2,
    earned_runs: 2,
    walks: 3,
    strikeouts: 9,
    home_runs: 1,
    pitches_thrown: 98,
    notes: 'Great performance'
  };

  describe('Constructor', () => {
    it('should create a game with all properties', () => {
      const game = new Game(validGameData);

      expect(game.record_id).toBe(1);
      expect(game.player_id).toBe(100);
      expect(game.game_date).toBe('2024-01-15');
      expect(game.pitch_type).toBe('Fastball');
      expect(game.release_speed).toBe(92.5);
      expect(game.spin_rate).toBe(2200);
      expect(game.release_pos_x).toBe(2.5);
      expect(game.release_pos_y).toBe(5.0);
      expect(game.release_pos_z).toBe(6.0);
      expect(game.opponent).toBe('Chicago Cubs');
      expect(game.innings_pitched).toBe(7.0);
      expect(game.hits).toBe(5);
      expect(game.runs).toBe(2);
      expect(game.earned_runs).toBe(2);
      expect(game.walks).toBe(3);
      expect(game.strikeouts).toBe(9);
      expect(game.home_runs).toBe(1);
      expect(game.pitches_thrown).toBe(98);
      expect(game.notes).toBe('Great performance');
    });

    it('should create a game with minimal required properties', () => {
      const minimalData = {
        player_id: 100,
        game_date: '2024-01-15',
        pitch_type: 'Fastball',
        release_speed: 92.5,
        spin_rate: 2200
      };

      const game = new Game(minimalData);

      expect(game.player_id).toBe(100);
      expect(game.game_date).toBe('2024-01-15');
      expect(game.pitch_type).toBe('Fastball');
      expect(game.release_speed).toBe(92.5);
      expect(game.spin_rate).toBe(2200);
      expect(game.record_id).toBeUndefined();
      expect(game.opponent).toBeUndefined();
    });

    it('should handle undefined values for optional fields', () => {
      const game = new Game({
        player_id: 100,
        game_date: '2024-01-15',
        pitch_type: 'Fastball',
        release_speed: 92.5,
        spin_rate: 2200,
        opponent: undefined,
        notes: undefined
      });

      expect(game.opponent).toBeUndefined();
      expect(game.notes).toBeUndefined();
    });
  });

  describe('isValid', () => {
    it('should validate a complete game record', () => {
      const game = new Game(validGameData);
      expect(game.isValid()).toBe(true);
    });

    it('should validate a minimal game record', () => {
      const game = new Game({
        player_id: 100,
        game_date: '2024-01-15',
        pitch_type: 'Fastball',
        release_speed: 92.5,
        spin_rate: 2200
      });
      expect(game.isValid()).toBe(true);
    });

    it('should fail validation when player_id is missing', () => {
      const game = new Game({
        ...validGameData,
        player_id: undefined
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when player_id is zero', () => {
      const game = new Game({
        ...validGameData,
        player_id: 0
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when player_id is negative', () => {
      const game = new Game({
        ...validGameData,
        player_id: -1
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when game_date is missing', () => {
      const game = new Game({
        ...validGameData,
        game_date: undefined
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when game_date is empty string', () => {
      const game = new Game({
        ...validGameData,
        game_date: ''
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when pitch_type is missing', () => {
      const game = new Game({
        ...validGameData,
        pitch_type: undefined
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when pitch_type is empty string', () => {
      const game = new Game({
        ...validGameData,
        pitch_type: ''
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when release_speed is missing', () => {
      const game = new Game({
        ...validGameData,
        release_speed: undefined
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when release_speed is zero', () => {
      const game = new Game({
        ...validGameData,
        release_speed: 0
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when release_speed is negative', () => {
      const game = new Game({
        ...validGameData,
        release_speed: -10
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when spin_rate is missing', () => {
      const game = new Game({
        ...validGameData,
        spin_rate: undefined
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when spin_rate is zero', () => {
      const game = new Game({
        ...validGameData,
        spin_rate: 0
      });
      expect(game.isValid()).toBe(false);
    });

    it('should fail validation when spin_rate is negative', () => {
      const game = new Game({
        ...validGameData,
        spin_rate: -100
      });
      expect(game.isValid()).toBe(false);
    });

    it('should validate with very high release speed', () => {
      const game = new Game({
        ...validGameData,
        release_speed: 105.0
      });
      expect(game.isValid()).toBe(true);
    });

    it('should validate with very low release speed (but > 0)', () => {
      const game = new Game({
        ...validGameData,
        release_speed: 0.1
      });
      expect(game.isValid()).toBe(true);
    });

    it('should validate with very high spin rate', () => {
      const game = new Game({
        ...validGameData,
        spin_rate: 4000
      });
      expect(game.isValid()).toBe(true);
    });

    it('should validate with very low spin rate (but > 0)', () => {
      const game = new Game({
        ...validGameData,
        spin_rate: 1
      });
      expect(game.isValid()).toBe(true);
    });
  });

  describe('getFormattedDate', () => {
    it('should format date correctly', () => {
      const game = new Game({
        ...validGameData,
        game_date: '2024-01-15'
      });
      const formatted = game.getFormattedDate();
      // Format should be like "Jan 15, 2024"
      expect(formatted).toMatch(/\w{3}\s\d{1,2},\s\d{4}/);
    });

    it('should return empty string when game_date is missing', () => {
      const game = new Game({
        ...validGameData,
        game_date: undefined
      });
      expect(game.getFormattedDate()).toBe('');
    });

    it('should return empty string when game_date is empty', () => {
      const game = new Game({
        ...validGameData,
        game_date: ''
      });
      expect(game.getFormattedDate()).toBe('');
    });

    it('should handle various date formats', () => {
      const testDates = [
        '2024-01-15',
        '2024-12-31',
        '2024-06-01'
      ];

      testDates.forEach(date => {
        const game = new Game({
          ...validGameData,
          game_date: date
        });
        const formatted = game.getFormattedDate();
        expect(formatted).toBeTruthy();
        expect(formatted).toMatch(/\w{3}\s\d{1,2},\s\d{4}/);
      });
    });

    it('should handle Date objects', () => {
      const game = new Game({
        ...validGameData,
        game_date: new Date('2024-01-15')
      });
      const formatted = game.getFormattedDate();
      expect(formatted).toMatch(/\w{3}\s\d{1,2},\s\d{4}/);
    });
  });

  describe('Pitch Types', () => {
    it('should accept various pitch types', () => {
      const pitchTypes = [
        'Fastball',
        'Curveball',
        'Slider',
        'Changeup',
        'Sinker',
        'Cutter',
        'Splitter',
        'Knuckleball'
      ];

      pitchTypes.forEach(type => {
        const game = new Game({
          ...validGameData,
          pitch_type: type
        });
        expect(game.isValid()).toBe(true);
        expect(game.pitch_type).toBe(type);
      });
    });

    it('should handle custom pitch type names', () => {
      const game = new Game({
        ...validGameData,
        pitch_type: 'Custom Pitch'
      });
      expect(game.isValid()).toBe(true);
    });
  });

  describe('Position Values', () => {
    it('should handle positive release positions', () => {
      const game = new Game({
        ...validGameData,
        release_pos_x: 2.5,
        release_pos_y: 5.0,
        release_pos_z: 6.0
      });
      expect(game.release_pos_x).toBe(2.5);
      expect(game.release_pos_y).toBe(5.0);
      expect(game.release_pos_z).toBe(6.0);
    });

    it('should handle negative release positions', () => {
      const game = new Game({
        ...validGameData,
        release_pos_x: -2.5,
        release_pos_y: -5.0,
        release_pos_z: -6.0
      });
      expect(game.release_pos_x).toBe(-2.5);
      expect(game.release_pos_y).toBe(-5.0);
      expect(game.release_pos_z).toBe(-6.0);
    });

    it('should handle zero release positions', () => {
      const game = new Game({
        ...validGameData,
        release_pos_x: 0,
        release_pos_y: 0,
        release_pos_z: 0
      });
      expect(game.release_pos_x).toBe(0);
      expect(game.release_pos_y).toBe(0);
      expect(game.release_pos_z).toBe(0);
    });
  });

  describe('Game Statistics', () => {
    it('should handle zero statistics', () => {
      const game = new Game({
        ...validGameData,
        hits: 0,
        runs: 0,
        earned_runs: 0,
        walks: 0,
        strikeouts: 0,
        home_runs: 0,
        pitches_thrown: 0
      });
      expect(game.hits).toBe(0);
      expect(game.runs).toBe(0);
      expect(game.earned_runs).toBe(0);
      expect(game.walks).toBe(0);
      expect(game.strikeouts).toBe(0);
      expect(game.home_runs).toBe(0);
      expect(game.pitches_thrown).toBe(0);
    });

    it('should handle high statistics', () => {
      const game = new Game({
        ...validGameData,
        hits: 15,
        runs: 10,
        earned_runs: 8,
        walks: 6,
        strikeouts: 20,
        home_runs: 4,
        pitches_thrown: 150
      });
      expect(game.strikeouts).toBe(20);
      expect(game.pitches_thrown).toBe(150);
    });

    it('should handle fractional innings pitched', () => {
      const testInnings = [6.1, 7.2, 5.0, 8.1];
      testInnings.forEach(innings => {
        const game = new Game({
          ...validGameData,
          innings_pitched: innings
        });
        expect(game.innings_pitched).toBe(innings);
      });
    });
  });

  describe('Notes Field', () => {
    it('should handle long notes', () => {
      const longNote = 'A'.repeat(1000);
      const game = new Game({
        ...validGameData,
        notes: longNote
      });
      expect(game.notes).toBe(longNote);
      expect(game.notes.length).toBe(1000);
    });

    it('should handle empty notes', () => {
      const game = new Game({
        ...validGameData,
        notes: ''
      });
      expect(game.notes).toBe('');
    });

    it('should handle null notes', () => {
      const game = new Game({
        ...validGameData,
        notes: null
      });
      expect(game.notes).toBeNull();
    });

    it('should handle notes with special characters', () => {
      const specialNote = 'Great game! Strike out @ 92mph, ERA: 2.50';
      const game = new Game({
        ...validGameData,
        notes: specialNote
      });
      expect(game.notes).toBe(specialNote);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty object', () => {
      const game = new Game({});
      expect(game.isValid()).toBe(false);
    });

    it('should handle decimal values for integer stats', () => {
      const game = new Game({
        ...validGameData,
        hits: 5.5,
        runs: 2.2
      });
      expect(game.hits).toBe(5.5);
      expect(game.runs).toBe(2.2);
    });

    it('should handle string numbers', () => {
      const game = new Game({
        ...validGameData,
        player_id: '100',
        release_speed: '92.5',
        spin_rate: '2200'
      });
      // The entity doesn't do type coercion, so this tests what happens
      expect(game.player_id).toBe('100');
    });

    it('should handle very long opponent name', () => {
      const longName = 'A'.repeat(500);
      const game = new Game({
        ...validGameData,
        opponent: longName
      });
      expect(game.opponent).toBe(longName);
    });

    it('should handle future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      const game = new Game({
        ...validGameData,
        game_date: futureDate.toISOString().split('T')[0]
      });
      expect(game.isValid()).toBe(true);
    });

    it('should handle very old dates', () => {
      const game = new Game({
        ...validGameData,
        game_date: '1950-01-01'
      });
      expect(game.isValid()).toBe(true);
    });
  });
});
