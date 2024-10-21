import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../utils/axiosInstance';
import IncidentList from './IncidentList';

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
    },
  ];

  beforeEach(() => {
    mockAxiosInstance.get.mockResolvedValue({ data: mockIncidents });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders incidents correctly after fetching', async () => {
    render(<IncidentList />);

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
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

    render(<IncidentList />);

    // Espera a que la tabla de incidentes se actualice
    await waitFor(() => {
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/incidentes');
    });

    // Verifica que se muestra el mensaje de "No se encontraron incidentes"
    expect(screen.getByText('No se encontraron incidentes')).toBeInTheDocument();
  });

  test('opens and closes the detail modal when clicking on "Detalle"', async () => {
    render(<IncidentList />);
  
    // Espera a que los datos de los incidentes se carguen
    await waitFor(() => {
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/incidentes');
    });
  
    // Verifica que los botones "Detalle" se renderizan correctamente
    const detailButtons = screen.getAllByRole('button', { name: '' }); // Verifica que existan botones sin texto específico
    expect(detailButtons.length).toBeGreaterThan(0); // Asegúrate de que haya al menos un botón
  
    // Haz clic en el botón "Detalle" del primer incidente
    fireEvent.click(detailButtons[0]);
  
    // Usa screen.debug() para inspeccionar el estado del DOM después del clic
    screen.debug();
  
    // Verifica si el modal se ha abierto, y el texto que contiene
    await waitFor(() => {
      expect(screen.getByText('Descripción del soporte:')).toBeInTheDocument();
    });
  
    // Simula cerrar el modal
    fireEvent.click(screen.getByText('×'));
  
    // Verifica que el modal de detalle se cierra
    await waitFor(() => {
      expect(screen.queryByText('Descripción del soporte:')).not.toBeInTheDocument();
    });
  });

  
});
