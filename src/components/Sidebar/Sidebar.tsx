// src/components/Sidebar/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../assets/images/logo.png';

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar-card">
            <div className="logo-container">
                <img src={logo} alt="ABCall Logo" className="logo-image" />
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Inicio</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Tableros</Link>
                    </li>
                    <li>
                        <Link to="/billing">Facturación</Link>
                    </li>
                    <li>
                        <Link to="/sync-users">Sincronizar usuarios</Link>
                    </li>
                    <li>
                        <Link to="/incident-list">Incidentes</Link>
                    </li>
                    <li>
                        <Link to="/directory-list">Directorio</Link>
                    </li>
                </ul>
            </nav>
            <button className="logout-button">Cerrar Sesión</button>
        </div>
    );
};

export default Sidebar;
