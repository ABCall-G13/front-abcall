import React, { useState } from 'react';
import './Register.css'; // Mantén tu archivo de estilos
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        nit: '',
        direccion: '',
        telefono: '',
        industria: '',
        password: '',
        confirmPassword: '',
        WelcomeMessage: '',
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [disabledButton, setDisabledButton] = useState<boolean>(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        if (name === 'telefono') {
            const isNumeric = /^\d+$/.test(value);
            if (!isNumeric) {
                setPhoneError(t('El teléfono solo puede contener números.'));
            } else {
                setPhoneError(null);
            }
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setDisabledButton(true);

        if (!/^\d+$/.test(formData.telefono)) {
            setPhoneError(t('El teléfono solo puede contener números.'));
            setDisabledButton(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage(t('Las contraseñas no coinciden.'));
            setDisabledButton(false);
            return;
        }

        setErrorMessage(null);

        console.log('Form data submitted:', formData);
        axiosInstance
            .post('/clientes/', formData)
            .then((response) => {
                navigate('/login-client');
                setDisabledButton(false);
            })
            .catch((error) => {
                console.error('Error al crear cliente:', error);
                if (error.response?.data?.detail) {
                    setErrorMessage(error.response.data.detail);
                } else {
                    setErrorMessage(t('Ocurrió un error al crear el cliente.'));
                }
                setDisabledButton(false);
            });
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>{t('Registrarse')}</h2>

                {errorMessage && (
                    <Stack sx={{ width: '100%', marginBottom: 2 }} spacing={2}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Stack>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-column">
                            <div className="form-group">
                                <label htmlFor="companyName">
                                    {t('Nombre empresa')}
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="nombre"
                                    placeholder={t('Introduce el nombre de la empresa')}
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    {t('Correo electrónico')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder={t('Introduce tu correo electrónico')}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="nit">{t('NIT')}</label>
                                <input
                                    type="text"
                                    id="nit"
                                    name="nit"
                                    placeholder={t('Introduce el NIT de la empresa')}
                                    value={formData.nit}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">{t('Dirección')}</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="direccion"
                                    placeholder={t('Introduce la dirección de la empresa')}
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">{t('Teléfono')}</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="telefono"
                                    placeholder={t('Introduce el teléfono de la empresa')}
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                />
                                {phoneError && (
                                    <span className="error-message">
                                        {phoneError}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="industry">{t('Industria')}</label>
                                <select
                                    id="industry"
                                    name="industria"
                                    value={formData.industria}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        {t('Selecciona una industria')}
                                    </option>
                                    <option value="technology">
                                        {t('Tecnología')}
                                    </option>
                                    <option value="finance">
                                        {t('Finanzas')}
                                    </option>
                                    <option value="healthcare">
                                        {t('Salud')}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="form-column">
                            <div className="form-group">
                                <label htmlFor="password">{t('Contraseña')}</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder={t('Introduce tu contraseña')}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    {t('Confirmar contraseña')}
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder={t('Introduce tu contraseña')}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="WelcomeMessage">
                                    {t('Bienvenida para los Usuarios')}
                                </label>
                                <textarea
                                    id="WelcomeMessage"
                                    name="WelcomeMessage"
                                    placeholder={t('Escribe el mensaje de bienvenida que tus clientes escucharán cuando se comuniquen con el servicio de soporte.')}
                                    value={formData.WelcomeMessage}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={disabledButton}
                    >
                        {t('Siguiente')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
