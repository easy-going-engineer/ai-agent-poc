
import React from 'react';
import styled from 'styled-components';

const ModeButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 25px;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  margin: 0 5px;
  padding: 8px 15px;
  transition: background-color 0.3s;

  &.active {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

interface ModeSelectorProps {
  currentMode: string;
  onSelectMode: (mode: string) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div>
      <ModeButton
        className={currentMode === 'pomodoro' ? 'active' : ''}
        onClick={() => onSelectMode('pomodoro')}
      >
        Pomodoro
      </ModeButton>
      <ModeButton
        className={currentMode === 'shortBreak' ? 'active' : ''}
        onClick={() => onSelectMode('shortBreak')}
      >
        Short Break
      </ModeButton>
      <ModeButton
        className={currentMode === 'longBreak' ? 'active' : ''}
        onClick={() => onSelectMode('longBreak')}
      >
        Long Break
      </ModeButton>
    </div>
  );
};

export default ModeSelector;
