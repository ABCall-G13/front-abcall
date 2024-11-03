import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../utils/axiosInstance';
import IncidentList from './IncidentList';
import { MemoryRouter } from 'react-router-dom';

// Mock de axiosInstance
jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('IncidentList component', () => {
    const mockIncidents = [
        {
            id: 1,
            cliente_id: 101,
            description: 'Incidente 1',
            estado: 'Abierto',
            categoria: 'Hardware',
            canal: 'Email',
            prioridad: 'Alta',
            fecha_creacion: '2023-09-01T12:00:00Z',
            fecha_cierre: null,
            solucion: null,
            radicado: 'RAD123',
        },
        {
            id: 2,
            cliente_id: 102,
            description: 'Incidente 2',
            estado: 'Cerrado',
            categoria: 'Software',
            canal: 'Teléfono',
            prioridad: 'Media',
            fecha_creacion: '2023-09-02T12:00:00Z',
            fecha_cierre: '2023-09-05T12:00:00Z',
            solucion: 'Solución aplicada',
            radicado: 'RAD124',
        },
    ];

    beforeEach(() => {
        mockAxiosInstance.get.mockResolvedValue({ data: mockIncidents });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders incidents correctly after fetching', async () => {
        render(
            <MemoryRouter>
                <IncidentList />
            </MemoryRouter>
        );

        // Espera a que los datos de los incidentes se carguen
        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/incidentes');
        });

        // Verifica que los incidentes se renderizan en la tabla
        expect(screen.getByText('Incidente 1')).toBeInTheDocument();
        expect(screen.getByText('Incidente 2')).toBeInTheDocument();
        expect(screen.getByText('Abierto')).toBeInTheDocument();
        expect(screen.getByText('Cerrado')).toBeInTheDocument();
    });

    test('displays message when there are no incidents', async () => {
        // Configura la respuesta simulada de la API como una lista vacía
        mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

        render(
            <MemoryRouter>
                <IncidentList />
            </MemoryRouter>
        );

        // Espera a que se complete la llamada a la API y a que el mensaje esté en el DOM
        await waitFor(() => {
            expect(screen.getByText('No se encontraron incidentes')).toBeInTheDocument();
        });
    });

    test('opens and closes the detail modal when clicking on "Detalle"', async () => {
        render(
            <MemoryRouter>
                <IncidentList />
            </MemoryRouter>
        );

        // Espera a que los datos de los incidentes se carguen
        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/incidentes');
        });

        // Verifica que los botones "Detalle" se renderizan correctamente
        const detailButtons = screen.getAllByRole('button', { name: '' });
        expect(detailButtons.length).toBeGreaterThan(0);

        // Haz clic en el botón "Detalle" del primer incidente
        fireEvent.click(detailButtons[0]);

        // Verifica si el modal de detalle se abre mostrando contenido relevante
        await waitFor(() => {
            expect(
                screen.getByText('Descripción del soporte:')
            ).toBeInTheDocument();
        });

        // Cierra el modal
        const closeModalButton = screen.getByText('×');
        fireEvent.click(closeModalButton);

        // Verifica que el modal se cierra
        await waitFor(() => {
            expect(
                screen.queryByText('Descripción del soporte:')
            ).not.toBeInTheDocument();
        });
    });

    test('opens and closes the user validation modal when clicking on "AGREGAR INCIDENTE"', async () => {
        render(
            <MemoryRouter>
                <IncidentList />
            </MemoryRouter>
        );

        // Verifica que el botón "AGREGAR INCIDENTE" esté presente
        const addIncidentButton = screen.getByText('AGREGAR INCIDENTE');
        expect(addIncidentButton).toBeInTheDocument();

        // Haz clic en el botón "AGREGAR INCIDENTE" para abrir el modal de validación de usuario
        fireEvent.click(addIncidentButton);

        // Espera a que el modal de validación se abra
        await waitFor(() => {
            expect(screen.getByText('Validación de usuario')).toBeInTheDocument();
        });

        // Cierra el modal de validación
        const closeValidationModalButton = screen.getByLabelText('close');
        fireEvent.click(closeValidationModalButton);

        // Verifica que el modal de validación se haya cerrado
        await waitFor(() => {
            expect(screen.queryByText('Validación de usuario')).not.toBeInTheDocument();
        });
    });
});
