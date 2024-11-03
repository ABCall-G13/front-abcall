import React from 'react';

const LanguageSelector: React.FC = () => {
    return (
        <select className="selector">
            <option value="es">Español</option>
            <option value="en">Inglés</option>
        </select>
    );
};

export default LanguageSelector;
