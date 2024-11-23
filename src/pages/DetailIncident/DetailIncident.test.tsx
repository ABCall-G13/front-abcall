import React from 'react';
import {
    render,
    fireEvent,
    waitFor,
    screen,
    act,
} from '@testing-library/react';
import DetailIncidentModal from './DetailIncident';
import axiosInstance from '../../utils/axiosInstance';

jest.mock('../../utils/axiosInstance');

const mockIncidentDetail = {
    id: 1,
    cliente_id: 123,
    description: 'Test incident description',
    estado: 'abierto',
    categoria: 'Test category',
    canal: 'Test channel',
    prioridad: 'Alta',
    fecha_creacion: '2023-01-01',
    fecha_cierre: null,
    solucion: null,
    radicado: 'ABC123',
};

const mockOnClose = jest.fn();
const mockOnIncidentUpdated = jest.fn();

describe('DetailIncidentModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when open', async () => {
        await act(async () => {
            render(
                <DetailIncidentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    incidentDetail={mockIncidentDetail}
                    onIncidentUpdated={mockOnIncidentUpdated}
                />
            );
        });

        expect(screen.getByText('Detalle del Incidente')).toBeInTheDocument();
        expect(
            screen.getByText('Descripción del soporte:')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Test incident description')
        ).toBeInTheDocument();
    });

    it('does not render when closed', async () => {
        await act(async () => {
            render(
                <DetailIncidentModal
                    isOpen={false}
                    onClose={mockOnClose}
                    incidentDetail={mockIncidentDetail}
                    onIncidentUpdated={mockOnIncidentUpdated}
                />
            );
        });

        expect(
            screen.queryByText('Detalle del Incidente')
        ).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        await act(async () => {
            render(
                <DetailIncidentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    incidentDetail={mockIncidentDetail}
                    onIncidentUpdated={mockOnIncidentUpdated}
                />
            );
        });

        fireEvent.click(screen.getByText('×'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles solucionar action', async () => {
        (axiosInstance.put as jest.Mock).mockResolvedValueOnce({});

        await act(async () => {
            render(
                <DetailIncidentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    incidentDetail={mockIncidentDetail}
                    onIncidentUpdated={mockOnIncidentUpdated}
                />
            );
        });

        fireEvent.change(
            screen.getByPlaceholderText('Escribe la solución aquí'),
            {
                target: { value: 'Test solution' },
            }
        );
        fireEvent.click(screen.getByText('Guardar Solución'));

        await waitFor(() =>
            expect(axiosInstance.put).toHaveBeenCalledWith(
                `/incidente/1/solucionar`,
                { solucion: 'Test solution' }
            )
        );
        expect(mockOnIncidentUpdated).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('fetches and displays common issues when "Buscar problemas comunes" is clicked', async () => {
        (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
            data: [{ id: 1, description: 'Common Issue 1' }],
        });

        await act(async () => {
            render(
                <DetailIncidentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    incidentDetail={mockIncidentDetail}
                    onIncidentUpdated={mockOnIncidentUpdated}
                />
            );
        });

        fireEvent.click(screen.getByText('Buscar problemas comunes'));

        await waitFor(() =>
            expect(axiosInstance.get).toHaveBeenCalledWith('/soluciones')
        );
        expect(screen.getByText('Common Issue 1')).toBeInTheDocument();
    });

    it('shows error message when IA solution fetch fails', async () => {
        (axiosInstance.post as jest.Mock).mockRejectedValueOnce(
            new Error('Network error')
        );

        await act(async () => {
            render(
                <DetailIncidentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    incidentDetail={mockIncidentDetail}
                    onIncidentUpdated={mockOnIncidentUpdated}
                />
            );
        });

        fireEvent.click(screen.getByText('Buscar solución con IA'));

        await waitFor(() =>
            expect(
                screen.getByText(
                    'No se encontraron problemas comunes para este incidente.'
                )
            ).toBeInTheDocument()
        );
    });

    it('shows error message when common issues fetch fails', async () => {
        (axiosInstance.get as jest.Mock).mockRejectedValueOnce(
            new Error('Network error')
        );

        await act(async () => {
            render(
                <DetailIncidentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    incidentDetail={mockIncidentDetail}
                    onIncidentUpdated={mockOnIncidentUpdated}
                />
            );
        });

        fireEvent.click(screen.getByText('Buscar problemas comunes'));

        await waitFor(() =>
            expect(
                screen.getByText('Error fetching common problem data')
            ).toBeInTheDocument()
        );
    });

    it('shows error message on solucionar failure', async () => {
        (axiosInstance.put as jest.Mock).mockRejectedValueOnce(
            new Error('Network error')
        );

        await act(async () => {
            render(
                <DetailIncidentModal
                    isOpen={true}
                    onClose={mockOnClose}
                    incidentDetail={mockIncidentDetail}
                    onIncidentUpdated={mockOnIncidentUpdated}
                />
            );
        });
        fireEvent.change(
            screen.getByPlaceholderText('Escribe la solución aquí'),
            {
                target: { value: 'Test solution' },
            }
        );
        fireEvent.click(screen.getByText('Guardar Solución'));

        await waitFor(() =>
            expect(
                screen.getByText('Error al solucionar incidente')
            ).toBeInTheDocument()
        );
    });
});
