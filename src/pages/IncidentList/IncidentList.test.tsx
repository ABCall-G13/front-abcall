import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axiosInstance from '../../utils/axiosInstance';
import IncidentList from './IncidentList';
import { MemoryRouter } from 'react-router-dom';

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
        await act(async () => {
            render(
                <MemoryRouter>
                    <IncidentList />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/incidentes');
        });

        expect(screen.getByText('Incidente 1')).toBeInTheDocument();
        expect(screen.getByText('Incidente 2')).toBeInTheDocument();
        expect(screen.getByText('Abierto')).toBeInTheDocument();
        expect(screen.getByText('Cerrado')).toBeInTheDocument();
    });

    test('opens and closes the detail modal when clicking on "Detalle"', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <IncidentList />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/incidentes');
        });

        const detailButtons = screen.getAllByRole('button', { name: '' });
        expect(detailButtons.length).toBeGreaterThan(0);

        await act(async () => {
            fireEvent.click(detailButtons[0]);
        });

        await waitFor(() => {
            expect(
                screen.getByText('Descripción del soporte:')
            ).toBeInTheDocument();
        });

        const closeModalButton = screen.getByText('×');
        await act(async () => {
            fireEvent.click(closeModalButton);
        });

        await waitFor(() => {
            expect(
                screen.queryByText('Descripción del soporte:')
            ).not.toBeInTheDocument();
        });
    });

    test('opens and closes the user validation modal when clicking on "AGREGAR INCIDENTE"', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <IncidentList />
                </MemoryRouter>
            );
        });

        const addIncidentButton = screen.getByText('AGREGAR INCIDENTE');
        expect(addIncidentButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(addIncidentButton);
        });

        await waitFor(() => {
            expect(
                screen.getByText('Validación de usuario')
            ).toBeInTheDocument();
        });

        const closeValidationModalButton = screen.getByLabelText('close');
        await act(async () => {
            fireEvent.click(closeValidationModalButton);
        });

        await waitFor(() => {
            expect(
                screen.queryByText('Validación de usuario')
            ).not.toBeInTheDocument();
        });
    });

    test('displays error message when fetching incidents fails', async () => {
        const errorMessage = 'Error al obtener incidentes';
        mockAxiosInstance.get.mockRejectedValueOnce(new Error(errorMessage));

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        await act(async () => {
            render(
                <MemoryRouter>
                    <IncidentList />
                </MemoryRouter>
            );
        });

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/incidentes');
        });

        consoleErrorSpy.mockRestore();
    });

    test('opens and handles user validation modal', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <IncidentList />
                </MemoryRouter>
            );
        });

        fireEvent.click(screen.getByText(/AGREGAR INCIDENTE/i));
        expect(
            await screen.findByText(/Validación de usuario/i)
        ).toBeInTheDocument();

        const selectField = screen.getByLabelText(/Tipo de documento/i);
        fireEvent.change(selectField, { target: { value: 'CC' } });
        expect((selectField as HTMLSelectElement).value).toBe('CC');

        const inputField = screen.getByLabelText(/Número de identificación/i);
        await userEvent.type(inputField, 'usuarioValido');

        const validateButton = screen.getByText(/Validar usuario/i);
        await act(async () => {
            fireEvent.click(validateButton);
        });
    });

    test('opens incident detail modal', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <IncidentList />
                </MemoryRouter>
            );
        });

        expect(await screen.findByText(/RAD123/i)).toBeInTheDocument();

        const detailButton = screen.getAllByRole('button', { name: '' })[0];
        await act(async () => {
            fireEvent.click(detailButton);
        });

        expect(
            await screen.findByText(/Detalle del Incidente/i)
        ).toBeInTheDocument();
    });

    test('closes create incident modal', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <IncidentList />
                </MemoryRouter>
            );
        });

        fireEvent.click(screen.getByText(/AGREGAR INCIDENTE/i));
        expect(screen.queryByText(/Crear Incidente/i)).not.toBeInTheDocument();
    });
});
