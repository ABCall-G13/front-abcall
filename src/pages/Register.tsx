// src/pages/Register.tsx
import React, { useState } from 'react';
import './Register.css'; // Añadiremos estilos más adelante

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    nit: '',
    address: '',
    phone: '',
    industry: '',
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
    // Aquí puedes manejar la lógica de envío de los datos del formulario
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName">Nombre empresa *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="Introduce el nombre de la empresa"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico *</label>
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
            <label htmlFor="nit">NIT *</label>
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
            <label htmlFor="address">Dirección *</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Introduce la dirección de la empresa"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono *</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Introduce el teléfono de la empresa"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="industry">Industria *</label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una industria</option>
              <option value="technology">Tecnología</option>
              <option value="finance">Finanzas</option>
              <option value="healthcare">Salud</option>
              {/* Añade más opciones según tus necesidades */}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
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
            <label htmlFor="confirmPassword">Confirmar contraseña *</label>
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
            <label htmlFor="welcomeMessage">Bienvenida para los Usuarios *</label>
            <textarea
              id="welcomeMessage"
              name="welcomeMessage"
              placeholder="Escribe el mensaje de bienvenida..."
              value={formData.welcomeMessage}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">Siguiente</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
