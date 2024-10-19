import React, { useState } from 'react';
import DetailIncidentModal from '../DetailIncident/DetailIncident';
import CreateIncident from '../CreateIncident/CreateIncident';
import './IncidentList.css'; // Estilos actualizados

const IncidentList2: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isCreateIncidentVisible, setIsCreateIncidentVisible] = useState(false);

  const incidents = [
    {
      id: 'SP-000001',
      cliente: "Claro Colombia",
      descripcion: "Error en inicio de sesión",
      estado: "Cerrado",
      categoria: "Acceso",
      canal: "Teléfono",
      prioridad: "Alta",
      fechaApertura: "2024-09-12 8:30 AM",
      fechaCierre: "2024-09-12 10:30 AM",
      solucion: "Se restableció la contraseña del usuario"
    },
    {
      id: 'SP-000002',
      cliente: "Claro Colombia",
      descripcion: "Error en inicio de sesión",
      estado: "Abierto",
      categoria: "Configuración",
      canal: "Email",
      prioridad: "Media",
      fechaApertura: "2024-09-12 8:30 AM",
    },
    // Otros incidentes
  ];

  const openModal = (incident: any) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIncident(null);
  };

  const toggleCreateIncident = () => {
    setIsCreateIncidentVisible(!isCreateIncidentVisible);
  };

  return (
    <div className="incident-list-container">
      <div className="header">
        <h1>Incidentes</h1>
        <button onClick={toggleCreateIncident} className="btn-create-incident">
          Agregar Incidente
        </button>
      </div>

      {isCreateIncidentVisible && (
        <div className="create-incident-modal">
          <CreateIncident onClose={toggleCreateIncident} />
        </div>
      )}

      <table className="incident-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Categoría</th>
            <th>Canal</th>
            <th>Prioridad</th> {/* Nueva columna de prioridad */}
            <th>Fecha de Apertura</th>
            <th>Fecha de Cierre</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident, index) => (
            <tr key={index}>
              <td>{incident.id}</td>
              <td>{incident.cliente}</td>
              <td>{incident.descripcion}</td>
              <td className={`status ${incident.estado.toLowerCase()}`}>
                {incident.estado}
              </td>
              <td>{incident.categoria}</td>
              <td>{incident.canal}</td>
              <td className={`priority ${incident.prioridad.toLowerCase()}`}>
                {incident.prioridad}
              </td>
              <td>{incident.fechaApertura}</td>
              <td>{incident.fechaCierre || '-'}</td>
              <td>
                <button onClick={() => openModal(incident)} className="btn-view-detail">
                  <span className="icon-detail"></span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedIncident && (
        <DetailIncidentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          incidentDetail={selectedIncident}
        />
      )}
    </div>
  );
};

export default IncidentList2;
