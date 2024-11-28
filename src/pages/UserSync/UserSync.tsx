import React, { useState } from 'react';
import axiosUserServiceInstance from '../../utils/axiosUserServiceInstance';
import './UserSync.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTranslation } from 'react-i18next';

const UserSync: React.FC = () => {
    const { t } = useTranslation();
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
                    t('Por favor, selecciona un archivo Excel (.xlsx)')
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
            setUploadStatus(t('No hay archivo seleccionado'));
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadStatus(t('Subiendo...'));
            await axiosUserServiceInstance.post('/sync-users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus(t('Archivo subido exitosamente'));
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            setUploadStatus(t('Error al subir el archivo'));
        }
    };

    return (
        <div className="user-sync-container">
            <div className="user-sync-card">
                <h2>{t('Cargar usuarios')}</h2>
                <div className="upload-area">
                    <CloudUploadIcon className="upload-icon" />
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx"
                        data-testid="file-input"
                    />
                    <p>{t('Click para subir o arrastra y suelta el archivo aquí')}</p>
                    <small>{t('CSV (max. 50MB)')}</small>
                </div>
                {file && <p>{t('Archivo seleccionado:')} {file.name}</p>}
                <button
                    onClick={handleUpload}
                    className="upload-btn"
                    disabled={!file}
                >
                    {t('Subir')}
                </button>
                {uploadStatus && (
                    <p className="status-message">{uploadStatus}</p>
                )}
            </div>
        </div>
    );
};

export default UserSync;
