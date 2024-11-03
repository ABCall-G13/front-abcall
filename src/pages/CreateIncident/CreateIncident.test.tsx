import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateIncident from './CreateIncident';
import axiosInstance from '../../utils/axiosInstance';

jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('CreateIncident component', () => {
    const mockOnClose = jest.fn();
    const mockOnIncidentCreated = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test para renderizar el formulario correctamente
    test('renders form correctly', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({
            data: {
                categoria: ['Hardware', 'Software'],
                prioridad: ['Alta', 'Media', 'Baja'],
                canal: ['Email', 'Teléfono'],
                estado: ['Abierto', 'Cerrado'],
            },
        });

        mockAxiosInstance.get.mockResolvedValueOnce({
            data: [
                { id: 1, nombre: 'Cliente 1', email: 'cliente1@example.com', nit: '123456789', direccion: 'Direccion 1', telefono: '1234567890', industria: 'Industria 1', WelcomeMessage: 'Bienvenido Cliente 1' },
                { id: 2, nombre: 'Cliente 2', email: 'cliente2@example.com', nit: '987654321', direccion: 'Direccion 2', telefono: '0987654321', industria: 'Industria 2', WelcomeMessage: 'Bienvenido Cliente 2' },
            ],
        });

        // Renderizar el componente
        render(
            <CreateIncident
                onClose={mockOnClose}
                onIncidentCreated={mockOnIncidentCreated}
                initialUserInfo={{}} 
            />
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByLabelText(/Prioridad/i)).toBeInTheDocument();
        });
    });

    // Test para verificar que se envía el formulario con datos válidos
    test('submits the form with valid data', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({
            data: {
                categoria: ['Hardware', 'Software'],
                prioridad: ['Alta', 'Media', 'Baja'],
                canal: ['Email', 'Teléfono'],
                estado: ['Abierto', 'Cerrado'],
            },
        });

        mockAxiosInstance.get.mockResolvedValueOnce({
            data: [
                { id: 1, nombre: 'Cliente 1' },
                { id: 2, nombre: 'Cliente 2' },
            ],
        });

        render(
            <CreateIncident
                onClose={mockOnClose}
                onIncidentCreated={mockOnIncidentCreated}
                initialUserInfo={{}} 
            />
        );

        fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Incidente de prueba' } });
        fireEvent.change(screen.getByLabelText(/Categoría/i), { target: { value: 'Hardware' } });
        fireEvent.change(screen.getByLabelText(/Prioridad/i), { target: { value: 'Alta' } });
        fireEvent.change(screen.getByLabelText(/Canal/i), { target: { value: 'Email' } });

        mockAxiosInstance.post.mockResolvedValue({ data: { success: true } });

        fireEvent.submit(screen.getByRole('button', { name: /Registrar Incidente/i }));

        await waitFor(() => {
            expect(axiosInstance.post).toHaveBeenCalledWith(
                '/incidente',
                expect.any(Object)
            );
        });
    });

    // Test para el manejo de errores en la creación del incidente
    test('shows error message when submission fails', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({
            data: {
                categoria: ['Hardware', 'Software'],
                prioridad: ['Alta', 'Media', 'Baja'],
                canal: ['Email', 'Teléfono'],
                estado: ['Abierto', 'Cerrado'],
            },
        });

        mockAxiosInstance.get.mockResolvedValueOnce({
            data: [
                { id: 1, nombre: 'Cliente 1' },
                { id: 2, nombre: 'Cliente 2' },
            ],
        });

        // Renderizar el componente
        render(
            <CreateIncident
                onClose={mockOnClose}
                onIncidentCreated={mockOnIncidentCreated}
                initialUserInfo={{}} 
            />
        );

        fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Incidente de prueba' } });
        fireEvent.change(screen.getByLabelText(/Categoría/i), { target: { value: 'Hardware' } });
        fireEvent.change(screen.getByLabelText(/Prioridad/i), { target: { value: 'Alta' } });
        fireEvent.change(screen.getByLabelText(/Canal/i), { target: { value: 'Email' } });

        mockAxiosInstance.post.mockRejectedValueOnce(new Error('Error al crear incidente'));

        fireEvent.submit(screen.getByRole('button', { name: /Registrar Incidente/i }));

        await waitFor(() => {
            expect(screen.getByText(/Hubo un error al crear el incidente/i)).toBeInTheDocument();
        });

        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
