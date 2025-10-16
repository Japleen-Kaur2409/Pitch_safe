import { useEffect, useState } from "react";
import GameRecordForm from './components/GameRecordForm';
import "./App.css";

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState("");
  const [playerInfo, setPlayerInfo] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
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
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
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
  }, []);

  const handleSearch = () => {
    setError("");
    
    if (!playerId.trim()) {
      setError("Please enter a player ID");
      setPlayerInfo(null);
      return;
    }

    setSearchLoading(true);
    setPlayerInfo(null);

    console.log(`Fetching: http://localhost:5001/api/players/${playerId}/info`);

    fetch(`http://localhost:5001/api/players/${playerId}/info`)
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Player with ID ${playerId} not found`);
          } else {
            throw new Error(`Server error (Status: ${res.status})`);
          }
        }
        return res.json();
      })
      .then((data) => {
        console.log("Player data received:", data);
        setPlayerInfo(data);
        setSearchLoading(false);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching player info:", err);
        setError(err.message);
        setSearchLoading(false);
        setPlayerInfo(null);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
      console.log("Attempting login with:", loginEmail);
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      console.log("Login response status:", response.status);
      const data = await response.json();
      console.log("Login response data:", data);

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

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    if (!signupEmail || !signupPassword || !signupConfirmPassword) {
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
        body: JSON.stringify({ email: signupEmail, password: signupPassword }),
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

  if (showLoggedInUI) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">SafePitch - Players List</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <GameRecordForm 
          playerId={playerInfo?.player_id} 
          onSuccess={() => {
            // Refresh player records if needed
            console.log('Game record added successfully');
          }}
        />
        </div>
        
        {loading ? (
          <p className="text-gray-600">Loading players...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Current Players</h2>
            <ul className="space-y-2">
              {players.map((player) => (
                <li key={player.player_id} className="flex items-center p-3 hover:bg-gray-50 rounded">
                  <span className="text-gray-500 mr-3">ID: {player.player_id}</span>
                  <span className="font-medium">{player.first_name} {player.last_name}</span>
                  <span className="ml-auto text-blue-600">{player.team_name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Search Player Personal Info</h2>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter Player ID (e.g., 1, 2, 3)"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {searchLoading && (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading player info...</p>
            </div>
          )}

          {playerInfo && !searchLoading && (
            <div className="bg-gray-50 rounded-md p-4">
              <h3 className="text-lg font-semibold mb-3 text-green-700">Player Information Found</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-medium text-gray-600">Player ID:</span>
                  <span className="ml-2">{playerInfo.player_id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Date of Birth:</span>
                  <span className="ml-2">{new Date(playerInfo.date_of_birth).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Bats:</span>
                  <span className="ml-2">{playerInfo.bats === 'R' ? 'Right' : 'Left'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Throws:</span>
                  <span className="ml-2">{playerInfo.throws === 'R' ? 'Right' : 'Left'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Height:</span>
                  <span className="ml-2">{playerInfo.height}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Weight:</span>
                  <span className="ml-2">{playerInfo.weight} lbs</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Level:</span>
                  <span className="ml-2">{playerInfo.level}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">How Acquired:</span>
                  <span className="ml-2">{playerInfo.how_acquired}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Signing Bonus:</span>
                  <span className="ml-2">{playerInfo.signing_bonus ? `$${playerInfo.signing_bonus.toLocaleString()}` : "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">School:</span>
                  <span className="ml-2">{playerInfo.school || "N/A"}</span>
                </div>
              </div>
            </div>
          )}
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

          <div className="signup-text">
          Don’t have an account? <a href="#">Sign up</a>
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