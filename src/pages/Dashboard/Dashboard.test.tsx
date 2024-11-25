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

    it('renders a generic error for non-Axios errors', async () => {
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

    it('renders an iframe with the correct src params for a valid client ID', async () => {
        mockUseAuth.mockReturnValue({ token: 'mock-token' });
        mockAxios.get.mockResolvedValueOnce({ data: { clientId: 456 } });

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
                        JSON.stringify({ 'ds27.cliente_parameter': 456 })
                    )
                )
            );
        });
    });

    it('renders an error when the API returns an invalid response format', async () => {
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

    // it('handles an Axios error and displays the correct error message', async () => {
    //     const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    //     mockUseAuth.mockReturnValue({ token: 'mock-token' });
    //     mockAxios.get.mockRejectedValueOnce({
    //         isAxiosError: true,
    //         response: { data: { message: 'Failed to fetch client ID' } },
    //     });

    //     await act(async () => {
    //         render(
    //             <MemoryRouter>
    //                 <LookerDashboard />
    //             </MemoryRouter>
    //         );
    //     });

    //     await waitFor(() => {
    //         expect(
    //             screen.getByText(/failed to fetch client id/i)
    //         ).toBeInTheDocument();
    //         expect(consoleSpy).toHaveBeenCalledWith(
    //             'Axios error:',
    //             expect.objectContaining({
    //                 response: {
    //                     data: { message: 'Failed to fetch client ID' },
    //                 },
    //             })
    //         );
    //     });

    //     consoleSpy.mockRestore();
    // });

    // it('handles an Axios error with no response message and displays a default error', async () => {
    //     const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    //     mockUseAuth.mockReturnValue({ token: 'mock-token' });
    //     mockAxios.get.mockRejectedValueOnce({
    //         isAxiosError: true,
    //         response: undefined, // Simulate an Axios error with no response
    //     });

    //     await act(async () => {
    //         render(
    //             <MemoryRouter>
    //                 <LookerDashboard />
    //             </MemoryRouter>
    //         );
    //     });

    //     await waitFor(() => {
    //         expect(
    //             screen.getByText(/an unexpected error occurred/i)
    //         ).toBeInTheDocument();
    //         expect(consoleSpy).toHaveBeenCalledWith(
    //             'Axios error:',
    //             expect.objectContaining({
    //                 isAxiosError: true,
    //                 response: undefined,
    //             })
    //         );
    //     });

    //     consoleSpy.mockRestore();
    // });
});
