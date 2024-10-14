// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register/Register';
import PlanSelection from './pages/PlanSelection/PlanSelection'; // Asegúrate de importar esta página si la usarás
import Navbar from './components/Navbar/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/plan-selection" element={<PlanSelection />} /> {/* Página para la selección de planes */}
      </Routes>
    </Router>
  );
};

export default App;
