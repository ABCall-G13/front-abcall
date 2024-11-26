import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login-client');
    };

    return (
        <div className="sidebar-card">
            <div className="logo-container">
                <img src={logo} alt="ABCall Logo" className="logo-image" />
                <div className='version-side'>v1.25.0</div>
            </div>
            <nav>
                <ul>
                    <li className={location.pathname === '/dashboard' ? 'active' : ''}>
                        <Link to="/dashboard">Tableros</Link>
                    </li>
                    <li className={location.pathname === '/billing' ? 'active' : ''}>
                        <Link to="/billing">Facturación</Link>
                    </li>
                    <li className={location.pathname === '/sync-users' ? 'active' : ''}>
                        <Link to="/sync-users">Sincronizar usuarios</Link>
                    </li>
                    <li className={location.pathname === '/incident-list' ? 'active' : ''}>
                        <Link to="/incident-list">Incidentes</Link>
                    </li>
                    <li className={location.pathname === '/directory-list' ? 'active' : ''}>
                        <Link to="/directory-list">Directorio</Link>
                    </li>
                    <li className={location.pathname === '/common-issue-list' ? 'active' : ''}>
                        <Link to="/common-issue-list">Problemas comunes</Link>
                    </li>
                </ul>
            </nav>
            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
};

export default Sidebar;