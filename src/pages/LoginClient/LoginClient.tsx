import React, { useState } from 'react';
import './LoginClient.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import LanguageSelector from '../../components/Select/LanguageSelector';
import CurrencySelector from '../../components/Select/CurrencySelector';
import { useAuth } from '../../context/AuthContext';

const LoginClient: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        try {
            const response = await axiosInstance.post('/login-client', formData);
            const token = response.data.access_token;
            login(token);
            navigate('/dashboard');
        } catch (error) {
            setErrorMessage('Correo o contraseña incorrectos');
        }
    };

    return (
        <div className="login-client-container">
            <div className="selectors-bar">
                <LanguageSelector />
                <CurrencySelector />
            </div>
            <div className="login-client-card">
                <h2>Iniciar sesión</h2>
                {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
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
                    <button type="submit" className="submit-btn">
                        Iniciar sesión
                    </button>
                    <div className='register_text'>¿No tienes una cuenta? <a href='/register'>Registrate</a></div>
                </form>
            </div>
        </div>
    );
};

export default LoginClient;