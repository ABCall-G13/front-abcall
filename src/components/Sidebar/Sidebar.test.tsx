import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthProvider } from '../../context/AuthContext';

// Envolvemos el componente en el Router y AuthProvider ya que usa Link para la navegación y useAuth
describe('Sidebar Component', () => {
    test('renders Sidebar component correctly', () => {
        render(
            <AuthProvider>
                <Router>
                    <Sidebar />
                </Router>
            </AuthProvider>
        );

        // Verifica que la imagen del logo esté presente
        const logoImage = screen.getByAltText('ABCall Logo');
        expect(logoImage).toBeInTheDocument();

        // Verifica que los enlaces de navegación estén presentes
        const dashboardLink = screen.getByText('Tableros');
        expect(dashboardLink).toBeInTheDocument();
        expect(dashboardLink).toHaveAttribute('href', '/dashboard');

        const billingLink = screen.getByText('Facturación');
        expect(billingLink).toBeInTheDocument();
        expect(billingLink).toHaveAttribute('href', '/billing');

        const syncUsersLink = screen.getByText('Sincronizar usuarios');
        expect(syncUsersLink).toBeInTheDocument();
        expect(syncUsersLink).toHaveAttribute('href', '/sync-users');

        const incidentListLink = screen.getByText('Incidentes');
        expect(incidentListLink).toBeInTheDocument();
        expect(incidentListLink).toHaveAttribute('href', '/incident-list');

        const directoryListLink = screen.getByText('Directorio');
        expect(directoryListLink).toBeInTheDocument();
        expect(directoryListLink).toHaveAttribute('href', '/directory-list');

        const commonIssueListLink = screen.getByText('Problemas comunes');
        expect(commonIssueListLink).toBeInTheDocument();
        expect(commonIssueListLink).toHaveAttribute('href', '/common-issue-list');

        // Verifica que el botón de cierre de sesión esté presente
        const logoutButton = screen.getByText('Cerrar Sesión');
        expect(logoutButton).toBeInTheDocument();
    });
});