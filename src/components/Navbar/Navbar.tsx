import React from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo-white.png';
import key from '../../assets/icons/key.svg';
import search from '../../assets/icons/search.svg';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt={t('ABCall Logo')} />
        <div className="version">{t('v{{version}}', { version: '1.33.0' })}</div>
      </div>
      <div className="navbar-links">
        {location.pathname === '/login-client' ? (
          <Link to="/register" className="navbar-link">
            <img src={key} alt={t('Registrarse')} /> {t('REGISTRARSE')}
          </Link>
        ) : location.pathname === '/register' ? (
          <Link to="/login-client" className="navbar-link">
            <img src={key} alt={t('Iniciar Sesión')} /> {t('INICIAR SESIÓN')}
          </Link>
        ) : (
          <a href="/login-client" className="navbar-link">
            <img src={key} alt={t('Iniciar Sesión')} /> {t('INICIAR SESIÓN')}
          </a>
        )}
        <Link to="/search-incident" className="navbar-link">
          <img src={search} alt={t('Consultar Incidente')} /> {t('CONSULTAR INCIDENTE')}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
