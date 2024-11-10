import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

const LookerDashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Register = lazy(() => import('./pages/Register/Register'));
const PlanSelection = lazy(
    () => import('./pages/PlanSelection/PlanSelection')
);
const IncidentList = lazy(() => import('./pages/IncidentList/IncidentList'));
const ClienteList = lazy(() => import('./pages/DirectoryList/DirectoryList'));
const IncidentSearch = lazy(
    () => import('./pages/IncidentSearch/IncidentSearch')
);
const ProblemaComunList = lazy(
    () => import('./pages/CommonIssueList/CommonIssueList')
);
const UserSync = lazy(() => import('./pages/UserSync/UserSync'));
const LoginClient = lazy(() => import('./pages/LoginClient/LoginClient'));

const AppContent: React.FC = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const showSidebar =
        currentPath !== '/' &&
        currentPath !== '/plan-selection' &&
        currentPath !== '/search-incident' &&
        currentPath !== '/login-client' &&
        currentPath !== '/register';

    const showNavbar =
        currentPath === '/' ||
        currentPath === '/plan-selection' ||
        currentPath === '/search-incident' ||
        currentPath === '/login-client' ||
        currentPath === '/register';

    return (
        <AuthProvider>
            <div className="app-container">
                {showNavbar && <Navbar />}
                <div
                    className={`content-wrapper ${
                        showSidebar ? 'with-sidebar' : ''
                    }`}
                >
                    {showSidebar && <Sidebar />}
                    <div className="main-content">
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route path="/" element={<LoginClient />} />
                                <Route
                                    path="/plan-selection"
                                    element={<PlanSelection />}
                                />
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
                                    path="/sync-users"
                                    element={
                                        <PrivateRoute>
                                            <UserSync />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/login-client"
                                    element={<LoginClient />}
                                />
                                <Route
                                    path="/register"
                                    element={<Register />}
                                />
                            </Routes>
                        </Suspense>
                    </div>
                </div>
            </div>
        </AuthProvider>
    );
};

export default AppContent;
