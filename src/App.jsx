import React, { useState } from 'react';
import { usePopper } from 'react-popper';
import Confetti from 'react-confetti';
import Die from './Die'; // Make sure to import your Die component
import './App.css';
import { nanoid } from 'nanoid';

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [confettiConfig, setConfettiConfig] = useState(null);

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setConfettiConfig({
        angle: 360,
        spread: 360,
        startVelocity: 20,
        elementCount: 70,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: '100px',
        height: '100px',
        colors: ['#e44d26', '#018574', '#fdd835', '#6d4c41', '#3949ab'],
      });
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice(oldDice =>
        oldDice.map(die => (die.isHeld ? die : generateNewDie()))
      );
    } else {
      setTenzies(false);
      setDice(allNewDice);
    }
  }

  function holdDice(id) {
    setDice(oldDice =>
      oldDice.map(die =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <main>
      {tenzies && <Confetti active={tenzies} config={confettiConfig} />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="Roll" onClick={rollDice}>
        {tenzies ? 'New Game' : 'Roll'}
      </button>
      <div
        ref={setReferenceElement}
        onClick={() => setTenzies(!tenzies)}
        className={`pop-button ${tenzies ? 'clicked' : ''}`}
      >  FINISH
      </div>
      
      {tenzies && (
        <div
          ref={setPopperElement}
          style={{ ...styles.popper, zIndex: 1, position: 'absolute' }}
          {...attributes.popper}
        > 
          {/* Your popper content goes here */}
          <div className="popper-content">🎉 WOhoOoO! 🎉</div>
        </div>
      )}
    </main>
  );
}
