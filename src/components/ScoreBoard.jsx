// src/components/ScoreBoard.jsx
import React from 'react';

const ScoreBoard = ({ score, moves }) => {
  return (
    <div className="flex justify-between p-4">
      <div>Score: {score}</div>
      <div>Moves left: {moves}</div>
    </div>
  );
};

export default ScoreBoard;
