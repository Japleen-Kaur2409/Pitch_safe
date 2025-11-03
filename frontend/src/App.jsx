import { useEffect, useState } from "react";
import GameRecordForm from './components/GameRecordForm';
import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoggedInUI, setShowLoggedInUI] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupTeam, setSignupTeam] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('roster');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [playerMLBIds, setPlayerMLBIds] = useState({});

  // Fetch players
  const fetchPlayers = () => {
    fetch("http://localhost:5001/api/players")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Fetch individual player info
  const fetchPlayerInfo = (playerId) => {
    return fetch(`http://localhost:5001/api/players/${playerId}/info`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Player info not found`);
        }
        return res.json();
      })
      .catch((err) => {
        console.error("Error fetching player info:", err);
        return null;
      });
  };

  // Team abbreviation mapping for logos
  const getTeamAbbreviation = (teamName) => {
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

  const getTeamLogo = (teamName) => {
    const abbrev = getTeamAbbreviation(teamName);
    return `https://a.espncdn.com/i/teamlogos/mlb/500/${abbrev}.png`;
  };

  // Fetch MLB Stats API player ID for plyer images
  const fetchMLBPlayerId = async (firstName, lastName) => {
    try {
      const searchQuery = `${firstName} ${lastName}`;
      console.log('Searching for player:', searchQuery);
      
      // Using MLB Stats API search endpoint
      const response = await fetch(`https://statsapi.mlb.com/api/v1/people/search?names=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      console.log('Search results:', data);
      
      // Look for exact match
      if (data.people && data.people.length > 0) {
        const exactMatch = data.people.find(p => 
          p.fullName.toLowerCase() === searchQuery.toLowerCase() ||
          `${p.firstName} ${p.lastName}`.toLowerCase() === searchQuery.toLowerCase()
        );
        
        const playerId = exactMatch ? exactMatch.id : data.people[0].id;
        console.log('Found player ID:', playerId);
        return playerId;
      }
      
      console.log('No player found');
      return null;
    } catch (error) {
      console.error('Error fetching MLB player ID:', error);
      return null;
    }
  };

const getPlayerImage = (mlbPlayerId) => {
  if (mlbPlayerId) {
    // MLB official headshot URL - simplified version
    return `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${mlbPlayerId}/headshot/67/current`;
  }
  return null;
};

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    if (!loginEmail || !loginPassword) {
      setAuthError("Please enter both email and password");
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error || "Login failed");
        setAuthLoading(false);
        return;
      }

      setCurrentUser(data.user);
      setShowLoggedInUI(true);
      setShowLogin(false);
      setAuthLoading(false);
    } catch (err) {
      console.error("Login error:", err);
      setAuthError(`Network error: ${err.message}`);
      setAuthLoading(false);
    }
  };

  const handleLogOut = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    if (currentUser == null) {
      setAuthError("Cannot log out; you are not signed in");
      setAuthLoading(false);
      return;
    }

    try {
      console.log("Attempting logout");
      setCurrentUser(null);
      setShowLoggedInUI(false);
      setShowLandingPage(true);
      setAuthLoading(false);
    } catch (err) {
      console.error("Logout error:", err);
      setAuthError(`Network error: ${err.message}`);
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    if (!signupEmail || !signupPassword || !signupConfirmPassword || !signupTeam) {
      setAuthError("Please fill in all fields");
      setAuthLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setAuthError("Passwords do not match");
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: signupEmail, 
          password: signupPassword,
          teamName: signupTeam 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error || "Sign up failed");
        setAuthLoading(false);
        return;
      }

      setCurrentUser(data.user);
      setShowLoggedInUI(true);
      setShowSignUp(false);
      setAuthLoading(false);
    } catch (err) {
      console.error("Sign up error:", err);
      setAuthError("Network error. Please try again.");
      setAuthLoading(false);
    }
  };

  const handlePlayerClick = async (player) => {
    setSelectedPlayer(player);
    
    // Fetch MLB Stats API ID if we don't have it yet
    if (!playerMLBIds[player.player_id]) {
      const mlbId = await fetchMLBPlayerId(player.first_name, player.last_name);
      if (mlbId) {
        setPlayerMLBIds(prev => ({...prev, [player.player_id]: mlbId}));
      }
    }
    
    // Fetch detailed player info
    const playerInfo = await fetchPlayerInfo(player.player_id);
    if (playerInfo) {
      setSelectedPlayer({ ...player, ...playerInfo });
    }
    
    setCurrentView('playerDetail');
  };

  const handleAddPlayerSuccess = () => {
    // Refresh the players list
    fetchPlayers();
    setShowAddPlayerForm(false);
    setCurrentView('roster');
  };

  if (showLoggedInUI) {
    return (
      <div style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        background: "linear-gradient(180deg, #a85f6f 0%, #8b6b9e 30%, #6b7cb8 50%, #7b6ca8 70%, #b8697a 100%)",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px",
        paddingTop: "40px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
      }}>
        <div style={{
          position: 'absolute',
          top: '3vh',
          left: '80%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5vw',
          padding: '1vh 1.5vw',
          borderRadius: '1vw',
          maxWidth: '90%',
        }}>
          <span style={{ color: 'white', fontWeight: 600, fontSize: 'clamp(14px, 1.5vw, 18px)', whiteSpace: 'nowrap', }}>{currentUser?.email}</span>
          <button
            onClick={handleLogOut}
            disabled={authLoading}
            className="logged-in-btn"
          >
            Log Out
          </button>
        </div>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          paddingBottom: "100px",
        }}>
          {/* Header */}
          <div style={{
            textAlign: "center",
            marginBottom: "30px",
          }}>
            <img
              src={getTeamLogo(currentUser?.teamName || "Toronto Blue Jays")}
              alt="Team Logo"
              style={{
                width: "100px",
                height: "100px",
                margin: "0 auto 15px",
                borderRadius: "12px",
                objectFit: "contain",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
              onError={(e) => (e.currentTarget.src = "/default-team.png")}
            />
            <div style={{
              color: "white",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}>
              Toronto Blue Jays
            </div>
          </div>

          {/* Player Detail View */}
          {currentView === 'playerDetail' && selectedPlayer && (
            <>
              <button
                onClick={() => {
                  setCurrentView('roster');
                  setSelectedPlayer(null);
                }}
                className="logged-in-btn"
              >
                ← Back to Roster
              </button>

              {/* Player Info Card */}
              <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "20px",
                }}>
                  {/* Player Image Container */}
                  <div style={{ position: "relative" }}>
                    {playerMLBIds[selectedPlayer.player_id] && (
                      <img
                        src={getPlayerImage(playerMLBIds[selectedPlayer.player_id])}
                        alt={`${selectedPlayer.first_name} ${selectedPlayer.last_name}`}
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "10px",
                          objectFit: "cover",
                          backgroundColor: "#e9ecef",
                          display: "block",
                        }}
                        onError={(e) => {
                          console.log('Image failed to load for player:', selectedPlayer.first_name, selectedPlayer.last_name);
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully for:', selectedPlayer.first_name, selectedPlayer.last_name);
                        }}
                      />
                    )}
                    {/* Player avatar placeholder */}
                    <div style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "10px",
                      backgroundColor: "#7b6ca8",
                      display: playerMLBIds[selectedPlayer.player_id] ? "none" : "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px",
                      color: "white",
                      position: playerMLBIds[selectedPlayer.player_id] ? "absolute" : "relative",
                      top: 0,
                      left: 0,
                    }}>
                      👤
                    </div>
                  </div>
                  <div>
                    <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#333", marginBottom: "5px" }}>
                      {selectedPlayer.first_name} {selectedPlayer.last_name}
                    </h2>
                    <p style={{ fontSize: "16px", color: "#666", margin: 0 }}>
                      #{selectedPlayer.player_id} • {selectedPlayer.team_name || "TOR"}
                    </p>
                  </div>
                </div>

                {selectedPlayer.date_of_birth && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    padding: "20px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
                        Date of Birth
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
                        {new Date(selectedPlayer.date_of_birth).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
                        Bats
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
                        {selectedPlayer.bats === 'R' ? 'Right' : 'Left'}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
                        Throws
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
                        {selectedPlayer.throws === 'R' ? 'Right' : 'Left'}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
                        Height
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
                        {selectedPlayer.height}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
                        Weight
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
                        {selectedPlayer.weight} lbs
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
                        Level
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
                        {selectedPlayer.level}
                      </span>
                    </div>
                    {selectedPlayer.school && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
                          School
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
                          {selectedPlayer.school}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Game Record Form */}
              <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}>
                <GameRecordForm 
                  playerId={selectedPlayer.player_id} 
                  onSuccess={() => {
                    console.log('Game record added successfully');
                  }}
                />
              </div>
            </>
          )}

          {/* Roster View with Add Player Button */}
          {currentView === 'roster' && (
            <>
              {/* Add Player Button */}
              <button
                onClick={() => setShowAddPlayerForm(!showAddPlayerForm)}
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.95)",
                  color: "#7b6ca8",
                  border: "none",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "20px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                }}
              >
                <span style={{ fontSize: "20px" }}>➕</span>
                {showAddPlayerForm ? 'Hide Add Player Form' : 'Add New Player'}
              </button>

              {/* Add Player Form */}
              {showAddPlayerForm && (
                <div style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "15px", color: "#333" }}>
                    Add New Player
                  </h3>
                  <GameRecordForm 
                    playerId={null}
                    onSuccess={handleAddPlayerSuccess}
                  />
                </div>
              )}

              {/* Players List */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "20px",
              }}>
                {loading ? (
                  <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
                    Loading players...
                  </div>
                ) : (
                  players.map((player) => (
                    <div 
                      key={player.player_id} 
                      onClick={() => handlePlayerClick(player)}
                      style={{
                        background: "linear-gradient(135deg, #8b6b9e 0%, #7b6ca8 100%)",
                        borderRadius: "12px",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                      }}
                    >
                      <div style={{
                        color: "white",
                        fontSize: "24px",
                        fontWeight: 700,
                        minWidth: "40px",
                        textAlign: "center",
                      }}>
                        #{player.player_id}
                      </div>

                      {/* Player Image Container */}
                      <div style={{ position: "relative" }}>
                        {playerMLBIds[player.player_id] && (
                          <img
                            src={getPlayerImage(playerMLBIds[player.player_id])}
                            alt={`${player.first_name} ${player.last_name}`}
                            style={{
                              width: "70px",
                              height: "70px",
                              borderRadius: "10px",
                              objectFit: "cover",
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              display: "block",
                            }}
                            onError={(e) => {
                              console.log('Image failed to load for:', player.first_name, player.last_name);
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }
                            }}
                          />
                        )}
                        {/* Player avatar placeholder */}
                        <div style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.2)",
                          display: playerMLBIds[player.player_id] ? "none" : "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "32px",
                          flexShrink: 0,
                          position: playerMLBIds[player.player_id] ? "absolute" : "relative",
                          top: 0,
                          left: 0,
                        }}>
                          👤
                        </div>
                      </div>

                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div style={{
                          color: "white",
                          fontSize: "16px",
                          fontWeight: 600,
                          marginBottom: "6px",
                        }}>
                          {player.first_name} {player.last_name}
                        </div>
                        <div style={{
                          display: "flex",
                          gap: "12px",
                          fontSize: "13px",
                          color: "rgba(255, 255, 255, 0.85)",
                        }}>
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}>
                            <span style={{ fontSize: "11px", opacity: 0.8 }}>Team</span>
                            <span style={{ fontWeight: 600, fontSize: "14px" }}>
                              {player.team_name || "TOR"}
                            </span>
                          </div>
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}>
                            <span style={{ fontSize: "11px", opacity: 0.8 }}>ID</span>
                            <span style={{ fontWeight: 600, fontSize: "14px" }}>
                              {player.player_id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Stats View */}
          {currentView === 'stats' && (
            <div style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}>
              <h3 style={{ color: "#333", fontSize: "20px" }}>Team Statistics</h3>
              <p style={{ color: "#666", marginTop: "10px" }}>Coming soon...</p>
            </div>
          )}

          {/* Download View */}
          {currentView === 'download' && (
            <div style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}>
              <h3 style={{ color: "#333", fontSize: "20px" }}>Download Reports</h3>
              <p style={{ color: "#666", marginTop: "10px" }}>Coming soon...</p>
            </div>
          )}

          {/* Bottom Navigation */}
          <div style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 40px)",
            maxWidth: "420px",
            background: "rgba(139, 69, 69, 0.8)",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
          }}>
            <div
              onClick={() => setCurrentView('stats')}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                color: "white",
                fontSize: "24px",
                opacity: currentView === 'stats' ? 1 : 0.6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span>📊</span>
              <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>Stats</span>
            </div>

            <div
              onClick={() => setCurrentView('roster')}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                color: "white",
                fontSize: "24px",
                opacity: currentView === 'roster' || currentView === 'playerDetail' ? 1 : 0.6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span>🏠</span>
              <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>Home</span>
            </div>

            <div
              onClick={() => setCurrentView('download')}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                color: "white",
                fontSize: "24px",
                opacity: currentView === 'download' ? 1 : 0.6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <span>⬇️</span>
              <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>Download</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (showLogin) {
    return (
    <div className="login-page">
      <div className="login-card">
        <div className="welcome-text">
          <h1>Welcome,</h1>
          <p>Let's get batting!</p>
        </div>

        {authError && <div className="auth-error">{authError}</div>}
          <form>
          <div className="form-group">
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="input-field"
              placeholder="Email Address"
              required
            />
          </div>

            <div className="form-group password-group" style={{ position: "relative" }}>
              <input
              type={showPassword ? "text" : "password"}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="input-field"
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </button>
          </div>

            <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>

            <button
            type="submit"
            className="btn-login"
            onClick={handleLogin}
            disabled={authLoading}
          >
            Log in
          </button>
        </form>

          <div className="divider">
          <span></span>
          Or login with
          <span></span>
        </div>

        <button
          className="btn-google"
          onClick={() => {
            setShowLoggedInUI(true);
            setShowLogin(false);
          }}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="login-text">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowLogin(false);
              setShowSignUp(true);
            }}
          >
            Sign up now!
          </a>
        </div>
      </div>
    </div>
  );

  } else if (showSignUp) {
  return (
    <div className="auth-wrapper">
      <div className="signup-container">
        <div className="welcome-text">
          <h1>Create Account</h1>
          <p>to get started</p>
        </div>

        {authError && <div className="auth-error">{authError}</div>}

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
          </div>

          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="eye-btn"
            >
              👁️
            </button>
          </div>

          <div className="form-group password-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="eye-btn"
            >
              👁️
            </button>
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <select
              value={signupTeam}
              onChange={(e) => setSignupTeam(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                background: "rgba(255, 255, 255, 0.9)",
                color: signupTeam ? "black" : "#666",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="">Select Your Team</option>
              <option value="Arizona Diamondbacks">Arizona Diamondbacks</option>
              <option value="Atlanta Braves">Atlanta Braves</option>
              <option value="Baltimore Orioles">Baltimore Orioles</option>
              <option value="Boston Red Sox">Boston Red Sox</option>
              <option value="Chicago Cubs">Chicago Cubs</option>
              <option value="Chicago White Sox">Chicago White Sox</option>
              <option value="Cincinnati Reds">Cincinnati Reds</option>
              <option value="Cleveland Guardians">Cleveland Guardians</option>
              <option value="Colorado Rockies">Colorado Rockies</option>
              <option value="Detroit Tigers">Detroit Tigers</option>
              <option value="Houston Astros">Houston Astros</option>
              <option value="Kansas City Royals">Kansas City Royals</option>
              <option value="Los Angeles Angels">Los Angeles Angels</option>
              <option value="Los Angeles Dodgers">Los Angeles Dodgers</option>
              <option value="Miami Marlins">Miami Marlins</option>
              <option value="Milwaukee Brewers">Milwaukee Brewers</option>
              <option value="Minnesota Twins">Minnesota Twins</option>
              <option value="New York Mets">New York Mets</option>
              <option value="New York Yankees">New York Yankees</option>
              <option value="Oakland Athletics">Oakland Athletics</option>
              <option value="Philadelphia Phillies">Philadelphia Phillies</option>
              <option value="Pittsburgh Pirates">Pittsburgh Pirates</option>
              <option value="San Diego Padres">San Diego Padres</option>
              <option value="San Francisco Giants">San Francisco Giants</option>
              <option value="Seattle Mariners">Seattle Mariners</option>
              <option value="St. Louis Cardinals">St. Louis Cardinals</option>
              <option value="Tampa Bay Rays">Tampa Bay Rays</option>
              <option value="Texas Rangers">Texas Rangers</option>
              <option value="Toronto Blue Jays">Toronto Blue Jays</option>
              <option value="Washington Nationals">Washington Nationals</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-signup"
            disabled={authLoading}
          >
            Sign Up
          </button>
        </form>

        <div className="divider">
          <span></span> Or sign up with <span></span>
        </div>

        <button
          className="btn-google"
          onClick={() => {
            setShowLoggedInUI(true);
            setShowSignUp(false);
          }}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..." />
          </svg>
          Continue with Google
        </button>

        <div className="login-text">
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowLogin(true);
              setShowSignUp(false);
            }}
          >
            Log in now.
          </a>
        </div>
      </div>
    </div>
  );
} else if (showLandingPage) {
  return (
    <div className="auth-wrapper">
      <div className="login-container">
        <div className="logo-container">
          <div className="logo">
            <img src="src/assets/logo.png" alt="PitchSafe Logo" />
          </div>
          <div className="app-name">PitchSafe</div>
        </div>

        <div className="button-group">
          <button
            className="btn btn-login"
            onClick={() => {
              setShowLogin(true);
              setShowLandingPage(false);
            }}
          >
            Log in
          </button>

          <button
            className="btn btn-signup"
            onClick={() => {
              setShowSignUp(true);
              setShowLandingPage(false);
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

}

export default App;