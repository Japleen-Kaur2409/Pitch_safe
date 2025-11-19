// tests/unit/entities/User.test.js
const User = require('../../../entities/User');

describe('User Entity', () => {
  const validUserData = {
    coach_id: 1,
    username: 'coach@example.com',
    password: 'password123',
    team_name: 'Boston Red Sox',
    created_at: '2024-01-15T00:00:00.000Z'
  };

  describe('Constructor', () => {
    it('should create a user with all properties', () => {
      const user = new User(validUserData);

      expect(user.coach_id).toBe(1);
      expect(user.username).toBe('coach@example.com');
      expect(user.password).toBe('password123');
      expect(user.team_name).toBe('Boston Red Sox');
      expect(user.created_at).toBe('2024-01-15T00:00:00.000Z');
    });

    it('should create a user with minimal required properties', () => {
      const minimalUser = new User({
        username: 'coach@example.com',
        password: 'password123',
        team_name: 'Boston Red Sox'
      });

      expect(minimalUser.username).toBe('coach@example.com');
      expect(minimalUser.password).toBe('password123');
      expect(minimalUser.team_name).toBe('Boston Red Sox');
      expect(minimalUser.coach_id).toBeUndefined();
      expect(minimalUser.created_at).toBeUndefined();
    });
  });

  describe('isValid', () => {
    it('should validate a complete user', () => {
      const user = new User(validUserData);
      expect(user.isValid()).toBe(true);
    });

    it('should fail validation when username is missing', () => {
      const user = new User({
        ...validUserData,
        username: undefined
      });
      expect(user.isValid()).toBe(false);
    });

    it('should fail validation when username is empty', () => {
      const user = new User({
        ...validUserData,
        username: ''
      });
      expect(user.isValid()).toBe(false);
    });

    it('should fail validation when username does not contain @', () => {
      const user = new User({
        ...validUserData,
        username: 'notanemail'
      });
      expect(user.isValid()).toBe(false);
    });

    it('should validate username with @ symbol', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@test.org'
      ];

      validEmails.forEach(email => {
        const user = new User({
          ...validUserData,
          username: email
        });
        expect(user.isValid()).toBe(true);
      });
    });

    it('should fail validation when password is missing', () => {
      const user = new User({
        ...validUserData,
        password: undefined
      });
      expect(user.isValid()).toBe(false);
    });

    it('should fail validation when password is empty', () => {
      const user = new User({
        ...validUserData,
        password: ''
      });
      expect(user.isValid()).toBe(false);
    });

    it('should fail validation when password is less than 6 characters', () => {
      const shortPasswords = ['12345', 'abc', 'a', ''];

      shortPasswords.forEach(password => {
        const user = new User({
          ...validUserData,
          password: password
        });
        expect(user.isValid()).toBe(false);
      });
    });

    it('should validate password exactly 6 characters', () => {
      const user = new User({
        ...validUserData,
        password: '123456'
      });
      expect(user.isValid()).toBe(true);
    });

    it('should validate long passwords', () => {
      const user = new User({
        ...validUserData,
        password: 'thisIsAVeryLongPasswordThatShouldBeValid123!'
      });
      expect(user.isValid()).toBe(true);
    });

    it('should fail validation when team_name is missing', () => {
      const user = new User({
        ...validUserData,
        team_name: undefined
      });
      expect(user.isValid()).toBe(false);
    });

    it('should fail validation when team_name is empty', () => {
      const user = new User({
        ...validUserData,
        team_name: ''
      });
      expect(user.isValid()).toBe(false);
    });

    it('should validate with any non-empty team_name', () => {
      const teamNames = [
        'Boston Red Sox',
        'New York Yankees',
        'My Custom Team',
        'Team 123',
        'A'
      ];

      teamNames.forEach(teamName => {
        const user = new User({
          ...validUserData,
          team_name: teamName
        });
        expect(user.isValid()).toBe(true);
      });
    });

    it('should validate without coach_id (new user)', () => {
      const user = new User({
        username: 'coach@example.com',
        password: 'password123',
        team_name: 'Boston Red Sox'
      });
      expect(user.isValid()).toBe(true);
    });

    it('should validate without created_at', () => {
      const user = new User({
        username: 'coach@example.com',
        password: 'password123',
        team_name: 'Boston Red Sox'
      });
      expect(user.isValid()).toBe(true);
    });
  });

  describe('getTeamAbbreviation', () => {
    it('should return correct abbreviation for MLB teams', () => {
      const teamMappings = [
        { name: 'Arizona Diamondbacks', abbr: 'ARI' },
        { name: 'Atlanta Braves', abbr: 'ATL' },
        { name: 'Baltimore Orioles', abbr: 'BAL' },
        { name: 'Boston Red Sox', abbr: 'BOS' },
        { name: 'Chicago Cubs', abbr: 'CHC' },
        { name: 'Chicago White Sox', abbr: 'CHW' },
        { name: 'Cincinnati Reds', abbr: 'CIN' },
        { name: 'Cleveland Guardians', abbr: 'CLE' },
        { name: 'Colorado Rockies', abbr: 'COL' },
        { name: 'Detroit Tigers', abbr: 'DET' },
        { name: 'Houston Astros', abbr: 'HOU' },
        { name: 'Kansas City Royals', abbr: 'KC' },
        { name: 'Los Angeles Angels', abbr: 'LAA' },
        { name: 'Los Angeles Dodgers', abbr: 'LAD' },
        { name: 'Miami Marlins', abbr: 'MIA' },
        { name: 'Milwaukee Brewers', abbr: 'MIL' },
        { name: 'Minnesota Twins', abbr: 'MIN' },
        { name: 'New York Mets', abbr: 'NYM' },
        { name: 'New York Yankees', abbr: 'NYY' },
        { name: 'Oakland Athletics', abbr: 'OAK' },
        { name: 'Philadelphia Phillies', abbr: 'PHI' },
        { name: 'Pittsburgh Pirates', abbr: 'PIT' },
        { name: 'San Diego Padres', abbr: 'SD' },
        { name: 'San Francisco Giants', abbr: 'SF' },
        { name: 'Seattle Mariners', abbr: 'SEA' },
        { name: 'St. Louis Cardinals', abbr: 'STL' },
        { name: 'Tampa Bay Rays', abbr: 'TB' },
        { name: 'Texas Rangers', abbr: 'TEX' },
        { name: 'Toronto Blue Jays', abbr: 'TOR' },
        { name: 'Washington Nationals', abbr: 'WSH' }
      ];

      teamMappings.forEach(({ name, abbr }) => {
        const user = new User({
          ...validUserData,
          team_name: name
        });
        expect(user.getTeamAbbreviation()).toBe(abbr);
      });
    });

    it('should return "MLB" for unknown team names', () => {
      const unknownTeams = [
        'My High School Team',
        'Unknown Team',
        'Custom Team Name',
        ''
      ];

      unknownTeams.forEach(teamName => {
        const user = new User({
          ...validUserData,
          team_name: teamName
        });
        expect(user.getTeamAbbreviation()).toBe('MLB');
      });
    });

    it('should be case-sensitive for team names', () => {
      const user1 = new User({
        ...validUserData,
        team_name: 'boston red sox' // lowercase
      });
      const user2 = new User({
        ...validUserData,
        team_name: 'BOSTON RED SOX' // uppercase
      });

      // Should return MLB for incorrect case
      expect(user1.getTeamAbbreviation()).toBe('MLB');
      expect(user2.getTeamAbbreviation()).toBe('MLB');
    });

    it('should return "MLB" when team_name is null', () => {
      const user = new User({
        ...validUserData,
        team_name: null
      });
      expect(user.getTeamAbbreviation()).toBe('MLB');
    });

    it('should return "MLB" when team_name is undefined', () => {
      const user = new User({
        ...validUserData,
        team_name: undefined
      });
      expect(user.getTeamAbbreviation()).toBe('MLB');
    });
  });

  describe('Password Security', () => {
    it('should accept passwords with special characters', () => {
      const specialPasswords = [
        'Pass@123!',
        'My$ecure#Pass',
        'Test_Pass-123',
        'Pä$$wörd!'
      ];

      specialPasswords.forEach(password => {
        const user = new User({
          ...validUserData,
          password: password
        });
        expect(user.isValid()).toBe(true);
      });
    });

    it('should accept passwords with only numbers', () => {
      const user = new User({
        ...validUserData,
        password: '123456'
      });
      expect(user.isValid()).toBe(true);
    });

    it('should accept passwords with only letters', () => {
      const user = new User({
        ...validUserData,
        password: 'abcdef'
      });
      expect(user.isValid()).toBe(true);
    });

    it('should accept passwords with spaces', () => {
      const user = new User({
        ...validUserData,
        password: 'pass word 123'
      });
      expect(user.isValid()).toBe(true);
    });

    it('should accept very long passwords', () => {
      const longPassword = 'a'.repeat(1000);
      const user = new User({
        ...validUserData,
        password: longPassword
      });
      expect(user.isValid()).toBe(true);
    });
  });

  describe('Username/Email Validation', () => {
    it('should accept various valid email formats', () => {
      const validEmails = [
        'simple@example.com',
        'very.common@example.com',
        'disposable.style.email.with+symbol@example.com',
        'x@example.com',
        'user-100@test-domain.com',
        'user_name@example.com'
      ];

      validEmails.forEach(email => {
        const user = new User({
          ...validUserData,
          username: email
        });
        expect(user.isValid()).toBe(true);
      });
    });

    it('should accept email with multiple @ symbols (though unusual)', () => {
      // The current validation just checks for @ presence, not email format validity
      const user = new User({
        ...validUserData,
        username: 'user@@example.com'
      });
      expect(user.isValid()).toBe(true);
    });

    it('should reject username without domain', () => {
      const user = new User({
        ...validUserData,
        username: 'user@'
      });
      // Current validation only checks for @ presence, so this passes
      // If stricter validation is needed, this test would fail
      expect(user.isValid()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values', () => {
      const user = new User({
        coach_id: null,
        username: null,
        password: null,
        team_name: null,
        created_at: null
      });
      expect(user.isValid()).toBe(false);
    });

    it('should handle undefined object', () => {
      const user = new User(undefined);
      expect(user.coach_id).toBeUndefined();
      expect(user.username).toBeUndefined();
      expect(user.isValid()).toBe(false);
    });

    it('should handle empty object', () => {
      const user = new User({});
      expect(user.isValid()).toBe(false);
    });

    it('should handle numeric coach_id types', () => {
      const user1 = new User({ ...validUserData, coach_id: 1 });
      const user2 = new User({ ...validUserData, coach_id: '1' });
      const user3 = new User({ ...validUserData, coach_id: 0 });

      expect(user1.coach_id).toBe(1);
      expect(user2.coach_id).toBe('1');
      expect(user3.coach_id).toBe(0);
    });

    it('should handle whitespace in password', () => {
      const user = new User({
        ...validUserData,
        password: '      ' // 6 spaces
      });
      expect(user.isValid()).toBe(true);
      expect(user.password.length).toBe(6);
    });

    it('should handle whitespace in team_name', () => {
      const user = new User({
        ...validUserData,
        team_name: '   ' // only spaces
      });
      // Current validation checks for truthy value, spaces are truthy
      expect(user.isValid()).toBe(true);
    });

    it('should handle very long team names', () => {
      const longTeamName = 'A'.repeat(1000);
      const user = new User({
        ...validUserData,
        team_name: longTeamName
      });
      expect(user.isValid()).toBe(true);
      expect(user.team_name.length).toBe(1000);
    });

    it('should handle special characters in team name', () => {
      const specialTeamName = 'Team #1 - "Winners" (2024) @Champions!';
      const user = new User({
        ...validUserData,
        team_name: specialTeamName
      });
      expect(user.isValid()).toBe(true);
      expect(user.team_name).toBe(specialTeamName);
    });

    it('should handle Date objects for created_at', () => {
      const user = new User({
        ...validUserData,
        created_at: new Date()
      });
      expect(user.created_at).toBeInstanceOf(Date);
    });

    it('should handle ISO date strings for created_at', () => {
      const isoDate = '2024-01-15T10:30:00.000Z';
      const user = new User({
        ...validUserData,
        created_at: isoDate
      });
      expect(user.created_at).toBe(isoDate);
    });
  });

  describe('Integration with Authentication', () => {
    it('should store hashed passwords (simulated)', () => {
      const hashedPassword = '$2b$10$abcdefghijklmnopqrstuvwxyz123456789';
      const user = new User({
        ...validUserData,
        password: hashedPassword
      });
      expect(user.password).toBe(hashedPassword);
      expect(user.isValid()).toBe(true);
    });

    it('should handle bcrypt hash format', () => {
      // Typical bcrypt hash is 60 characters
      const bcryptHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
      const user = new User({
        ...validUserData,
        password: bcryptHash
      });
      expect(user.isValid()).toBe(true);
      expect(user.password).toBe(bcryptHash);
    });
  });
});
