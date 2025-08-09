import React from "react";
import { List, ListItem, Checkbox, ListItemText } from "@mui/material";
import { Subtask } from "../types";
import { pulseAnimation, checkmarkAnimation } from "../styles/animations";

type Props = {
  subtasks?: Subtask[];
  onToggle: (id: string) => void;
};

export default function SubtaskList({ subtasks = [], onToggle }: Props) {
  return (
    <List dense>
      {subtasks.map(s => (
        <ListItem key={s.id} sx={{ py: 0 }}>
          <Checkbox 
            size="small" 
            checked={!!s.done} 
            onChange={() => onToggle(s.id)}
            sx={{
              '& .MuiSvgIcon-root': {
                transition: 'all 0.3s ease',
                animation: s.done ? `${pulseAnimation} 0.4s ease-in-out` : 'none'
              },
              '&.Mui-checked': {
                '& .MuiSvgIcon-root': {
                  animation: `${checkmarkAnimation} 0.3s ease-in-out forwards`
                }
              }
            }}
          />
          <ListItemText 
            primary={s.title} 
            primaryTypographyProps={{ 
              sx: {
                position: 'relative',
                textDecoration: s.done ? 'line-through' : 'none',
                color: s.done ? '#9e9e9e' : 'inherit',
                transition: 'all 0.3s ease',
                '&::after': s.done ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  width: '100%',
                  height: '1px',
                  backgroundColor: '#9e9e9e',
                  animation: 'strikeThrough 0.3s ease-in-out forwards'
                } : {},
                '@keyframes strikeThrough': {
                  '0%': { width: '0%' },
                  '100%': { width: '100%' }
                }
              }
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}
