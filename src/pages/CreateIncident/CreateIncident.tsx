import React, { useState, useEffect } from 'react';
import './CreateIncident.css'; // Archivo de estilos
import axiosInstance from '../../utils/axiosInstance'; // Asegúrate de tener configurado axiosInstance para manejar la API

interface CreateIncidentProps {
    onClose: () => void;
    onIncidentCreated: () => void; // Nueva prop para actualizar la lista de incidentes
}

const CreateIncident: React.FC<CreateIncidentProps> = ({
    onClose,
    onIncidentCreated,
}) => {
    const [formData, setFormData] = useState({
        id: 0,
        descripcion: '',
        categoria: '',
        prioridad: '',
        canal: '',
        cliente: '',
        estado: 'abierto',
        fecha_creacion: new Date().toISOString().slice(0, 10), // Fecha actual
        fecha_cierre: '',
        solucion: '',
    });

    const [enums, setEnums] = useState({
        categoria: [],
        prioridad: [],
        canal: [],
        estado: [],
    });

    interface Cliente {
        id: number;
        nombre: string;
        email: string;
        nit: string;
        direccion: string;
        telefono: string;
        industria: string;
        WelcomeMessage: string;
    }

    const [clientes, setClientes] = useState<Cliente[]>([]); // Estado para almacenar los clientes
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Manejo de errores

    // Obtener los valores de los enums y los clientes desde el backend
    useEffect(() => {
        axiosInstance
            .get('/incidentes/fields')
            .then((response) => {
                setEnums(response.data); // Establece los valores de los enums
            })
            .catch((error) => {
                console.error(
                    'Error al obtener los valores permitidos:',
                    error
                );
            });

        axiosInstance
            .get('/clientes')
            .then((response) => {
                setClientes(response.data); // Establece los valores de los clientes
            })
            .catch((error) => {
                console.error('Error al obtener los clientes:', error);
            });
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/incidente', {
                id: formData.id,
                description: formData.descripcion,
                categoria: formData.categoria,
                prioridad: formData.prioridad,
                canal: formData.canal,
                cliente_id: parseInt(formData.cliente), // Convertimos a número si es necesario
                estado: formData.estado,
                fecha_creacion: formData.fecha_creacion,
                fecha_cierre: formData.fecha_cierre || null,
                solucion: formData.solucion || null,
            });

            console.log('Incidente creado:', response.data);

            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                onClose(); // Cierra el modal
                onIncidentCreated(); // Notifica al componente padre que se ha creado un nuevo incidente
            }, 3000);
        } catch (error) {
            console.error('Error al crear incidente:', error);
            setErrorMessage(
                'Hubo un error al crear el incidente. Intenta de nuevo.'
            );
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
        }
    };

    return (
        <div className="modal-content">
            <button className="close-button" onClick={onClose}>
                &times;
            </button>
            <h2 className="modal-title">Registrar Incidente</h2>

            {isSubmitted && (
                <div className="alert-success">
                    <span>&#10003;</span> Incidente creado satisfactoriamente
                </div>
            )}

            {errorMessage && (
                <div className="alert-error">
                    <span>&#10060;</span> {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="incident-form">
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categoria">Categoría</label>
                    <select
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {enums.categoria.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="prioridad">Prioridad</label>
                    <select
                        id="prioridad"
                        name="prioridad"
                        value={formData.prioridad}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una prioridad</option>
                        {enums.prioridad.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="cliente">Cliente</label>
                    <select
                        id="cliente"
                        name="cliente"
                        value={formData.cliente}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="canal">Canal</label>
                    <select
                        id="canal"
                        name="canal"
                        value={formData.canal}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona un canal</option>
                        {enums.canal.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="submit-btn">
                    Registrar Incidente
                </button>
            </form>
        </div>
    );
};

export default CreateIncident;
