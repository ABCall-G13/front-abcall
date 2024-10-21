import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailIncidentModal from './DetailIncident';

describe('DetailIncidentModal component', () => {
    const mockOnClose = jest.fn();

    const incidentDetail = {
        descripcion: 'Descripción del incidente',
        categoria: 'Hardware',
        cliente: 'Cliente ABC',
        fechaApertura: '2023-09-01',
        fechaCierre: '2023-09-10',
        prioridad: 'Alta',
        solucion: 'Solución aplicada al incidente',
    };

    test('renders correctly when open', () => {
        render(<DetailIncidentModal isOpen={true} onClose={mockOnClose} incidentDetail={incidentDetail} />);

        // Verificar que el modal se renderiza con el título correcto
        expect(screen.getByText('Detalle del Incidente')).toBeInTheDocument();

        // Verificar que los detalles del incidente se muestran correctamente
        expect(screen.getByText('Descripción del soporte:')).toBeInTheDocument();
        expect(screen.getByText(incidentDetail.descripcion)).toBeInTheDocument();
        expect(screen.getByText('Solución')).toBeInTheDocument();
        expect(screen.getByText(incidentDetail.solucion)).toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', () => {
        render(<DetailIncidentModal isOpen={true} onClose={mockOnClose} incidentDetail={incidentDetail} />);

        // Simular clic en el botón de cierre
        fireEvent.click(screen.getByText('×'));

        // Verificar que la función de cierre fue llamada
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });


    test('renders with correct priority class', () => {
        render(<DetailIncidentModal isOpen={true} onClose={mockOnClose} incidentDetail={incidentDetail} />);

        // Verificar que la prioridad tiene la clase correcta
        expect(screen.getByText('Alta').classList.contains('prioridad')).toBe(true);
        expect(screen.getByText('Alta').classList.contains('alta')).toBe(true);
    });

    test('renders without crashing when incidentDetail is empty', () => {
        const emptyIncidentDetail = {
            descripcion: '',
            categoria: '',
            cliente: '',
            fechaApertura: '',
            fechaCierre: '',
            prioridad: '',
            solucion: '',
        };

        render(<DetailIncidentModal isOpen={true} onClose={mockOnClose} incidentDetail={emptyIncidentDetail} />);

        // Verificar que el modal se renderiza sin detalles
        expect(screen.getByText('Detalle del Incidente')).toBeInTheDocument();
    });
});