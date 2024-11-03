import React, { useEffect, useState } from 'react';
import './CommonIssue.css'; // Import custom styles
import axiosInstance from '../../utils/axiosInstance';

interface ProblemaComun {
    id: number;
    description: string;
    categoria: string;
    solucion: string;
}

interface ProblemaComunModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProblemaComunModal: React.FC<
    ProblemaComunModalProps & { onAddSolution: (solucion: string) => void }
> = ({ isOpen, onClose, onAddSolution }) => {
    const [problemas, setProblemas] = useState<ProblemaComun[]>([]);

    useEffect(() => {
        if (isOpen) {
            axiosInstance
                .get('/soluciones')
                .then((response) => {
                    setProblemas(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching problem data:', error);
                });
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="modal-title">Problemas Comunes</h2>

                <div className="table-container">
                    <table className="problema-comun-table">
                        <thead>
                            <tr>
                                <th>DESCRIPCIÓN</th>
                                <th>CATEGORÍA</th>
                                <th>SOLUCIÓN</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problemas.length > 0 ? (
                                problemas.map((problema) => (
                                    <tr key={problema.id}>
                                        <td>{problema.description}</td>
                                        <td>{problema.categoria}</td>
                                        <td>{problema.solucion}</td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    onAddSolution(
                                                        problema.solucion
                                                    );
                                                    onClose();
                                                }}
                                                className="btn-agregar-solucion"
                                            >
                                                Agregar Solución
                                            </button>
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
        </div>
    );
};

export default ProblemaComunModal;