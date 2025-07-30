import React from 'react';
import NavBar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VehicleMakeComponent from './pages/VehicleMake';
import VehicleMakeCreate from './pages/VehicleMakeCreate';
import VehicleMakeEdit from './pages/VehicleMakeEdit';
import VehicleModelComponent from './pages/VehicleModel';
import VehicleModelCreate from './pages/VehicleModelCreate';
import VehicleModelEdit from './pages/VehicleModelEdit';
import VehiclePage from './pages/VehiclePage';

const App: React.FC = () => (
  <Router>
    <NavBar />
    <div style={{ paddingTop: 50 }}>
      <Routes>
        <Route path="/" element={<VehiclePage />} />
        <Route path="/vehicle-makes" element={<VehicleMakeComponent />} />
        <Route path="/vehicle-makes/create" element={<VehicleMakeCreate />} />
        <Route path="/vehicle-makes/edit/:id" element={<VehicleMakeEdit />} />
        <Route path="/vehicle-models" element={<VehicleModelComponent />} />
        <Route path="/vehicle-models/create" element={<VehicleModelCreate />} />
        <Route path="/vehicle-models/edit/:id" element={<VehicleModelEdit />} />
      </Routes>
    </div>
  </Router>
);

export default App;
