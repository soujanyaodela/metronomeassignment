import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PosterMakerLanding.css';

const PosterMakerLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="content-wrapper">
        <h1 className="title">
        Capital Rush is a kind of Trading
        </h1>
        
        <p className="subtitle">
        investment-based simulator game
        </p>
        
       

        <button
          onClick={() => navigate('/Dashboard')}
          className="create-button"
        >
          Create your own poster
        </button>

      
      </div>
    </div>
  );
};

export default PosterMakerLanding;
