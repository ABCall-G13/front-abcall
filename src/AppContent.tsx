import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LookerDashboard from './pages/Dashboard/Dashboard';
import Register from './pages/Register/Register';
import PlanSelection from './pages/PlanSelection/PlanSelection';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import IncidentList from './pages/IncidentList/IncidentList';

const AppContent: React.FC = () => {
    const currentPath = window.location.pathname;

    const showSidebar =
        currentPath !== '/' && currentPath !== '/plan-selection';
    const showNavbar =
        currentPath === '/' || currentPath === '/plan-selection';
    const showSvgBackground =
        currentPath !== '/' && currentPath !== '/plan-selection';

    return (
        <div
            className={`app-container ${
                showSvgBackground ? 'svg-background' : ''
            }`}
        >
            {showNavbar && <Navbar />}
            <div
                className={`content-wrapper ${
                    showSidebar ? 'with-sidebar' : ''
                }`}
            >
                {showSidebar && <Sidebar />}
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Register />} />
                        <Route
                            path="/plan-selection"
                            element={<PlanSelection />}
                        />
                        <Route
                            path="/dashboard"
                            element={<LookerDashboard />}
                        />
                        <Route
                            path="/incident-list"
                            element={<IncidentList />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AppContent;
