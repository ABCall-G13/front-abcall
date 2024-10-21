// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LookerDashboard from './pages/Dashboard/Dashboard';
import Register from './pages/Register/Register';
import PlanSelection from './pages/PlanSelection/PlanSelection';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import IncidentList from './pages/IncidentList/IncidentList';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="app-container">
      {location.pathname === '/' ? <Navbar /> : <Sidebar />}
      <div className={`main-content ${location.pathname !== '/' ? 'content-with-sidebar' : ''}`}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/plan-selection" element={<PlanSelection />} />
          <Route path="/dashboard" element={<LookerDashboard />} />
          <Route path="/incident-list" element={<IncidentList />} />
        </Routes>
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