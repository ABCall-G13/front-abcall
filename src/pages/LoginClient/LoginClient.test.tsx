import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../utils/axiosInstance';
import LoginClient from './LoginClient';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../utils/axiosInstance');
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: jest.fn(),
        },
    }),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        login: jest.fn(),
    }),
}));

const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;
//const mockNavigate = jest.requireMock('react-router-dom').useNavigate as jest.Mock;

describe('LoginClient Component', () => {

    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form', () => {
        render(
            <BrowserRouter>
                <LoginClient />
            </BrowserRouter>
        );

        // Verifica que los campos de entrada se renderizan usando IDs
        expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();

        // Verifica que el botón "Iniciar sesión" se renderiza usando clase
        const loginButton = screen.getByRole('button', {
            name: /Iniciar sesión/i,
        });
        expect(loginButton).toBeInTheDocument();
    });

    test('shows error message on failed login', async () => {
        // Simula un fallo de inicio de sesión
        mockAxiosInstance.post.mockRejectedValue(new Error('Invalid credentials'));

        render(
            <BrowserRouter>
                <LoginClient />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), {
            target: { value: 'wrongpassword' },
        });

        // Haz clic en el botón de inicio de sesión
        fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

        // Espera a que aparezca el mensaje de error
        await waitFor(() => {
            expect(screen.getByText(/Correo o contraseña incorrectos/i)).toBeInTheDocument();
        });
    });


    test('redirects based on plan status after successful login', async () => {
       
        mockAxiosInstance.post.mockResolvedValueOnce({ data: { access_token: 'fake-token' } });
    
        mockAxiosInstance.get.mockResolvedValueOnce({ data: true });
    
        render(
            <BrowserRouter>
                <LoginClient />
            </BrowserRouter>
        );
    
        fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/status-plan', {
                headers: { Authorization: `Bearer fake-token` },
            });
        });
    
       
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        }   );
    
    });


    test('redirects based on plan status after login client not plan', async () => {
       
        mockAxiosInstance.post.mockResolvedValueOnce({ data: { access_token: 'fake-token' } });
    
        mockAxiosInstance.get.mockResolvedValueOnce({ data: false });
    
        render(
            <BrowserRouter>
                <LoginClient />
            </BrowserRouter>
        );
    
        fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

        await waitFor(() => {
            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/status-plan', {
                headers: { Authorization: `Bearer fake-token` },
            });
        });
    
       
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/plan-selection');
        }   );
    
    });

});
