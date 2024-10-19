import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import axiosInstance from '../../utils/axiosInstance';

jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('submits the form with correct data', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    mockAxiosInstance.post.mockResolvedValue({ data: {} });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre empresa/i), { target: { value: 'Mi Empresa' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@correo.com' } });
    fireEvent.change(screen.getByLabelText(/NIT/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Industria/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input#password' }), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i, { selector: 'input#confirmPassword' }), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Bienvenida para los Usuarios/i), { target: { value: 'Bienvenido a nuestro servicio!' } });

    fireEvent.submit(screen.getByRole('button', { name: /Siguiente/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Form data submitted:', {
        nombre: 'Mi Empresa',
        email: 'test@correo.com',
        nit: '123456789',
        direccion: 'Calle 123',
        telefono: '1234567890',
        industria: 'technology',
        password: 'password',
        confirmPassword: 'password',
        welcomeMessage: 'Bienvenido a nuestro servicio!',
      });
    });

    consoleSpy.mockRestore();
  });

  test('displays error message on failed submission', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    mockAxiosInstance.post.mockRejectedValue(new Error('Error al crear cliente'));

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre empresa/i), { target: { value: 'Mi Empresa' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@correo.com' } });
    fireEvent.change(screen.getByLabelText(/NIT/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Industria/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i, { selector: 'input#password' }), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i, { selector: 'input#confirmPassword' }), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Bienvenida para los Usuarios/i), { target: { value: 'Bienvenido a nuestro servicio!' } });

    fireEvent.submit(screen.getByRole('button', { name: /Siguiente/i }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error al crear cliente:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
