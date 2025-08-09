import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, BoxProps } from '@mui/material';
import { Task } from '../types';
import { fadeInRightAnimation, fadeOutLeftAnimation } from '../styles/animations';

interface AnimatedListProps extends BoxProps {
  items: Task[];
  renderItem: (item: Task, index: number) => React.ReactNode;
  keyExtractor: (item: Task) => string;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ 
  items, 
  renderItem, 
  keyExtractor, 
  ...boxProps 
}) => {
  const [positions, setPositions] = useState<{ [key: string]: { top: number; height: number } }>({});
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Track which items are new to the list
  const [newItems, setNewItems] = useState<Set<string>>(new Set());
  
  // Track items that are being removed
  const [prevItems, setPrevItems] = useState<Task[]>(items);
  const [removedItems, setRemovedItems] = useState<Task[]>([]);
  
  // Calculate and store positions of items
  useEffect(() => {
    const newPositions: { [key: string]: { top: number; height: number } } = {};
    
    // Detect new items that weren't in the previous items list
    const currentKeys = new Set(items.map(item => keyExtractor(item)));
    const previousKeys = new Set(prevItems.map(item => keyExtractor(item)));
    
    // Track new items
    const newItemsSet = new Set<string>();
    currentKeys.forEach(key => {
      if (!previousKeys.has(key)) {
        newItemsSet.add(key);
      }
    });
    
    // Track removed items
    const removed = prevItems.filter(item => {
      const key = keyExtractor(item);
      return !currentKeys.has(key);
    });
    
    if (removed.length > 0) {
      setRemovedItems(removed);
      
      // Set a timeout to clear removed items after animation completes
      setTimeout(() => {
        setRemovedItems([]);
      }, 400); // Match animation duration
    }
    
    setNewItems(newItemsSet);
    setPrevItems(items);
    
    Object.keys(itemRefs.current).forEach(key => {
      const el = itemRefs.current[key];
      if (el) {
        const rect = el.getBoundingClientRect();
        newPositions[key] = {
          top: rect.top,
          height: rect.height
        };
      }
    });
    
    setPositions(newPositions);
  }, [items, keyExtractor, prevItems]);
  
  // Get animation style for an item based on its previous and current position
  const getAnimationStyle = useCallback((key: string) => {
    if (!positions[key]) {
      return {};
    }
    
    const el = itemRefs.current[key];
    if (!el) {
      return {};
    }
    
    const rect = el.getBoundingClientRect();
    const prevPos = positions[key];
    const currentTop = rect.top;
    
    if (prevPos.top !== currentTop) {
      return {
        transform: `translateY(${prevPos.top - currentTop}px)`,
        transition: 'transform 0s'
      };
    }
    
    return {};
  }, [positions]);
  
  // Apply animation to smoothly move items to their new positions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Object.keys(itemRefs.current).forEach(key => {
        const el = itemRefs.current[key];
        if (el) {
          el.style.transform = '';
          el.style.transition = 'transform 0.3s ease-in-out';
        }
      });
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [positions]);
  
  return (
    <Box {...boxProps}>
      {/* Render current items */}
      {items.map((item, index) => {
        const key = keyExtractor(item);
        return (
          <Box 
            key={key}
            ref={(el: HTMLDivElement | null) => {
              itemRefs.current[key] = el;
            }}
            sx={{
              position: 'relative',
              ...(newItems.has(key) ? {
                animation: `${fadeInRightAnimation} 0.4s ease forwards`
              } : getAnimationStyle(key))
            }}
          >
            {renderItem(item, index)}
          </Box>
        );
      })}
      
      {/* Render items being removed with exit animation */}
      {removedItems.map((item) => {
        const key = `removed-${keyExtractor(item)}`;
        return (
          <Box
            key={key}
            sx={{
              position: 'absolute',
              width: '100%',
              animation: `${fadeOutLeftAnimation} 0.4s ease forwards`,
              pointerEvents: 'none',
              zIndex: 0
            }}
          >
            {renderItem(item, -1)}
          </Box>
        );
      })}
    </Box>
  );
};
