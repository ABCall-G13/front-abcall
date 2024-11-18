import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login-client');
  };

  return (
    <div className="sidebar-card">
      <div className="logo-container">
        <img src={logo} alt={t('ABCall Logo')} className="logo-image" />
        <div className="version-side">
          {t('v{{version}}', { version: '1.24.0' })}
        </div>
      </div>
      <nav>
        <ul>
          {role === 'cliente' && (
            <>
              <li className={location.pathname === '/dashboard' ? 'active' : ''}>
                <Link to="/dashboard">{t('Tableros')}</Link>
              </li>
              <li className={location.pathname === '/incident-list' ? 'active' : ''}>
                <Link to="/incident-list">{t('Incidentes')}</Link>
              </li>
              <li className={location.pathname === '/sync-users' ? 'active' : ''}>
                <Link to="/sync-users">{t('Sincronizar usuarios')}</Link>
              </li>
            </>
          )}
          {role === 'agente' && (
            <>
              <li
                className={
                  location.pathname === '/directory-list' ? 'active' : ''
                }
              >
                <Link to="/directory-list">{t('Directorio')}</Link>
              </li>
              <li className={location.pathname === '/incident-list' ? 'active' : ''}>
                <Link to="/incident-list">{t('Incidentes')}</Link>
              </li>
              <li
                className={
                  location.pathname === '/common-issue-list' ? 'active' : ''
                }
              >
                <Link to="/common-issue-list">{t('Problemas comunes')}</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <button className="logout-button" onClick={handleLogout}>
        {t('Cerrar Sesión')}
      </button>
    </div>
  );
};

export default Sidebar;
