import React, { useState } from 'react';
import './DetailIncidentModal.css'; // Importa los estilos personalizados
import axiosInstance from '../../utils/axiosInstance';

interface DetailIncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    incidentDetail: {
        id: number;
        cliente_id: number;
        description: string;
        estado: string;
        categoria: string;
        canal: string;
        prioridad: string;
        fecha_creacion: string;
        fecha_cierre?: string | null; // Opcional porque puede ser null
        solucion?: string | null;
        radicado: string;
    };
    onIncidentUpdated: () => void; // Callback para actualizar la lista de incidentes
}

const DetailIncidentModal: React.FC<DetailIncidentModalProps> = ({
    isOpen,
    onClose,
    incidentDetail,
    onIncidentUpdated,
}) => {
    const [solucion, setSolucion] = useState<string>(''); // Para manejar la solución

    if (!isOpen) {
        return null;
    }

    // Función para manejar el botón "Solucionar"
    const handleSolucionar = () => {
        axiosInstance
            .put(`/incidente/${incidentDetail.id}/solucionar`, { solucion })
            .then((response) => {
                onIncidentUpdated(); // Llama a la función para actualizar la lista de incidentes
                onClose(); // Cierra el modal
            })
            .catch((error) => {
                console.error('Error al solucionar incidente:', error);
            });
    };

    // Función para manejar el botón "Escalar"
    const handleEscalar = () => {
        axiosInstance
            .put(`/incidente/${incidentDetail.id}/escalar`)
            .then((response) => {
                onIncidentUpdated(); // Actualiza la lista de incidentes
                onClose(); // Cierra el modal
            })
            .catch((error) => {
                console.error('Error al escalar incidente:', error);
            });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="modal-title">Detalle del Incidente</h2>

                <div className="incident-details">
                    <h3 className="section-title">Descripción del soporte:</h3>
                    <div className="scroll-container">
                        <div>{incidentDetail.description}</div>
                    </div>

                    <div className="incident-info-grid">
                        <div className="column">
                            <p>
                                <strong>Categoría:</strong>{' '}
                                {incidentDetail.categoria}
                            </p>
                            <p>
                                <strong>Cliente:</strong>{' '}
                                {incidentDetail.cliente_id}
                            </p>
                            <p>
                                <strong>Radicado:</strong>{' '}
                                {incidentDetail.radicado}
                            </p>
                        </div>
                        <div className="column">
                            <p>
                                <strong>Prioridad:</strong>{' '}
                                <span
                                    className={`prioridad ${incidentDetail.prioridad.toLowerCase()}`}
                                >
                                    {incidentDetail.prioridad}
                                </span>
                            </p>
                            <p>
                                <strong>Fecha de apertura:</strong>{' '}
                                {incidentDetail.fecha_creacion}
                            </p>
                            <p>
                                <strong>Fecha de cierre:</strong>{' '}
                                {incidentDetail.fecha_cierre || '-'}
                            </p>
                        </div>
                    </div>

                    <h3 className="section-title">Solución</h3>
                    <div className="scroll-container">
                        <div>
                            {incidentDetail.solucion ||
                                'Aún no se ha proporcionado una solución.'}
                        </div>
                    </div>

                    {/* Mostrar los botones "Solucionar" y "Escalar" solo si el incidente está abierto */}
                    {incidentDetail.estado === 'abierto' && (
                        <div className="incident-actions">
                            <textarea
                                value={solucion}
                                onChange={(e) => setSolucion(e.target.value)}
                                placeholder="Escribe la solución aquí"
                                className="solucion-input"
                            />
                            <button
                                onClick={handleSolucionar}
                                className="btn-solucionar"
                            >
                                Guardar Solución
                            </button>
                            <button
                                onClick={handleEscalar}
                                className="btn-escalar"
                            >
                                Escalar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailIncidentModal;
