import { Data } from "../types";

export interface Command {
  execute(): void;
  undo(): void;
}

export class ActionHistory {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private maxHistory = 30;

  push(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // Clear redo stack when a new action is performed

    // Limit the history size
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
  }

  undo(): void {
    const command = this.undoStack.pop();
    if (command) {
      command.undo();
      this.redoStack.push(command);
    }
  }

  redo(): void {
    const command = this.redoStack.pop();
    if (command) {
      command.execute();
      this.undoStack.push(command);
    }
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}

// Command for data changes
export class DataCommand implements Command {
  private oldData: Data;
  
  constructor(
    private setter: React.Dispatch<React.SetStateAction<Data>>,
    private newData: Data,
    private currentData: Data
  ) {
    this.oldData = JSON.parse(JSON.stringify(currentData));
  }

  execute(): void {
    this.setter(this.newData);
  }

  undo(): void {
    this.setter(this.oldData);
  }
}
