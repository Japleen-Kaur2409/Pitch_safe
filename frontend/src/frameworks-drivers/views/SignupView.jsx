// frontend/src/frameworks-drivers/views/SignupView.jsx
import React, { useState } from 'react';

const SignupView = ({ 
  onSignup, 
  onNavigateToLogin, 
  onNavigateToLanding,
  isLoading = false,
  error = null 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(email, password, confirmPassword, teamName);
  };

  return (
    <div className="auth-wrapper">
      <div className="signup-container">
        <div className="welcome-text">
          <h1>Create Account</h1>
          <p>to get started</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="eye-btn"
              disabled={isLoading}
            >
              👁️
            </button>
          </div>

          <div className="form-group password-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="eye-btn"
              disabled={isLoading}
            >
              👁️
            </button>
          </div>

          <div className="form-group" style={{ marginBottom: "15px" }}>
            <select
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                background: "rgba(255, 255, 255, 0.9)",
                color: teamName ? "black" : "#666",
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
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="divider">
          <span></span> Or sign up with <span></span>
        </div>

        <button
          className="btn-google"
          disabled={isLoading}
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
              onNavigateToLogin();
            }}
          >
            Log in now.
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupView;