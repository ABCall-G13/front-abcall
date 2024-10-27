import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../utils/axiosInstance';
import ClienteList from './DirectoryList';
import { MemoryRouter } from 'react-router-dom'; // For routing context

// Mock axiosInstance
jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('ClienteList component', () => {
    const mockClientes = [
        {
            id: 1,
            nombre: 'Cliente 1',
            telefono: '123456789',
            WelcomeMessage: 'Bienvenido, Cliente 1',
        },
        {
            id: 2,
            nombre: 'Cliente 2',
            telefono: '987654321',
            WelcomeMessage: null,
        },
    ];

    beforeEach(() => {
        mockAxiosInstance.get.mockResolvedValue({ data: mockClientes });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders clients correctly after fetching', async () => {
        render(
            <MemoryRouter>
                <ClienteList />
            </MemoryRouter>
        );

        // Wait for data to load
        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/clientes');
        });

        // Check if clients are rendered in the table
        expect(screen.getByText('Cliente 1')).toBeInTheDocument();
        expect(screen.getByText('Cliente 2')).toBeInTheDocument();
        expect(screen.getByText('123456789')).toBeInTheDocument();
        expect(screen.getByText('987654321')).toBeInTheDocument();
        expect(screen.getByText('Bienvenido, Cliente 1')).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument(); // For null WelcomeMessage
    });

    test('displays message when there are no clients', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

        render(
            <MemoryRouter>
                <ClienteList />
            </MemoryRouter>
        );

        // Wait for the clients table to update
        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/clientes');
        });

        // Verify that the "No se encontraron clientes" message is displayed
        expect(
            screen.getByText('No se encontraron clientes')
        ).toBeInTheDocument();
    });
});
