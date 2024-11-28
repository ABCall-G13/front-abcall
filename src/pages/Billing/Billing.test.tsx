import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../utils/axiosInstance';
import IncidentesFacturados from './Billing';

jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

beforeEach(() => {
    // Simular valores en localStorage
    Storage.prototype.getItem = jest.fn((key) => {
        if (key === 'currency') return 'USD';
        if (key === 'language') return 'en';
        return null;
    });
});

beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe('IncidentesFacturados component', () => {
    const mockFacturas = [
        { id: 1, fecha_inicio: '2023-01-01', fecha_fin: '2023-01-31' },
        { id: 2, fecha_inicio: '2023-02-01', fecha_fin: '2023-02-28' },
    ];

    const mockIncidentes = [
        {
            factura_id: 1,
            radicado_incidente: 'RAD001',
            costo: 100.5,
            fecha_incidente: '2023-01-15',
        },
        {
            factura_id: 1,
            radicado_incidente: 'RAD002',
            costo: 200.0,
            fecha_incidente: '2023-01-20',
        },
    ];

    const currency = "USD";
    const language = "en";

    beforeEach(() => {
        mockAxiosInstance.get.mockReset();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders facturas and selects the first one by default', async () => {
        mockAxiosInstance.get
            .mockResolvedValueOnce({ data: mockFacturas })
            .mockResolvedValueOnce({ data: mockIncidentes });

        await act(async () => {
            render(<IncidentesFacturados />);
        });

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/facturas-by-cliente');
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/facturas/1/incidentes', {
                params: { currency },
            });
        });

        expect(screen.getByLabelText('Seleccionar Factura:')).toBeInTheDocument();
        expect(screen.getByText('ID: 1 | Periodo: 2023-01-01 - 2023-01-31')).toBeInTheDocument();
    });

    test('fetches and displays incidentes for the selected factura', async () => {
        mockAxiosInstance.get
            .mockResolvedValueOnce({ data: mockFacturas })
            .mockResolvedValueOnce({ data: mockIncidentes });

        await act(async () => {
            render(<IncidentesFacturados />);
        });

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/facturas-by-cliente');
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/facturas/1/incidentes', {
                params: { currency },
            });
        });

        expect(screen.getByText('RAD001')).toBeInTheDocument();
        expect(screen.getByText('RAD002')).toBeInTheDocument();
        expect(screen.getByText('100.50')).toBeInTheDocument();
        expect(screen.getByText('200.00')).toBeInTheDocument();
    });


    test('downloads factura when download button is clicked', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({ data: mockFacturas });
        mockAxiosInstance.get.mockResolvedValueOnce({ data: mockIncidentes });
        mockAxiosInstance.get.mockResolvedValueOnce({
            data: new Blob(['Factura content']),
        });

        await act(async () => {
            render(<IncidentesFacturados />);
        });

        const downloadButton = screen.getByText('Descargar Factura');
        await act(async () => {
            fireEvent.click(downloadButton);
        });

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/facturas/1/download', {
                params: { currency, language },
                responseType: 'blob',
            });
        });
    });

    test('displays error when fetching facturas fails', async () => {
        mockAxiosInstance.get.mockRejectedValueOnce(new Error('Error al cargar facturas'));

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        await act(async () => {
            render(<IncidentesFacturados />);
        });

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/facturas-by-cliente');
        });

        consoleErrorSpy.mockRestore();
    });

    test('displays error when fetching incidentes fails', async () => {
        mockAxiosInstance.get
            .mockResolvedValueOnce({ data: mockFacturas })
            .mockRejectedValueOnce(new Error('Error al cargar incidentes'));

        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        await act(async () => {
            render(<IncidentesFacturados />);
        });

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/facturas/1/incidentes', {
                params: { currency },
            });
        });

        consoleErrorSpy.mockRestore();
    });
});
