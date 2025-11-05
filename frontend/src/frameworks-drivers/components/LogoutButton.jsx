// frontend/src/frameworks-drivers/components/LogoutButton.jsx
import React from 'react';

const LogoutButton = ({ onLogout, isLoading, userEmail }) => {
  return (
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
      <span style={{ 
        color: 'white', 
        fontWeight: 600, 
        fontSize: 'clamp(14px, 1.5vw, 18px)', 
        whiteSpace: 'nowrap' 
      }}>
        {userEmail}
      </span>
      <button
        onClick={onLogout}
        disabled={isLoading}
        className="logged-in-btn"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#7b6ca8',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        {isLoading ? 'Logging out...' : 'Log Out'}
      </button>
    </div>
  );
};

export default LogoutButton;