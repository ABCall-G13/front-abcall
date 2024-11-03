import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
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
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

const AppContent: React.FC = () => {
    const currentPath = window.location.pathname;

    const showSidebar =
        currentPath !== '/' &&
        currentPath !== '/plan-selection' &&
        currentPath !== '/search-incident' &&
        currentPath !== '/login-client';

    const showNavbar =
        currentPath === '/' ||
        currentPath === '/plan-selection' ||
        currentPath === '/search-incident' ||
        currentPath === '/login-client';
    const showSvgBackground =
        currentPath !== '/' && currentPath !== '/plan-selection';

    return (
        <AuthProvider>
                <div className={`app-container ${showSvgBackground ? 'svg-background' : ''}`}>
                    {showNavbar && <Navbar />}
                    <div className={`content-wrapper ${showSidebar ? 'with-sidebar' : ''}`}>
                        {showSidebar && <Sidebar />}
                        <div className="main-content">
                            <Routes>
                                <Route path="/" element={<Register />} />
                                <Route path="/login-client" element={<LoginClient />} />
                                <Route path="/plan-selection" element={<PlanSelection />} />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <PrivateRoute>
                                            <LookerDashboard />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/incident-list"
                                    element={
                                        <PrivateRoute>
                                            <IncidentList />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/directory-list"
                                    element={
                                        <PrivateRoute>
                                            <ClienteList />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/common-issue-list"
                                    element={
                                        <PrivateRoute>
                                            <ProblemaComunList />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/search-incident"
                                    element={
                                        <PrivateRoute>
                                            <IncidentSearch />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/user-sync"
                                    element={
                                        <PrivateRoute>
                                            <UserSync />
                                        </PrivateRoute>
                                    }
                                />
                            </Routes>
                        </div>
                    </div>
                </div>
        </AuthProvider>
    );
};

export default AppContent;