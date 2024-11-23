import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
    FiHome,
    FiBarChart2,
    FiFileText,
    FiUserCheck,
    FiLogOut,
    FiMenu,
} from 'react-icons/fi';
import Avatar from 'react-avatar';

const Sidebar: React.FC = () => {
    const { logout, role } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login-client');
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`sidebar-card ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Botón de colapsar/expandir */}
            <button className="collapse-button" onClick={toggleSidebar}>
                <FiMenu size={20} />
            </button>

            {/* Logo */}
            {!isCollapsed && (
                <div className="logo-container">
                    <img
                        src={logo}
                        alt={t('ABCall Logo')}
                        className="logo-image"
                    />
                </div>
            )}

            {/* Menú de navegación */}
            <nav>
                <ul className="menu-list">
                    {role === 'cliente' && (
                        <>
                            <li
                                className={
                                    location.pathname === '/dashboard'
                                        ? 'active'
                                        : ''
                                }
                            >
                                <Link to="/dashboard">
                                    <FiHome size={20} className="menu-icon" />
                                    {!isCollapsed && t('Inicio')}
                                </Link>
                            </li>
                            <li
                                className={
                                    location.pathname === '/incident-list'
                                        ? 'active'
                                        : ''
                                }
                            >
                                <Link to="/incident-list">
                                    <FiBarChart2
                                        size={20}
                                        className="menu-icon"
                                    />
                                    {!isCollapsed && t('Tableros')}
                                </Link>
                            </li>
                            <li
                                className={
                                    location.pathname === '/sync-users'
                                        ? 'active'
                                        : ''
                                }
                            >
                                <Link to="/sync-users">
                                    <FiUserCheck
                                        size={20}
                                        className="menu-icon"
                                    />
                                    {!isCollapsed && t('Sincronizar usuarios')}
                                </Link>
                            </li>
                            <li>
                                <button
                                    className="logout-button"
                                    onClick={handleLogout}
                                >
                                    <FiLogOut
                                        size={20}
                                        className="menu-icon"
                                    />
                                    {!isCollapsed && t('Cerrar Sesión')}
                                </button>
                            </li>
                        </>
                    )}
                    {role === 'agente' && (
                        <>
                            <li
                                className={
                                    location.pathname === '/directory-list'
                                        ? 'active'
                                        : ''
                                }
                            >
                                <Link to="/directory-list">
                                    <FiFileText
                                        size={20}
                                        className="menu-icon"
                                    />
                                    {!isCollapsed && t('Directorio')}
                                </Link>
                            </li>
                            <li
                                className={
                                    location.pathname === '/incident-list'
                                        ? 'active'
                                        : ''
                                }
                            >
                                <Link to="/incident-list">
                                    <FiFileText
                                        size={20}
                                        className="menu-icon"
                                    />
                                    {!isCollapsed && t('Incidentes')}
                                </Link>
                            </li>
                            <li
                                className={
                                    location.pathname === '/common-issue-list'
                                        ? 'active'
                                        : ''
                                }
                            >
                                <Link to="/common-issue-list">
                                    <FiUserCheck
                                        size={20}
                                        className="menu-icon"
                                    />
                                    {!isCollapsed && t('Problemas comunes')}
                                </Link>
                            </li>
                            <li>
                                <button
                                    className="logout-button"
                                    onClick={handleLogout}
                                >
                                    <FiLogOut
                                        size={20}
                                        className="menu-icon"
                                    />
                                    {!isCollapsed && t('Cerrar Sesión')}
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Información del usuario */}
            {!isCollapsed && (
                <div className="user-section">
                    {role === 'cliente' && (
                        <>
                            <Avatar
                                name="Cliente ABCall"
                                size="80"
                                round={true}
                                color="#4167b2"
                                fgColor="#fff"
                            />
                            <p className="user-description">
                                {t('Cliente de ABCall')}
                            </p>
                        </>
                    )}
                    {role === 'agente' && (
                        <>
                            <Avatar
                                name="Agente ABCall"
                                size="80"
                                round={true}
                                color="#2d3748"
                                fgColor="#fff"
                            />
                            <p className="user-description">
                                {t('Agente de soporte ABCall')}
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Sidebar;
