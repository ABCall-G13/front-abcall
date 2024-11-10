import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateProblemaComun from './CreateCommonIssue';
import axiosInstance from '../../utils/axiosInstance';

jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

// ErrorBoundary component to handle error boundaries in tests
function ErrorBoundary({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

describe('CreateProblemaComun component', () => {
    const mockOnClose = jest.fn();
    const mockOnProblemaComunCreated = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form and category options correctly', async () => {
        mockAxiosInstance.get
            .mockResolvedValueOnce({
                data: { categoria: ['Software', 'Hardware'] },
            }) // Mock categories
            .mockResolvedValueOnce({ data: [{ id: 4, nombre: 'Cliente 4' }] }); // Mock clients

        render(
            <ErrorBoundary>
                <CreateProblemaComun
                    onClose={mockOnClose}
                    onProblemaComunCreated={mockOnProblemaComunCreated}
                />
            </ErrorBoundary>
        );

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith(
                '/incidentes/fields'
            );
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/clientes/');
        });

        expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Cliente/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Solución/i)).toBeInTheDocument();

        expect(screen.getByText('Software')).toBeInTheDocument();
        expect(screen.getByText('Hardware')).toBeInTheDocument();
        expect(screen.getByText('Cliente 4')).toBeInTheDocument();
    });

    test('submits the form with valid data', async () => {
        mockAxiosInstance.get
            .mockResolvedValueOnce({
                data: { categoria: ['Software', 'Hardware'] },
            }) // Mock categories
            .mockResolvedValueOnce({ data: [{ id: 4, nombre: 'Cliente 4' }] }); // Mock clients

        mockAxiosInstance.post.mockResolvedValueOnce({
            data: { success: true },
        });

        render(
            <ErrorBoundary>
                <CreateProblemaComun
                    onClose={mockOnClose}
                    onProblemaComunCreated={mockOnProblemaComunCreated}
                />
            </ErrorBoundary>
        );

        await waitFor(() => {
            expect(screen.getByText('Hardware')).toBeInTheDocument();
        });

        // Fill in the form fields
        await act(async () => {
            fireEvent.change(screen.getByLabelText(/Descripción/i), {
                target: { value: 'Problema de ejemplo' },
            });
            fireEvent.change(screen.getByLabelText(/Categoría/i), {
                target: { value: 'Hardware' },
            });
            fireEvent.change(screen.getByLabelText(/Cliente/i), {
                target: { value: '4' },
            });
            fireEvent.change(screen.getByLabelText(/Solución/i), {
                target: { value: 'Solución de ejemplo' },
            });
        });

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
                    cliente_id: '4',
                }
            );
        });

        expect(mockOnProblemaComunCreated).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('displays error message when submission fails', async () => {
        mockAxiosInstance.get
            .mockResolvedValueOnce({
                data: { categoria: ['Software', 'Hardware'] },
            }) // Mock categories
            .mockResolvedValueOnce({ data: [{ id: 4, nombre: 'Cliente 4' }] }); // Mock clients

        mockAxiosInstance.post.mockRejectedValueOnce(
            new Error('Network Error')
        );

        render(
            <ErrorBoundary>
                <CreateProblemaComun
                    onClose={mockOnClose}
                    onProblemaComunCreated={mockOnProblemaComunCreated}
                />
            </ErrorBoundary>
        );

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/Descripción/i), {
                target: { value: 'Problema de ejemplo' },
            });
            fireEvent.change(screen.getByLabelText(/Categoría/i), {
                target: { value: 'Hardware' },
            });
            fireEvent.change(screen.getByLabelText(/Cliente/i), {
                target: { value: '4' },
            });
            fireEvent.change(screen.getByLabelText(/Solución/i), {
                target: { value: 'Solución de ejemplo' },
            });
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
