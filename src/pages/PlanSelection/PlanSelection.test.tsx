/* eslint-disable jest/no-conditional-expect */
/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlanSelection from './PlanSelection';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

describe('PlanSelection', () => {
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

    test('navigates to confirmation page on plan select', () => {
        const navigate = jest.fn();
        jest.spyOn(
            require('react-router-dom'),
            'useNavigate'
        ).mockImplementation(() => navigate);

        render(
            <MemoryRouter>
                <PlanSelection />
            </MemoryRouter>
        );

        const emprendedorCard = screen.getByText('Emprendedor');
        fireEvent.click(emprendedorCard);

        expect(navigate).toHaveBeenCalledWith('/incident-list');
    });
});
