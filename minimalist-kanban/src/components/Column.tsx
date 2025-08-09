import React, { useRef, useState, memo } from "react";
import { Box, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";
import ColumnHeader from "./ColumnHeader.js";
import TaskCard from "./TaskCard.js";
import { ColumnType, Task } from "../types";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { AnimatedList } from "./AnimatedList";

type Props = {
  column: ColumnType;
  tasks: Task[];
  onAdd: () => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
};

const Column = memo(({ column, tasks, onAdd, onEdit, onDelete, onToggleSubtask, onToggleComplete }: Props) => {
  const [wasDroppedOn, setWasDroppedOn] = useState(false);
  const columnRef = useRef<HTMLDivElement | null>(null);
  
  return (
    <Box>
      <ColumnHeader title={column.title} count={tasks.length} />
      <StrictModeDroppable droppableId={column.id}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => {
          // Handle drop animation
          if (snapshot.isDraggingOver && !wasDroppedOn) {
            setWasDroppedOn(true);
          } else if (!snapshot.isDraggingOver && wasDroppedOn) {
            // A task was just dropped on this column
            setWasDroppedOn(false);
            // Play drop animation
            if (columnRef.current) {
              const animation = columnRef.current.animate([
                { boxShadow: '0 0 0 rgba(25, 118, 210, 0)', backgroundColor: 'rgba(25, 118, 210, 0.1)' },
                { boxShadow: '0 0 15px rgba(25, 118, 210, 0.4)', backgroundColor: 'rgba(25, 118, 210, 0.15)' },
                { boxShadow: '0 0 0 rgba(25, 118, 210, 0)', backgroundColor: 'transparent' }
              ], {
                duration: 600,
                easing: 'ease-out'
              });
              
              // Clean up the animation when it's done
              animation.onfinish = () => animation.cancel();
            }
          }
          
          // Create a ref combining function that works with both react-beautiful-dnd and our columnRef
          const setRef = (el: HTMLDivElement | null) => {
            // First satisfy the DroppableProvided.innerRef requirement
            provided.innerRef(el);
            // Then set our own ref
            columnRef.current = el;
          };
          
          return (
            <Box
              ref={setRef}
              {...provided.droppableProps}
              sx={{
                minHeight: 360,
                p: 1.5,
                borderRadius: 2,
                position: 'relative',
                transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: snapshot.isDraggingOver ? "action.hover" : "background.paper",
                border: '1px solid',
                borderColor: snapshot.isDraggingOver ? 'primary.light' : 'divider',
                boxShadow: snapshot.isDraggingOver ? 2 : 0,
                // Enhanced visual cues for drop targets
                outline: snapshot.isDraggingOver ? '2px dashed rgba(25, 118, 210, 0.6)' : 'none',
                outlineOffset: -4
              }}
            >
              <AnimatedList
                items={tasks}
                keyExtractor={(task) => task.id}
                renderItem={(task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onEdit={() => onEdit(task.id)}
                    onDelete={() => onDelete(task.id)}
                    onToggleSubtask={(subId: string) => onToggleSubtask(task.id, subId)}
                    onToggleComplete={(completed: boolean) => onToggleComplete(task.id, completed)}
                  />
                )}
                sx={{ minHeight: '100%' }}
              />
              {provided.placeholder}
            </Box>
          );
        }}
      </StrictModeDroppable>

      <Box mt={2} display="flex" justifyContent="center">
        <Button 
          size="small" 
          variant="outlined" 
          onClick={onAdd} 
          startIcon={<AddIcon />}
          sx={{ 
            borderStyle: 'dashed',
            transition: 'all 0.3s ease',
            animation: 'pulse 2s infinite',
            '&:hover': {
              borderStyle: 'solid',
              transform: 'translateY(-2px)',
              boxShadow: 2
            },
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.2)' },
              '70%': { boxShadow: '0 0 0 6px rgba(25, 118, 210, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' }
            }
          }}
        >
          Add Task
        </Button>
      </Box>
    </Box>
  );
});

export default Column;
