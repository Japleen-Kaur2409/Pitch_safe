// frontend/src/entities/User.js
/**
 * User Entity
 * 
 * Represents a coach/user in the system with their team association.
 * Contains business rules for user validation and team information.
 * 
 * @class User
 */
class User {
  /**
   * Creates a new User instance
   * 
   * @param {Object} params - User parameters
   * @param {number} params.user_id - Unique user identifier
   * @param {string} params.email - User's email address
   * @param {string} params.teamName - Associated MLB team name
   * @param {Date} params.created_at - Account creation timestamp
   */
  constructor({ user_id, email, teamName, created_at }) {
    this.user_id = user_id;
    this.email = email;
    this.teamName = teamName;
    this.created_at = created_at;
  }

  /**
   * Validates user data meets business requirements
   * 
   * @returns {boolean} True if user has valid email and team name
   */
  isValid() {
    return this.email && this.teamName;
  }

/**
   * Gets the three-letter abbreviation for the user's team
   * 
   * @returns {string} Team abbreviation (e.g., 'TOR' for Toronto Blue Jays)
   */
  getTeamAbbreviation() {
    const teamMap = {
      'Arizona Diamondbacks': 'ARI',
      'Atlanta Braves': 'ATL',
      'Baltimore Orioles': 'BAL',
      'Boston Red Sox': 'BOS',
      'Chicago Cubs': 'CHC',
      'Chicago White Sox': 'CHW',
      'Cincinnati Reds': 'CIN',
      'Cleveland Guardians': 'CLE',
      'Colorado Rockies': 'COL',
      'Detroit Tigers': 'DET',
      'Houston Astros': 'HOU',
      'Kansas City Royals': 'KC',
      'Los Angeles Angels': 'LAA',
      'Los Angeles Dodgers': 'LAD',
      'Miami Marlins': 'MIA',
      'Milwaukee Brewers': 'MIL',
      'Minnesota Twins': 'MIN',
      'New York Mets': 'NYM',
      'New York Yankees': 'NYY',
      'Oakland Athletics': 'OAK',
      'Philadelphia Phillies': 'PHI',
      'Pittsburgh Pirates': 'PIT',
      'San Diego Padres': 'SD',
      'San Francisco Giants': 'SF',
      'Seattle Mariners': 'SEA',
      'St. Louis Cardinals': 'STL',
      'Tampa Bay Rays': 'TB',
      'Texas Rangers': 'TEX',
      'Toronto Blue Jays': 'TOR',
      'Washington Nationals': 'WSH'
    };
    return teamMap[this.teamName] || 'MLB';
  }
}

export default User;