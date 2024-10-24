import React, { useState } from 'react';
import './IncidentSearch.css';
import axiosInstance from '../../utils/axiosInstance';
import DetailIncidentModal from '../DetailIncident/DetailIncident';

// Aquí definimos el tipo de los detalles del incidente
interface IncidentDetail {
  id: number;
  cliente_id: number;
  description: string;
  estado: string;
  categoria: string;
  canal: string;
  prioridad: string;
  fecha_creacion: string;
  fecha_cierre?: string | null;
  solucion?: string | null;
  radicado: string;
}

const IncidentSearch = () => {
  const [radicado, setRadicado] = useState(''); // Cambié incidentId a radicado
  
  // Usamos el tipo IncidentDetail en el estado
  const [incidentDetail, setIncidentDetail] = useState<IncidentDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      // Cambié el endpoint para que use el radicado
      const response = await axiosInstance.get(`/incidente/radicado/${radicado}`);
      setIncidentDetail(response.data); // Esto debe devolver un objeto con los detalles del incidente
      setIsModalOpen(true);
      setError('');
    } catch (err) {
      setError('No se encontró el incidente');
      setIncidentDetail(null);
      setIsModalOpen(false);
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIncidentDetail(null);
  };

  return (
    <div className="incident-search-page">
      <div className="header-background">
        <h1>Ingrese el radicado del incidente</h1> {/* Cambié "identificador" por "radicado" */}
      </div>
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar incidente por radicado" // Cambié el placeholder
            value={radicado}
            onChange={(e) => setRadicado(e.target.value)} // Cambié incidentId a radicado
          />
          <button onClick={handleSearch}>Consultar</button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Solo muestra el modal si incidentDetail tiene datos válidos */}
      {incidentDetail && isModalOpen && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-container">
            <DetailIncidentModal
              isOpen={isModalOpen}
              onClose={closeModal}
              incidentDetail={incidentDetail} // incidentDetail siempre tendrá un valor aquí
              onIncidentUpdated={() => {}}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default IncidentSearch;
