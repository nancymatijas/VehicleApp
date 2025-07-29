import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="navbar-link">
        <div className="navbar-logo">VehicleApp</div>
      </Link>
      <Link to="/vehicle-makes" className="navbar-link">
        Vehicle Makes
      </Link>
      <Link to="/vehicle-models" className="navbar-link">
        Vehicle Models
      </Link>
    </nav>
  );
};

export default NavBar;
