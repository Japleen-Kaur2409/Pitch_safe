// frontend/src/frameworks-drivers/views/LandingPageView.jsx
import React from 'react';

const LandingPageView = ({ onNavigateToLogin, onNavigateToSignup }) => {
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
            onClick={onNavigateToLogin}
          >
            Log in
          </button>

          <button
            className="btn btn-signup"
            onClick={onNavigateToSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPageView;