// src/pages/Dashboard/LookerDashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import LookerDashboard from './Dashboard';

test('renders LookerDashboard component correctly', () => {
    render(<LookerDashboard />);
    
    // Verifica que el título se muestre
    const titleElement = screen.getByText(/Dashboard Incidentes/i);
    expect(titleElement).toBeInTheDocument();
    
});
