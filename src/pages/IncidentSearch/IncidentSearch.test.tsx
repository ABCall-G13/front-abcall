
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import IncidentSearch from './IncidentSearch';
import axiosInstance from '../../utils/axiosInstance';

// Mock de axiosInstance
jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('IncidentSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and button correctly', () => {
    render(<IncidentSearch />);
    expect(screen.getByPlaceholderText('Buscar incidente por radicado')).toBeInTheDocument();
    expect(screen.getByText('Consultar')).toBeInTheDocument();
  });

  test('displays error when no incident is found', async () => {
    // Mock de la respuesta de axios cuando no se encuentra el incidente
    mockAxiosInstance.get.mockRejectedValueOnce(new Error('Not found'));

    render(<IncidentSearch />);

    // Simula la escritura en el input
    fireEvent.change(screen.getByPlaceholderText('Buscar incidente por radicado'), {
      target: { value: '12345' },
    });

    // Simula el click en el botón de consultar
    fireEvent.click(screen.getByText('Consultar'));

    // Verifica si el error aparece
    expect(await screen.findByText('No se encontró el incidente')).toBeInTheDocument();

    // Verifica que el error desaparece después de 3 segundos
    await waitFor(() => expect(screen.queryByText('No se encontró el incidente')).not.toBeInTheDocument(), { timeout: 4000 });
  });

  test('displays modal when incident is found', async () => {
    // Mock de la respuesta de axios cuando se encuentra el incidente
    const mockIncidentDetail = {
      id: 1,
      cliente_id: 101,
      description: 'Incidente de prueba',
      estado: 'Abierto',
      categoria: 'Categoría 1',
      canal: 'Email',
      prioridad: 'Alta',
      fecha_creacion: '2023-10-21',
      radicado: '12345',
    };

    mockAxiosInstance.get.mockResolvedValueOnce({ data: mockIncidentDetail });

    render(<IncidentSearch />);

    // Simula la escritura en el input
    fireEvent.change(screen.getByPlaceholderText('Buscar incidente por radicado'), {
      target: { value: '12345' },
    });

    // Simula el click en el botón de consultar
    fireEvent.click(screen.getByText('Consultar'));

    // Verifica que el modal se abre y los detalles del incidente se muestran
    expect(await screen.findByText('Incidente de prueba')).toBeInTheDocument();
  });
});
