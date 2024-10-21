import React from 'react';

const LookerDashboard = () => {
    const refreshCache = `?t=${new Date().getTime()}`;

    return (
        <div style={{ width: '100%', height: '100%', paddingInline: '10px' }}>
            <h2>Tablero de control</h2>
            <div style={{ width: '100%', height: 'calc(100vh - 120px)', overflow: 'hidden'}}>
                <iframe
                    title="Looker Studio Dashboard"
                    src={`https://lookerstudio.google.com/embed/reporting/639d9b14-f68b-443c-8698-3be0916f0906/page/2TRFE${refreshCache}`}
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
