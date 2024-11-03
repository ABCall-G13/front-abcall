import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import DetailIncidentModal from './DetailIncident';
import axiosInstance from '../../utils/axiosInstance';

jest.mock('../../utils/axiosInstance');

(axiosInstance.get as jest.Mock).mockResolvedValue({ data: [] });

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
    it('renders correctly when open', () => {
        render(
            <DetailIncidentModal
                isOpen={true}
                onClose={mockOnClose}
                incidentDetail={mockIncidentDetail}
                onIncidentUpdated={mockOnIncidentUpdated}
            />
        );

        expect(screen.getByText('Detalle del Incidente')).toBeInTheDocument();
        expect(screen.getByText('Descripción del soporte:')).toBeInTheDocument();
        expect(screen.getByText('Test incident description')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(
            <DetailIncidentModal
                isOpen={false}
                onClose={mockOnClose}
                incidentDetail={mockIncidentDetail}
                onIncidentUpdated={mockOnIncidentUpdated}
            />
        );

        expect(screen.queryByText('Detalle del Incidente')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(
            <DetailIncidentModal
                isOpen={true}
                onClose={mockOnClose}
                incidentDetail={mockIncidentDetail}
                onIncidentUpdated={mockOnIncidentUpdated}
            />
        );

        fireEvent.click(screen.getByText('×'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles solucionar action', async () => {
        (axiosInstance.put as jest.Mock).mockResolvedValueOnce({});
        render(
            <DetailIncidentModal
                isOpen={true}
                onClose={mockOnClose}
                incidentDetail={mockIncidentDetail}
                onIncidentUpdated={mockOnIncidentUpdated}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('Escribe la solución aquí'), {
            target: { value: 'Test solution' },
        });
        fireEvent.click(screen.getByText('Guardar Solución'));

        await waitFor(() => 
            expect(axiosInstance.put).toHaveBeenCalledWith(
                `/incidente/1/solucionar`,
                { solucion: 'Test solution' }
            )
        );
        await waitFor(() => expect(mockOnIncidentUpdated).toHaveBeenCalled());
        await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
    });

    it('handles escalar action', async () => {
        (axiosInstance.put as jest.Mock).mockResolvedValueOnce({});
        render(
            <DetailIncidentModal
                isOpen={true}
                onClose={mockOnClose}
                incidentDetail={mockIncidentDetail}
                onIncidentUpdated={mockOnIncidentUpdated}
            />
        );

        fireEvent.click(screen.getByText('Escalar'));

        await waitFor(() => expect(axiosInstance.put).toHaveBeenCalledWith(`/incidente/1/escalar`));
        await waitFor(() => expect(mockOnIncidentUpdated).toHaveBeenCalled());
        await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
    });

    it('opens and closes ProblemaComunModal', () => {
        render(
            <DetailIncidentModal
                isOpen={true}
                onClose={mockOnClose}
                incidentDetail={mockIncidentDetail}
                onIncidentUpdated={mockOnIncidentUpdated}
            />
        );

        fireEvent.click(screen.getByText('Buscar problemas comunes'));
    });
});