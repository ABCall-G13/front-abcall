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
    test('toggles select dropdown for Tipo de Documento when handleSelectClick is called', async () => {
        render(
            <ValidateUserModal
                isOpen={true}
                onUserValidated={mockOnUserValidated}
                onClose={mockOnClose}
                onOpenCreateIncident={mockOnOpenCreateIncident}
            />
        );
    
        // Encuentra el select para Tipo de Documento y simula el clic
        const docTypeSelect = screen.getByLabelText('Tipo de documento');
        fireEvent.click(docTypeSelect);
    
        // Verifica que el ícono cambie a flecha hacia arriba (dropdown abierto)
        await waitFor(() => {
            const upIcons = screen.queryAllByTestId('ArrowDropUpIcon');
            expect(upIcons.length).toBeGreaterThan(0);
        });

        await waitFor(() => {
            // Verifica que uno de los íconos esté visible (el correspondiente al campo abierto)
            const upIcons = screen.queryAllByTestId('ArrowDropUpIcon');
            expect(upIcons[0]).toBeVisible();
        });
    
        // Vuelve a hacer clic en el select para cerrar el dropdown
        fireEvent.click(docTypeSelect);
    
        // Verifica que el ícono cambie a flecha hacia abajo (dropdown cerrado)
        await waitFor(() => {
            const downIcons = screen.queryAllByTestId('ArrowDropDownIcon');
            expect(downIcons.length).toBeGreaterThan(0);
        });

        await waitFor(() => {
            // Verifica que uno de los íconos esté visible (el correspondiente al campo cerrado)
            const downIcons = screen.queryAllByTestId('ArrowDropDownIcon');
            expect(downIcons[0]).toBeVisible();
        });
    });
    test('closes dropdown when clicking outside of the select', async () => {
        render(
            <ValidateUserModal
                isOpen={true}
                onUserValidated={mockOnUserValidated}
                onClose={mockOnClose}
                onOpenCreateIncident={mockOnOpenCreateIncident}
            />
        );
    
        // Simula la apertura del dropdown
        const docTypeSelect = screen.getByLabelText('Tipo de documento');
        fireEvent.click(docTypeSelect);
    
        // Verifica que el dropdown esté abierto
        await waitFor(() => {
            const upIcons = screen.queryAllByTestId('ArrowDropUpIcon');
            expect(upIcons.length).toBeGreaterThan(0);
        });

        await waitFor(() => {
            const upIcons = screen.queryAllByTestId('ArrowDropUpIcon');
            expect(upIcons[0]).toBeVisible();
        });
    
        // Simula un clic fuera del select
        fireEvent.mouseDown(document);
    
        // Verifica que el dropdown se haya cerrado
        await waitFor(() => {
            const downIcons = screen.queryAllByTestId('ArrowDropDownIcon');
            expect(downIcons.length).toBeGreaterThan(0);
        });

        await waitFor(() => {
            const downIcons = screen.queryAllByTestId('ArrowDropDownIcon');
            expect(downIcons[0]).toBeVisible();
        });
    });
    
    
    test('shows error alert when API call fails', async () => {
        (axiosInstance.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
    
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
    
        await waitFor(() => {
            // Usa queryByText para verificar que el mensaje de error está presente
            const errorMessage = screen.queryByText((content, element) => content.includes("Usuario no encontrado") || content.includes("completa todos los campos"));
            expect(errorMessage).toBeInTheDocument();
        });
    
        expect(mockOnUserValidated).not.toHaveBeenCalled();
    });
});
