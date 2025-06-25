import React from 'react';
import styled from 'styled-components';
import CircularProgressBar from './CircularProgressBar';

const TimerWrapper = styled.div`
  position: relative;
  margin: 20px 0;
`;

const TimeText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  font-weight: 600;
`;

interface TimerDisplayProps {
  time: number;
  duration: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ time, duration }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TimerWrapper>
      <CircularProgressBar time={time} duration={duration} />
      <TimeText>{formatTime(time)}</TimeText>
    </TimerWrapper>
  );
};

export default TimerDisplay;
