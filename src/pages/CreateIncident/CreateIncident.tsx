import React, { useState } from 'react';
import Modal from 'react-modal'; // Importando react-modal
import './CreateIncident.css'; // Archivo de estilos

Modal.setAppElement('#root'); // Necesario para accesibilidad

const CreateIncident: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: '',
    categoria: '',
    prioridad: '',
    cliente: '',
    canal: ''
  });

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Incidente registrado:', formData);
    // Aquí harías la solicitud con axios
    closeModal(); // Cierra el modal al enviar
  };

  return (
    <div>
      <button onClick={openModal} className="open-modal-btn">Agregar Incidente</button>

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal}
        contentLabel="Registro de Incidente"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-header">
          <h2>Nuevo Incidente</h2>
          <button onClick={closeModal} className="close-btn">X</button>
        </div>

        <form onSubmit={handleSubmit} className="incident-form">
          <div className="form-group">
            <label htmlFor="descripcion">Descripción del soporte</label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Introduce la descripción del soporte"
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
              <option value="Soporte técnico">Soporte técnico</option>
              <option value="Consulta">Consulta</option>
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
              <option value="">Selecciona la prioridad</option>
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
              <option value="Empresa A">Empresa A</option>
              <option value="Empresa B">Empresa B</option>
              <option value="Empresa C">Empresa C</option>
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
      </Modal>
    </div>
  );
};

export default CreateIncident;