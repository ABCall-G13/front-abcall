import React from 'react';

const LookerDashboard = () => {
    // Create a unique query parameter to force refresh by appending a timestamp
    const refreshCache = `?t=${new Date().getTime()}`;

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <h2>Dashboard Incidentes</h2>
            <iframe
                src={`https://lookerstudio.google.com/embed/reporting/639d9b14-f68b-443c-8698-3be0916f0906/page/2TRFE${refreshCache}`}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
            />
        </div>
    );
};

export default LookerDashboard;