import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import DetailIncidentModal from '../DetailIncident/DetailIncident';
import CreateIncident from '../CreateIncident/CreateIncident';
import ValidateUserModal from '../../components/UserValidation/UserValidation';
import { Dialog } from '@mui/material';
import './IncidentList.css';
import axiosInstance from '../../utils/axiosInstance';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
        null
    );
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [isCreateIncidentVisible, setIsCreateIncidentVisible] =
        useState(false);
    const [validatedUserInfo, setValidatedUserInfo] = useState<any>(null);

    const fetchIncidents = () => {
        axiosInstance
            .get('/incidentes')
            .then((response) => {
                setIncidents(response.data);
            })
            .catch((error) => {
                console.error(t('Error al obtener incidentes:'), error);
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

    const openValidationModal = () => {
        setIsValidationModalOpen(true);
    };

    const handleUserValidated = (userInfo: any) => {
        setValidatedUserInfo(userInfo);
    };

    const handleOpenCreateIncident = (userInfo: any) => {
        setValidatedUserInfo(userInfo);
        setIsValidationModalOpen(false);
        setIsCreateIncidentVisible(true);
    };

    const closeCreateIncidentModal = () => {
        setIsCreateIncidentVisible(false);
        setValidatedUserInfo(null);
        fetchIncidents();
    };

    return (
        <div className="incident-list-container">
            <BreadCrumb />
            <div className="button-container">
                <button
                    onClick={openValidationModal}
                    className="btn-create-incident"
                >
                    {t('AGREGAR INCIDENTE')}
                </button>
            </div>

            <ValidateUserModal
                isOpen={isValidationModalOpen}
                onUserValidated={handleUserValidated}
                onClose={() => setIsValidationModalOpen(false)}
                onOpenCreateIncident={handleOpenCreateIncident}
            />

            <Dialog
                open={isCreateIncidentVisible}
                onClose={closeCreateIncidentModal}
                fullWidth
                maxWidth="md"
            >
                <CreateIncident
                    onClose={closeCreateIncidentModal}
                    onIncidentCreated={fetchIncidents}
                    initialUserInfo={validatedUserInfo}
                />
            </Dialog>

            <div className="table-container">
                <h3>{t('Incidentes')}</h3>

                <table className="incident-table">
                    <thead>
                        <tr>
                            <th>{t('RADICADO')}</th>
                            <th>{t('CLIENTE')}</th>
                            <th>{t('DESCRIPCIÓN')}</th>
                            <th>{t('ESTADO')}</th>
                            <th>{t('CATEGORÍA')}</th>
                            <th>{t('CANAL')}</th>
                            <th>{t('PRIORIDAD')}</th>
                            <th>{t('FECHA DE APERTURA')}</th>
                            <th>{t('FECHA DE CIERRE')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.length > 0 ? (
                            incidents.map((incident) => (
                                <tr key={incident.id}>
                                    <td>{incident.radicado}</td>
                                    <td>{incident.cliente_id}</td>
                                    <td className="truncate">
                                        {incident.description}
                                    </td>
                                    <td>
                                        <div
                                            className={`status ${incident.estado.toLowerCase()}`}
                                        >
                                            {t(incident.estado)}
                                        </div>
                                    </td>
                                    <td>{t(incident.categoria)}</td>
                                    <td>{t(incident.canal)}</td>
                                    <td>
                                        <div
                                            className={`priority ${incident.prioridad.toLowerCase()}`}
                                        >
                                            {t(incident.prioridad)}
                                        </div>
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
                                    {t('No se encontraron incidentes')}
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
                    onIncidentUpdated={fetchIncidents}
                />
            )}
        </div>
    );
};

export default IncidentList;
