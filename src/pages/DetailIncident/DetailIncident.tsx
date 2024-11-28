import React, { useState } from 'react';
import './DetailIncidentModal.css';
import axiosInstance from '../../utils/axiosInstance';
import ProblemaComunModal from '../CommonIssue/CommonIssue';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation(); // Hook para traducciones
    const [solucion, setSolucion] = useState<string>('');
    const [isProblemaComunModalOpen, setIsProblemaComunModalOpen] =
        useState(false);
    const [problemasIA, setProblemasIA] = useState<any[]>([]);
    const [problemasComunes, setProblemasComunes] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [modalContext, setModalContext] = useState<'ia' | 'comunes' | null>(
        null
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (!isOpen) {
        return null;
    }

    const handleSolucionar = async () => {
        try {
            await axiosInstance.put(
                `/incidente/${incidentDetail.id}/solucionar`,
                { solucion }
            );
            onIncidentUpdated();
            onClose();
        } catch (error) {
            setError(t('Error al solucionar incidente'));
            console.error(t('Error al solucionar incidente:'), error);
        }
    };

    const handleAddSolution = (solucion: string) => {
        setSolucion(solucion);
    };

    const fetchIAProblemas = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/search-issues', {
                query: incidentDetail.description,
            });
            setProblemasIA(response.data);
            setModalContext('ia');
            setIsProblemaComunModalOpen(true);
        } catch (error) {
            setError(
                t('No se encontraron problemas comunes para este incidente.')
            );
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProblemasComunes = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/soluciones');
            setProblemasComunes(response.data);
            setModalContext('comunes');
            setIsProblemaComunModalOpen(true);
        } catch (error) {
            setError(t('Error fetching common problem data'));
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeProblemaComunModal = () => {
        setIsProblemaComunModalOpen(false);
        setModalContext(null);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="modal-title">{t('Detalle del Incidente')}</h2>

                <div className="incident-details">
                    <h3 className="section-title">{t('Descripción del soporte:')}</h3>
                    <div className="scroll-container">
                        <div>{incidentDetail.description}</div>
                    </div>

                    <div className="incident-info-grid">
                        <div className="column">
                            <p>
                                <strong>{t('Categoría:')}</strong>{' '}
                                {incidentDetail.categoria}
                            </p>
                            <p>
                                <strong>{t('Cliente:')}</strong>{' '}
                                {incidentDetail.cliente_id}
                            </p>
                            <p>
                                <strong>{t('Radicado:')}</strong>{' '}
                                {incidentDetail.radicado}
                            </p>
                        </div>
                        <div className="column">
                            <p>
                                <strong>{t('Prioridad:')}</strong>{' '}
                                {incidentDetail.prioridad}
                            </p>
                            <p>
                                <strong>{t('Fecha de apertura:')}</strong>{' '}
                                {incidentDetail.fecha_creacion}
                            </p>
                            <p>
                                <strong>{t('Fecha de cierre:')}</strong>{' '}
                                {incidentDetail.fecha_cierre || '-'}
                            </p>
                        </div>
                    </div>

                    <h3 className="section-title">{t('Solución')}</h3>
                    <div className="solution-actions">
                        <button
                            onClick={fetchIAProblemas}
                            className="btn-solucion-ia"
                            disabled={isLoading}
                        >
                            {isLoading && modalContext === 'ia'
                                ? t('Cargando...')
                                : t('Buscar solución con IA')}
                        </button>
                        <button
                            onClick={fetchProblemasComunes}
                            className="btn-problema-comun"
                            disabled={isLoading}
                        >
                            {isLoading && modalContext === 'comunes'
                                ? t('Cargando...')
                                : t('Buscar problemas comunes')}
                        </button>
                    </div>
                    <div className="scroll-container">
                        <div>
                            {incidentDetail.solucion ||
                                t('Aún no se ha proporcionado una solución.')}
                        </div>
                    </div>

                    {incidentDetail.estado === 'abierto' && (
                        <div className="incident-actions">
                            <textarea
                                value={solucion}
                                onChange={(e) => setSolucion(e.target.value)}
                                placeholder={t('Escribe la solución aquí')}
                                className="solucion-input"
                            />
                            <button
                                onClick={handleSolucionar}
                                className="btn-solucionar"
                            >
                                {t('Guardar Solución')}
                            </button>
                        </div>
                    )}
                    {error && <p>{error}</p>}
                </div>

                <ProblemaComunModal
                    isOpen={isProblemaComunModalOpen}
                    onClose={closeProblemaComunModal}
                    onAddSolution={handleAddSolution}
                    problemas={
                        modalContext === 'ia' ? problemasIA : problemasComunes
                    }
                />
            </div>
        </div>
    );
};

export default DetailIncidentModal;
