/* eslint-disable jest/no-conditional-expect */
/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlanSelection from './PlanSelection';
import axiosInstance from '../../utils/axiosInstance'; 


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

// Mock de axiosInstance
jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('PlanSelection', () => {

    const navigate = jest.fn();

    beforeEach(() => {
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component', () => {
        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        expect(
            screen.getByText(
                'Elige el plan perfecto para impulsar tu negocio y brindar la mejor experiencia a tus clientes.'
            )
        ).toBeInTheDocument();
    });

    // Pruebas para el plan "Emprendedor"
    test('selects the Emprendedor plan via click', () => {
        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        const emprendedorCard = screen.getByText('Emprendedor');
        fireEvent.click(emprendedorCard);

        const planCard = emprendedorCard.closest('.plan-card');
        if (planCard) {
            expect(planCard).toHaveClass('selected');
        }
    });

    test('selects the Emprendedor plan via keyboard (Enter)', () => {
        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        const emprendedorCard = screen.getByText('Emprendedor');
        const planCard = emprendedorCard.closest('.plan-card');

        if (planCard) {
            fireEvent.keyDown(planCard, { key: 'Enter', code: 'Enter' });
            expect(planCard).toHaveClass('selected');
        }
    });

    test('selects the Emprendedor plan via keyboard (Space)', () => {
        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        const emprendedorCard = screen.getByText('Emprendedor');
        const planCard = emprendedorCard.closest('.plan-card');

        if (planCard) {
            fireEvent.keyDown(planCard, { key: ' ', code: 'Space' });
            expect(planCard).toHaveClass('selected');
        }
    });

    // Pruebas para el plan "Empresario Plus"
    test('selects the Empresario Plus plan via click', () => {
        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        const empresarioPlusCard = screen.getByText('Empresario Plus');
        fireEvent.click(empresarioPlusCard);

        const planCard = empresarioPlusCard.closest('.plan-card');
        if (planCard) {
            expect(planCard).toHaveClass('selected');
        }
    });

    test('selects the Empresario Plus plan via keyboard (Enter)', () => {
        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        const empresarioPlusCard = screen.getByText('Empresario Plus');
        const planCard = empresarioPlusCard.closest('.plan-card');

        if (planCard) {
            fireEvent.keyDown(planCard, { key: 'Enter', code: 'Enter' });
            expect(planCard).toHaveClass('selected');
        }
    });

    test('selects the Empresario Plus plan via keyboard (Space)', () => {
        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        const empresarioPlusCard = screen.getByText('Empresario Plus');
        const planCard = empresarioPlusCard.closest('.plan-card');

        if (planCard) {
            fireEvent.keyDown(planCard, { key: ' ', code: 'Space' });
            expect(planCard).toHaveClass('selected');
        }
    });

    // Pruebas para el plan "Empresario"
    test('selects the Empresario plan via click', () => {
        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        const empresarioCard = screen.getByText('Empresario');
        fireEvent.click(empresarioCard);

        const planCard = empresarioCard.closest('.plan-card');
        if (planCard) {
            expect(planCard).toHaveClass('selected');
        }
    });

    test('selects the Empresario plan via keyboard (Enter)', () => {
        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        const empresarioCard = screen.getByText('Empresario');
        const planCard = empresarioCard.closest('.plan-card');

        if (planCard) {
            fireEvent.keyDown(planCard, { key: 'Enter', code: 'Enter' });
            expect(planCard).toHaveClass('selected');
        }
    });

    test('selects the Empresario plan via keyboard (Space)', () => {
        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        const empresarioCard = screen.getByText('Empresario');
        const planCard = empresarioCard.closest('.plan-card');

        if (planCard) {
            fireEvent.keyDown(planCard, { key: ' ', code: 'Space' });
            expect(planCard).toHaveClass('selected');
        }
    });

    test('calls API and navigates to incident-list page on plan select', async () => {
        // Configura una respuesta simulada de la API
        mockAxiosInstance.post.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        // Simula el clic en el plan 'Emprendedor'
        const emprendedorCard = await screen.findByText('Emprendedor');
        fireEvent.click(emprendedorCard);

        // Verifica que se haya llamado a la API con el plan correcto
        await waitFor(() => 
            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/clientes/update-plan', {
                plan: 'Emprendedor',
            })
        );
        
        await waitFor(() => 
            expect(navigate).toHaveBeenCalledWith('/incident-list')
        );
    });
});
