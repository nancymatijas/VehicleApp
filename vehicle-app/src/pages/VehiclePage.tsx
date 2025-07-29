import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VehiclePages.css';

const VehiclePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container-vehicle-page">
      
      <h1>Vehicle Management</h1>
      <button
        className="button-vehicle-page"
        type="button"
        onClick={() => navigate('/vehicle-makes')}
      >
        Vehicle Makes
      </button>

      <button
        className="button-vehicle-page"
        type="button"
        onClick={() => navigate('/vehicle-models')}
      >
        Vehicle Models
      </button>
    </div>
  );
};

export default VehiclePage;
