// tests/unit/entities/Player.test.js
const Player = require('../../../entities/Player');

describe('Player Entity', () => {
  describe('Constructor', () => {
    it('should create a player with all properties', () => {
      const player = new Player(
        1,
        'John',
        'Doe',
        '2000-01-01',
        'High School',
        'Lincoln High',
        'R',
        'R',
        "6'2\"",
        185
      );

      expect(player.playerId).toBe(1);
      expect(player.firstName).toBe('John');
      expect(player.lastName).toBe('Doe');
      expect(player.dateOfBirth).toBe('2000-01-01');
      expect(player.level).toBe('High School');
      expect(player.school).toBe('Lincoln High');
      expect(player.bats).toBe('R');
      expect(player.throws).toBe('R');
      expect(player.height).toBe("6'2\"");
      expect(player.weight).toBe(185);
    });

    it('should initialize validationErrors as empty array', () => {
      const player = new Player(1, 'John', 'Doe');
      expect(player.validationErrors).toEqual([]);
    });
  });

  describe('isValid', () => {
    it('should validate a complete player', () => {
      const player = new Player(
        1,
        'John',
        'Doe',
        '2000-01-01',
        'High School',
        'Lincoln High',
        'R',
        'R',
        "6'2\"",
        185
      );

      expect(player.isValid()).toBe(true);
      expect(player.validationErrors).toHaveLength(0);
    });

    it('should fail validation when firstName is missing', () => {
      const player = new Player(1, '', 'Doe');
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors).toContain('First name is required');
    });

    it('should fail validation when firstName is only whitespace', () => {
      const player = new Player(1, '   ', 'Doe');
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors).toContain('First name is required');
    });

    it('should fail validation when lastName is missing', () => {
      const player = new Player(1, 'John', '');
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors).toContain('Last name is required');
    });

    it('should fail validation when lastName is only whitespace', () => {
      const player = new Player(1, 'John', '   ');
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors).toContain('Last name is required');
    });

    it('should fail validation with invalid bats value', () => {
      const player = new Player(1, 'John', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'X');
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors).toContain("Bats must be 'R', 'L', or 'S'");
    });

    it('should validate with valid bats values', () => {
      const playerR = new Player(1, 'John', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'R');
      const playerL = new Player(2, 'Jane', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'L');
      const playerS = new Player(3, 'Jack', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'S');

      expect(playerR.isValid()).toBe(true);
      expect(playerL.isValid()).toBe(true);
      expect(playerS.isValid()).toBe(true);
    });

    it('should fail validation with invalid throws value', () => {
      const player = new Player(1, 'John', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'R', 'X');
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors).toContain("Throws must be 'R' or 'L'");
    });

    it('should validate with valid throws values', () => {
      const playerR = new Player(1, 'John', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'R', 'R');
      const playerL = new Player(2, 'Jane', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'R', 'L');

      expect(playerR.isValid()).toBe(true);
      expect(playerL.isValid()).toBe(true);
    });

    it('should fail validation when age is less than 10', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 9);
      
      const player = new Player(1, 'John', 'Doe', birthDate.toISOString().split('T')[0]);
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors).toContain('Player age must be between 10 and 60');
    });

    it('should fail validation when age is greater than 60', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 61);
      
      const player = new Player(1, 'John', 'Doe', birthDate.toISOString().split('T')[0]);
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors).toContain('Player age must be between 10 and 60');
    });

    it('should validate player at minimum age boundary (10)', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 10);
      
      const player = new Player(1, 'John', 'Doe', birthDate.toISOString().split('T')[0]);
      expect(player.isValid()).toBe(true);
    });

    it('should validate player at maximum age boundary (60)', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 60);
      
      const player = new Player(1, 'John', 'Doe', birthDate.toISOString().split('T')[0]);
      expect(player.isValid()).toBe(true);
    });

    it('should fail validation when weight is less than 100', () => {
      const player = new Player(1, 'John', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'R', 'R', "6'2\"", 99);
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors).toContain('Weight must be between 100 and 350 lbs');
    });

    it('should fail validation when weight is greater than 350', () => {
      const player = new Player(1, 'John', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'R', 'R', "6'2\"", 351);
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors).toContain('Weight must be between 100 and 350 lbs');
    });

    it('should validate weight at boundaries', () => {
      const player100 = new Player(1, 'John', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'R', 'R', "6'2\"", 100);
      const player350 = new Player(2, 'Jane', 'Doe', '2000-01-01', 'HS', 'Lincoln', 'R', 'R', "6'2\"", 350);

      expect(player100.isValid()).toBe(true);
      expect(player350.isValid()).toBe(true);
    });

    it('should accumulate multiple validation errors', () => {
      const player = new Player(1, '', '', '2000-01-01', 'HS', 'Lincoln', 'X', 'X', "6'2\"", 99);
      expect(player.isValid()).toBe(false);
      expect(player.validationErrors.length).toBeGreaterThan(1);
      expect(player.validationErrors).toContain('First name is required');
      expect(player.validationErrors).toContain('Last name is required');
      expect(player.validationErrors).toContain("Bats must be 'R', 'L', or 'S'");
      expect(player.validationErrors).toContain("Throws must be 'R' or 'L'");
      expect(player.validationErrors).toContain('Weight must be between 100 and 350 lbs');
    });

    it('should allow null/undefined optional fields', () => {
      const player = new Player(1, 'John', 'Doe', null, null, null, null, null, null, null);
      expect(player.isValid()).toBe(true);
    });
  });

  describe('calculateAge', () => {
    it('should return null when dateOfBirth is not set', () => {
      const player = new Player(1, 'John', 'Doe');
      expect(player.calculateAge()).toBeNull();
    });

    it('should calculate correct age', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      
      const player = new Player(1, 'John', 'Doe', birthDate.toISOString().split('T')[0]);
      expect(player.calculateAge()).toBe(25);
    });

    it('should handle birthday not yet occurred this year', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      birthDate.setMonth(birthDate.getMonth() + 1); // Set birthday to next month
      
      const player = new Player(1, 'John', 'Doe', birthDate.toISOString().split('T')[0]);
      expect(player.calculateAge()).toBe(24);
    });

    it('should handle birthday today', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      
      const player = new Player(1, 'John', 'Doe', birthDate.toISOString().split('T')[0]);
      expect(player.calculateAge()).toBe(25);
    });
  });

  describe('getFullName', () => {
    it('should return full name correctly', () => {
      const player = new Player(1, 'John', 'Doe');
      expect(player.getFullName()).toBe('John Doe');
    });

    it('should handle names with spaces', () => {
      const player = new Player(1, 'John Paul', 'Van Doe');
      expect(player.getFullName()).toBe('John Paul Van Doe');
    });
  });

  describe('getValidationErrors', () => {
    it('should return empty array when valid', () => {
      const player = new Player(1, 'John', 'Doe');
      player.isValid();
      expect(player.getValidationErrors()).toEqual([]);
    });

    it('should return validation errors when invalid', () => {
      const player = new Player(1, '', '');
      player.isValid();
      const errors = player.getValidationErrors();
      expect(errors.length).toBeGreaterThan(0);
      expect(Array.isArray(errors)).toBe(true);
    });
  });

  describe('toDataObject', () => {
    it('should convert to database format', () => {
      const player = new Player(
        1,
        'John',
        'Doe',
        '2000-01-01',
        'High School',
        'Lincoln High',
        'R',
        'R',
        "6'2\"",
        185
      );

      const dataObject = player.toDataObject();

      expect(dataObject).toEqual({
        player_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        level: 'High School',
        school: 'Lincoln High',
        bats: 'R',
        throws: 'R',
        height: "6'2\"",
        weight: 185
      });
    });

    it('should handle null values', () => {
      const player = new Player(1, 'John', 'Doe');
      const dataObject = player.toDataObject();

      expect(dataObject.player_id).toBe(1);
      expect(dataObject.first_name).toBe('John');
      expect(dataObject.last_name).toBe('Doe');
      expect(dataObject.date_of_birth).toBeUndefined();
    });
  });

  describe('fromDataObject', () => {
    it('should create player from database object', () => {
      const dataObject = {
        player_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '2000-01-01',
        level: 'High School',
        school: 'Lincoln High',
        bats: 'R',
        throws: 'R',
        height: "6'2\"",
        weight: 185
      };

      const player = Player.fromDataObject(dataObject);

      expect(player).toBeInstanceOf(Player);
      expect(player.playerId).toBe(1);
      expect(player.firstName).toBe('John');
      expect(player.lastName).toBe('Doe');
      expect(player.dateOfBirth).toBe('2000-01-01');
      expect(player.level).toBe('High School');
      expect(player.school).toBe('Lincoln High');
      expect(player.bats).toBe('R');
      expect(player.throws).toBe('R');
      expect(player.height).toBe("6'2\"");
      expect(player.weight).toBe(185);
    });

    it('should handle partial data', () => {
      const dataObject = {
        player_id: 1,
        first_name: 'John',
        last_name: 'Doe'
      };

      const player = Player.fromDataObject(dataObject);

      expect(player.playerId).toBe(1);
      expect(player.firstName).toBe('John');
      expect(player.lastName).toBe('Doe');
      expect(player.dateOfBirth).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings in optional fields', () => {
      const player = new Player(1, 'John', 'Doe', '', '', '', '', '', '', '');
      const isValid = player.isValid();
      // Empty strings in optional fields should be okay
      expect(isValid).toBe(true);
    });

    it('should handle very long names', () => {
      const longName = 'A'.repeat(1000);
      const player = new Player(1, longName, longName);
      expect(player.isValid()).toBe(true);
      expect(player.firstName).toBe(longName);
      expect(player.lastName).toBe(longName);
    });

    it('should handle special characters in names', () => {
      const player = new Player(1, "O'Connor", "José-María");
      expect(player.isValid()).toBe(true);
      expect(player.getFullName()).toBe("O'Connor José-María");
    });
  });
});
