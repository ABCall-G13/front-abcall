import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { useAuth } from './context/AuthContext';

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
    const { isAuthenticated, role } = useAuth();

    // Determina si mostrar el sidebar y el navbar
    const showSidebar = isAuthenticated && role !== null;
    const showNavbar = !isAuthenticated || role === null;

    return (
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
                            {/* Rutas abiertas */}
                            <Route path="/" element={<LoginClient />} />
                            <Route
                                path="/plan-selection"
                                element={<PlanSelection />}
                            />
                            <Route
                                path="/login-client"
                                element={<LoginClient />}
                            />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/search-incident"
                                element={<IncidentSearch />}
                            />

                            {/* Rutas para clientes */}
                            {isAuthenticated && role === 'cliente' && (
                                <>
                                    <Route
                                        path="/dashboard"
                                        element={<LookerDashboard />}
                                    />
                                    <Route
                                        path="/incident-list"
                                        element={<IncidentList />}
                                    />
                                    <Route
                                        path="/sync-users"
                                        element={<UserSync />}
                                    />
                                </>
                            )}

                            {/* Rutas para agentes */}
                            {isAuthenticated && role === 'agente' && (
                                <>
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
                                </>
                            )}

                            {/* Redireccionar a la página de inicio si la ruta no está permitida */}
                            <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                            />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default AppContent;
