import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Fade,
  IconButton,
  Tooltip
} from "@mui/material";
import { AnimatedGridItem } from "./AnimatedGridItem";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AddIcon from "@mui/icons-material/Add";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

import Column from "./Column.js";
import TaskDialog from "./TaskDialog.js";
import { Data, Task, Priority } from "../types";
import useLocalStorage from "../hooks/useLocalStorage";
import { useThemeContext } from "../styles/ThemeProvider";
import { useUndoableState } from "../hooks/useUndoableState";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { pulseAnimation } from "../styles/animations";

/** storage key */
const STORAGE_KEY = "kanban:minimal:data:v1";

/** initial sample data */
function sampleData(): Data {
  const t1: Task = {
    id: uuidv4(),
    title: "Taxes",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    subtasks: [
      { id: uuidv4(), title: "Gather receipts", done: true },
      { id: uuidv4(), title: "Fill form", done: false }
    ]
  };

  const t2: Task = {
    id: uuidv4(),
    title: "Write unit tests",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString()
  };

  const t3: Task = { id: uuidv4(), title: "Plan sprint" };
  const t4: Task = { id: uuidv4(), title: "Fix login bug" };

  const tasks = { [t1.id]: t1, [t2.id]: t2, [t3.id]: t3, [t4.id]: t4 };

  const columns = {
    not_started: { id: "not_started", title: "Not Started", taskIds: [t3.id, t1.id] },
    in_progress: { id: "in_progress", title: "In Progress", taskIds: [t2.id] },
    blocked: { id: "blocked", title: "Blocked", taskIds: [t4.id] },
    done: { id: "done", title: "Done", taskIds: [] }
  };

  return { tasks, columns, columnOrder: ["not_started", "in_progress", "blocked", "done"] };
}

export default function KanbanBoard() {
  // Get initial data from localStorage
  const [initialData] = useLocalStorage<Data>(STORAGE_KEY, sampleData());
  
  // Use undoable state for history tracking
  const [data, setData, undo, redo, canUndo, canRedo] = useUndoableState(initialData);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [targetColumnForNew, setTargetColumnForNew] = useState<string | null>(null);
  const { mode, toggleTheme } = useThemeContext();
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);
  
  // Set up keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Z or Ctrl+Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Cmd+Shift+Z or Ctrl+Y for redo
      if (((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) || 
          ((e.metaKey || e.ctrlKey) && e.key === 'y')) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  const openNew = (columnId?: string) => {
    setEditingTaskId(null);
    setTargetColumnForNew(columnId ?? null);
    setDialogOpen(true);
  };

  const openEdit = (taskId: string) => {
    setEditingTaskId(taskId);
    setTargetColumnForNew(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTaskId(null);
    setTargetColumnForNew(null);
  };

  const onSaveTask = (payload: { title: string; dueDate?: string; subtasksText?: string; notes?: string; priority?: Priority }, columnId?: string) => {
    const trimmed = payload.title.trim();
    if (!trimmed) return;

    if (editingTaskId) {
      // update existing
      const existing = data.tasks[editingTaskId];
      if (!existing) return;
      const subtasks =
        payload.subtasksText && payload.subtasksText.trim()
          ? payload.subtasksText.split("\n").map(s => ({ id: uuidv4(), title: s.trim(), done: false }))
          : existing.subtasks ?? [];
      const updated: Task = {
        ...existing,
        title: trimmed,
        dueDate: payload.dueDate ? new Date(payload.dueDate).toISOString() : undefined,
        subtasks,
        notes: payload.notes,
        completed: existing.completed, // Preserve the completed status
        priority: payload.priority || existing.priority || "medium"
      };
      setData({ 
        ...data, 
        tasks: { ...data.tasks, [editingTaskId]: updated } 
      });
    } else {
      // new task
      const id = uuidv4();
      const target = columnId ?? targetColumnForNew ?? data.columnOrder[0];
      const isAddingToDoneColumn = target === "done";
      
      const newTask: Task = {
        id,
        title: trimmed,
        dueDate: payload.dueDate ? new Date(payload.dueDate).toISOString() : undefined,
        subtasks: payload.subtasksText
          ? payload.subtasksText.split("\n").filter(Boolean).map(s => ({ 
              id: uuidv4(), 
              title: s.trim(), 
              done: isAddingToDoneColumn // Mark subtasks as done if adding to Done column
            }))
          : [],
        completed: isAddingToDoneColumn, // Automatically mark as completed if adding to Done column
        priority: payload.priority || "medium"
      };
      // target variable is now defined earlier when creating the task
      const column = data.columns[target];
      const newCol = { ...column, taskIds: [newTask.id, ...column.taskIds] };
      setData({
        ...data, 
        tasks: { ...data.tasks, [newTask.id]: newTask }, 
        columns: { ...data.columns, [newCol.id]: newCol } 
      });
    }
    closeDialog();
  };

  const deleteTask = (taskId: string) => {
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];
    
    const newColumns: Record<string, any> = {};
    Object.entries(data.columns).forEach(([cid, col]) => {
      newColumns[cid] = { 
        ...col, 
        taskIds: (col as any).taskIds.filter((id: string) => id !== taskId) 
      };
    });
    
    setData({ ...data, tasks: newTasks, columns: newColumns });
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const t = data.tasks[taskId];
    if (!t?.subtasks) return;
    
    const subtasks = t.subtasks.map((s: any) => 
      s.id === subtaskId ? { ...s, done: !s.done } : s
    );
    
    // Check if all subtasks are now done
    const allSubtasksDone = subtasks.length > 0 && subtasks.every(s => s.done);
    
    setData({ 
      ...data, 
      tasks: { 
        ...data.tasks, 
        [taskId]: { 
          ...t, 
          subtasks,
          // Automatically mark the task as completed if all subtasks are done
          completed: allSubtasksDone ? true : t.completed
        } 
      } 
    });
  };

  const toggleComplete = (taskId: string, completed: boolean) => {
    const t = data.tasks[taskId];
    if (!t) return;
    
    setData({ 
      ...data, 
      tasks: { 
        ...data.tasks, 
        [taskId]: { ...t, completed } 
      } 
    });
  };

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // Log to help debug drag and drop issues
    console.log('Drag ended:', { result, destination, source, draggableId });
    
    if (!destination) {
      console.log('No destination, drag cancelled');
      return;
    }
    
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      console.log('Dropped in same position, no action needed');
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];
    
    // Create a new state object
    const newData = { ...data };
    
    // same column
    if (start.id === finish.id) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newCol = { ...start, taskIds: newTaskIds };
      newData.columns = { ...data.columns, [newCol.id]: newCol };
    } else {
      // different columns
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = { ...start, taskIds: startTaskIds };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finish, taskIds: finishTaskIds };

      newData.columns = { 
        ...data.columns, 
        [newStart.id]: newStart, 
        [newFinish.id]: newFinish 
      };
      
      // If task is moved to "Done" column, mark it as completed automatically
      if (finish.id === "done") {
        const task = data.tasks[draggableId];
        if (task && !task.completed) {
          newData.tasks = {
            ...newData.tasks,
            [draggableId]: { ...task, completed: true }
          };
        }
      }
    }
    
    setData(newData);
  }, [data, setData]);

  const tasksByColumn = useMemo(() => {
    return Object.fromEntries(
      Object.entries(data.columns).map(([cid, col]) => [cid, col.taskIds.map(id => data.tasks[id]).filter(Boolean)])
    ) as Record<string, Task[]>;
  }, [data]);

  return (
    <Fade in timeout={800}>
      <Box>
        <AppBar 
          position="static" 
          color="transparent" 
          elevation={0} 
          sx={{ 
            mb: 3, 
            borderBottom: 1, 
            borderColor: 'divider',
            background: 'linear-gradient(to right, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.02))'
          }}
        >
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
              My Personal Kanban Board
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Box display="flex" mr={1}>
                <Tooltip title="Undo (Ctrl+Z)">
                  <span> {/* Wrapping span to allow tooltip on disabled button */}
                    <IconButton onClick={undo} color="inherit" disabled={!canUndo}>
                      <UndoIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Redo (Ctrl+Y)">
                  <span> {/* Wrapping span to allow tooltip on disabled button */}
                    <IconButton onClick={redo} color="inherit" disabled={!canRedo}>
                      <RedoIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 1 }}>
                  {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
              </Tooltip>
              <Button 
                startIcon={<AddIcon />} 
                onClick={() => openNew()} 
                variant="contained" 
                size="medium"
                sx={{ 
                  borderRadius: 8,
                  px: 2,
                  boxShadow: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: 4,
                    '&::after': {
                      opacity: 1,
                      transform: 'scale(1)'
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 8,
                    opacity: 0,
                    transform: 'scale(0.9)',
                    transition: 'all 0.3s ease'
                  },
                  '& .MuiButton-startIcon': {
                    animation: `${pulseAnimation} 2s infinite ease-in-out`,
                    animationDelay: '1s'
                  }
                }}
              >
                New Task
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={3} alignItems="flex-start">
            {data.columnOrder.map((colId, index) => {
              const col = data.columns[colId];
              const tasks = tasksByColumn[colId] ?? [];
              return (
                <Grid key={colId} item xs={12} sm={6} md={3}>
                  <AnimatedGridItem delay={index * 0.1}>
                    <Card 
                      sx={{ 
                        minHeight: 480, 
                        boxShadow: 1, 
                        bgcolor: "background.paper",
                        borderRadius: 3,
                        overflow: "hidden",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Column
                          column={col}
                          tasks={tasks}
                          onAdd={() => openNew(col.id)}
                          onEdit={(taskId: string) => openEdit(taskId)}
                          onDelete={(taskId: string) => deleteTask(taskId)}
                          onToggleSubtask={(taskId: string, subId: string) => toggleSubtask(taskId, subId)}
                          onToggleComplete={(taskId: string, completed: boolean) => toggleComplete(taskId, completed)}
                        />
                      </CardContent>
                    </Card>
                  </AnimatedGridItem>
                </Grid>
              );
            })}
          </Grid>
        </DragDropContext>

        <TaskDialog
          open={dialogOpen}
          onClose={closeDialog}
          onSave={(payload: { title: string; dueDate?: string; subtasksText?: string; notes?: string }) => onSaveTask(payload)}
          // if editingTaskId, pass initial
          initialTask={editingTaskId ? data.tasks[editingTaskId] : undefined}
        />
      </Box>
    </Fade>
  );
}
