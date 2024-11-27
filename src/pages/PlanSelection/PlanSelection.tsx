import React, { useState } from 'react';
import './PlanSelection.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useTranslation } from 'react-i18next';

const PlanSelection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);

    actualizarPlanCliente(plan)
      .then(() => {
        console.log(t('Plan actualizado exitosamente:'), plan);
        navigate('/incident-list');
      })
      .catch((error) => {
        console.error(t('Error al actualizar el plan:'), error);
      });
  };

  const actualizarPlanCliente = async (plan: string) => {
    try {
      const response = await axiosInstance.post('/clientes/update-plan', {
        plan: plan,
      });
      return response.data;
    } catch (error) {
      throw new Error(t('No se pudo actualizar el plan.'));
    }
  };

  return (
    <div className="plan-selection">
      <h2>
        {t(
          'Elige el plan perfecto para impulsar tu negocio y brindar la mejor experiencia a tus clientes.'
        )}
      </h2>
      <div className="plan-cards">
        <div
          className={`plan-card emprendedor ${
            selectedPlan === 'emprendedor' ? 'selected' : ''
          }`}
          onClick={() => handlePlanSelect('emprendedor')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handlePlanSelect('emprendedor');
            }
          }}
          role="button"
          tabIndex={0}
        >
          <h3>{t('Emprendedor')}</h3>
          <div className="plan-card-content">
            <p>
              {t(
                '¡Optimiza tu atención telefónica y resuelve problemas rápidamente! Ofrece a tus clientes un servicio profesional para gestionar sus solicitudes, con automatización y seguimiento continuo.'
              )}
            </p>
            <ul>
              <li>{t('Canales: Teléfono')}</li>
              <li>{t('Registro y gestión de PQRs')}</li>
              <li>{t('Automatización de escalamiento de problemas')}</li>
              <li>{t('Notificaciones por correo, SMS o llamada')}</li>
              <li>{t('Acceso a la app para seguimiento de incidentes')}</li>
            </ul>
          </div>
          <div className="plan-footer">
            <button className="select-button emprendedor">
              {t('Comprar')}
            </button>
            <div className="price-container emprendedor">$10</div>
          </div>
        </div>
        <div
          className={`plan-card empresario-plus ${
            selectedPlan === 'empresario_plus' ? 'selected' : ''
          }`}
          onClick={() => handlePlanSelect('empresario_plus')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handlePlanSelect('empresario_plus');
            }
          }}
          role="button"
          tabIndex={0}
        >
          <h3>{t('Empresario Plus')}</h3>
          <div className="plan-card-content">
            <p>
              {t(
                '¡Impulsa tu negocio con la última tecnología en inteligencia artificial y analítica predictiva! Resuelve problemas antes de que ocurran y ofrece experiencias únicas a tus clientes.'
              )}
            </p>
            <ul>
              <li>
                {t(
                  'Canales: Teléfono, chatbot, app móvil, correo electrónico'
                )}
              </li>
              <li>
                {t('IA y analítica predictiva para atención multicanal')}
              </li>
              <li>{t('Registro y gestión de PQRs')}</li>
              <li>{t('Automatización de escalamiento de problemas')}</li>
              <li>{t('Notificaciones por correo, SMS o llamada')}</li>
              <li>{t('Acceso a la app para seguimiento de incidentes')}</li>
            </ul>
          </div>
          <div className="plan-footer">
            <button className="select-button empresario-plus">
              {t('Comprar')}
            </button>
            <div className="price-container empresario-plus">$50</div>
          </div>
        </div>
        <div
          className={`plan-card empresario ${
            selectedPlan === 'empresario' ? 'selected' : ''
          }`}
          onClick={() => handlePlanSelect('empresario')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handlePlanSelect('empresario');
            }
          }}
          role="button"
          tabIndex={0}
        >
          <h3>{t('Empresario')}</h3>
          <div className="plan-card-content">
            <p>
              {t(
                'Lleva tu atención al cliente al siguiente nivel con soporte multicanal. Más formas de contacto, más oportunidades de vender y mejorar la experiencia de tus usuarios.'
              )}
            </p>
            <ul>
              <li>
                {t(
                  'Canales: Teléfono, chatbot, app móvil, correo electrónico'
                )}
              </li>
              <li>{t('Tablero de control con métricas clave')}</li>
              <li>{t('Análisis de rendimiento')}</li>
              <li>{t('Automatización de escalamiento de problemas')}</li>
              <li>{t('Notificaciones por correo, SMS o llamada')}</li>
              <li>{t('Acceso a la app para seguimiento de incidentes')}</li>
            </ul>
          </div>
          <div className="plan-footer">
            <button className="select-button empresario">
              {t('Comprar')}
            </button>
            <div className="price-container empresario">$20</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
