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
    const [problemasIA, setProblemasIA] = useState<any[]>([]); // State to store IA solutions
    const [problemasComunes, setProblemasComunes] = useState<any[]>([]); // State to store common issues

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

    const fetchIAProblemas = () => {
        axiosInstance
            .post('/search-issues', { query: incidentDetail.description })
            .then((response) => {
                setProblemasIA(response.data);
                setIsProblemaComunModalOpen(true);
            })
            .catch((error) => {
                console.error('Error fetching IA problem data:', error);
            });
    };

    const fetchProblemasComunes = () => {
        axiosInstance
            .get('/soluciones')
            .then((response) => {
                setProblemasComunes(response.data);
                setIsProblemaComunModalOpen(true);
            })
            .catch((error) => {
                console.error('Error fetching common problem data:', error);
            });
    };

    const handleProblemaComunModal = () => {
        fetchIAProblemas(); // Fetch IA solutions when the button is clicked
    };

    const handleFetchProblemasComunes = () => {
        fetchProblemasComunes(); // Fetch common problems when btn-problema-comun is clicked
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
                            onClick={handleProblemaComunModal}
                            className="btn-solucion-ia"
                        >
                            Buscar solución con IA
                        </button>
                        <button
                            onClick={handleFetchProblemasComunes}
                            className="btn-problema-comun"
                        >
                            Buscar problemas comunes
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
                        </div>
                    )}
                </div>

                <ProblemaComunModal
                    isOpen={isProblemaComunModalOpen}
                    onClose={closeProblemaComunModal}
                    onAddSolution={handleAddSolution}
                    problemas={problemasComunes} // Pass common problems to the modal
                />
            </div>
        </div>
    );
};

export default DetailIncidentModal;
