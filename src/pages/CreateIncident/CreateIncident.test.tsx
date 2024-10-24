import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Cambia esta línea
import CreateIncident from './CreateIncident';
import axiosInstance from '../../utils/axiosInstance';

// Mock de axiosInstance
jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('CreateIncident component', () => {
    const mockOnClose = jest.fn();
    const mockOnIncidentCreated = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form correctly', async () => {
        mockAxiosInstance.get.mockResolvedValue({
            data: {
                categoria: ['Hardware', 'Software'],
                prioridad: ['Alta', 'Media', 'Baja'],
                canal: ['Email', 'Teléfono'],
                estado: ['Abierto', 'Cerrado'],
            },
        });

        render(
            <CreateIncident
                onClose={mockOnClose}
                onIncidentCreated={mockOnIncidentCreated}
            />
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
            // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
            expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
            // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
            expect(screen.getByLabelText(/Prioridad/i)).toBeInTheDocument();
        });
    });

    test('submits the form with valid data', async () => {
        mockAxiosInstance.get.mockResolvedValue({
            data: {
                categoria: ['Hardware', 'Software'],
                prioridad: ['Alta', 'Media', 'Baja'],
                canal: ['Email', 'Teléfono'],
                estado: ['Abierto', 'Cerrado'],
            },
        });

        render(
            <CreateIncident
                onClose={mockOnClose}
                onIncidentCreated={mockOnIncidentCreated}
            />
        );

        fireEvent.change(screen.getByLabelText(/Descripción/i), {
            target: { value: 'Incidente de prueba' },
        });
        fireEvent.change(screen.getByLabelText(/Categoría/i), {
            target: { value: 'Hardware' },
        });
        fireEvent.change(screen.getByLabelText(/Prioridad/i), {
            target: { value: 'Alta' },
        });
        fireEvent.change(screen.getByLabelText(/Cliente/i), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText(/Canal/i), {
            target: { value: 'Email' },
        });

        mockAxiosInstance.post.mockResolvedValue({ data: { success: true } });

        fireEvent.submit(
            screen.getByRole('button', { name: /Registrar Incidente/i })
        );

        await waitFor(() => {
            expect(axiosInstance.post).toHaveBeenCalledWith(
                '/incidente',
                expect.any(Object)
            );
        });
    });

    test('shows error message when submission fails', async () => {
        mockAxiosInstance.get.mockResolvedValue({
            data: {
                categoria: ['Hardware', 'Software'],
                prioridad: ['Alta', 'Media', 'Baja'],
                canal: ['Email', 'Teléfono'],
                estado: ['Abierto', 'Cerrado'],
            },
        });

        render(
            <CreateIncident
                onClose={mockOnClose}
                onIncidentCreated={mockOnIncidentCreated}
            />
        );

        fireEvent.change(screen.getByLabelText(/Descripción/i), {
            target: { value: 'Incidente de prueba' },
        });
        fireEvent.change(screen.getByLabelText(/Categoría/i), {
            target: { value: 'Hardware' },
        });
        fireEvent.change(screen.getByLabelText(/Prioridad/i), {
            target: { value: 'Alta' },
        });
        fireEvent.change(screen.getByLabelText(/Cliente/i), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText(/Canal/i), {
            target: { value: 'Email' },
        });

        mockAxiosInstance.post.mockRejectedValue(
            new Error('Error al crear incidente')
        );

        fireEvent.submit(
            screen.getByRole('button', { name: /Registrar Incidente/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText(/Hubo un error al crear el incidente/i)
            ).toBeInTheDocument();
        });
    });
});
