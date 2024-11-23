import React, { useState } from 'react';
import './IncidentSearch.css';
import axiosInstance from '../../utils/axiosInstance';
import DetailIncidentModal from '../DetailIncident/DetailIncident';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      setError(t('No se encontró el incidente'));
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
        <h1>{t('Ingrese el radicado del incidente')}</h1> {/* Cambié "identificador" por "radicado" */}
      </div>
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder={t('Buscar incidente por radicado')} // Cambié el placeholder
            value={radicado}
            onChange={(e) => setRadicado(e.target.value)} // Cambié incidentId a radicado
          />
          <button onClick={handleSearch}>{t('Consultar')}</button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Solo muestra el modal si incidentDetail tiene datos válidos */}
      {incidentDetail && isModalOpen && (
        <>
          <div
            className="modal-overlay"
            onClick={closeModal}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                closeModal();
              }
            }}
            role="button"
            tabIndex={0}
          ></div>
          <div className="modal-container">
            <DetailIncidentModal
              isOpen={isModalOpen}
              onClose={closeModal}
              incidentDetail={incidentDetail}
              onIncidentUpdated={() => {}}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default IncidentSearch;
