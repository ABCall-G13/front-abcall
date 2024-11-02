import React from 'react';

const CurrencySelector: React.FC = () => {
    return (
        <select className="selector">
            <option value="usd">USD</option>
            <option value="cop">COP</option>
        </select>
    );
};

export default CurrencySelector;
