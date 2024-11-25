import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import LookerDashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

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

    it('renders the dashboard iframe when client ID is fetched successfully', async () => {
        mockUseAuth.mockReturnValue({ token: 'mock-token' });
        mockAxios.get.mockResolvedValue({ data: { clientId: 123 } }); // Correct format

        await act(async () => {
            render(
                <MemoryRouter>
                    <LookerDashboard />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(
                screen.getByText(/tablero de control/i)
            ).toBeInTheDocument();
        });

        const iframeElement = screen.getByTitle('Looker Studio Dashboard');
        expect(iframeElement).toBeInTheDocument();
        expect(iframeElement).toHaveAttribute(
            'src',
            expect.stringContaining(
                'https://lookerstudio.google.com/embed/reporting'
            )
        );
        expect(iframeElement).toHaveStyle('border: 0');
    });
});
