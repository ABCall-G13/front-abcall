import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import './CommonIssueList.css';
import axiosInstance from '../../utils/axiosInstance';
import CreateProblemaComun from '../CreateCommonIssue/CreateCommonIssue';
import { useTranslation } from 'react-i18next';

interface ProblemaComun {
    id: number;
    description: string;
    categoria: string;
    solucion: string;
    cliente_id: number;
}

interface Cliente {
    id: number;
    nombre: string;
}

const ProblemaComunList: React.FC = () => {
    const { t } = useTranslation();

    const [problemasComunes, setProblemasComunes] = useState<ProblemaComun[]>(
        []
    );
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [isCreateProblemaVisible, setIsCreateProblemaVisible] =
        useState(false);

    const fetchProblemasComunes = () => {
        axiosInstance
            .get('/soluciones')
            .then((response) => {
                setProblemasComunes(response.data);
            })
            .catch((error) => {
                console.error(t('Error al obtener problemas comunes:'), error);
            });
    };

    const fetchClientes = () => {
        axiosInstance
            .get('/clientes')
            .then((response) => {
                setClientes(response.data);
            })
            .catch((error) => {
                console.error(t('Error al obtener clientes:'), error);
            });
    };

    useEffect(() => {
        fetchProblemasComunes();
        fetchClientes();
    }, []);

    const getClienteNombre = (clientId: number) => {
        const cliente = clientes.find((cliente) => cliente.id === clientId);
        return cliente ? cliente.nombre : t('Cliente no encontrado');
    };

    const toggleCreateProblema = () => {
        setIsCreateProblemaVisible(!isCreateProblemaVisible);
    };

    return (
        <div className="problema-comun-list-container">
            <BreadCrumb />
            <div className="button-container">
                <button
                    onClick={toggleCreateProblema}
                    className="btn-create-problema-comun"
                >
                    {t('AGREGAR PROBLEMA COMÚN')}
                </button>
            </div>
            {isCreateProblemaVisible && (
                <div className="create-problema-comun-modal">
                    <CreateProblemaComun
                        onClose={toggleCreateProblema}
                        onProblemaComunCreated={fetchProblemasComunes}
                    />
                </div>
            )}

            <div className="table-container">
                <h3>{t('Problemas Comunes')}</h3>

                <table className="problema-comun-table">
                    <thead>
                        <tr>
                            <th>{t('CLIENTE')}</th>
                            <th>{t('DESCRIPCIÓN')}</th>
                            <th>{t('CATEGORÍA')}</th>
                            <th>{t('SOLUCIÓN')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problemasComunes.length > 0 ? (
                            problemasComunes.map((problema) => (
                                <tr key={problema.id}>
                                    <td>
                                        {getClienteNombre(problema.cliente_id)}
                                    </td>
                                    <td className="truncate">
                                        {problema.description}
                                    </td>
                                    <td>{problema.categoria}</td>
                                    <td className="truncate">
                                        {problema.solucion}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>
                                    {t('No se encontraron problemas comunes')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProblemaComunList;
