import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  test('renders Navbar and Register components', () => {
    render(<App />);

    // Verifica que el componente Navbar se renderiza
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    // Verifica que el componente Register se renderiza
    expect(screen.getByText(/Registrarse/i)).toBeInTheDocument();
  });
});
