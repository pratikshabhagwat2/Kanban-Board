import { SxProps, Theme, keyframes } from '@mui/material/styles';

// Define keyframes for animations
export const fadeInUpKeyframes = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Define reusable style objects
export const columnItemStyle = (index: number): SxProps<Theme> => ({
  opacity: 0,
  transform: 'translateY(20px)',
  animation: `${fadeInUpKeyframes} 0.6s ease forwards`,
  animationDelay: `${0.1 * index}s`,
});

// Define other styles as needed
export const kanbanStyles = {
  columnContainer: {
    p: 1, 
    borderRadius: 2,
    transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
};
