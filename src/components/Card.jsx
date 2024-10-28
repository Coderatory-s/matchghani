// src/components/Card.jsx
import React from 'react';

const Card = ({ symbol, onClick, isHidden }) => {
  return (
    <div
      className={`w-16 h-16 flex items-center justify-center border rounded-lg ${isHidden ? 'bg-gray-300' : 'bg-white'}`}
      onClick={onClick}
    >
      {isHidden ? ' ' : symbol}
    </div>
  );
};

export default Card;
