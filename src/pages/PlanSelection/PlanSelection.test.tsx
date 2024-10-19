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

    expect(screen.getByText('Elige el plan perfecto para impulsar tu negocio y brindar la mejor experiencia a tus clientes.')).toBeInTheDocument();
  });

  test('selects the Emprendedor plan', () => {
    render(
      <MemoryRouter>
        <PlanSelection />
      </MemoryRouter>
    );

    const emprendedorCard = screen.getByText('Emprendedor');
    fireEvent.click(emprendedorCard);

    expect(emprendedorCard.closest('.plan-card')).toHaveClass('selected');
  });

  test('selects the Empresario Plus plan', () => {
    render(
      <MemoryRouter>
        <PlanSelection />
      </MemoryRouter>
    );

    const empresarioPlusCard = screen.getByText('Empresario Plus');
    fireEvent.click(empresarioPlusCard);

    expect(empresarioPlusCard.closest('.plan-card')).toHaveClass('selected');
  });

  test('selects the Empresario plan', () => {
    render(
      <MemoryRouter>
        <PlanSelection />
      </MemoryRouter>
    );

    const empresarioCard = screen.getByText('Empresario');
    fireEvent.click(empresarioCard);

    expect(empresarioCard.closest('.plan-card')).toHaveClass('selected');
  });

  test('navigates to confirmation page on plan select', () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    render(
      <MemoryRouter>
        <PlanSelection />
      </MemoryRouter>
    );

    const emprendedorCard = screen.getByText('Emprendedor');
    fireEvent.click(emprendedorCard);

    expect(navigate).toHaveBeenCalledWith('/confirmacion');
  });
});