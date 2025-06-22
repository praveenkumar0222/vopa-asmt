import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/welcomeScreen.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/tender');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome to the Tender Portal!</h1>
        <p className="welcome-subtitle">
          Explore a comprehensive list of tenders and their details.
        </p>
        <button className="start-button" onClick={handleStartClick}>
          View Tenders
          <span className="arrow-icon">→</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;