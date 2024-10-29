import React, { useState, useEffect } from 'react';
import './CreateCommonIssue.css';
import axiosInstance from '../../utils/axiosInstance';

interface CreateProblemaComunProps {
    onClose: () => void;
    onProblemaComunCreated: () => void;
}

const CreateProblemaComun: React.FC<CreateProblemaComunProps> = ({
    onClose,
    onProblemaComunCreated,
}) => {
    const [formData, setFormData] = useState({
        description: '',
        categoria: '',
        solucion: '',
    });

    const [categorias, setCategorias] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch category options from the `/incidentes/fields` endpoint
    useEffect(() => {
        axiosInstance
            .get('/incidentes/fields')
            .then((response) => {
                setCategorias(response.data.categoria); // Set categories from response
            })
            .catch((error) => {
                console.error('Error al obtener categorías:', error);
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
            });

            console.log('Problema común creado:', response.data);

            // Mark submission as successful and call the callback functions
            setIsSubmitted(true);
            onProblemaComunCreated(); // Notify parent of the new issue creation
            onClose(); // Close the modal immediately
        } catch (error) {
            console.error('Error al crear problema común:', error);
            setErrorMessage(
                'Hubo un error al crear el problema común. Intenta de nuevo.'
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
            <h2 className="modal-title">Registrar Problema Común</h2>

            {isSubmitted && (
                <div className="alert-success">
                    <span>&#10003;</span> Problema común creado
                    satisfactoriamente
                </div>
            )}

            {errorMessage && (
                <div className="alert-error">
                    <span>&#10060;</span> {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="problema-comun-form">
                <div className="form-group">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
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
                        {categorias.map((categoria, index) => (
                            <option key={index} value={categoria}>
                                {categoria}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="solucion">Solución</label>
                    <textarea
                        id="solucion"
                        name="solucion"
                        value={formData.solucion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">
                    Crear Problema Común
                </button>
            </form>
        </div>
    );
};

export default CreateProblemaComun;
