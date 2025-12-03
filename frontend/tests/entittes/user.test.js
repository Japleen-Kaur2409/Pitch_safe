// tests/entities/User.test.js
import User from '../../src/entities/User';

describe('User Entity', () => {
  describe('constructor', () => {
    it('should create a user with all properties', () => {
      const userData = {
        user_id: 123,
        email: 'coach@bluejays.com',
        teamName: 'Toronto Blue Jays',
        created_at: new Date('2024-01-01')
      };

      const user = new User(userData);

      expect(user.user_id).toBe(123);
      expect(user.email).toBe('coach@bluejays.com');
      expect(user.teamName).toBe('Toronto Blue Jays');
      expect(user.created_at).toEqual(new Date('2024-01-01'));
    });

    it('should create a user with minimal properties', () => {
      const userData = {
        user_id: 1,
        email: 'test@test.com'
      };

      const user = new User(userData);

      expect(user.user_id).toBe(1);
      expect(user.email).toBe('test@test.com');
      expect(user.teamName).toBeUndefined();
      expect(user.created_at).toBeUndefined();
    });
  });

  describe('isValid', () => {
    it('should return truthy when user has email and teamName', () => {
      const user = new User({
        user_id: 1,
        email: 'coach@mlb.com',
        teamName: 'Boston Red Sox'
      });

      expect(user.isValid()).toBeTruthy();
    });

    it('should return falsy when email is missing', () => {
      const user = new User({
        user_id: 1,
        teamName: 'Boston Red Sox'
      });

      expect(user.isValid()).toBeFalsy();
    });

    it('should return falsy when teamName is missing', () => {
      const user = new User({
        user_id: 1,
        email: 'coach@mlb.com'
      });

      expect(user.isValid()).toBeFalsy();
    });

    it('should return falsy when both email and teamName are missing', () => {
      const user = new User({
        user_id: 1
      });

      expect(user.isValid()).toBeFalsy();
    });

    it('should return falsy when email is empty string', () => {
      const user = new User({
        user_id: 1,
        email: '',
        teamName: 'Boston Red Sox'
      });

      expect(user.isValid()).toBeFalsy();
    });

    it('should return falsy when teamName is empty string', () => {
      const user = new User({
        user_id: 1,
        email: 'coach@mlb.com',
        teamName: ''
      });

      expect(user.isValid()).toBeFalsy();
    });

    it('should return the result of email && teamName evaluation', () => {
      const validUser = new User({
        user_id: 1,
        email: 'coach@mlb.com',
        teamName: 'Boston Red Sox'
      });
      
      // The method returns email && teamName, which is truthy
      const result = validUser.isValid();
      expect(result).toBeTruthy();
      expect(Boolean(result)).toBe(true);
    });
  });

  describe('getTeamAbbreviation', () => {
    it('should return correct abbreviation for Arizona Diamondbacks', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Arizona Diamondbacks' });
      expect(user.getTeamAbbreviation()).toBe('ARI');
    });

    it('should return correct abbreviation for Atlanta Braves', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Atlanta Braves' });
      expect(user.getTeamAbbreviation()).toBe('ATL');
    });

    it('should return correct abbreviation for Baltimore Orioles', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Baltimore Orioles' });
      expect(user.getTeamAbbreviation()).toBe('BAL');
    });

    it('should return correct abbreviation for Boston Red Sox', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Boston Red Sox' });
      expect(user.getTeamAbbreviation()).toBe('BOS');
    });

    it('should return correct abbreviation for Chicago Cubs', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Chicago Cubs' });
      expect(user.getTeamAbbreviation()).toBe('CHC');
    });

    it('should return correct abbreviation for Chicago White Sox', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Chicago White Sox' });
      expect(user.getTeamAbbreviation()).toBe('CHW');
    });

    it('should return correct abbreviation for Cincinnati Reds', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Cincinnati Reds' });
      expect(user.getTeamAbbreviation()).toBe('CIN');
    });

    it('should return correct abbreviation for Cleveland Guardians', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Cleveland Guardians' });
      expect(user.getTeamAbbreviation()).toBe('CLE');
    });

    it('should return correct abbreviation for Colorado Rockies', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Colorado Rockies' });
      expect(user.getTeamAbbreviation()).toBe('COL');
    });

    it('should return correct abbreviation for Detroit Tigers', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Detroit Tigers' });
      expect(user.getTeamAbbreviation()).toBe('DET');
    });

    it('should return correct abbreviation for Houston Astros', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Houston Astros' });
      expect(user.getTeamAbbreviation()).toBe('HOU');
    });

    it('should return correct abbreviation for Kansas City Royals', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Kansas City Royals' });
      expect(user.getTeamAbbreviation()).toBe('KC');
    });

    it('should return correct abbreviation for Los Angeles Angels', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Los Angeles Angels' });
      expect(user.getTeamAbbreviation()).toBe('LAA');
    });

    it('should return correct abbreviation for Los Angeles Dodgers', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Los Angeles Dodgers' });
      expect(user.getTeamAbbreviation()).toBe('LAD');
    });

    it('should return correct abbreviation for Miami Marlins', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Miami Marlins' });
      expect(user.getTeamAbbreviation()).toBe('MIA');
    });

    it('should return correct abbreviation for Milwaukee Brewers', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Milwaukee Brewers' });
      expect(user.getTeamAbbreviation()).toBe('MIL');
    });

    it('should return correct abbreviation for Minnesota Twins', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Minnesota Twins' });
      expect(user.getTeamAbbreviation()).toBe('MIN');
    });

    it('should return correct abbreviation for New York Mets', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'New York Mets' });
      expect(user.getTeamAbbreviation()).toBe('NYM');
    });

    it('should return correct abbreviation for New York Yankees', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'New York Yankees' });
      expect(user.getTeamAbbreviation()).toBe('NYY');
    });

    it('should return correct abbreviation for Oakland Athletics', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Oakland Athletics' });
      expect(user.getTeamAbbreviation()).toBe('OAK');
    });

    it('should return correct abbreviation for Philadelphia Phillies', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Philadelphia Phillies' });
      expect(user.getTeamAbbreviation()).toBe('PHI');
    });

    it('should return correct abbreviation for Pittsburgh Pirates', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Pittsburgh Pirates' });
      expect(user.getTeamAbbreviation()).toBe('PIT');
    });

    it('should return correct abbreviation for San Diego Padres', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'San Diego Padres' });
      expect(user.getTeamAbbreviation()).toBe('SD');
    });

    it('should return correct abbreviation for San Francisco Giants', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'San Francisco Giants' });
      expect(user.getTeamAbbreviation()).toBe('SF');
    });

    it('should return correct abbreviation for Seattle Mariners', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Seattle Mariners' });
      expect(user.getTeamAbbreviation()).toBe('SEA');
    });

    it('should return correct abbreviation for St. Louis Cardinals', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'St. Louis Cardinals' });
      expect(user.getTeamAbbreviation()).toBe('STL');
    });

    it('should return correct abbreviation for Tampa Bay Rays', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Tampa Bay Rays' });
      expect(user.getTeamAbbreviation()).toBe('TB');
    });

    it('should return correct abbreviation for Texas Rangers', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Texas Rangers' });
      expect(user.getTeamAbbreviation()).toBe('TEX');
    });

    it('should return correct abbreviation for Toronto Blue Jays', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Toronto Blue Jays' });
      expect(user.getTeamAbbreviation()).toBe('TOR');
    });

    it('should return correct abbreviation for Washington Nationals', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Washington Nationals' });
      expect(user.getTeamAbbreviation()).toBe('WSH');
    });

    it('should return MLB for unknown team name', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: 'Unknown Team' });
      expect(user.getTeamAbbreviation()).toBe('MLB');
    });

    it('should return MLB for null team name', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: null });
      expect(user.getTeamAbbreviation()).toBe('MLB');
    });

    it('should return MLB for undefined team name', () => {
      const user = new User({ user_id: 1, email: 'test@test.com' });
      expect(user.getTeamAbbreviation()).toBe('MLB');
    });

    it('should return MLB for empty string team name', () => {
      const user = new User({ user_id: 1, email: 'test@test.com', teamName: '' });
      expect(user.getTeamAbbreviation()).toBe('MLB');
    });
  });
});
