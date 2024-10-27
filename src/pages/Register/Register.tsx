import React, { useState } from 'react';
import './Register.css'; // Mantén tu archivo de estilos
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const Register: React.FC = () => {
    const navigate = useNavigate();
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
    const [disabledButton, setDisabledButton ] = useState<boolean>(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        if (name === 'telefono') {
            const isNumeric = /^\d+$/.test(value);
            if (!isNumeric) {
                setPhoneError('El teléfono solo puede contener números.');
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
            setPhoneError('El teléfono solo puede contener números.');
            setDisabledButton(false); 
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            setDisabledButton(false); 
            return;
        }

        setErrorMessage(null);

        console.log('Form data submitted:', formData);
        axiosInstance
            .post('/clientes/', formData)
            .then((response) => {
                navigate('/plan-selection');
                setDisabledButton(false);
            })
            .catch((error) => {
                console.error('Error al crear cliente:', error); // Asegúrate de registrar el error
                if (error.response?.data?.detail) {
                    setErrorMessage(error.response.data.detail);
                } else {
                    setErrorMessage('Ocurrió un error al crear el cliente.');
                }
                setDisabledButton(false); 
            });
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Registrarse</h2>

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
                                    Nombre empresa
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="nombre"
                                    placeholder="Introduce el nombre de la empresa"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Introduce tu correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="nit">NIT</label>
                                <input
                                    type="text"
                                    id="nit"
                                    name="nit"
                                    placeholder="Introduce el NIT de la empresa"
                                    value={formData.nit}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Dirección</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="direccion"
                                    placeholder="Introduce la dirección de la empresa"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Teléfono</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="telefono"
                                    placeholder="Introduce el teléfono de la empresa"
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
                                <label htmlFor="industry">Industria</label>
                                <select
                                    id="industry"
                                    name="industria"
                                    value={formData.industria}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Selecciona una industria
                                    </option>
                                    <option value="technology">
                                        Tecnología
                                    </option>
                                    <option value="finance">Finanzas</option>
                                    <option value="healthcare">Salud</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-column">
                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Introduce tu contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    Confirmar contraseña
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Introduce tu contraseña"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="WelcomeMessage">
                                    Bienvenida para los Usuarios
                                </label>
                                <textarea
                                    id="WelcomeMessage"
                                    name="WelcomeMessage"
                                    placeholder="Escribe el mensaje de bienvenida que tus clientes escucharán cuando se comuniquen con el servicio de soporte."
                                    value={formData.WelcomeMessage}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="submit-btn" disabled={disabledButton} >
                        Siguiente
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
