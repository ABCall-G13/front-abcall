import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent'; // El nuevo componente separado

const App: React.FC = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
