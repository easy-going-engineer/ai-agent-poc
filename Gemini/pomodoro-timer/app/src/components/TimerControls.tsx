import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background-color: #f87070;
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  margin: 20px 10px 0;
  padding: 10px 30px;
  transition: background-color 0.3s, transform 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background-color: #f65a5a;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface TimerControlsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({ onStart, onPause, onReset }) => {
  return (
    <div>
      <Button onClick={onStart}>Start</Button>
      <Button onClick={onPause}>Pause</Button>
      <Button onClick={onReset}>Reset</Button>
    </div>
  );
};

export default TimerControls;
