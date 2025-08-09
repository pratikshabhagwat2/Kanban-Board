import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Task, Priority } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: { title: string; dueDate?: string; subtasksText?: string; notes?: string; priority?: Priority }) => void;
  initialTask?: Task;
};

export default function TaskDialog({ open, onClose, onSave, initialTask }: Props) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [subtasksText, setSubtasksText] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("medium");

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDueDate(initialTask.dueDate ? initialTask.dueDate.split("T")[0] : "");
      setSubtasksText(initialTask.subtasks ? initialTask.subtasks.map(s => s.title).join("\n") : "");
      setNotes(initialTask.notes || "");
      setPriority(initialTask.priority || "medium");
    } else {
      setTitle("");
      setDueDate("");
      setSubtasksText("");
      setNotes("");
      setPriority("medium");
    }
  }, [initialTask, open]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      TransitionProps={{
        timeout: 400,
        style: { 
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }}
      sx={{
        '& .MuiDialog-paper': {
          animation: 'dialogEntrance 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes dialogEntrance': {
            '0%': {
              opacity: 0,
              transform: 'scale(0.9)'
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1)'
            }
          }
        }
      }}
      PaperProps={{ 
        elevation: 5, 
        sx: { 
          borderRadius: 2,
          transform: open ? 'translateY(0)' : 'translateY(20px)',
          opacity: open ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        } 
      }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {initialTask ? "Edit Task" : "Create New Task"}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="grid" gap={2.5} py={1}>
          <TextField 
            label="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            fullWidth 
            autoFocus 
            variant="outlined" 
            placeholder="Enter task title"
          />
          <Box display="flex" gap={2}>
            <TextField 
              type="date" 
              label="Due date" 
              value={dueDate} 
              InputLabelProps={{ shrink: true }} 
              onChange={(e) => setDueDate(e.target.value)}
              variant="outlined"
              sx={{ flex: 1 }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 120, flex: 1 }}>
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                labelId="priority-select-label"
                id="priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="Subtasks (one per line)"
            helperText="Write each subtask on its own line"
            value={subtasksText}
            onChange={(e) => setSubtasksText(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            placeholder="E.g. Research options\nDraft proposal\nReview with team"
          />
          <TextField 
            label="Notes" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            fullWidth 
            multiline 
            minRows={3}
            variant="outlined" 
            placeholder="Any additional information about this task..."
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            '&:after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.2)',
              transform: 'scale(0)',
              opacity: 0,
              borderRadius: '50%',
              transition: 'transform 0.5s, opacity 0.5s',
            },
            '&:active:after': {
              transform: 'scale(2)',
              opacity: 0,
              transition: 'transform 0s',
            },
            '&:hover': {
              boxShadow: 2
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (title.trim()) {
              onSave({ 
                title, 
                dueDate: dueDate || undefined, 
                subtasksText: subtasksText || undefined, 
                notes: notes || undefined,
                priority
              });
            }
          }}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            '&:after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.3)',
              transform: 'scale(0)',
              opacity: 0,
              borderRadius: '50%',
              transition: 'transform 0.5s, opacity 0.5s',
            },
            '&:active:after': {
              transform: 'scale(2)',
              opacity: 0,
              transition: 'transform 0s',
            },
            '&:hover:not(:disabled)': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            },
            transition: 'all 0.2s ease'
          }}
          disabled={!title.trim()}
        >
          {initialTask ? "Save Changes" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
