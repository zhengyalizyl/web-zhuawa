import React from 'react';

const Card = ({ className, children }) => {
    return (React.createElement("div", { className: `bg-white border border-gray-200 m-2 rounded-sm shadow-md ${className}` }, children));
};

export { Card as default };
