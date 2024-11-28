import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext', () => ({
    ...jest.requireActual('../../context/AuthContext'),
    useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe('Sidebar Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders cliente links when role is cliente', () => {
        mockedUseAuth.mockReturnValue({
            isAuthenticated: true,
            token: 'test-token',
            role: 'cliente',
            login: jest.fn(),
            logout: jest.fn(),
        });

        render(
            <Router>
                <Sidebar />
            </Router>
        );

        expect(screen.getByText('Tableros')).toBeInTheDocument();
        expect(screen.getByText('Sincronizar usuarios')).toBeInTheDocument();
        expect(screen.queryByText('Directorio')).not.toBeInTheDocument();
        expect(screen.queryByText('Problemas comunes')).not.toBeInTheDocument();
    });

    test('renders agente links when role is agente', () => {
        mockedUseAuth.mockReturnValue({
            isAuthenticated: true,
            token: 'test-token',
            role: 'agente',
            login: jest.fn(),
            logout: jest.fn(),
        });

        render(
            <Router>
                <Sidebar />
            </Router>
        );

        expect(screen.getByText('Directorio')).toBeInTheDocument();
        expect(screen.getByText('Incidentes')).toBeInTheDocument();
        expect(screen.getByText('Problemas comunes')).toBeInTheDocument();
        expect(screen.queryByText('Tableros')).not.toBeInTheDocument();
        expect(screen.queryByText('Sincronizar usuarios')).not.toBeInTheDocument();
    });
});