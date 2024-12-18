import { render, screen, act } from '@testing-library/react';
import ProblemaComunModal from './CommonIssue';
import axiosInstance from '../../utils/axiosInstance';

jest.mock('../../utils/axiosInstance');

describe('ProblemaComunModal component', () => {
    const mockOnClose = jest.fn();
    const mockOnAddSolution = jest.fn();

    const problemasMockData = [
        {
            id: 1,
            description: 'Problema de conexión a internet',
            categoria: 'Conectividad',
            solucion:
                'Reiniciar el router y verificar la configuración de red.',
        },
        {
            id: 2,
            description: 'Error en la autenticación de usuario',
            categoria: 'Autenticación',
            solucion:
                'Verificar las credenciales e intentar restablecer la contraseña.',
        },
    ];

    test('renders correctly and displays problem data', async () => {
        await act(async () => {
            render(
                <ProblemaComunModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onAddSolution={mockOnAddSolution}
                    problemas={problemasMockData} // Provide mock problemas data here
                />
            );
        });

        // Verify data rendering
        expect(
            screen.getByText('Problema de conexión a internet')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Error en la autenticación de usuario')
        ).toBeInTheDocument();
    });
});
