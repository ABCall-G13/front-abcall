import React from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo-white.png';
import key from '../../assets/icons/key.svg';
import search from '../../assets/icons/search.svg';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="ABCall Logo" />
      </div>
      <div className="navbar-links">
        <a href="/login" className="navbar-link">
        <img src={key} alt='Iniciar Sesión'/> INICIAR SESIÓN</a>
        <a href="/create-incident" className="navbar-link">
        <img src={search} alt='Consultar Incidente'/> CONSULTAR INCIDENTE</a>
      </div>
    </nav>
  );
}

export default Navbar;