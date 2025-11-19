// frontend/src/App.jsx
import { useEffect, useState, useMemo } from "react";
import { configureDependencies } from "./config/dependencies";

// Import Views
import LandingPageView from "./frameworks-drivers/views/LandingPageView";
import LoginView from "./frameworks-drivers/views/LoginView";
import SignupView from "./frameworks-drivers/views/SignupView";
import LoggedInUIView from "./frameworks-drivers/views/LoggedInUIView";

import "./App.css";

function App() {
  // Configure dependencies
  const dependencies = useMemo(() => configureDependencies(), []);
  const { 
    authViewModel, 
    authController, 
    mlViewModel,
    mlController 
  } = dependencies;

  // App state
  const [currentView, setCurrentView] = useState('landing');
  const [authState, setAuthState] = useState(authViewModel.getState());
  const [mlState, setMlState] = useState(mlViewModel.getState());

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authViewModel.subscribe((newState) => {
      console.log('🔐 Auth state changed:', newState);
      setAuthState(newState);
      
      // Auto-navigate on auth state changes
      if (newState.isAuthenticated) {
        console.log('✅ User authenticated, navigating to logged in view');
        setCurrentView('loggedIn');
        // IMPORTANT: Fetch ML data after successful login
        fetchInjuryRiskData();
      } else if (currentView === 'loggedIn') {
        console.log('🚪 User logged out, navigating to landing');
        setCurrentView('landing');
      }
    });

    return unsubscribe;
  }, [currentView]);

  // Subscribe to ML state changes
  useEffect(() => {
    const unsubscribe = mlViewModel.subscribe((newState) => {
      console.log('🤖 ML state updated:', newState);
      console.log('🤖 playerRiskMap:', newState.data?.playerRiskMap);
      setMlState({ ...newState });
    });

    return unsubscribe;
  }, [mlViewModel]);

  // Fetch injury risk data
  const fetchInjuryRiskData = async () => {
    console.log('🚀 Starting injury risk data fetch...');
    console.log('🔍 All env vars:', import.meta.env);
    console.log('🔍 VITE_CSV_PATH:', import.meta.env.VITE_CSV_PATH);
    try {
      const csvPath = import.meta.env.VITE_CSV_PATH || 
              '/yankees.csv';
    } catch (error) {
      console.error('❌LALALALALLALALALA:', error);
    }
    try {
      const csvPath = import.meta.env.VITE_CSV_PATH || 
              '/yankees.csv';
      
      console.log('📁 CSV Path:', csvPath);
      console.log('📊 Calling mlController.getInjuryRisk...');
      
      await mlController.getInjuryRisk(csvPath, 0.10, '2024-04-01');
      
      console.log('✅ ML Controller call completed');
      const currentState = mlViewModel.getState();
      console.log('📦 Full ML State:', currentState);
      if (currentState.data?.playerRiskMap) {
        const entries = Object.entries(currentState.data.playerRiskMap);
        console.log('📊 First 3 players:', entries.slice(0, 3));
      }
      console.log('📦 Current mlState after fetch:', mlViewModel.getState());
      
    } catch (error) {
      console.error('❌ Failed to load injury risk data:', error);
      console.error('Error stack:', error.stack);
    }
  };

  // Auth handlers
  const handleLogin = async (email, password) => {
    console.log('🔑 Attempting login...');
    await authController.handleLogin(email, password);
  };

  const handleSignup = async (email, password, confirmPassword, teamName) => {
    console.log('📝 Attempting signup...');
    await authController.handleSignup(email, password, confirmPassword, teamName);
  };

  const handleLogout = async () => {
    console.log('👋 Logging out...');
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
        console.log('🎨 Rendering LoggedInUIView');
        console.log('  mlState:', mlState);
        console.log('  mlState.data:', mlState.data);
        console.log('  mlState.data?.playerRiskMap:', mlState.data?.playerRiskMap);
        console.log('  injuryRiskData:', mlState.data?.playerRiskMap);
        return (
          <LoggedInUIView
            currentUser={authState.currentUser}
            coachId={authState.currentUser?.coach_id}
            onLogout={handleLogout}
            authLoading={authState.isLoading}
            injuryRiskData={mlState.data?.playerRiskMap}
            mlLoading={mlState.loading}
            mlError={mlState.error}
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