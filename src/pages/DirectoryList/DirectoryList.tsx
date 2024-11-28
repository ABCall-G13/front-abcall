import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import './DirectoryList.css';
import { useTranslation } from 'react-i18next'; // Importar useTranslation

interface Cliente {
    id: number;
    nombre: string;
    telefono: string;
    WelcomeMessage: string | null;
}

const ClienteList: React.FC = () => {
    const { t } = useTranslation(); // Inicializar hook de traducciones
    const [clientes, setClientes] = useState<Cliente[]>([]);

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
        fetchClientes();
    }, []);

    return (
        <div className="cliente-list-container">
            <BreadCrumb />
            <div className="spacing-divider"></div>{' '}
            <div className="table-container">
                <h3>{t('Directorio líneas telefónicas')}</h3>
                <table className="cliente-table">
                    <thead>
                        <tr>
                            <th>{t('LINEA TELEFÓNICA')}</th>
                            <th>{t('CLIENTE')}</th>
                            <th>{t('BIENVENIDA')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.length > 0 ? (
                            clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.telefono}</td>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.WelcomeMessage || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3}>{t('No se encontraron clientes')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClienteList;
