// backend/entities/User.js
class User {
  constructor({ coach_id, username, password, team_name, created_at } = {}) {
    this.coach_id = coach_id;
    this.username = username;
    this.password = password;
    this.team_name = team_name;
    this.created_at = created_at;
  }

  isValid() {
    if (!this.username || !this.username.includes('@')) return false;
    if (!this.password || this.password.length < 6) return false;
    if (!this.team_name) return false;
    return true;
  }

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
    return teamMap[this.team_name] || 'MLB';
  }
}

module.exports = User;