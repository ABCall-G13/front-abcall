import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailIncidentModal from './DetailIncident';

describe('DetailIncidentModal component', () => {
    const mockOnClose = jest.fn();

    const incidentDetail = {
        id: 0,
        cliente_id: 0,
        description: '',
        estado: '',
        categoria: '',
        canal: '',
        prioridad: 'alta',
        fecha_creacion: '',
        fecha_cierre: null,
        solucion: '',
        radicado: '',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly when open', () => {
        render(
            <DetailIncidentModal
                isOpen={true}
                onClose={mockOnClose}
                incidentDetail={incidentDetail}
                onIncidentUpdated={jest.fn()}
            />
        );

        expect(screen.getByText('Detalle del Incidente')).toBeInTheDocument();
        expect(
            screen.getByText('Descripción del soporte:')
        ).toBeInTheDocument();
        expect(screen.getByText('Solución')).toBeInTheDocument();
    });

    test('calls onClose when main close button is clicked', () => {
        render(
            <DetailIncidentModal
                isOpen={true}
                onClose={mockOnClose}
                incidentDetail={incidentDetail}
                onIncidentUpdated={jest.fn()}
            />
        );

        const closeButtons = screen.getAllByText('×');
        fireEvent.click(closeButtons[0]);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('opens and closes ProblemaComunModal correctly', () => {
        render(
            <DetailIncidentModal
                isOpen={true}
                onClose={mockOnClose}
                incidentDetail={incidentDetail}
                onIncidentUpdated={jest.fn()}
            />
        );

        const openModalButton = screen.getByText('Buscar problemas comunes');
        fireEvent.click(openModalButton);

        expect(screen.getByText('Problemas Comunes')).toBeInTheDocument();

        const closeModalButton = screen.getAllByText('×')[1];
        fireEvent.click(closeModalButton);

        expect(
            screen.queryByText('Problemas Comunes')
        ).not.toBeInTheDocument();
    });
});
