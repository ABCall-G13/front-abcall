import React, { useState } from 'react';
import axiosUserServiceInstance from '../../utils/axiosUserServiceInstance';
import './UserSync.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UserSync: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            const isExcel =
                selectedFile.type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            if (!isExcel) {
                setUploadStatus(
                    'Por favor, selecciona un archivo Excel (.xlsx)'
                );
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setUploadStatus('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('No hay archivo seleccionado');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadStatus('Subiendo...');
            await axiosUserServiceInstance.post('/sync-users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus('Archivo subido exitosamente');
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            setUploadStatus('Error al subir el archivo');
        }
    };

    return (
        <div className="user-sync-container">
            <div className="user-sync-card">
                <h2>Cargar usuarios</h2>
                <div className="upload-area">
                    <CloudUploadIcon className="upload-icon" />
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx"
                        data-testid="file-input" // Añadido para facilitar la selección en tests
                    />
                    <p>Click para subir o arrastra y suelta el archivo aquí</p>
                    <small>CSV (max. 50MB)</small>
                </div>
                {file && <p>Archivo seleccionado: {file.name}</p>}
                <button
                    onClick={handleUpload}
                    className="upload-btn"
                    disabled={!file}
                >
                    Subir
                </button>
                {uploadStatus && (
                    <p className="status-message">{uploadStatus}</p>
                )}
            </div>
        </div>
    );
};

export default UserSync;
