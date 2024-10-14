import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from './Register';

describe('Register Component', () => {
  test('renders the form with all fields', () => {
    render(<Register />);

    // Selección específica usando IDs
    expect(screen.getByLabelText(/Nombre empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/NIT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Industria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i, { selector: 'input#password' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bienvenida para los Usuarios/i)).toBeInTheDocument();
  });

  test('allows the user to fill in the form', () => {
    render(<Register />);

    // Cambia a usar IDs o getAllByLabelText con índice
    fireEvent.change(screen.getByLabelText(/Nombre empresa/i), { target: { value: 'Mi Empresa' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@correo.com' } });
    fireEvent.change(screen.getByLabelText(/NIT/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Industria/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input#password' }), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Bienvenida para los Usuarios/i), { target: { value: 'Bienvenido a nuestro servicio!' } });

    // Verifica los valores correctos
    expect(screen.getByLabelText(/Nombre empresa/i)).toHaveValue('Mi Empresa');
    expect(screen.getByLabelText(/Correo electrónico/i)).toHaveValue('test@correo.com');
    expect(screen.getByLabelText(/NIT/i)).toHaveValue('123456789');
    expect(screen.getByLabelText(/Dirección/i)).toHaveValue('Calle 123');
    expect(screen.getByLabelText(/Teléfono/i)).toHaveValue('1234567890');
    expect(screen.getByLabelText(/Industria/i)).toHaveValue('technology');
    expect(screen.getByLabelText(/Contraseña/i, { selector: 'input#password' })).toHaveValue('password');
    expect(screen.getByLabelText(/Confirmar contraseña/i)).toHaveValue('password');
    expect(screen.getByLabelText(/Bienvenida para los Usuarios/i)).toHaveValue('Bienvenido a nuestro servicio!');
  });

  test('submits the form with correct data', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Nombre empresa/i), { target: { value: 'Mi Empresa' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@correo.com' } });
    fireEvent.change(screen.getByLabelText(/NIT/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Industria/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input#password' }), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Bienvenida para los Usuarios/i), { target: { value: 'Bienvenido a nuestro servicio!' } });

    fireEvent.submit(screen.getByRole('button', { name: /Siguiente/i }));

    // Verifica que los datos correctos se envíen
    expect(consoleSpy).toHaveBeenCalledWith('Form data submitted:', {
      companyName: 'Mi Empresa',
      email: 'test@correo.com',
      nit: '123456789',
      address: 'Calle 123',
      phone: '1234567890',
      industry: 'technology',
      password: 'password',  // NOSONAR
      confirmPassword: 'password',  // NOSONAR
      welcomeMessage: 'Bienvenido a nuestro servicio!',
    });

    consoleSpy.mockRestore();
  });
});
