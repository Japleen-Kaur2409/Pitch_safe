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

  const handlePlayerClick = async (player, index) => {
    // Temporary placeholder stats - these should ideally come from your API
    const fatigueScores = [33, 28, 19, 14, 8];
    const velocities = ["-3%", "-2%", "-2%", "+1%", "+1%"];
    const spinRates = ["-0%", "-0%", "-4%", "-2%", "-1%"];
    
    const playerWithStats = {
      ...player,
      fatigueScore: fatigueScores[index % fatigueScores.length],
      velocity: velocities[index % velocities.length],
      spinRate: spinRates[index % spinRates.length],
    };
    
    setSelectedPlayer(playerWithStats);
    
    // Fetch detailed player info from database
    const playerInfo = await fetchPlayerInfo(player.player_id);
    if (playerInfo) {
      setSelectedPlayer(prev => ({ ...prev, ...playerInfo }));
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
            <div style={{
              width: "100px",
              height: "100px",
              margin: "0 auto 15px",
              background: "rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}>
              🔵
            </div>
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
              {/* Back Button */}
              <button
                onClick={() => {
                  setCurrentView('roster');
                  setSelectedPlayer(null);
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#7b6ca8",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 20px",
                  marginBottom: "20px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                ← Back to Roster
              </button>

              {/* Team Name Header */}
              <div style={{
                color: "white",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "10px",
                textAlign: "center",
              }}>
                
              </div>

              {/* Player Card with Photo and Name */}
              <div style={{
                background: (() => {
                  const score = selectedPlayer.fatigueScore;
                  if (score > 20) return "linear-gradient(180deg, rgba(231, 76, 60, 0.85) 0%, rgba(192, 57, 43, 0.85) 100%)";
                  if (score > 10) return "linear-gradient(180deg, rgba(155, 89, 182, 0.85) 0%, rgba(142, 68, 173, 0.85) 100%)";
                  return "linear-gradient(180deg, rgba(52, 152, 219, 0.85) 0%, rgba(41, 128, 185, 0.85) 100%)";
                })(),
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
                color: "white",
              }}>
                <div style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "16px",
                }}>
                  #{selectedPlayer.player_id} {selectedPlayer.first_name} {selectedPlayer.last_name}
                </div>

                {/* Player Photo */}
                <div style={{
                  width: "140px",
                  height: "140px",
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.3)",
                  border: "4px solid rgba(255, 255, 255, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "64px",
                  overflow: "hidden",
                }}>
                  👤
                </div>

                {/* Fatigue Score */}
                <div style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "24px",
                }}>
                  Fatigue Score: {selectedPlayer.fatigueScore}%
                </div>

                {/* Stats Row */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  paddingTop: "16px",
                  borderTop: "2px solid rgba(255, 255, 255, 0.3)",
                }}>
                  <div>
                    <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}>B/T</div>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>
                      {selectedPlayer.bats || 'R'}/{selectedPlayer.throws || 'R'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}>Height</div>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>{selectedPlayer.height || '6\'3"'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}>Weight</div>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>{selectedPlayer.weight || '200'}lbs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "4px" }}>Age</div>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>
                      {selectedPlayer.date_of_birth 
                        ? Math.floor((new Date() - new Date(selectedPlayer.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)) 
                        : '30'} yo
                    </div>
                  </div>
                </div>
              </div>

              {/* Player Details List */}
              <div style={{
                background: "rgba(255, 255, 255, 0.75)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px",
                fontSize: "15px",
                color: "#2c3e50",
              }}>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Level:</strong> {selectedPlayer.level || 'N/A'}
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <strong>School:</strong> {selectedPlayer.school || 'N/A'}
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <strong>Bats:</strong> {selectedPlayer.bats === 'R' ? 'Right' : selectedPlayer.bats === 'L' ? 'Left' : 'N/A'}
                </div>
                <div>
                  <strong>Throws:</strong> {selectedPlayer.throws === 'R' ? 'Right' : selectedPlayer.throws === 'L' ? 'Left' : 'N/A'}
                </div>
              </div>

              {/* Effective Speed Card */}
              <div style={{
                background: "rgba(255, 255, 255, 0.75)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px",
              }}>
                <div style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#2c3e50",
                  marginBottom: "12px",
                  textAlign: "center",
                }}>
                  Effective Speed
                </div>
                <div style={{
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: "1.6",
                  textAlign: "center",
                }}>
                  {selectedPlayer.velocity === "-3%" && "5% decrease over the last 5 games compared to year average."}
                  {selectedPlayer.velocity === "-2%" && "2% decrease over the last 5 games compared to year average."}
                  {selectedPlayer.velocity === "+1%" && "1% increase over the last 5 games compared to year average."}
                  {!selectedPlayer.velocity && "No velocity data available."}
                </div>
              </div>

              {/* Spin Rate Card */}
              <div style={{
                background: "rgba(255, 255, 255, 0.75)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px",
              }}>
                <div style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#2c3e50",
                  marginBottom: "12px",
                  textAlign: "center",
                }}>
                  Spin rate
                </div>
                <div style={{
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: "1.6",
                  textAlign: "center",
                }}>
                  {selectedPlayer.spinRate === "-0%" && "0% change over the last 5 games compared to year average."}
                  {selectedPlayer.spinRate === "-4%" && "4% decrease over the last 5 games compared to year average."}
                  {selectedPlayer.spinRate === "-2%" && "2% decrease over the last 5 games compared to year average."}
                  {selectedPlayer.spinRate === "-1%" && "1% decrease over the last 5 games compared to year average."}
                  {!selectedPlayer.spinRate && "No spin rate data available."}
                </div>
              </div>

              {/* Warning Card */}
              <div style={{
                background: "rgba(231, 76, 60, 0.75)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                color: "white",
              }}>
                <div style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "12px",
                  textAlign: "center",
                }}>
                  WARNING
                </div>
                <div style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                  textAlign: "center",
                }}>
                  {selectedPlayer.fatigueScore > 20 
                    ? "This pitcher is presenting similar signs of fatigue that leads to Rotator Cuff."
                    : selectedPlayer.fatigueScore > 10
                    ? "This pitcher is showing moderate signs of fatigue. Monitor closely."
                    : "This pitcher is in good condition with minimal fatigue indicators."}
                </div>
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
                    // Optionally refresh player data here
                  }}
                />
              </div>
            </>
          )}

          {/* Roster View */}
          {currentView === 'roster' && (
            <>
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
                ) : players.length === 0 ? (
                  <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
                    No players found. Please add players to your roster.
                  </div>
                ) : (
                  players.map((player, index) => {
                    // Placeholder stats - these should come from your API in production
                    const fatigueScores = [33, 28, 19, 14, 8];
                    const fatigueScore = fatigueScores[index % fatigueScores.length];
                    
                    const velocities = ["-3%", "-2%", "-2%", "+1%", "+1%"];
                    const spinRates = ["-0%", "-0%", "-4%", "-2%", "-1%"];
                    
                    const velocity = velocities[index % velocities.length];
                    const spinRate = spinRates[index % spinRates.length];
                    
                    // Determine border color based on fatigue score
                    let borderColor;
                    if (fatigueScore > 20) {
                      borderColor = "rgba(231, 76, 60, 0.4)";
                    } else if (fatigueScore > 10) {
                      borderColor = "rgba(155, 89, 182, 0.4)";
                    } else {
                      borderColor = "rgba(52, 152, 219, 0.4)";
                    }
                    
                    return (
                      <div 
                        key={player.player_id}
                        onClick={() => handlePlayerClick(player, index)}
                        style={{
                          background: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "16px",
                          padding: "16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          border: `5px solid ${borderColor}`,
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                        }}
                      >
                        {/* Player Photo */}
                        <div style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #e8d5d5 0%, #d5c8e8 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "32px",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}>
                          👤
                        </div>

                        {/* Player Info */}
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <div style={{
                            color: "#2c3e50",
                            fontSize: "15px",
                            fontWeight: 700,
                            marginBottom: "8px",
                          }}>
                            #{player.player_id} {player.first_name} {player.last_name}
                          </div>
                          
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            fontSize: "13px",
                            color: "#7f8c8d",
                          }}>
                            <div>
                              <span style={{ fontWeight: 600 }}>Velocity:</span> {velocity}
                            </div>
                            <div>
                              <span style={{ fontWeight: 600 }}>Spin Rate:</span> {spinRate}
                            </div>
                            <div 
                              style={{
                                color: "#3498db",
                                fontWeight: 600,
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              See More
                            </div>
                          </div>
                        </div>

                        {/* Fatigue Score */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          marginRight: "8px",
                        }}>
                          <div style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            color: fatigueScore > 20 ? "#e74c3c" : fatigueScore > 10 ? "#9b59b6" : "#3498db",
                            lineHeight: "1",
                            marginBottom: "4px",
                          }}>
                            {fatigueScore}
                          </div>
                          <div style={{
                            fontSize: "11px",
                            color: "#95a5a6",
                            fontWeight: 600,
                            textAlign: "center",
                          }}>
                            Fatigue Score
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* Stats View */}
{currentView === 'stats' && (
  <div style={{
    marginBottom: "20px",
  }}>
    <h3 style={{ 
      color: "white", 
      fontSize: "28px", 
      fontWeight: 700,
      marginBottom: "25px",
      textAlign: "center",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    }}>
      Team Performance Map
    </h3>
    
    {/* Chart Container with Labels */}
    <div style={{ position: "relative", paddingLeft: "50px", paddingBottom: "50px", paddingTop: "10px" }}>
      {/* Y-Axis Label */}
      <div style={{
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%) rotate(-90deg)",
        color: "white",
        fontSize: "18px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        whiteSpace: "nowrap",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
      }}>
        Spin Rate →
      </div>

      {/* Chart Area */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "500px",
        background: "linear-gradient(to top right, #e74c3c 0%, #c0392b 15%, #9b59b6 35%, #8e44ad 50%, #3498db 70%, #2980b9 100%)",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
      }}>
        {/* Player Pins */}
        {players.map((player, index) => {
          // Generate positions based on placeholder data
          const positions = [
            { x: 15, y: 75 },  // Low velocity, low spin (red zone - bottom left)
            { x: 30, y: 60 },  // Low-medium velocity, medium spin
            { x: 50, y: 50 },  // Medium velocity, medium spin (purple zone)
            { x: 70, y: 30 },  // High velocity, high spin (blue zone)
            { x: 85, y: 15 },  // Very high velocity, very high spin (deep blue - top right)
          ];
          
          const position = positions[index % positions.length];
          
          return (
            <div
              key={player.player_id}
              onClick={() => handlePlayerClick(player, index)}
              style={{
                position: "absolute",
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.15)";
                e.currentTarget.style.zIndex = "20";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                e.currentTarget.style.zIndex = "10";
              }}
            >
              {/* Pin */}
              <svg width="60" height="70" viewBox="0 0 60 70" style={{
                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
              }}>
                <path
                  d="M30 0C20.335 0 12.5 7.835 12.5 17.5c0 9.665 17.5 52.5 17.5 52.5s17.5-42.835 17.5-52.5C47.5 7.835 39.665 0 30 0z"
                  fill="#ffffff"
                  stroke="rgba(0, 0, 0, 0.15)"
                  strokeWidth="1.5"
                />
                <circle cx="30" cy="17.5" r="14" fill="rgba(44, 62, 80, 0.95)" />
                <text
                  x="30"
                  y="23.5"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="700"
                >
                  #{player.player_id}
                </text>
              </svg>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          padding: "14px 16px",
          fontSize: "13px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "16px", height: "16px", background: "#2980b9", borderRadius: "3px", border: "1px solid rgba(255, 255, 255, 0.3)" }}></div>
            <span style={{ color: "white", fontWeight: 600 }}>Performance Normal</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "16px", height: "16px", background: "#9b59b6", borderRadius: "3px", border: "1px solid rgba(255, 255, 255, 0.3)" }}></div>
            <span style={{ color: "white", fontWeight: 600 }}>Signs of Fatigue</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "16px", height: "16px", background: "#e74c3c", borderRadius: "3px", border: "1px solid rgba(255, 255, 255, 0.3)" }}></div>
            <span style={{ color: "white", fontWeight: 600 }}>Fatigued</span>
          </div>
        </div>
      </div>

      {/* Y-Axis Label */}
      <div style={{
        position: "absolute",
        left: "-30px",
        top: "50%",
        transform: "translateY(-50%) rotate(-90deg)",
        color: "white",
        fontSize: "20px",
        fontWeight: 700,
        letterSpacing: "1px",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
      }}>
        Spin Rate →
      </div>
      {/* X-Axis Label */}
      <div style={{
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        fontSize: "18px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
      }}>
        Velocity →
      </div>
    </div>

    <p style={{ 
      color: "white", 
      fontSize: "15px", 
      marginTop: "20px",
      textAlign: "center",
      lineHeight: "1.6",
      fontWeight: 500,
      textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
    }}>
      Click on any player to view detailed performance metrics
    </p>
  </div>
)}

          {/* Download View */}
{currentView === 'download' && (
  <div style={{
    marginBottom: "20px",
  }}>
    <h3 style={{ 
      color: "white", 
      fontSize: "28px", 
      fontWeight: 700,
      marginBottom: "25px",
      textAlign: "center",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    }}>
      Download Report
    </h3>

    {/* Team Summary Section */}
    <div style={{
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    }}>
      <h4 style={{
        color: "#2c3e50",
        fontSize: "20px",
        fontWeight: 700,
        marginBottom: "12px",
      }}>
        Team Summary Report
      </h4>
      <p style={{
        color: "#7f8c8d",
        fontSize: "14px",
        marginBottom: "20px",
        lineHeight: "1.6",
      }}>
        Download a comprehensive PDF report containing all player data, fatigue scores, warnings, and performance metrics.
      </p>
      <button
        onClick={() => {
          console.log('Team data download clicked');
          // Functionality to be added later
        }}
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "16px",
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(52, 152, 219, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(52, 152, 219, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(52, 152, 219, 0.3)";
        }}
      >
        📄 Download Team Data
      </button>
    </div>

    {/* Individual Player Section */}
    <div style={{
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "16px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    }}>
      <h4 style={{
        color: "#2c3e50",
        fontSize: "20px",
        fontWeight: 700,
        marginBottom: "12px",
      }}>
        Individual Player Report
      </h4>
      <p style={{
        color: "#7f8c8d",
        fontSize: "14px",
        marginBottom: "20px",
        lineHeight: "1.6",
      }}>
        Select a player to download their individual performance report.
      </p>
      
      <select
        value={selectedPlayer?.player_id || ''}
        onChange={(e) => {
          const playerId = e.target.value;
          if (playerId) {
            const player = players.find(p => p.player_id.toString() === playerId);
            const index = players.findIndex(p => p.player_id.toString() === playerId);
            
            if (player && index !== -1) {
              const fatigueScores = [33, 28, 19, 14, 8];
              const velocities = ["-3%", "-2%", "-2%", "+1%", "+1%"];
              const spinRates = ["-0%", "-0%", "-4%", "-2%", "-1%"];
              
              setSelectedPlayer({
                ...player,
                fatigueScore: fatigueScores[index % fatigueScores.length],
                velocity: velocities[index % velocities.length],
                spinRate: spinRates[index % spinRates.length],
              });
            }
          } else {
            setSelectedPlayer(null);
          }
        }}
        style={{
          width: "100%",
          padding: "14px 16px",
          border: "2px solid #e0e0e0",
          borderRadius: "10px",
          fontSize: "15px",
          background: "white",
          color: selectedPlayer ? "#2c3e50" : "#999",
          outline: "none",
          cursor: "pointer",
          marginBottom: "16px",
          transition: "all 0.3s ease",
        }}
      >
        <option value="">Select a Player</option>
        {players.map((player) => (
          <option key={player.player_id} value={player.player_id}>
            #{player.player_id} - {player.first_name} {player.last_name}
          </option>
        ))}
      </select>

      {selectedPlayer && (
        <button
          onClick={() => {
            console.log(`Download clicked for ${selectedPlayer.first_name} ${selectedPlayer.last_name}`);
            // Functionality to be added later
          }}
          style={{
            width: "100%",
          padding: "14px 16px",
          border: "2px solid #e0e0e0",
          borderRadius: "10px",
          fontSize: "15px",
          background: "white",
          color: selectedPlayer ? "#2c3e50" : "#999",
          outline: "none",
          cursor: "pointer",
          marginBottom: "16px",
          transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(155, 89, 182, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(155, 89, 182, 0.3)";
          }}
        >
          📊 Download {selectedPlayer.first_name} {selectedPlayer.last_name}'s Report
        </button>
      )}
    </div>
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