import React from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo-white.png';
import key from '../../assets/icons/key.svg';
import search from '../../assets/icons/search.svg';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="ABCall Logo" />
                <div className='version'>v1.24.0</div>
            </div>
            <div className="navbar-links">
                {location.pathname === '/login-client' ? (
                    <Link to="/register" className="navbar-link">
                        <img src={key} alt="Registrarse" /> REGISTRARSE
                    </Link>
                ) : location.pathname === '/register' ? (
                    <Link to="/login-client" className="navbar-link">
                        <img src={key} alt="Iniciar Sesión" /> INICIAR SESIÓN
                    </Link>
                ) : (
                    <a href="/login-client" className="navbar-link">
                        <img src={key} alt="Iniciar Sesión" /> INICIAR SESIÓN
                    </a>
                )}
                <Link to="/search-incident" className="navbar-link">
                    <img src={search} alt="Consultar Incidente" /> CONSULTAR INCIDENTE
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;