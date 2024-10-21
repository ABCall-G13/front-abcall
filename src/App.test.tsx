import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppContent from './AppContent';

beforeEach(() => {
    delete (window as any).location;
    (window as any).location = {
        href: 'http://localhost/',
        pathname: '/',
        origin: 'http://localhost',
        assign: jest.fn(),
        reload: jest.fn(),
        replace: jest.fn(),
    };
});

test('renders Navbar on the root route', () => {
    render(
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
    // Aquí puedes verificar que el Navbar se renderiza correctamente
});

test('renders Sidebar on the /dashboard route', () => {
    (window as any).location.pathname = '/dashboard'; // Cambia la ruta mockeada

    render(
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
    // Aquí puedes verificar que el Sidebar se renderiza correctamente
});
