import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'es';
        i18n.changeLanguage(savedLanguage);
    }, [i18n]);

    const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value;
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    return (
        <select className="selector" onChange={changeLanguage} value={i18n.language}>
            <option value="es">Español</option>
            <option value="en">Inglés</option>
        </select>
    );
};

export default LanguageSelector;