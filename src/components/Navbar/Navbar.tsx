import React from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo-white.png';
import key from '../../assets/icons/key.svg';
import search from '../../assets/icons/search.svg';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="ABCall Logo" />
            </div>
            <div className="navbar-links">
                <a href="/login-client" className="navbar-link">
                    <img src={key} alt="Iniciar Sesión" /> INICIAR SESIÓN
                </a>
                <Link to="/search-incident" className="navbar-link">
                    <img src={search} alt="Consultar Incidente" /> CONSULTAR INCIDENTE
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
