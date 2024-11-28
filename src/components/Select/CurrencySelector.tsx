import React, { useState, useEffect } from 'react';

const CurrencySelector: React.FC = () => {
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        const savedCurrency = localStorage.getItem('currency') || 'USD';
        setCurrency(savedCurrency);
    }, []);

    const onChangeCurrency = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value;
        setCurrency(newCurrency);
        localStorage.setItem('currency', newCurrency);
    };

    return (
        <select className="selector" value={currency} onChange={onChangeCurrency}>
            <option value="USD">USD</option>
            <option value="COP">COP</option>
        </select>
    );
};

export default CurrencySelector;