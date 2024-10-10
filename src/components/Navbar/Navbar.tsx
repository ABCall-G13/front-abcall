import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo-white.png';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="ABCall Logo" />
      </div>
      <div className="navbar-links">
        <a href="/login" className="navbar-link">Iniciar sesión</a>
        <a href="/create-incident" className="navbar-link">Consultar incidente</a>
      </div>
    </nav>
  );
}

export default Navbar;
