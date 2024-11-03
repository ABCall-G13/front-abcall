import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axiosInstance from '../../utils/axiosInstance';
import UserSync from './UserSync';

jest.mock('../../utils/axiosInstance');
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('UserSync Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders upload area, button, and title', () => {
        render(<UserSync />);

        expect(screen.getByText(/Cargar usuarios/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /Click para subir o arrastra y suelta el archivo aquí/i
            )
        ).toBeInTheDocument();

        const uploadButton = screen.getByRole('button', { name: /Subir/i });
        expect(uploadButton).toBeInTheDocument();
        expect(uploadButton).toBeDisabled();
    });

    test('displays error message when non-Excel file is selected', async () => {
        render(<UserSync />);

        const fileInput = screen.getByTestId('file-input');
        const nonExcelFile = new File(['dummy content'], 'document.pdf', {
            type: 'application/pdf',
        });
        fireEvent.change(fileInput, { target: { files: [nonExcelFile] } });

        await waitFor(() => {
            expect(
                screen.getByText(/Por favor, selecciona un archivo Excel/i)
            ).toBeInTheDocument();
        });
    });

    test('displays selected file name when Excel file is selected', () => {
        render(<UserSync />);

        const fileInput = screen.getByTestId('file-input');
        const excelFile = new File(['dummy content'], 'usuarios.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        fireEvent.change(fileInput, { target: { files: [excelFile] } });

        expect(
            screen.getByText(/Archivo seleccionado: usuarios.xlsx/i)
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Subir/i })).toBeEnabled();
    });

    test('uploads file successfully', async () => {
        mockAxiosInstance.post.mockResolvedValue({ data: {} });

        render(<UserSync />);

        const fileInput = screen.getByTestId('file-input');
        const excelFile = new File(['dummy content'], 'usuarios.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        fireEvent.change(fileInput, { target: { files: [excelFile] } });

        const uploadButton = screen.getByRole('button', { name: /Subir/i });
        fireEvent.click(uploadButton);

        await waitFor(() => {
            expect(
                screen.getByText(/Archivo subido exitosamente/i)
            ).toBeInTheDocument();
        });
    });

    test('displays error message when upload fails', async () => {
        mockAxiosInstance.post.mockRejectedValue(
            new Error('Error al subir el archivo')
        );

        render(<UserSync />);

        const fileInput = screen.getByTestId('file-input');
        const excelFile = new File(['dummy content'], 'usuarios.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        fireEvent.change(fileInput, { target: { files: [excelFile] } });

        const uploadButton = screen.getByRole('button', { name: /Subir/i });
        fireEvent.click(uploadButton);

        await waitFor(() => {
            expect(
                screen.getByText(/Error al subir el archivo/i)
            ).toBeInTheDocument();
        });
    });
});
