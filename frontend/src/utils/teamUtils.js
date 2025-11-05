// frontend/src/utils/teamUtils.js
export const getTeamAbbreviation = (teamName) => {
  const teamMap = {
    'Arizona Diamondbacks': 'ari',
    'Atlanta Braves': 'atl',
    'Baltimore Orioles': 'bal',
    'Boston Red Sox': 'bos',
    'Chicago Cubs': 'chc',
    'Chicago White Sox': 'chw',
    'Cincinnati Reds': 'cin',
    'Cleveland Guardians': 'cle',
    'Colorado Rockies': 'col',
    'Detroit Tigers': 'det',
    'Houston Astros': 'hou',
    'Kansas City Royals': 'kc',
    'Los Angeles Angels': 'laa',
    'Los Angeles Dodgers': 'lad',
    'Miami Marlins': 'mia',
    'Milwaukee Brewers': 'mil',
    'Minnesota Twins': 'min',
    'New York Mets': 'nym',
    'New York Yankees': 'nyy',
    'Oakland Athletics': 'oak',
    'Philadelphia Phillies': 'phi',
    'Pittsburgh Pirates': 'pit',
    'San Diego Padres': 'sd',
    'San Francisco Giants': 'sf',
    'Seattle Mariners': 'sea',
    'St. Louis Cardinals': 'stl',
    'Tampa Bay Rays': 'tb',
    'Texas Rangers': 'tex',
    'Toronto Blue Jays': 'tor',
    'Washington Nationals': 'wsh'
  };
  return teamMap[teamName] || 'mlb';
};

export const getTeamLogo = (teamName) => {
  const abbrev = getTeamAbbreviation(teamName);
  return `https://a.espncdn.com/i/teamlogos/mlb/500/${abbrev}.png`;
};