import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

const symbols = ['⚪', '🔺', '❌', '⭐', '⬜']; // Circle, Triangle, X, Star, Square

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const GRID_SIZE = 8;
const TARGET_SCORE = 100;
const MAX_MOVES = 7;
const TIME_LIMIT = 120;

function App() {
  const [theme, setTheme] = useState('white');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [nextLevel, setNextLevel] = useState(false);
  const [level, setLevel] = useState(1);
  const [starAvailable, setStarAvailable] = useState(false);
  const [allLevelResults, setAllLevelResults] = useState([]);
  const [timer, setTimer] = useState(TIME_LIMIT);
  const [bombIndex, setBombIndex] = useState(null);

  // Timer countdown
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timer > 0 && score < TARGET_SCORE && moves < MAX_MOVES) {
        setTimer(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timer, score, moves]);

  // Toggle theme between black and white
  const toggleTheme = () => {
    setTheme(prev => (prev === 'white' ? 'black' : 'white'));
  };

  // Generate random cards
  const generateRandomCards = () => {
    return Array.from({ length: GRID_SIZE * GRID_SIZE }, () => getRandomSymbol());
  };

  useEffect(() => {
    setCards(generateRandomCards());
  }, [level]);

  // Flip card
  const flipCard = (index) => {
    if (flippedCards.length < 5 && !flippedCards.includes(index)) {
      setFlippedCards(prev => [...prev, index]);
    }
  };

  // Handle bomb click (clears row and column)
  const handleBombClick = (index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    let newCards = [...cards];

    // Clear the row
    for (let i = 0; i < GRID_SIZE; i++) {
      newCards[row * GRID_SIZE + i] = getRandomSymbol();
    }

    // Clear the column
    for (let i = 0; i < GRID_SIZE; i++) {
      newCards[i * GRID_SIZE + col] = getRandomSymbol();
    }

    setCards(newCards);
    setBombIndex(null);
    setFlippedCards([]); // Reset flipped cards after using the bomb
  };

  // Generate a hint (simple random move suggestion)
  const handleHint = () => {
    alert('Try matching three symbols at the top right!');
  };

  // Check for matches and update the board accordingly
  useEffect(() => {
    if (flippedCards.length >= 3) {
      const selectedSymbols = flippedCards.map(index => cards[index]);
      const matchCount = selectedSymbols.filter(symbol => symbol === selectedSymbols[0]).length;

      if (matchCount >= 3) {
        // Check for exact match of four
        if (matchCount === 4) {
          setScore(score + matchCount);
          setMoves(moves + 1);
          setSliderValue(Math.min(sliderValue + 20, 100));
          setStarAvailable(true);
          alert('Booster activated! Score increased!');
        }

        // Check if we need to place a bomb for five or more matches
        if (matchCount >= 5) {
          const bombCardIndex = flippedCards[Math.floor(Math.random() * flippedCards.length)];
          setCards(prevCards =>
            prevCards.map((card, index) =>
              index === bombCardIndex ? '💣' : card // Replace one matched card with a bomb
            )
          );
          setBombIndex(bombCardIndex);
        }

        setTimeout(() => {
          let newCards = [...cards];
          flippedCards.forEach(index => {
            newCards[index] = getRandomSymbol(); // Reset matched symbols
          });
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      } else {
        setTimeout(() => {
          setFlippedCards([]); // Reset flipped cards if not a match
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  // Handle star click (reset the board)
  const handleStarClick = () => {
    setCards(generateRandomCards());
    setStarAvailable(false);
    setFlippedCards([]);
    setScore(0);
  };

  // Handle the next level button
  const handleNextLevel = () => {
    setAllLevelResults(prev => [...prev, { level, score }]);
    setLevel(level + 1);
    setNextLevel(false);
    setSliderValue(0);
    setScore(0);
    setMoves(0);
    setTimer(TIME_LIMIT);
    setCards(generateRandomCards()); // Reset cards for the new level
  };

  // Show all results
  const handleShowResults = () => {
    alert(`Results: ${allLevelResults.map(res => `Level ${res.level}: ${res.score} points`).join(', ')}`);
  };

  // End game if moves are exhausted or time runs out
  useEffect(() => {
    if (score >= TARGET_SCORE || moves >= MAX_MOVES || timer === 0) {
      alert('Game over! Try again.');
      setNextLevel(true); // Allow moving to the next level
    }
  }, [moves, timer, score]);

  return (
    <div className={`min-h-screen ${theme === 'white' ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <div className="container py-10 text-center">
        <div className='mb-5'>
          <h1 className="text-3xl font-bold mb-4">Match Master Game - Level {level}</h1>
          <button
            aria-label="Switch theme"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={toggleTheme}
          >
            Switch to {theme === 'white' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        <div className='flex justify-center mb-5'>
          <span className="text-xl">Score: {score}</span>
          <span className="text-xl ml-5">Moves: {moves}/{MAX_MOVES}</span>
          <span className="text-xl ml-5">Time: {timer}s</span>
        </div>

        {starAvailable && (
          <button
            className="mb-5 px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={handleStarClick}
          >
            ⭐ Star Available: Click to Reset Board!
          </button>
        )}

        <div className="mb-5">
          <input
            type="range"
            className="w-full"
            value={sliderValue}
            max="100"
            readOnly
          />
          <p>{sliderValue}% Complete</p>
        </div>

        {nextLevel && (
          <button
            className="mb-5 px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleNextLevel}
          >
            Next Level
          </button>
        )}

        <div className="grid grid-cols-8 justify-center items-center w-[700px] mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className={classNames('w-15 h-15 flex items-center justify-center border rounded cursor-pointer transition duration-300 transform hover:scale-105', {
                'bg-blue-300': flippedCards.includes(index),
                'bg-gray-400': !flippedCards.includes(index),
              })}
              onClick={() => {
                if (card === '💣') {
                  handleBombClick(index);
                } else {
                  flipCard(index);
                }
              }}
              style={{ margin: '0' }} // Remove any margin if present
            >
              <span className="text-3xl">{card}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
