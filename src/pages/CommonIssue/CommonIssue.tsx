import React from 'react';
import './CommonIssue.css';
import axiosInstance from '../../utils/axiosInstance';
import { useTranslation } from 'react-i18next';

interface ProblemaComun {
    id: number;
    description: string;
    categoria: string;
    solucion: string;
}

interface ProblemaComunModalProps {
    isOpen: boolean;
    onClose: () => void;
    problemas: ProblemaComun[];
    onAddSolution: (solucion: string) => void;
}

const ProblemaComunModal: React.FC<ProblemaComunModalProps> = ({
    isOpen,
    onClose,
    problemas,
    onAddSolution,
}) => {
    const { t } = useTranslation();

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="modal-title">{t('Problemas Comunes')}</h2>

                <div className="table-container">
                    <table className="problema-comun-table">
                        <thead>
                            <tr>
                                <th>{t('DESCRIPCIÓN')}</th>
                                <th>{t('CATEGORÍA')}</th>
                                <th>{t('SOLUCIÓN')}</th>
                                <th>{t('ACCIONES')}</th>
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
                                                {t('Agregar Solución')}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>
                                        {t(
                                            'No se encontraron problemas comunes'
                                        )}
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
