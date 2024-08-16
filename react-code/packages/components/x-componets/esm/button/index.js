import React from 'react';

const Button = ({ children }) => {
    return (React.createElement("button", { className: 'w-16 h-8 mx-4 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ' }, children));
};

export { Button as default };
