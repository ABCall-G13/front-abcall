import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Alert,
    Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import './UserValidation.css';
import axiosInstance from '../../utils/axiosInstance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';

interface ValidateUserModalProps {
    isOpen: boolean;
    onUserValidated: (userInfo: any) => void;
    onClose: () => void;
    onOpenCreateIncident: (userInfo: any) => void;
}

const ValidateUserModal: React.FC<ValidateUserModalProps> = ({
    isOpen,
    onUserValidated,
    onClose,
    onOpenCreateIncident,
}) => {
    const { t } = useTranslation();

    const [docType, setDocType] = useState('');
    const [docNumber, setDocNumber] = useState('');
    const [client, setClient] = useState<any>(null);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isUserFound, setIsUserFound] = useState(false);
    const [showEmptyFieldsAlert, setShowEmptyFieldsAlert] = useState(false);
    const [showUserNotFoundAlert, setShowUserNotFoundAlert] = useState(false);
    const [clientes, setClientes] = useState<any[]>([]);

    const selectRef = useRef<HTMLSelectElement | null>(null);

    const handleSelectClick = () => {
        setIsSelectOpen((prev) => !prev);
    };

    const resetFields = () => {
        setDocType('');
        setDocNumber('');
        setClient('');
        setIsSelectOpen(false);
        setUserInfo(null);
        setIsUserFound(false);
        setShowEmptyFieldsAlert(false);
        setShowUserNotFoundAlert(false);
    };

    const handleClose = () => {
        resetFields();
        onClose();
    };

    useEffect(() => {
        axiosInstance
            .get('/clientes')
            .then((response) => setClientes(response.data))
            .catch((error) => console.error(t('Error al obtener los clientes:'), error));

        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleValidateUser = async () => {
        if (!docType || !docNumber || !client) {
            setShowEmptyFieldsAlert(true);
            setShowUserNotFoundAlert(false);
            return;
        }

        try {
            const response = await axiosInstance.get(`/usuario`, {
                params: {
                    doc_type: docType,
                    doc_number: docNumber,
                    client: client.nit,
                },
            });

            if (response.data && Object.keys(response.data).length > 0) {
                const userData = response.data;
                console.log(t('Información del usuario:'), userData);
                const userFormattedData = {
                    name: userData.nombre,
                    document: `${userData.tipo_documento}. ${userData.documento}`,
                    phone: userData.telefono,
                    email: userData.email,
                    cliente_id: client.id,
                    identificacion_usuario: userData.documento,
                };
                setUserInfo(userFormattedData);
                setIsUserFound(true);
                onUserValidated(userData);
                setShowEmptyFieldsAlert(false);
                setShowUserNotFoundAlert(false);
            } else {
                setIsUserFound(false);
                setShowEmptyFieldsAlert(false);
                setShowUserNotFoundAlert(true);
            }
        } catch (error) {
            setShowEmptyFieldsAlert(false);
            setShowUserNotFoundAlert(true);
        }
    };

    const handleCreateIncident = () => {
        if (userInfo) {
            console.log(t('Información del usuario:'), userInfo);
            onOpenCreateIncident(userInfo);
            handleClose();
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '20px',
                    minHeight: '65vh',
                    paddingInline: '2rem',
                },
            }}
        >
            <DialogTitle color="#2D3748">
                <p>{t('Validación de usuario')}</p>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {showEmptyFieldsAlert && (
                    <Stack sx={{ width: '100%', marginBottom: 2 }} spacing={2}>
                        <Alert severity="error" className="custom-alert">
                            {t('Por favor, completa todos los campos.')}
                        </Alert>
                    </Stack>
                )}
                {showUserNotFoundAlert && (
                    <Stack sx={{ width: '100%', marginBottom: 2 }} spacing={2}>
                        <Alert severity="error" className="custom-alert">
                            {t('Usuario no encontrado.')}
                        </Alert>
                    </Stack>
                )}
                <div className="custom-field">
                    <label className="custom-label" htmlFor="docType">
                        {t('Tipo de documento')}
                    </label>
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <select
                            ref={selectRef}
                            value={docType}
                            onClick={handleSelectClick}
                            onChange={(e) => setDocType(e.target.value)}
                            className="custom-select"
                            style={{ width: '100%', appearance: 'none', paddingRight: '2.5rem' }}
                            aria-label={t('Tipo de documento')}
                            id="docType"
                        >
                            <option value="">{t('Seleccione un tipo de documento')}</option>
                            <option value="CC">{t('Cédula de ciudadanía')}</option>
                            <option value="PP">{t('Pasaporte')}</option>
                            <option value="CE">{t('Cédula de extranjería')}</option>
                            <option value="NIT">{t('NIT')}</option>
                        </select>
                        {docType && (
                            <IconButton
                                aria-label="clear"
                                onClick={() => setDocType('')}
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    right: '32px',
                                    color: '#888',
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}
                        {isSelectOpen ? (
                            <ArrowDropUpIcon
                                sx={{
                                    position: 'absolute',
                                    right: '8px',
                                    pointerEvents: 'none',
                                    color: '#888',
                                }}
                            />
                        ) : (
                            <ArrowDropDownIcon
                                sx={{
                                    position: 'absolute',
                                    right: '8px',
                                    pointerEvents: 'none',
                                    color: '#888',
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="custom-field">
                    <label htmlFor="docNumber" className="custom-label">
                        {t('Número de identificación')}
                    </label>
                    <input
                        id="docNumber"
                        type="text"
                        placeholder={t('Ingrese el número de identificación')}
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        className="custom-input"
                    />
                </div>

                <div className="custom-field">
                    <label className="custom-label" htmlFor="client">
                        {t('Cliente')}
                    </label>
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <select
                            ref={selectRef}
                            value={client ? JSON.stringify(client) : ''}
                            onClick={handleSelectClick}
                            onChange={(e) => {
                                const value = e.target.value;
                                setClient(value ? JSON.parse(value) : null);
                            }}
                            className="custom-select"
                            style={{ width: '100%', appearance: 'none', paddingRight: '2.5rem' }}
                            aria-label={t('Cliente')}
                            id="client"
                        >
                            <option value="" key="default">
                                {t('Seleccione un cliente')}
                            </option>
                            {Array.isArray(clientes) &&
                                clientes.map((cliente, index) => (
                                    <option
                                        key={cliente.nit || index}
                                        value={JSON.stringify(cliente)}
                                    >
                                        {cliente.nombre}
                                    </option>
                                ))}
                        </select>
                        {client && (
                            <IconButton
                                aria-label="clear"
                                onClick={() => setClient('')}
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    right: '32px',
                                    color: '#888',
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}
                        {isSelectOpen ? (
                            <ArrowDropUpIcon
                                data-testid="ArrowDropUpIcon"
                                sx={{
                                    position: 'absolute',
                                    right: '8px',
                                    pointerEvents: 'none',
                                    color: '#888',
                                }}
                            />
                        ) : (
                            <ArrowDropDownIcon
                                data-testid="ArrowDropDownIcon"
                                sx={{
                                    position: 'absolute',
                                    right: '8px',
                                    pointerEvents: 'none',
                                    color: '#888',
                                }}
                            />
                        )}
                    </div>
                </div>
                {!isUserFound && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '3rem',
                        }}
                    >
                        <button
                            className="custom-button"
                            onClick={handleValidateUser}
                            id="validar-btn"
                        >
                            {t('Validar usuario')}
                        </button>
                    </div>
                )}

                {isUserFound && userInfo && (
                    <div
                        data-testid="user-found-message"
                        style={{ marginTop: '20px' }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <CheckCircleIcon style={{ color: 'green' }} />
                            <p className="found-user">{t('Usuario encontrado')}</p>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '20px',
                                marginTop: '10px',
                            }}
                        >
                            <div style={{ flex: '1 1 45%' }}>
                                <label>
                                    <strong>{t('Usuario:')}</strong>
                                </label>
                                <p>{userInfo.name}</p>
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>
                                    <strong>{t('Documento:')}</strong>
                                </label>
                                <p>{userInfo.document}</p>
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>
                                    <strong>{t('Teléfono:')}</strong>
                                </label>
                                <p>{userInfo.phone}</p>
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label>
                                    <strong>{t('Email:')}</strong>
                                </label>
                                <p>{userInfo.email}</p>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '3rem',
                            }}
                        >
                            <button
                                className="custom-button"
                                onClick={handleCreateIncident}
                            >
                                {t('Crear Incidente')}
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ValidateUserModal;
