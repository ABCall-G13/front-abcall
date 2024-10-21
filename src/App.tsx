// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LookerDashboard from './pages/Dashboard/Dashboard';
import Register from './pages/Register/Register';
import PlanSelection from './pages/PlanSelection/PlanSelection';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';

const App: React.FC = () => {
  const location = useLocation();

  const showSidebar = location.pathname !== '/' && location.pathname !== '/plan-selection';
  const showNavbar = location.pathname === '/' || location.pathname === '/plan-selection';
  const showSvgBackground = location.pathname !== '/' && location.pathname !== '/plan-selection';

  return (
    <div className={`app-container ${showSvgBackground ? 'svg-background' : ''}`}>
      {showNavbar && <Navbar />}
      <div className={`content-wrapper ${showSidebar ? 'with-sidebar' : ''}`}>
        {showSidebar && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/plan-selection" element={<PlanSelection />} />
            <Route path="/dashboard" element={<LookerDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
