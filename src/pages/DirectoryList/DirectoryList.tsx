import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import './DirectoryList.css';

interface Cliente {
    id: number;
    nombre: string;
    telefono: string;
    WelcomeMessage: string | null;
}

const ClienteList: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);

    const fetchClientes = () => {
        axiosInstance
            .get('/clientes')
            .then((response) => {
                setClientes(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener clientes:', error);
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
                <h3>Directorio líneas telefónicas</h3>
                <table className="cliente-table">
                    <thead>
                        <tr>
                            <th>LINEA TELEFÓNICA</th>
                            <th>CLIENTE</th>
                            <th>BIENVENIDA</th>
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
                                <td colSpan={3}>No se encontraron clientes</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClienteList;
