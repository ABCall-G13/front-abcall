import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../utils/axiosInstance';
import ProblemaComunList from './CommonIssueList';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('ProblemaComunList component', () => {
    const mockProblemas = [
        {
            id: 1,
            description: 'Problema 1',
            categoria: 'Categoría 1',
            solucion: 'Solución 1',
        },
        {
            id: 2,
            description: 'Problema 2',
            categoria: 'Categoría 2',
            solucion: 'Solución 2',
        },
    ];

    beforeEach(() => {
        mockAxiosInstance.get.mockResolvedValue({ data: mockProblemas });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders ProblemaComunList with fetched problems', async () => {
        render(
            <MemoryRouter>
                <ProblemaComunList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/soluciones');
        });

        expect(screen.getByText('Problema 1')).toBeInTheDocument();
        expect(screen.getByText('Problema 2')).toBeInTheDocument();
        expect(screen.getByText('Categoría 1')).toBeInTheDocument();
        expect(screen.getByText('Categoría 2')).toBeInTheDocument();
    });

    test('displays message when no problems are found', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

        render(
            <MemoryRouter>
                <ProblemaComunList />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/soluciones');
        });

        expect(
            screen.getByText('No se encontraron problemas comunes')
        ).toBeInTheDocument();
    });

    test('toggles the create problem modal on button click', async () => {
        render(
            <MemoryRouter>
                <ProblemaComunList />
            </MemoryRouter>
        );

        const addButton = screen.getByText('AGREGAR PROBLEMA COMÚN');
        fireEvent.click(addButton);

        expect(
            screen.getByText('Registrar Problema Común')
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText('×'));

        await waitFor(() => {
            expect(
                screen.queryByText('Registrar Problema Común')
            ).not.toBeInTheDocument();
        });
    });
});
