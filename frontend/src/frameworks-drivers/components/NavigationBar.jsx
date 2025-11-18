// frontend/src/frameworks-drivers/components/NavigationBar.jsx
import React from 'react';

const NavigationBar = ({ currentView, onNavigate }) => {
  const handleNavClick = (view) => {
    console.log('NavigationBar: Navigating to', view);
    onNavigate(view);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50.5%",
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
      zIndex: 1000,
    }}>
      <div
        onClick={() => handleNavClick('stats')}
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
          padding: "8px",
          borderRadius: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <span>📊</span>
        <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>Stats</span>
      </div>

      <div
        onClick={() => handleNavClick('roster')}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          color: "white",
          fontSize: "24px",
          opacity: (currentView === 'roster' || currentView === 'playerDetail') ? 1 : 0.6,
          padding: "8px",
          borderRadius: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <span>🏠</span>
        <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>Home</span>
      </div>

      <div
        onClick={() => handleNavClick('download')}
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
          padding: "8px",
          borderRadius: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <span>⬇️</span>
        <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>Download</span>
      </div>
    </div>
  );
};

export default NavigationBar;