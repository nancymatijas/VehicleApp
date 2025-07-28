import React from 'react';
import { useNavigate } from 'react-router-dom';

const VehiclePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Vehicle Management</h1>

      <button
        style={{ margin: '16px 0', padding: '12px 24px', fontSize: 16, cursor: 'pointer' }}
        onClick={() => navigate('/vehicle-makes')}
      >
        Vehicle Makes
      </button>

      <button
        style={{ margin: '16px 0', padding: '12px 24px', fontSize: 16, cursor: 'pointer' }}
        onClick={() => navigate('/vehicle-models')}
      >
        Vehicle Models
      </button>
    </div>
  );
};

export default VehiclePage;
