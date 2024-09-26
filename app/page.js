'use client';

import React, { useState, useEffect } from 'react';

const Circle = ({ number, position, handleClick, isClicked }) => {
  return (
    <div
      className={`absolute w-12 h-12 rounded-full flex justify-center items-center border-2 border-black text-lg cursor-pointer transition-transform duration-300 ${
        isClicked ? 'bg-red-500 opacity-0 pointer-events-none' : 'bg-white'
      }`}
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        zIndex: 100 - number,
        transition: isClicked ? 'background-color 0s, opacity 2s ease-in-out 2s' : 'none',
      }}
      onClick={() => handleClick(number)}
    >
      {number}
    </div>
  );
};

export default function Home() {
  const [points, setPoints] = useState(0); // Number of circles
  const [time, setTime] = useState(0); // Time
  const [timerOn, setTimerOn] = useState(false); // Start timer
  const [circles, setCircles] = useState([]); // Array of circles
  const [clickedOrder, setClickedOrder] = useState([]); // Track click order
  const [gameStatus, setGameStatus] = useState(null); // Game status: null, win, lose
  const [gameStarted, setGameStarted] = useState(false); // Game started status

  useEffect(() => {
    if (timerOn) {
      const interval = setInterval(() => setTime(prevTime => prevTime + 0.1), 100);
      return () => clearInterval(interval);
    }
  }, [timerOn]);

  const generateCircles = () => {
    const newCircles = [];
    for (let i = 1; i <= points; i++) {
      newCircles.push({
        number: i,
        position: { top: Math.random() * 88, left: Math.random() * 88 }, // Generate random position within 88%
        isClicked: false,
      });
    }
    setCircles(newCircles);
    setClickedOrder([]); // Reset click order
    setTime(0); // Reset time
    setTimerOn(true); // Start timer
    setGameStatus(null); // Reset game status
    setGameStarted(true); // Game started status
  };

  const handleCircleClick = number => {
    if (gameStatus || !gameStarted) return; // Do nothing if game is over or not started
    if (number === clickedOrder.length + 1) {
      // Check click order
      const newCircles = circles.map(circle => (circle.number === number ? { ...circle, isClicked: true } : circle));
      setCircles(newCircles);
      setClickedOrder([...clickedOrder, number]);

      if (number === points) {
        setTimerOn(false); // Stop timer
        setGameStatus('win'); // Set game status to win
      }
    } else {
      setTimerOn(false); // Stop timer if clicked wrong
      setGameStatus('lose'); // Set game status to lose
    }
  };

  const handlePointsChange = e => {
    const newPoints = parseInt(e.target.value);
    setPoints(newPoints);
    setGameStatus(null); // Reset game status if points are valid
  };

  const handleGameStart = () => {
    if (points > 0) {
      generateCircles(); // Start new game immediately when Play/Restart button is clicked
    }
  };

  return (
    <div className="text-center mt-10 flex flex-col items-center">
      <div className="flex flex-col items-start w-[400px]">
        <div className="flex items-center ">
          <h1
            className={`text-2xl font-bold mb-4 ${
              gameStatus === 'win' ? 'text-green-500' : gameStatus === 'lose' ? 'text-red-500' : ''
            }`}
          >
            {gameStatus === 'win' && 'ALL CLEARED!'}
            {gameStatus === 'lose' && 'GAME OVER!'}
            {!gameStatus && "LET'S PLAY"}
          </h1>
        </div>

        <div className="mb-4">
          Points:
          <input
            type="number"
            value={points}
            onChange={handlePointsChange}
            className="w-[200px] border-2 border-black rounded-md px-2 py-1 ml-20"
          />
        </div>
        <div className="mb-4 flex items-center">
          <span>Time:</span>
          <span className="ml-[100px]">{time.toFixed(1)}s</span>
        </div>

        <button
          onClick={handleGameStart}
          className="px-12 py-1 border-2 rounded-full bg-gray-300 text-black rounded-md"
        >
          {gameStarted ? 'Restart' : 'Play'}
        </button>
      </div>

      <div className="relative w-[500px] h-[500px] border-2 border-black mx-auto mt-6">
        {circles.map(circle => (
          <Circle
            key={circle.number}
            number={circle.number}
            position={circle.position}
            isClicked={circle.isClicked}
            handleClick={handleCircleClick}
          />
        ))}
      </div>
    </div>
  );
}
