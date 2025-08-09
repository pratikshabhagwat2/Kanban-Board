export type Subtask = {
  id: string;
  title: string;
  done: boolean;
};

export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  dueDate?: string; // ISO string
  subtasks?: Subtask[];
  notes?: string;
  completed?: boolean;
  priority?: Priority;
};

export type ColumnType = {
  id: string;
  title: string;
  taskIds: string[];
};

export type Data = {
  tasks: Record<string, Task>;
  columns: Record<string, ColumnType>;
  columnOrder: string[];
};
