import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LookerDashboard from './pages/Dashboard/Dashboard';
import Register from './pages/Register/Register';
import PlanSelection from './pages/PlanSelection/PlanSelection';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import IncidentList from './pages/IncidentList/IncidentList';
import ClienteList from './pages/DirectoryList/DirectoryList';
import IncidentSearch from './pages/IncidentSearch/IncidentSearch';
import ProblemaComunList from './pages/CommonIssueList/CommonIssueList';
import UserSync from './pages/UserSync/UserSync';
import LoginClient from './pages/LoginClient/LoginClient';

const AppContent: React.FC = () => {
    const currentPath = window.location.pathname;

    const showSidebar =
        currentPath !== '/' &&
        currentPath !== '/plan-selection' &&
        currentPath !== '/search-incident';
    const showNavbar =
        currentPath === '/' ||
        currentPath === '/plan-selection' ||
        currentPath === '/search-incident';
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
                            path="/login-client" // Nueva ruta para LoginClient
                            element={<LoginClient />}
                        />
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
                        <Route
                            path="/directory-list"
                            element={<ClienteList />}
                        />
                        <Route
                            path="/common-issue-list"
                            element={<ProblemaComunList />}
                        />
                        <Route
                            path="/search-incident"
                            element={<IncidentSearch />}
                        />
                        <Route path="/user-sync" element={<UserSync />} />{' '}
                        {/* Nueva ruta */}
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AppContent;
