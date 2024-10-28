// src/components/Hint.jsx
import React from 'react';

const Hint = ({ hint }) => {
  return (
    <div className="text-lg text-red-600">
      {hint}
    </div>
  );
};

export default Hint;
