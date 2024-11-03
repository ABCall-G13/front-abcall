import React, { useState } from 'react';
import './DetailIncidentModal.css';
import axiosInstance from '../../utils/axiosInstance';
import ProblemaComunModal from '../CommonIssue/CommonIssue';

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
        fecha_cierre?: string | null;
        solucion?: string | null;
        radicado: string;
    };
    onIncidentUpdated: () => void;
}

const DetailIncidentModal: React.FC<DetailIncidentModalProps> = ({
    isOpen,
    onClose,
    incidentDetail,
    onIncidentUpdated,
}) => {
    const [solucion, setSolucion] = useState<string>('');
    const [isProblemaComunModalOpen, setIsProblemaComunModalOpen] =
        useState(false);

    if (!isOpen) {
        return null;
    }

    const handleSolucionar = () => {
        axiosInstance
            .put(`/incidente/${incidentDetail.id}/solucionar`, { solucion })
            .then(() => {
                onIncidentUpdated();
                onClose();
            })
            .catch((error) => {
                console.error('Error al solucionar incidente:', error);
            });
    };

    const handleEscalar = () => {
        axiosInstance
            .put(`/incidente/${incidentDetail.id}/escalar`)
            .then(() => {
                onIncidentUpdated();
                onClose();
            })
            .catch((error) => {
                console.error('Error al escalar incidente:', error);
            });
    };

    const handleAddSolution = (solucion: string) => {
        setSolucion(solucion);
    };

    const handleProblemaComunModal = () => {
        setIsProblemaComunModalOpen(true);
    };

    const closeProblemaComunModal = () => {
        setIsProblemaComunModalOpen(false);
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
                                {incidentDetail.prioridad}
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
                    <div className="solution-actions">
                        <button
                            onClick={handleSolucionar}
                            className="btn-solucion-ia"
                        >
                            Buscar solución con IA
                        </button>
                        <button
                            onClick={handleProblemaComunModal}
                            className="btn-problema-comun"
                        >
                            Buscar problemas comunes
                        </button>
                        <button
                            onClick={handleEscalar}
                            className="btn-registrar-solucion"
                        >
                            Crear solución
                        </button>
                    </div>
                    <div className="scroll-container">
                        <div>
                            {incidentDetail.solucion ||
                                'Aún no se ha proporcionado una solución.'}
                        </div>
                    </div>
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

                <ProblemaComunModal
                    isOpen={isProblemaComunModalOpen}
                    onClose={closeProblemaComunModal}
                    onAddSolution={handleAddSolution}
                />
            </div>
        </div>
    );
};

export default DetailIncidentModal;
