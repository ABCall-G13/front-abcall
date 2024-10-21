import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './Sidebar';

// Envolvemos el componente en el Router ya que usa Link para la navegación
describe('Sidebar Component', () => {
  test('renders Sidebar component correctly', () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );

    // Verifica que la imagen del logo esté presente
    const logoImage = screen.getByAltText('ABCall Logo');
    expect(logoImage).toBeInTheDocument();

    // Verifica que los enlaces de navegación estén presentes
    const homeLink = screen.getByText('Inicio');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    const dashboardLink = screen.getByText('Tableros');
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');

    const billingLink = screen.getByText('Facturación');
    expect(billingLink).toBeInTheDocument();
    expect(billingLink).toHaveAttribute('href', '/billing');

    const syncUsersLink = screen.getByText('Sincronizar usuarios');
    expect(syncUsersLink).toBeInTheDocument();
    expect(syncUsersLink).toHaveAttribute('href', '/sync-users');

    // Verifica que el botón de cierre de sesión esté presente
    const logoutButton = screen.getByText('Cerrar Sesión');
    expect(logoutButton).toBeInTheDocument();
  });
});
