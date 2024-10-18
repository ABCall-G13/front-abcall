// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register/Register';
import PlanSelection from './pages/PlanSelection/PlanSelection'; // Asegúrate de importar esta página si la usarás
import Navbar from './components/Navbar/Navbar';
import CreateIncident from './pages/CreateIncident/CreateIncident';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/plan-selection" element={<PlanSelection />} /> {/* Página para la selección de planes */}
        <Route path="/create-incident" element={<CreateIncident />} /> 
        <Route path="*" element={<h1>404: Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
