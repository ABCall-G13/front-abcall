import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import AppContent from './AppContent';
import { AuthProvider } from './context/AuthContext';

describe('AppContent Component', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

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
        expect(screen.getByText('Incidentes')).toBeInTheDocument();
        expect(screen.getByText('Sincronizar usuarios')).toBeInTheDocument();
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

    test('redirects unauthenticated user to login', () => {
        render(
            <AuthProvider>
                <MemoryRouter initialEntries={['/dashboard']}>
                    <AppContent />
                </MemoryRouter>
            </AuthProvider>
        );

        expect(screen.getByRole('navigation')).toBeInTheDocument(); // Navbar should be visible
        expect(screen.queryByText('Tableros')).not.toBeInTheDocument(); // Dashboard should not load
    });
});
