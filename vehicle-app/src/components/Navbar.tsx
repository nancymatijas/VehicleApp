import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaCar } from "react-icons/fa";

import '../styles/Navbar.css';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-logo">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
        >
          <div className="logo">VehicleApp <FaCar /></div>
        </NavLink>
      </div>

      <div className="navbar-links">
        <NavLink 
          to="/vehicle-makes" 
          className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
        >
          Vehicle Makes
        </NavLink>
        <NavLink 
          to="/vehicle-models" 
          className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}
        >
          Vehicle Models
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
