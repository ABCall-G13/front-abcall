import React, { useState } from 'react';
import './Register.css'; // Mantén tu archivo de estilos
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate(); // Hook de navegación
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    nit: '',
    direccion: '',
    telefono: '',
    industria: '',
    password: '',
    confirmPassword: '',
    welcomeMessage: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    axiosInstance.post('/clientes', formData)
    .then(response => {
      navigate('/plan-selection');
    })
    .catch(error => {
      console.error('Error al crear cliente:', error);
    });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="companyName">Nombre empresa</label>
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
                  type="text"
                  id="phone"
                  name="telefono"
                  placeholder="Introduce el teléfono de la empresa"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
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
                  <option value="">Selecciona una industria</option>
                  <option value="technology">Tecnología</option>
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
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
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
                <label htmlFor="welcomeMessage">Bienvenida para los Usuarios</label>
                <textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  placeholder="Escribe el mensaje de bienvenida que tus clientes escucharán cuando se comuniquen con el servicio de soporte."
                  value={formData.welcomeMessage}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" >Siguiente</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
