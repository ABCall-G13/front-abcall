import React, { useEffect, useState } from 'react';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import { useAuth } from '../../context/AuthContext'; // Adjust the path to your AuthContext
import axiosInstance from '../../utils/axiosInstance';
import { useTranslation } from 'react-i18next'; // Importa useTranslation

const LookerDashboard = () => {
    const { t } = useTranslation(); // Hook para traducciones
    const [clientId, setClientId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentClientId = async () => {
            try {
                const response = await axiosInstance.get('/current-client');
                setClientId(response.data);
            } catch (err) {
                console.error(t('Failed to fetch client ID'), err);
                setError(t('Failed to fetch client ID'));
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentClientId();
    }, []);

    if (loading) {
        return <div>{t('Loading...')}</div>;
    }

    if (error || clientId === null) {
        return <div>{`${t('Error:')} ${error || t('Failed to load dashboard')}`}</div>;
    }

    const refreshCache = `t=${new Date().getTime()}`;
    const clientParam = `params=${encodeURIComponent(
        `{"ds27.cliente_parameter":${clientId},"ds28.cliente_facturacion":${clientId}}`
    )}`;

    const urlParams = `?${clientParam}&${refreshCache}`;
    const finalUrl = `https://lookerstudio.google.com/embed/reporting/639d9b14-f68b-443c-8698-3be0916f0906/page/2TRFE${urlParams}`;
    // console.log(t('Final Looker Studio URL:'), finalUrl);

    return (
        <div style={{ width: '100%', height: '100%', paddingInline: '10px' }}>
            <h2 style={{"color":"white"}}>{t('Tablero de control')}</h2>
            <div
                style={{
                    width: '100%',
                    height: 'calc(100vh - 120px)',
                    overflow: 'hidden',
                }}
            >
                <iframe
                    title="Looker Studio Dashboard"
                    src={finalUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                />
            </div>
        </div>
    );
};

export default LookerDashboard;
