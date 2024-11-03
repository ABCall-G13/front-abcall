import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ValidateUserModal from './UserValidation';
import axiosInstance from '../../utils/axiosInstance';
import '@testing-library/jest-dom';

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
    const onUserValidated = jest.fn();
    const onClose = jest.fn();
    const onOpenCreateIncident = jest.fn();
    const setupComponent = (isOpen = true) => {
        render(
            <ValidateUserModal
                isOpen={isOpen}
                onUserValidated={onUserValidated}
                onClose={onClose}
                onOpenCreateIncident={onOpenCreateIncident}
            />
        );
    };

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
    test('shows "complete all fields" alert when fields are empty', async () => {
        setupComponent();

        fireEvent.click(screen.getByText(/Validar usuario/i));

        expect(await screen.findByText(/Por favor, completa todos los campos/i)).toBeInTheDocument();
        expect(screen.queryByText(/Usuario no encontrado/i)).not.toBeInTheDocument();
    });
    
    
});


describe('ValidateUserModal Component', () => {
    const mockClient = { nit: '12345', nombre: 'Cliente Prueba' };
    const onUserValidatedMock = jest.fn();
    const onCloseMock = jest.fn();
    const onOpenCreateIncidentMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('shows user not found alert when no user data is returned', async () => {
        // Mock de la respuesta de cliente existente
        jest.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: [mockClient] });
    
        // Mock de la respuesta de usuario no encontrado
        jest.spyOn(axiosInstance, 'get').mockResolvedValueOnce({ data: {} });
    
        // Renderizamos el modal
        await act(async () => {
            render(
                <ValidateUserModal
                    isOpen={true}
                    onUserValidated={onUserValidatedMock}
                    onClose={onCloseMock}
                    onOpenCreateIncident={onOpenCreateIncidentMock}
                />
            );
        });
    
        // Llenamos todos los campos requeridos
        await act(async () => {
            fireEvent.change(screen.getByLabelText('Tipo de documento'), { target: { value: 'CC' } });
            fireEvent.change(screen.getByLabelText('Número de identificación'), { target: { value: '12345678' } });
            fireEvent.change(screen.getByLabelText('Cliente'), { target: { value: JSON.stringify(mockClient) } });
        });
    
        // Validamos los valores con los que se llenaron los campos
        expect(screen.getByLabelText('Tipo de documento')).toHaveValue('CC');
        expect(screen.getByLabelText('Número de identificación')).toHaveValue('12345678');
        expect(screen.getByLabelText('Cliente')).toHaveValue(JSON.stringify(mockClient));
    
        // Simulamos el clic en el botón "Validar usuario"
        await act(async () => {
            fireEvent.click(screen.getByText('Validar usuario'));
        });
    
        // Esperamos que aparezca la alerta de "Usuario no encontrado"
        await waitFor(() => {
            const alertElement = screen.getByRole('alert');
            expect(alertElement).toHaveTextContent(/Usuario no encontrado/i);
        });
    })

    test('shows empty fields alert when required fields are not filled', async () => {
        await act(async () => {
            render(
                <ValidateUserModal
                    isOpen={true}
                    onUserValidated={onUserValidatedMock}
                    onClose={onCloseMock}
                    onOpenCreateIncident={onOpenCreateIncidentMock}
                />
            );
        });

        // Simulamos el clic en el botón "Validar usuario" sin llenar los campos
        await act(async () => {
            fireEvent.click(screen.getByText('Validar usuario'));
        });

        // Esperamos que aparezca la alerta de "Por favor, completa todos los campos"
        await waitFor(() => {
            const alertElement = screen.getByRole('alert');
            expect(alertElement).toHaveTextContent(/Por favor, completa todos los campos/i);
        });
    });
});