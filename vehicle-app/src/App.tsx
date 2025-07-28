import React from 'react';
import NavBar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VehicleMakeComponent from './pages/VehicleMake';
import VehicleModelComponent from './pages/VehicleModel';
import VehiclePage from './pages/VehiclePage';

const App: React.FC = () => (
  <Router>
    <NavBar />
    <div style={{ paddingTop: 50 }}>
      <Routes>
        <Route path="/" element={<VehiclePage />} />
        <Route path="/vehicle-makes" element={<VehicleMakeComponent />} />
        <Route path="/vehicle-models" element={<VehicleModelComponent />} />
      </Routes>
    </div>
  </Router>
);

export default App;
