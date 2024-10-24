import React, { useState, useEffect } from 'react';
import DetailIncidentModal from '../DetailIncident/DetailIncident';
import CreateIncident from '../CreateIncident/CreateIncident';
import './IncidentList.css';
import axiosInstance from '../../utils/axiosInstance';

interface Incident {
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

const IncidentList: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
        null
    );
    const [isCreateIncidentVisible, setIsCreateIncidentVisible] =
        useState(false);

    const fetchIncidents = () => {
        axiosInstance
            .get('/incidentes')
            .then((response) => {
                setIncidents(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener incidentes:', error);
            });
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    const openModal = (incident: Incident) => {
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
                <button
                    onClick={toggleCreateIncident}
                    className="btn-create-incident"
                >
                    Agregar Incidente
                </button>
            </div>

            {isCreateIncidentVisible && (
                <div className="create-incident-modal">
                    <CreateIncident
                        onClose={toggleCreateIncident}
                        onIncidentCreated={fetchIncidents}
                    />
                </div>
            )}

            <div className="table-container">
                <table className="incident-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Categoría</th>
                            <th>Canal</th>
                            <th>Prioridad</th>
                            <th>Fecha de Apertura</th>
                            <th>Fecha de Cierre</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.length > 0 ? (
                            incidents.map((incident) => (
                                <tr key={incident.id}>
                                    <td>{incident.id}</td>
                                    <td>{incident.cliente_id}</td>
                                    <td className="truncate">
                                        {incident.description}
                                    </td>
                                    <td
                                        className={`status ${incident.estado.toLowerCase()}`}
                                    >
                                        {incident.estado}
                                    </td>
                                    <td>{incident.categoria}</td>
                                    <td>{incident.canal}</td>
                                    <td
                                        className={`priority ${incident.prioridad.toLowerCase()}`}
                                    >
                                        {incident.prioridad}
                                    </td>
                                    <td>
                                        {new Date(
                                            incident.fecha_creacion
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {incident.fecha_cierre
                                            ? new Date(
                                                  incident.fecha_cierre
                                              ).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => openModal(incident)}
                                            className="btn-view-detail"
                                        >
                                            <span className="icon-detail"></span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10}>
                                    No se encontraron incidentes
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedIncident && (
                <DetailIncidentModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    incidentDetail={selectedIncident}
                    onIncidentUpdated={fetchIncidents} // Llama a la función para actualizar la lista
                />
            )}
        </div>
    );
};

export default IncidentList;
