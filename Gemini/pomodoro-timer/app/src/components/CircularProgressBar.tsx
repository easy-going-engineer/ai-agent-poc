
import React from 'react';
import styled from 'styled-components';

const SVGWrapper = styled.svg`
  width: 300px;
  height: 300px;
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: #e6e6e6;
  stroke-width: 10;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: #f87070;
  stroke-linecap: round;
  stroke-width: 10;
  transition: stroke-dashoffset 0.5s;
`;

interface CircularProgressBarProps {
  time: number;
  duration: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ time, duration }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (time / duration) * circumference;

  return (
    <SVGWrapper>
      <CircleBackground cx="150" cy="150" r={radius} />
      <CircleProgress
        cx="150"
        cy="150"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </SVGWrapper>
  );
};

export default CircularProgressBar;
