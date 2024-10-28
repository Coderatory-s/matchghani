// src/components/Slider.jsx
import React from 'react';

const Slider = ({ percentage }) => {
  return (
    <div>
      <input type="range" value={percentage} max="100" className="w-full" disabled />
      <span>{percentage}%</span>
    </div>
  );
};

export default Slider;
