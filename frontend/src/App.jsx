import { useEffect, useState } from "react";
import { configureDependencies } from "./config/dependencies";

// Import Views
import LandingPageView from "./frameworks-drivers/views/LandingPageView";
import LoginView from "./frameworks-drivers/views/LoginView";
import SignupView from "./frameworks-drivers/views/SignupView";
import LoggedInUIView from "./frameworks-drivers/views/LoggedInUIView";

import "./App.css";

function App() {
  // Configure dependencies
  const { authViewModel, authController } = configureDependencies();

  // App state
  const [currentView, setCurrentView] = useState('landing');
  const [authState, setAuthState] = useState(authViewModel.getState());

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authViewModel.subscribe((newState) => {
      setAuthState(newState);
      
      // Auto-navigate on auth state changes
      if (newState.isAuthenticated) {
        setCurrentView('loggedIn');
      } else if (currentView === 'loggedIn') {
        setCurrentView('landing');
      }
    });

    return unsubscribe;
  }, [currentView]);

  // Auth handlers
  const handleLogin = async (email, password) => {
    await authController.handleLogin(email, password);
  };

  const handleSignup = async (email, password, confirmPassword, teamName) => {
    await authController.handleSignup(email, password, confirmPassword, teamName);
  };

  const handleLogout = async () => {
    await authController.handleLogout();
    setCurrentView('landing');
  };

  // Navigation handlers
  const navigateToLogin = () => setCurrentView('login');
  const navigateToSignup = () => setCurrentView('signup');
  const navigateToLanding = () => setCurrentView('landing');

  // Render appropriate view based on currentView state
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPageView 
            onNavigateToLogin={navigateToLogin}
            onNavigateToSignup={navigateToSignup}
          />
        );

      case 'login':
        return (
          <LoginView
            onLogin={handleLogin}
            onNavigateToSignup={navigateToSignup}
            onNavigateToLanding={navigateToLanding}
            isLoading={authState.isLoading}
            error={authState.authError}
          />
        );

      case 'signup':
        return (
          <SignupView
            onSignup={handleSignup}
            onNavigateToLogin={navigateToLogin}
            onNavigateToLanding={navigateToLanding}
            isLoading={authState.isLoading}
            error={authState.authError}
          />
        );

      case 'loggedIn':
        return (
          <LoggedInUIView
            currentUser={authState.currentUser}
            onLogout={handleLogout}
            authLoading={authState.isLoading}
          />
        );

      default:
        return (
          <LandingPageView 
            onNavigateToLogin={navigateToLogin}
            onNavigateToSignup={navigateToSignup}
          />
        );
    }
  };

  return renderView();
}

export default App;