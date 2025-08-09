import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable as ReactDndDroppable, DroppableProps } from 'react-beautiful-dnd';
import { keyframes } from '@mui/system';

// This is a wrapper component to make react-beautiful-dnd work with React 18
// It addresses the issue with Strict Mode rendering components twice

// Animation for when a task is dropped into a column
const dropAnimation = keyframes`
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
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  
  useEffect(() => {
    // We need to delay the initialization of the Droppable in React 18's Strict Mode
    // This is a workaround for the issue with react-beautiful-dnd not supporting React 18 yet
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  
  if (!enabled) {
    return null;
  }
  
  return <ReactDndDroppable {...props}>{children}</ReactDndDroppable>;
};
