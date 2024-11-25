import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import LookerDashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock axios
jest.mock('axios');

describe('LookerDashboard', () => {
    const mockUseAuth = require('../../context/AuthContext').useAuth;
    const mockAxios = require('axios').default;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the loading state initially', () => {
        mockUseAuth.mockReturnValue({ token: 'mock-token' });
        render(
            <MemoryRouter>
                <LookerDashboard />
            </MemoryRouter>
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders an error when the token is missing', async () => {
        mockUseAuth.mockReturnValue({ token: null });

        render(
            <MemoryRouter>
                <LookerDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(
                screen.getByText(/authentication token not found/i)
            ).toBeInTheDocument();
        });
    });
});
