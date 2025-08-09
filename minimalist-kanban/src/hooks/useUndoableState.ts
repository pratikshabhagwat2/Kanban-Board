import { useState, useCallback, useRef } from "react";
import { ActionHistory, DataCommand } from "../utils/actionHistory";
import { Data } from "../types";

// We're working with Data type specifically for the Kanban board
export function useUndoableState(initialState: Data): [
  Data, 
  (newState: Data) => void,
  () => void,
  () => void,
  boolean,
  boolean
] {
  const [state, setState] = useState<Data>(initialState);
  const history = useRef(new ActionHistory());

  const setUndoableState = useCallback((newState: Data) => {
    const command = new DataCommand(setState as any, newState, state);
    history.current.push(command);
  }, [state]);

  const undo = useCallback(() => {
    history.current.undo();
  }, []);

  const redo = useCallback(() => {
    history.current.redo();
  }, []);

  const canUndo = history.current.canUndo();
  const canRedo = history.current.canRedo();

  return [state, setUndoableState, undo, redo, canUndo, canRedo];
}
