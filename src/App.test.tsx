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
});
