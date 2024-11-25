import { render, screen, waitFor, act } from '@testing-library/react';
import LookerDashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mock useAuth from AuthContext
jest.mock('../../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock axios
jest.mock('axios');

// Mock i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key, // Translate key directly for simplicity
    }),
}));

describe('LookerDashboard - Additional Tests', () => {
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

    it('renders a generic error for non-Axios errors (line 34)', async () => {
        mockUseAuth.mockReturnValue({ token: 'mock-token' });
        mockAxios.get.mockRejectedValueOnce(new Error('Unexpected error'));

        await act(async () => {
            render(
                <MemoryRouter>
                    <LookerDashboard />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(
                screen.getByText(/error: unexpected error/i)
            ).toBeInTheDocument();
        });
    });

    it('renders an iframe with correct src params when client ID is fetched (line 41, 42)', async () => {
        mockUseAuth.mockReturnValue({ token: 'mock-token' });
        mockAxios.get.mockResolvedValueOnce({ data: { clientId: 123 } });

        await act(async () => {
            render(
                <MemoryRouter>
                    <LookerDashboard />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            const iframeElement = screen.getByTitle('Looker Studio Dashboard');
            expect(iframeElement).toHaveAttribute(
                'src',
                expect.stringContaining(
                    encodeURIComponent(
                        JSON.stringify({ 'ds27.cliente_parameter': 123 })
                    )
                )
            );
            expect(iframeElement).toBeInTheDocument();
        });
    });

    it('renders an error when the API returns an invalid response format (line 34)', async () => {
        mockUseAuth.mockReturnValue({ token: 'mock-token' });
        mockAxios.get.mockResolvedValueOnce({ data: {} }); // Missing `clientId`

        await act(async () => {
            render(
                <MemoryRouter>
                    <LookerDashboard />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(
                screen.getByText(/invalid response format/i)
            ).toBeInTheDocument();
        });
    });
});
