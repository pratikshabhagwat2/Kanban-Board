import { useState, useCallback, useRef } from "react";
import { ActionHistory, DataCommand } from "../utils/actionHistory";
import { Data } from "../types";

// Type definition for return value
type UndoableStateReturn = [
  Data,                    // current state
  (newState: Data) => void, // state setter
  () => void,             // undo function
  () => void,             // redo function
  boolean,                // canUndo flag
  boolean                 // canRedo flag
];

// Optimized hook for managing undoable state
export function useUndoableState(initialState: Data): UndoableStateReturn {
  const [state, setState] = useState<Data>(initialState);
  const history = useRef(new ActionHistory());

  // Setter function that records history
  const setUndoableState = useCallback((newState: Data) => {
    const command = new DataCommand(setState as any, newState, state);
    history.current.push(command);
  }, [state]);

  // Simple memoized undo/redo functions
  const undo = useCallback(() => history.current.undo(), []);
  const redo = useCallback(() => history.current.redo(), []);

  // Get current ability to undo/redo
  const canUndo = history.current.canUndo();
  const canRedo = history.current.canRedo();

  return [state, setUndoableState, undo, redo, canUndo, canRedo];
}
