
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import ModeSelector from './components/ModeSelector';

const AppWrapper = styled.div`
  align-items: center;
  background: linear-gradient(to bottom, #1d2b3e, #2c3e50);
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  font-family: 'Arial', sans-serif;
`;

const TimerContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const App: React.FC = () => {
  const [mode, setMode] = useState('pomodoro');
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  const handleSelectMode = (newMode: string) => {
    setMode(newMode);
    setIsActive(false);
    switch (newMode) {
      case 'pomodoro':
        setTime(25 * 60);
        break;
      case 'shortBreak':
        setTime(5 * 60);
        break;
      case 'longBreak':
        setTime(15 * 60);
        break;
      default:
        setTime(25 * 60);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isActive) {
      const audio = new Audio('/bell.mp3');
      audio.play();
      setIsActive(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const getDuration = (mode: string) => {
    switch (mode) {
      case 'pomodoro':
        return 25 * 60;
      case 'shortBreak':
        return 5 * 60;
      case 'longBreak':
        return 15 * 60;
      default:
        return 25 * 60;
    }
  };

  const handleReset = () => {
    setIsActive(false);
    handleSelectMode(mode);
  };

  return (
    <AppWrapper>
      <TimerContainer>
        <h1>Pomodoro Timer</h1>
        <ModeSelector currentMode={mode} onSelectMode={handleSelectMode} />
        <TimerDisplay time={time} duration={getDuration(mode)} />
        <TimerControls
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />
      </TimerContainer>
    </AppWrapper>
  );
};

export default App;
