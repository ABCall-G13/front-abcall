import React, { useState, useEffect } from 'react';
import './CreateCommonIssue.css';
import axiosInstance from '../../utils/axiosInstance';
import { useTranslation } from 'react-i18next';

interface CreateProblemaComunProps {
    onClose: () => void;
    onProblemaComunCreated: () => void;
}

const CreateProblemaComun: React.FC<CreateProblemaComunProps> = ({
    onClose,
    onProblemaComunCreated,
}) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        description: '',
        categoria: '',
        solucion: '',
        cliente_id: '',
    });

    const [categorias, setCategorias] = useState<string[]>([]);
    const [clientes, setClientes] = useState<{ id: number; nombre: string }[]>(
        []
    );
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // Fetch categories
        axiosInstance
            .get('/incidentes/fields')
            .then((response) => {
                setCategorias(response.data.categoria);
            })
            .catch((error) => {
                console.error(t('Error al obtener categorías:'), error);
            });

        // Fetch additional clients from backend
        axiosInstance
            .get('/clientes/')
            .then((response) => {
                setClientes((prevClientes) => [
                    ...prevClientes,
                    ...response.data,
                ]);
            })
            .catch((error) => {
                console.error(t('Error al obtener clientes:'), error);
            });
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
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
            const response = await axiosInstance.post('/soluciones', {
                description: formData.description,
                categoria: formData.categoria,
                solucion: formData.solucion,
                cliente_id: formData.cliente_id,
            });

            console.log(t('Problema común creado satisfactoriamente'), response.data);

            setIsSubmitted(true);
            onProblemaComunCreated();
            onClose();
        } catch (error) {
            console.error(t('Error al crear problema común:'), error);
            setErrorMessage(
                t('Hubo un error al crear el problema común. Intenta de nuevo.')
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
            <h2 className="modal-title">{t('Registrar Problema Común')}</h2>

            {isSubmitted && (
                <div className="alert-success">
                    <span>&#10003;</span> {t('Problema común creado satisfactoriamente')}
                </div>
            )}

            {errorMessage && (
                <div className="alert-error">
                    <span>&#10060;</span> {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="problema-comun-form">
                <div className="form-group">
                    <label htmlFor="description">{t('Descripción')}</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categoria">{t('Categoría')}</label>
                    <select
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                    >
                        <option value="">{t('Selecciona una categoría')}</option>
                        {categorias.map((categoria, index) => (
                            <option key={index} value={categoria}>
                                {categoria}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="cliente_id">{t('Cliente')}</label>
                    <select
                        id="cliente_id"
                        name="cliente_id"
                        value={formData.cliente_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">{t('Selecciona un cliente')}</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="solucion">{t('Solución')}</label>
                    <textarea
                        id="solucion"
                        name="solucion"
                        value={formData.solucion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">
                    {t('Crear Problema Común')}
                </button>
            </form>
        </div>
    );
};

export default CreateProblemaComun;
