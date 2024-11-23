// [src/context/AuthContext.test.tsx](src/context/AuthContext.test.tsx)

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import '@testing-library/jest-dom';

// Componente de prueba para usar el contexto
const TestComponent: React.FC = () => {
    const { isAuthenticated, login, logout, token, role } = useAuth();

    return (
        <div>
            <p>Authenticated: {isAuthenticated.toString()}</p>
            <p>Token: {token}</p>
            <p>Role: {role}</p>
            <button onClick={() => login('test-token', 'cliente')}>Login as Cliente</button>
            <button onClick={() => login('test-token', 'agente')}>Login as Agente</button>
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
        expect(screen.getByText('Role:')).toBeInTheDocument();
    });

    test('login sets isAuthenticated to true, stores token and role', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByText('Login as Cliente').click();
        });

        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
        expect(screen.getByText('Token: test-token')).toBeInTheDocument();
        expect(screen.getByText('Role: cliente')).toBeInTheDocument();
        expect(localStorage.getItem('token')).toBe('test-token');
        expect(localStorage.getItem('role')).toBe('cliente');

        // Probando login como agente
        act(() => {
            screen.getByText('Login as Agente').click();
        });

        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
        expect(screen.getByText('Token: test-token')).toBeInTheDocument();
        expect(screen.getByText('Role: agente')).toBeInTheDocument();
        expect(localStorage.getItem('token')).toBe('test-token');
        expect(localStorage.getItem('role')).toBe('agente');
    });

    test('logout sets isAuthenticated to false and removes token and role', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByText('Login as Cliente').click();
        });

        act(() => {
            screen.getByText('Logout').click();
        });

        expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
        expect(screen.getByText('Token:')).toBeInTheDocument();
        expect(screen.getByText('Role:')).toBeInTheDocument();
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('role')).toBeNull();
    });

    test('restores token and role from localStorage on mount', () => {
        localStorage.setItem('token', 'stored-token');
        localStorage.setItem('role', 'cliente');

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
        expect(screen.getByText('Token: stored-token')).toBeInTheDocument();
        expect(screen.getByText('Role: cliente')).toBeInTheDocument();
    });
});