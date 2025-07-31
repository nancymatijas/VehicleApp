import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VehiclePages.css';

const VehiclePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container-vehicle-page">
      <h1>Vehicle Management</h1>
      <p>
        Welcome to the Vehicle Management application. Here you can view, add, edit, and delete vehicle makes and models. Use the options below to get started.
      </p>

      <div className="vehicle-buttons">
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

      <section className="info-section">
        <h2>What can you do?</h2>
        <ul>
          <li><strong>View vehicle makes:</strong> Sort, filter, and search through various vehicle manufacturers.</li>
          <li><strong>Manage vehicle models:</strong> Add new models, edit existing ones, or delete them.</li>
          <li><strong>Persistent filter settings:</strong> Your filter and sorting preferences are saved for easier future use.</li>
          <li><strong>Data validation:</strong> When creating or editing makes and models, data accuracy and completeness are ensured.</li>
        </ul>
      </section>
    </div>
  );
};

export default VehiclePage;
