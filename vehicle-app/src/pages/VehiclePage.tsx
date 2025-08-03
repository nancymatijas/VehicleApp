import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/VehiclePages.css';

const VehiclePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="container-vehicle-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1>Vehicle Management</h1>
      <p>
        Welcome to the Vehicle Management application. Here you can view, add, edit, and delete vehicle makes and models. Use the options below to get started.
      </p>

      <div className="vehicle-buttons">
        <motion.button
          className="button-vehicle-page"
          type="button"
          onClick={() => navigate('/vehicle-makes')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Vehicle Makes
        </motion.button>

        <motion.button
          className="button-vehicle-page"
          type="button"
          onClick={() => navigate('/vehicle-models')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Vehicle Models
        </motion.button>
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
    </motion.div>
  );
};

export default VehiclePage;
