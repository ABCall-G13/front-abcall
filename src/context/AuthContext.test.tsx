import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import '@testing-library/jest-dom';

// Componente de prueba para usar el contexto
const TestComponent: React.FC = () => {
    const { isAuthenticated, login, logout, token } = useAuth();

    return (
        <div>
            <p>Authenticated: {isAuthenticated.toString()}</p>
            <p>Token: {token}</p>
            <button onClick={() => login('test-token')}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('provides default values', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
        expect(screen.getByText('Token:')).toBeInTheDocument();
    });

    test('login sets isAuthenticated to true and stores token', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByText('Login').click();
        });

        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
        expect(screen.getByText('Token: test-token')).toBeInTheDocument();
        expect(localStorage.getItem('token')).toBe('test-token');
    });

    test('logout sets isAuthenticated to false and removes token', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByText('Login').click();
        });

        act(() => {
            screen.getByText('Logout').click();
        });

        expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
        expect(screen.getByText('Token:')).toBeInTheDocument();
        expect(localStorage.getItem('token')).toBeNull();
    });

    test('restores token from localStorage on mount', () => {
        localStorage.setItem('token', 'stored-token');

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
        expect(screen.getByText('Token: stored-token')).toBeInTheDocument();
    });
});