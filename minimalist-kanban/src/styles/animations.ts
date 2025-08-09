import { keyframes } from '@mui/material/styles';

// Keyframes for animations
export const checkmarkAnimation = keyframes`
  0% {
    height: 0;
    width: 0;
    opacity: 0;
  }
  40% {
    height: 0.5em;
    width: 0.25em;
    opacity: 1;
  }
  100% {
    height: 1em;
    width: 0.5em;
    opacity: 1;
  }
`;

export const fadeOutLeftAnimation = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
`;

export const fadeInRightAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const shimmerAnimation = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const expandAnimation = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Animation for when a task is dropped into a column
export const dropAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 rgba(25, 118, 210, 0);
    background-color: rgba(25, 118, 210, 0.1);
  }
  50% {
    box-shadow: 0 0 15px rgba(25, 118, 210, 0.4);
    background-color: rgba(25, 118, 210, 0.15);
  }
  100% {
    box-shadow: 0 0 0 rgba(25, 118, 210, 0);
    background-color: transparent;
  }
`;
