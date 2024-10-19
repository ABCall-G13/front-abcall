import React, { useState } from 'react';
import DetailIncidentModal from '../DetailIncident/DetailIncident';

const IncidentList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const incidents = [
    {
      descripcion: "El usuario reporta que no puede iniciar sesión en el sistema.",
      categoria: "Acceso",
      usuario: "Movistar Colombia",
      fechaApertura: "2024-09-12 8:30 AM",
      fechaCierre: "2024-09-12 10:30 AM",
      prioridad: "Alta",
      solucion: "Verificar credenciales del usuario... | Restablecer contraseña...",
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

  return (
    <div>
      <h1>Lista de Incidentes</h1>
      <ul>
        {incidents.map((incident, index) => (
          <li key={index}>
            <button onClick={() => openModal(incident)}>
              Ver detalle del incidente
            </button>
          </li>
        ))}
      </ul>

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

export default IncidentList;
