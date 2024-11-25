import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';

const LookerDashboard = () => {
    const { token } = useAuth();
    const [clientId, setClientId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentClientId = async () => {
            if (!token) {
                setError('Authentication token not found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/current-client', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const fetchedClientId = response.data?.clientId;
                if (!fetchedClientId)
                    throw new Error('Invalid response format');
                setClientId(fetchedClientId);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    console.error('Axios error:', err);
                    setError(
                        err.response?.data?.message ||
                            'Failed to fetch client ID'
                    );
                } else if (err instanceof Error) {
                    console.error('Error:', err.message);
                    setError(err.message);
                } else {
                    console.error('Unknown error:', err);
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentClientId();
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const refreshCache = `t=${new Date().getTime()}`;
    const clientParam = encodeURIComponent(
        JSON.stringify({ 'ds27.cliente_parameter': clientId })
    );

    const urlParams = `?params=${clientParam}&${refreshCache}`;

    return (
        <div style={{ width: '100%', height: '100%', paddingInline: '10px' }}>
            <h2>Tablero de control</h2>
            <div
                style={{
                    width: '100%',
                    height: 'calc(100vh - 120px)',
                    overflow: 'hidden',
                }}
            >
                <iframe
                    title="Looker Studio Dashboard"
                    src={`https://lookerstudio.google.com/embed/reporting/639d9b14-f68b-443c-8698-3be0916f0906/page/2TRFE${urlParams}`}
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
