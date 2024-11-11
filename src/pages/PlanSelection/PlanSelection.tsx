import React, { useState } from 'react';
import './PlanSelection.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const PlanSelection: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const navigate = useNavigate();

    const handlePlanSelect = (plan: string) => {
        setSelectedPlan(plan);

        // Llamada a la API para actualizar el plan
        actualizarPlanCliente(plan)
            .then(() => {
                console.log('Plan actualizado exitosamente:', plan);
                navigate('/incident-list'); // Redirige a la página de confirmación
            })
            .catch((error) => {
                console.error('Error al actualizar el plan:', error);
            });
    };

    const actualizarPlanCliente = async (plan: string) => {
        try {
            const response = await axiosInstance.post('/clientes/update-plan', {
                plan: plan,
            });
            return response.data;
        } catch (error) {
            throw new Error('No se pudo actualizar el plan.');
        }
    };

    return (
        <div className="plan-selection">
            <h2>
                Elige el plan perfecto para impulsar tu negocio y brindar la
                mejor experiencia a tus clientes.
            </h2>
            <div className="plan-cards">
                <div
                    className={`plan-card emprendedor ${
                        selectedPlan === 'Emprendedor' ? 'selected' : ''
                    }`}
                    onClick={() => handlePlanSelect('Emprendedor')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handlePlanSelect('Emprendedor');
                        }
                    }}
                    role="button"
                    tabIndex={0}
                >
                    <h3>Emprendedor</h3>
                    <div className="plan-card-content">
                        <p>
                            ¡Optimiza tu atención telefónica y resuelve
                            problemas rápidamente! Ofrece a tus clientes un
                            servicio profesional para gestionar sus
                            solicitudes, con automatización y seguimiento
                            continuo.
                        </p>
                        <ul>
                            <li>Canales: Teléfono</li>
                            <li>Registro y gestión de PQRs</li>
                            <li>
                                Automatización de escalamiento de problemas
                            </li>
                            <li>Notificaciones por correo, SMS o llamada</li>
                            <li>
                                Acceso a la app para seguimiento de incidentes
                            </li>
                        </ul>
                    </div>
                    <div className="plan-footer">
                        <button className="select-button emprendedor">
                            Comprar
                        </button>
                        <div className="price-container emprendedor">$10</div>
                    </div>
                </div>
                <div
                    className={`plan-card empresario-plus ${
                        selectedPlan === 'Empresario Plus' ? 'selected' : ''
                    }`}
                    onClick={() => handlePlanSelect('Empresario Plus')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handlePlanSelect('Empresario Plus');
                        }
                    }}
                    role="button"
                    tabIndex={0}
                >
                    <h3>Empresario Plus</h3>
                    <div className="plan-card-content">
                        <p>
                            ¡Impulsa tu negocio con la última tecnología en
                            inteligencia artificial y analítica predictiva!
                            Resuelve problemas antes de que ocurran y ofrece
                            experiencias únicas a tus clientes.
                        </p>
                        <ul>
                            <li>
                                Canales: Teléfono, chatbot, app móvil, correo
                                electrónico
                            </li>
                            <li>
                                IA y analítica predictiva para atención
                                multicanal
                            </li>
                            <li>Registro y gestión de PQRs</li>
                            <li>
                                Automatización de escalamiento de problemas
                            </li>
                            <li>Notificaciones por correo, SMS o llamada</li>
                            <li>
                                Acceso a la app para seguimiento de incidentes
                            </li>
                        </ul>
                    </div>
                    <div className="plan-footer">
                        <button className="select-button empresario-plus">
                            Comprar
                        </button>
                        <div className="price-container empresario-plus">
                            $50
                        </div>
                    </div>
                </div>
                <div
                    className={`plan-card empresario ${
                        selectedPlan === 'Empresario' ? 'selected' : ''
                    }`}
                    onClick={() => handlePlanSelect('Empresario')}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handlePlanSelect('Empresario');
                        }
                    }}
                    role="button"
                    tabIndex={0}
                >
                    <h3>Empresario</h3>
                    <div className="plan-card-content">
                        <p>
                            {' '}
                            Lleva tu atención al cliente al siguiente nivel con
                            soporte multicanal. Más formas de contacto, más
                            oportunidades de vender y mejorar la experiencia de
                            tus usuarios.
                        </p>
                        <ul>
                            <li>
                                Canales: Teléfono, chatbot, app móvil, correo
                                electrónico
                            </li>
                            <li>Tablero de control con métricas clave</li>
                            <li>Análisis de rendimiento</li>
                            <li>
                                Automatización de escalamiento de problemas
                            </li>
                            <li>Notificaciones por correo, SMS o llamada</li>
                            <li>
                                Acceso a la app para seguimiento de incidentes
                            </li>
                        </ul>
                    </div>
                    <div className="plan-footer">
                        <button className="select-button empresario">
                            Comprar
                        </button>
                        <div className="price-container empresario">$20</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanSelection;
