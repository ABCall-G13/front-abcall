import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateProblemaComun from './CreateCommonIssue';
import axiosInstance from '../../utils/axiosInstance';

jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('CreateProblemaComun component', () => {
    const mockOnClose = jest.fn();
    const mockOnProblemaComunCreated = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form and category options correctly', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({
            data: { categoria: ['Software', 'Hardware'] },
        });

        render(
            <CreateProblemaComun
                onClose={mockOnClose}
                onProblemaComunCreated={mockOnProblemaComunCreated}
            />
        );

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith(
                '/incidentes/fields'
            );
        });

        expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Solución/i)).toBeInTheDocument();

        expect(screen.getByText('Software')).toBeInTheDocument();
        expect(screen.getByText('Hardware')).toBeInTheDocument();
    });

    test('submits the form with valid data', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({
            data: { categoria: ['Software', 'Hardware'] },
        });

        mockAxiosInstance.post.mockResolvedValueOnce({
            data: { success: true },
        });

        render(
            <CreateProblemaComun
                onClose={mockOnClose}
                onProblemaComunCreated={mockOnProblemaComunCreated}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Hardware')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Descripción/i), {
            target: { value: 'Problema de ejemplo' },
        });
        fireEvent.change(screen.getByLabelText(/Categoría/i), {
            target: { value: 'Hardware' },
        });
        fireEvent.change(screen.getByLabelText(/Solución/i), {
            target: { value: 'Solución de ejemplo' },
        });

        expect(screen.getByLabelText(/Categoría/i)).toHaveValue('Hardware');

        fireEvent.submit(
            screen.getByRole('button', { name: /Crear Problema Común/i })
        );

        await waitFor(() => {
            expect(mockAxiosInstance.post).toHaveBeenCalledWith(
                '/soluciones',
                {
                    description: 'Problema de ejemplo',
                    categoria: 'Hardware',
                    solucion: 'Solución de ejemplo',
                }
            );
        });

        expect(mockOnProblemaComunCreated).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('displays error message when submission fails', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({
            data: { categoria: ['Software', 'Hardware'] },
        });

        mockAxiosInstance.post.mockRejectedValueOnce(
            new Error('Network Error')
        );

        render(
            <CreateProblemaComun
                onClose={mockOnClose}
                onProblemaComunCreated={mockOnProblemaComunCreated}
            />
        );

        fireEvent.change(screen.getByLabelText(/Descripción/i), {
            target: { value: 'Problema de ejemplo' },
        });
        fireEvent.change(screen.getByLabelText(/Categoría/i), {
            target: { value: 'Hardware' },
        });
        fireEvent.change(screen.getByLabelText(/Solución/i), {
            target: { value: 'Solución de ejemplo' },
        });

        fireEvent.submit(
            screen.getByRole('button', { name: /Crear Problema Común/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText(/Hubo un error al crear el problema común/i)
            ).toBeInTheDocument();
        });

        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
