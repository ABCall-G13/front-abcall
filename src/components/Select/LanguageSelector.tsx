import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <select className="selector" onChange={changeLanguage} value={i18n.language}>
            <option value="es">Español</option>
            <option value="en">Inglés</option>
        </select>
    );
};

export default LanguageSelector;