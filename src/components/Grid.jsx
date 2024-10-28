// src/components/Grid.jsx
import React from 'react';
import Card from './Card';

const Grid = ({ grid, onCardClick }) => {
  return (
    <div className="grid grid-cols-8 gap-2">
      {grid.map((row, rowIndex) => 
        row.map((symbol, colIndex) => (
          <Card
            key={`${rowIndex}-${colIndex}`}
            symbol={symbol}
            onClick={() => onCardClick(rowIndex, colIndex)}
            isHidden={symbol === null} // Hide when null
          />
        ))
      )}
    </div>
  );
};

export default Grid;
