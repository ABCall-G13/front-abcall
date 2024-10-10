// src/App.tsx
import React from 'react';
import Register from './pages/Register';
import Navbar from './components/Navbar/Navbar';

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Register />
    </div>
  );
};

export default App;
