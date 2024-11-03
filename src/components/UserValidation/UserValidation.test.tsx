import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ValidateUserModal from './UserValidation';
import axiosInstance from '../../utils/axiosInstance';

jest.mock('../../utils/axiosInstance');

const mockOnUserValidated = jest.fn();
const mockOnClose = jest.fn();
const mockOnOpenCreateIncident = jest.fn();

const mockClientes = [
    { nit: '123', nombre: 'Cliente 1', id: '1' },
    { nit: '456', nombre: 'Cliente 2', id: '2' },
];

describe('ValidateUserModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockClientes });
    });

    test('renders correctly when open', () => {
        render(
            <ValidateUserModal
                isOpen={true}
                onUserValidated={mockOnUserValidated}
                onClose={mockOnClose}
                onOpenCreateIncident={mockOnOpenCreateIncident}
            />
        );

        expect(screen.getByText(/Validación de usuario/i)).toBeInTheDocument();
    });

    test('closes the modal when close button is clicked', () => {
        render(
            <ValidateUserModal
                isOpen={true}
                onUserValidated={mockOnUserValidated}
                onClose={mockOnClose}
                onOpenCreateIncident={mockOnOpenCreateIncident}
            />
        );

        fireEvent.click(screen.getByLabelText(/close/i));
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('shows empty fields alert when fields are not filled', async () => {
        render(
            <ValidateUserModal
                isOpen={true}
                onUserValidated={mockOnUserValidated}
                onClose={mockOnClose}
                onOpenCreateIncident={mockOnOpenCreateIncident}
            />
        );

        fireEvent.click(screen.getByText(/Validar usuario/i));

        await waitFor(() => {
            expect(screen.getByText(/Por favor, completa todos los campos./i)).toBeInTheDocument();
        });
    });

    test('shows user not found alert when user is not found', async () => {
        (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: {} });

        render(
            <ValidateUserModal
                isOpen={true}
                onUserValidated={mockOnUserValidated}
                onClose={mockOnClose}
                onOpenCreateIncident={mockOnOpenCreateIncident}
            />
        );

        fireEvent.change(screen.getByPlaceholderText(/Ingrese el número de identificación/i), { target: { value: '12345' } });
        fireEvent.change(screen.getByRole('combobox', { name: /tipo de documento/i }), { target: { value: 'CC' } });
        fireEvent.change(screen.getByRole('combobox', { name: /cliente/i }), { target: { value: JSON.stringify(mockClientes[0]) } });

        fireEvent.click(screen.getByText(/Validar usuario/i));
    });

    test('validates user and shows user info when user is found', async () => {
        const mockUserData = {
            nombre: 'John Doe',
            tipo_documento: 'CC',
            documento: '12345',
            telefono: '1234567890',
            email: 'john.doe@example.com',
            id: '1',
        };
    
        (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockUserData });

        render(
            <ValidateUserModal
                isOpen={true}
                onUserValidated={mockOnUserValidated}
                onClose={mockOnClose}
                onOpenCreateIncident={mockOnOpenCreateIncident}
            />
        );
    
        fireEvent.change(screen.getByPlaceholderText(/Ingrese el número de identificación/i), { target: { value: '12345' } });
        fireEvent.change(screen.getByRole('combobox', { name: /tipo de documento/i }), { target: { value: 'CC' } });
        fireEvent.change(screen.getByRole('combobox', { name: /cliente/i }), { target: { value: JSON.stringify(mockClientes[0]) } });
    
        fireEvent.click(screen.getByText(/Validar usuario/i));
    });


});
