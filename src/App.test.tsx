import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppContent from './AppContent';
import { AuthProvider } from './context/AuthContext';

describe('AppContent Component', () => {
    test('renders Navbar when not authenticated', () => {
        render(
            <AuthProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </AuthProvider>
        );

        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('renders Sidebar and cliente routes when authenticated as cliente', () => {
        localStorage.setItem('token', 'test-token');
        localStorage.setItem('role', 'cliente');

        render(
            <AuthProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </AuthProvider>
        );

        expect(screen.getByText('Tableros')).toBeInTheDocument();
    });

    test('renders Sidebar and agente routes when authenticated as agente', () => {
        localStorage.setItem('token', 'test-token');
        localStorage.setItem('role', 'agente');

        render(
            <AuthProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </AuthProvider>
        );

        expect(screen.getByText('Directorio')).toBeInTheDocument();
        expect(screen.getByText('Incidentes')).toBeInTheDocument();
        expect(screen.getByText('Problemas comunes')).toBeInTheDocument();
    });
});
