import React from 'react';
import './DetailIncidentModal.css'; // Importa los estilos personalizados

interface DetailIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentDetail: {
    descripcion: string;
    categoria: string;
    cliente: string;
    fechaApertura: string;
    fechaCierre: string;
    prioridad: string;
    solucion: string;
  };
}

const DetailIncidentModal: React.FC<DetailIncidentModalProps> = ({ isOpen, onClose, incidentDetail }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Detalle del Incidente</h2> {/* Asegurar que este título sea visible */}

        <div className="incident-details">
          <h3 className="section-title">Descripción del soporte:</h3>
          <div className="scroll-container">
            <div>{incidentDetail.descripcion}</div>
          </div>

          <div className="incident-info-grid">
            <div className="column">
              <p><strong>Categoría:</strong> {incidentDetail.categoria}</p>
              <p><strong>Cliente:</strong> {incidentDetail.cliente}</p>
            </div>
            <div className="column">
              <p><strong>Prioridad:</strong> <span className={`prioridad ${incidentDetail.prioridad.toLowerCase()}`}>{incidentDetail.prioridad}</span></p>
              <p><strong>Fecha de apertura:</strong> {incidentDetail.fechaApertura}</p>
              <p><strong>Fecha de cierre:</strong> {incidentDetail.fechaCierre}</p>
            </div>
          </div>

          <h3 className="section-title">Solución</h3>
          <div className="scroll-container">
            <div>{incidentDetail.solucion}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailIncidentModal;
