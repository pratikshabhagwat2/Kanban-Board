import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Checkbox
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { Task } from "../types";
import { formatDueDate, dueChipColor } from "../utils/dateUtils";
import { getPriorityColor, getPriorityLabel } from "../utils/priorityUtils";
import { checkmarkAnimation, pulseAnimation, expandAnimation } from "../styles/animations";

type Props = {
  task: Task;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onToggleComplete?: (completed: boolean) => void;
};

export default function TaskCard({ task, index, onEdit, onDelete, onToggleSubtask, onToggleComplete }: Props) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const closeMenu = () => setAnchor(null);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            mb={1}
            sx={{ 
              userSelect: "none", 
              transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
              transform: snapshot.isDragging ? "scale(1.02)" : "none",
              opacity: snapshot.isDragging ? 0.9 : 1,
              cursor: "grab",
              minHeight: "60px", // Ensure there's enough area to grab
              "&:active": {
                cursor: "grabbing"
              }
            }}
          >
            <Card 
              elevation={snapshot.isDragging ? 4 : 1} 
              sx={{ 
                borderLeft: '4px solid',
                borderLeftColor: task.dueDate ? dueChipColor(task.dueDate) + '.main' : 'primary.main',
                background: snapshot.isDragging ? 'rgba(25, 118, 210, 0.04)' : 'inherit',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-3px)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease, background-color 0.2s ease',
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(25, 118, 210, 0.08)'
                },
                // Improve drag visual feedback
                transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
                transform: snapshot.isDragging ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                  <Box display="flex" alignItems="flex-start">
                    <Checkbox
                      size="small"
                      checked={!!task.completed}
                      onChange={(e) => onToggleComplete?.(e.target.checked)}
                      sx={{
                        mt: -0.5, 
                        ml: -1, 
                        mr: 0.5,
                        '& .MuiSvgIcon-root': {
                          transition: 'all 0.3s ease',
                          animation: task.completed ? `${pulseAnimation} 0.4s ease-in-out` : 'none'
                        },
                        '&.Mui-checked': {
                          '& .MuiSvgIcon-root': {
                            animation: `${checkmarkAnimation} 0.3s ease-in-out forwards`
                          }
                        }
                      }}
                    />
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          position: 'relative',
                          '&::after': task.completed ? {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            width: '100%',
                            height: '2px',
                            backgroundColor: (theme) => theme.palette.text.disabled,
                            animation: 'strikeThrough 0.3s ease-in-out forwards'
                          } : {},
                          '@keyframes strikeThrough': {
                            '0%': { width: '0%' },
                            '100%': { width: '100%' }
                          },
                          fontWeight: 600,
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.disabled' : 'text.primary',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Box display="flex" gap={0.5} mt={0.5}>
                        {task.priority && (
                          <Chip 
                            label={getPriorityLabel(task.priority)} 
                            size="small" 
                            color={getPriorityColor(task.priority) as any}
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                        {task.dueDate && 
                          <Chip 
                            label={formatDueDate(task.dueDate)} 
                            size="small" 
                            color={dueChipColor(task.dueDate)}
                            sx={{ 
                              height: 20, 
                              fontSize: '0.7rem',
                              transition: 'background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease',
                              animation: `${expandAnimation} 0.3s ease forwards`
                            }}
                          />
                        }
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                  <IconButton size="small" onClick={openMenu}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Menu anchorEl={anchor} open={!!anchor} onClose={closeMenu}>
                    <MenuItem
                      onClick={() => {
                        onEdit();
                        closeMenu();
                      }}
                    >
                      <EditIcon sx={{ mr: 1 }} /> Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        onDelete();
                        closeMenu();
                      }}
                    >
                      <DeleteIcon sx={{ mr: 1 }} /> Delete
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>

              {task.subtasks && task.subtasks.length > 0 && (
                <List dense sx={{ mt: 1 }}>
                  {task.subtasks.slice(0, 3).map(s => (
                    <ListItem key={s.id} sx={{ py: 0 }}>
                      <Checkbox 
                        size="small" 
                        checked={!!s.done} 
                        onChange={() => onToggleSubtask(s.id)} 
                        sx={{
                          '& .MuiSvgIcon-root': {
                            transition: 'transform 0.2s ease',
                            transform: s.done ? 'scale(1.1)' : 'scale(1)'
                          }
                        }}
                      />
                      <ListItemText 
                        primary={s.title} 
                        primaryTypographyProps={{ 
                          style: {
                            textDecoration: s.done ? 'line-through' : 'none',
                            color: s.done ? '#9e9e9e' : 'inherit',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {task.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {task.notes}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Draggable>
  );
}
