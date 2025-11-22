// frontend/src/frameworks-drivers/data/playerData.js
export const PLAYER_PERSONAL_INFO = {
 
 //luis gil
    81: {
    player_id: 81,
    date_of_birth: '1998-06-03',
    bats: 'R',
    throws: 'R',
    height: '6\'2"',
    weight: 185,
    age: '27 Years',
  },
  
  //marcus stroman
  0: {
    player_id: 0,
    date_of_birth: '1991-05-01',
    bats: 'R',
    throws: 'R',
    height: '5\'7"',
    weight: 180,
    age: '27 Years',
  },
  
  //max fried
  54: {
    player_id: 54,
    date_of_birth: '1994-01-18',
    bats: 'L',
    throws: 'L',
    height: '6\'4"',
    weight: 190,
    age: "31 Years",
  },
  
  //clarke schmidt
  36: {
    player_id: 36,
    date_of_birth: '1996-02-20',
    bats: 'R',
    throws: 'R',
    height: '6\'1"',
    weight: 200,
    age: "29 Years",
  },
  
  //ryan yarbrough
  33: {
    player_id: 33,
    date_of_birth: '1991-12-31',
    bats: 'R',
    throws: 'L',
    height: '6\'5"',
    weight: 215,
    age: "33 Years",
  },

  //carlos carrasco
    59: {
    player_id: 59,
    date_of_birth: '1987-03-21',
    bats: 'R',
    throws: 'R',
    height: '6\'4"',
    weight: 224,
    age: "38 Years",
  },

//will warren
    98: {
    player_id: 98,
    date_of_birth: '1999-06-16',
    bats: 'R',
    throws: 'R',
    height: '6\'2"',
    weight: 200,
    age: "26 Years",
  },

  //allan winans
    62: {
    player_id: 62,
    date_of_birth: '1995-08-10',
    bats: 'R',
    throws: 'R',
    height: '6\'2"',
    weight: 180,
    age: "30 Years",
  },

  //ian hamilton
    71: {
    player_id: 71,
    date_of_birth: '1995-06-16',
    bats: 'R',
    throws: 'R',
    height: '6\'1"',
    weight: 200,
    age: "30 Years",
  },
  
  //cam schlittler
    31: {
    player_id: 31,
    date_of_birth: '2001-02-05',
    bats: 'R',
    throws: 'R',
    height: '6\'5"',
    weight: 225,
    age: "24 Years",
  },

    //carlos rodon
    55: {
    player_id: 55,
    date_of_birth: '1992-12-10',
    bats: 'L',
    throws: 'L',
    height: '6\'2"',
    weight: 255,
    age: "32 Years",
  },
  // ADD MORE PLAYERS HERE:
  // Copy the template below and fill in your data
  /*
  6: {
    player_id: 6,
    date_of_birth: 'YYYY-MM-DD',
    bats: 'R', // R, L, or S (switch)
    throws: 'R', // R or L
    height: '6\'0"',
    weight: 185,
    level: 'College',
    how_acquired: 'Drafted',
    signing_bonus: 50000,
    school: 'School Name'
  },
  */
};

// Helper function to get player info by ID
export const getPlayerInfo = (playerId) => {
  return PLAYER_PERSONAL_INFO[playerId] || null;
};

// Helper function to check if player has info
export const hasPlayerInfo = (playerId) => {
  return playerId in PLAYER_PERSONAL_INFO;
};

export default PLAYER_PERSONAL_INFO;