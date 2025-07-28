import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VehicleMake from './pages/VehicleMake';
import VehicleModel from './pages/VehicleModel';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/makes" element={<VehicleMake />} />
        <Route path="/models" element={<VehicleModel />} />
        <Route path="*" element={<div>Stranica nije pronađena.</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
