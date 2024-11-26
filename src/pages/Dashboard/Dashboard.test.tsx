import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LookerDashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

// Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock axiosInstance
jest.mock('../../utils/axiosInstance', () => ({
    get: jest.fn(),
    interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
    },
}));

describe('LookerDashboard', () => {
    const mockUseAuth = require('../../context/AuthContext').useAuth;

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

    // it('renders an error when the token is missing', async () => {
    //     mockUseAuth.mockReturnValue({ token: null });

    //     render(
    //         <MemoryRouter>
    //             <LookerDashboard />
    //         </MemoryRouter>
    //     );

    //     await waitFor(() => {
    //         expect(
    //             screen.getByText(/authentication token not found/i)
    //         ).toBeInTheDocument();
    //     });
    // });

    it('renders an error if fetching client ID fails', async () => {
        mockUseAuth.mockReturnValue({ token: 'mock-token' });
        (axiosInstance.get as jest.Mock).mockRejectedValue(
            new Error('Network Error')
        );

        render(
            <MemoryRouter>
                <LookerDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(
                screen.getByText(/failed to fetch client id/i)
            ).toBeInTheDocument();
        });
    });

    it('renders the dashboard iframe when client ID is fetched successfully', async () => {
        mockUseAuth.mockReturnValue({ token: 'mock-token' });
        (axiosInstance.get as jest.Mock).mockResolvedValue({ data: 123 });

        render(
            <MemoryRouter>
                <LookerDashboard />
            </MemoryRouter>
        );

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
