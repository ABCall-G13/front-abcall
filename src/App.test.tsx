import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import AppContent from './AppContent'; // Verify export is correct
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

jest.mock('./context/AuthContext', () => ({
    ...jest.requireActual('./context/AuthContext'),
    useAuth: jest.fn(),
}));

describe('AppContent Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('renders Navbar when not authenticated (line 18)', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            role: null,
        });

        render(
            <AuthProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </AuthProvider>
        );

        expect(screen.getByRole('navigation')).toBeInTheDocument();
        expect(screen.queryByText('Sidebar')).not.toBeInTheDocument();
    });

    // test('renders Sidebar when authenticated as cliente (line 15)', () => {
    //     (useAuth as jest.Mock).mockReturnValue({
    //         isAuthenticated: true,
    //         role: 'cliente',
    //     });

    //     render(
    //         <AuthProvider>
    //             <BrowserRouter>
    //                 <AppContent />
    //             </BrowserRouter>
    //         </AuthProvider>
    //     );

    //     expect(screen.getByText('Tableros')).toBeInTheDocument();
    //     expect(screen.getByText('Incidentes')).toBeInTheDocument();
    //     expect(screen.getByText('Sincronizar usuarios')).toBeInTheDocument();
    //     expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    // });

    // test('renders Sidebar when authenticated as agente (line 15)', () => {
    //     (useAuth as jest.Mock).mockReturnValue({
    //         isAuthenticated: true,
    //         role: 'agente',
    //     });

    //     render(
    //         <AuthProvider>
    //             <BrowserRouter>
    //                 <AppContent />
    //             </BrowserRouter>
    //         </AuthProvider>
    //     );

    //     expect(screen.getByText('Directorio')).toBeInTheDocument();
    //     expect(screen.getByText('Incidentes')).toBeInTheDocument();
    //     expect(screen.getByText('Problemas comunes')).toBeInTheDocument();
    //     expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    // });

    test('uses useLocation for route-based rendering (line 10)', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            role: 'cliente',
        });

        render(
            <AuthProvider>
                <MemoryRouter initialEntries={['/dashboard']}>
                    <AppContent />
                </MemoryRouter>
            </AuthProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('redirects unauthenticated user to login', () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            role: null,
        });

        render(
            <AuthProvider>
                <MemoryRouter initialEntries={['/dashboard']}>
                    <AppContent />
                </MemoryRouter>
            </AuthProvider>
        );

        expect(screen.getByRole('navigation')).toBeInTheDocument();
        expect(screen.queryByText('Tableros')).not.toBeInTheDocument();
    });

    // test('redirects to home page for unknown routes', () => {
    //     (useAuth as jest.Mock).mockReturnValue({
    //         isAuthenticated: true,
    //         role: 'cliente',
    //     });

    //     render(
    //         <AuthProvider>
    //             <MemoryRouter initialEntries={['/unknown-route']}>
    //                 <AppContent />
    //             </MemoryRouter>
    //         </AuthProvider>
    //     );

    //     expect(screen.getByText('Loading...')).toBeInTheDocument();
    // });
});
