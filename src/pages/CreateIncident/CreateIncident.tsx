import React, { useState } from 'react';
import './CreateIncident.css'; // Archivo de estilos

interface CreateIncidentProps {
  onClose: () => void;
}

const CreateIncident: React.FC<CreateIncidentProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    categoria: '',
    prioridad: '',
    cliente: '',
    canal: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para manejar el envío del formulario
    console.log('Form data submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000); // Oculta la alerta después de 3 segundos y cierra el modal
  };

  return (
    <div className="modal-content">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <h2 className="modal-title">Registrar Incidente</h2> {/* Asegurar que este título sea visible */}
      {isSubmitted && (
        <div className="alert-success">
          <span>&#10003;</span> Incidente creado satisfactoriamente
        </div>
      )}
      <form onSubmit={handleSubmit} className="incident-form">
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoría</option>
            <option value="Acceso">Acceso</option>
            <option value="Red">Red</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="prioridad">Prioridad</label>
          <select
            id="prioridad"
            name="prioridad"
            value={formData.prioridad}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una prioridad</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cliente">Cliente</label>
          <select
            id="cliente"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un cliente</option>
            <option value="Cliente1">Cliente1</option>
            <option value="Cliente2">Cliente2</option>
            <option value="Cliente3">Cliente3</option>
            <option value="Cliente4">Cliente4</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="canal">Canal</label>
          <select
            id="canal"
            name="canal"
            value={formData.canal}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un canal</option>
            <option value="Teléfono">Teléfono</option>
            <option value="Correo">Correo</option>
            <option value="Chat">Chat</option>
            <option value="Llamada">Llamada</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Registrar Incidente</button>
      </form>
    </div>
  );
};

export default CreateIncident;