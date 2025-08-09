import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface AnimatedGridItemProps extends BoxProps {
  delay?: number;
  children: React.ReactNode;
}

export const AnimatedGridItem: React.FC<AnimatedGridItemProps> = ({ 
  delay = 0, 
  children, 
  ...props 
}) => {
  return (
    <Box
      {...props}
      sx={{
        opacity: 0,
        animation: `${fadeInUp} 0.6s ease-out forwards`,
        animationDelay: `${delay}s`,
        ...(props.sx || {})
      }}
    >
      {children}
    </Box>
  );
};
