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
        prioridad: 'alta', // Priority should render "prioridad alta" class
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

    test('calls onClose when close button is clicked', () => {
        render(
            <DetailIncidentModal
                isOpen={true}
                onClose={mockOnClose}
                incidentDetail={incidentDetail}
                onIncidentUpdated={jest.fn()}
            />
        );

        fireEvent.click(screen.getByText('×'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('renders without crashing when incidentDetail is empty', () => {
        const emptyIncidentDetail = {
            id: 0,
            cliente_id: 0,
            description: '',
            estado: '',
            categoria: '',
            canal: '',
            prioridad: '',
            fecha_creacion: '',
            fecha_cierre: null,
            solucion: '',
            radicado: '',
        };

        render(
            <DetailIncidentModal
                isOpen={true}
                onClose={mockOnClose}
                incidentDetail={emptyIncidentDetail}
                onIncidentUpdated={jest.fn()}
            />
        );

        expect(screen.getByText('Detalle del Incidente')).toBeInTheDocument();
    });
});
