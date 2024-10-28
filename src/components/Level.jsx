// src/components/Level.jsx
import React from 'react';

const Level = ({ level, onNextLevel }) => {
  return (
    <div>
      <h2>Level {level}</h2>
      <button onClick={onNextLevel}>Next Level</button>
    </div>
  );
};

export default Level;
