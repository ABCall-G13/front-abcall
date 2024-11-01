import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import './UserValidation.css';
import Stack from '@mui/material/Stack';
import axiosInstance from '../../utils/axiosInstance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ValidateUserModalProps {
    isOpen: boolean;
    onUserValidated: (userInfo: any) => void;
    onClose: () => void;
    onOpenCreateIncident: () => void;
}

const ValidateUserModal: React.FC<ValidateUserModalProps> = ({
    isOpen,
    onUserValidated,
    onClose,
    onOpenCreateIncident,
}) => {
    const [docType, setDocType] = useState('');
    const [docNumber, setDocNumber] = useState('');
    const [client, setClient] = useState('');
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isUserFound, setIsUserFound] = useState(false);
    const [showEmptyFieldsAlert, setShowEmptyFieldsAlert] = useState(false);
    const [showUserNotFoundAlert, setShowUserNotFoundAlert] = useState(false);

    const selectRef = useRef<HTMLSelectElement | null>(null);

    const handleSelectClick = () => {
        setIsSelectOpen((prev) => !prev);
    };

    // Función para limpiar el estado
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
            .then((response) => {
                setClientes(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener los clientes:', error);
            });
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
    
    interface Cliente {
        id: number;
        nombre: string;
        email: string;
        nit: string;
        direccion: string;
        telefono: string;
        industria: string;
        WelcomeMessage: string;
    }

    const [clientes, setClientes] = useState<Cliente[]>([]);

    const handleValidateUser = async () => {
        // Validación de campos vacíos
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
                    client: client,
                },
            });

            if (response.data && Object.keys(response.data).length > 0) {
                console.log('Usuario encontrado:', response.data);
                const userData = response.data;
                setUserInfo({
                    name: userData.nombre,
                    document: `${userData.tipo_documento}. ${userData.documento}`,
                    phone: userData.telefono,
                    email: userData.email,
                });
                setIsUserFound(true);
                onUserValidated(userData);
                setShowEmptyFieldsAlert(false);
                setShowUserNotFoundAlert(false);
            } else {
                // Usuario no encontrado
                setIsUserFound(false);
                setShowEmptyFieldsAlert(false);
                setShowUserNotFoundAlert(true);
            }
        } catch (error) {
            console.error('Error al validar el usuario:', error);
            setShowEmptyFieldsAlert(false);
            setShowUserNotFoundAlert(true);
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={handleClose} 
            fullWidth 
            maxWidth="sm"
            sx={{ '& .MuiPaper-root': { borderRadius: '20px', minHeight: '65vh', paddingInline: '2rem'} }}
        >
            <DialogTitle>
                <h3>Validación de usuario</h3>
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
                            Por favor, completa todos los campos.
                        </Alert>
                    </Stack>
                )}
                {showUserNotFoundAlert && (
                    <Stack sx={{ width: '100%', marginBottom: 2 }} spacing={2}>
                        <Alert severity="error" className="custom-alert">
                            Usuario no encontrado.
                        </Alert>
                    </Stack>
                )}

                <div className="custom-field">
                    <label className="custom-label">Tipo de documento</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <select
                            ref={selectRef}
                            value={docType}
                            onClick={handleSelectClick}
                            onChange={(e) => setDocType(e.target.value)}
                            className="custom-select"
                            style={{ width: '100%', appearance: 'none', paddingRight: '2.5rem' }}
                        >
                            <option value="">Seleccione un tipo de documento</option>
                            <option value="CC">Cédula de ciudadanía</option>
                            <option value="PP">Pasaporte</option>
                            <option value="CE">Cédula de extranjería</option>
                            <option value="NIT">NIT</option>
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
                    <label className="custom-label">Número de identificación</label>
                    <input
                        type="text"
                        placeholder="Ingrese el número de identificación"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        className="custom-input"
                    />
                </div>

                <div className="custom-field">
                    <label className="custom-label">Cliente</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <select
                            ref={selectRef}
                            value={client}
                            onClick={handleSelectClick}
                            onChange={(e) => setClient(e.target.value)}
                            className="custom-select"
                            style={{ width: '100%', appearance: 'none', paddingRight: '2.5rem' }}
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.nit} value={cliente.nit}>
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
                {!isUserFound && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                        <button className="custom-button" onClick={handleValidateUser}>
                            Validar usuario
                        </button>
                    </div>
                )}

                {isUserFound && userInfo && (
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircleIcon style={{ color: 'green' }} />
                            <p className="found-user">Usuario encontrado</p>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
                            <div style={{ flex: '1 1 45%' }}>
                                <label><strong>Usuario:</strong></label>
                                <p>{userInfo.name}</p>
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label><strong>Documento:</strong></label>
                                <p>{userInfo.document}</p>
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label><strong>Teléfono:</strong></label>
                                <p>{userInfo.phone}</p>
                            </div>
                            <div style={{ flex: '1 1 45%' }}>
                                <label><strong>Email:</strong></label>
                                <p>{userInfo.email}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                            <button className="custom-button" onClick={() => {
                                onOpenCreateIncident();
                                handleClose();
                            }}>
                                Crear Incidente
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ValidateUserModal;
