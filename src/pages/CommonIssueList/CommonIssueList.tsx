import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import './CommonIssueList.css';
import axiosInstance from '../../utils/axiosInstance';
import CreateProblemaComun from '../CreateCommonIssue/CreateCommonIssue';

interface ProblemaComun {
    id: number;
    description: string;
    categoria: string;
    solucion: string;
}

const ProblemaComunList: React.FC = () => {
    const [problemasComunes, setProblemasComunes] = useState<ProblemaComun[]>(
        []
    );
    const [isCreateProblemaVisible, setIsCreateProblemaVisible] =
        useState(false);

    const fetchProblemasComunes = () => {
        axiosInstance
            .get('/soluciones')
            .then((response) => {
                setProblemasComunes(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener problemas comunes:', error);
            });
    };

    useEffect(() => {
        fetchProblemasComunes();
    }, []);

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
                    AGREGAR PROBLEMA COMÚN
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
                <h3>Problemas Comunes</h3>

                <table className="problema-comun-table">
                    <thead>
                        <tr>
                            <th>DESCRIPCIÓN</th>
                            <th>CATEGORÍA</th>
                            <th>SOLUCIÓN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {problemasComunes.length > 0 ? (
                            problemasComunes.map((problema) => (
                                <tr key={problema.id}>
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
                                    No se encontraron problemas comunes
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
