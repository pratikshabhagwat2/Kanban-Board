import React from "react";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { shimmerAnimation } from "../styles/animations";

export default function ColumnHeader({ title, count }: { title: string; count: number }) {
  const theme = useTheme();
  
  // Determine color based on column title
  const getColumnColor = (title: string) => {
    switch (title) {
      case "Not Started":
        return theme.palette.info.main;
      case "In Progress":
        return theme.palette.warning.main;
      case "Blocked":
        return theme.palette.error.main;
      case "Done":
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} pb={1} borderBottom={1} borderColor="divider">
      <Box display="flex" alignItems="center">
        <AssignmentIcon 
          fontSize="small" 
          sx={{ 
            mr: 1, 
            color: getColumnColor(title),
            animation: `${shimmerAnimation} 2s ease-in-out infinite`,
            backgroundSize: '200% 100%',
            backgroundImage: `linear-gradient(90deg, transparent, ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)'}, transparent)`,
          }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>
      <Chip 
        label={count} 
        size="small"
        sx={{ 
          bgcolor: getColumnColor(title) + "20", // Add 20% opacity 
        color: getColumnColor(title),
        fontWeight: 600,
        background: `linear-gradient(90deg, 
          ${getColumnColor(title) + "20"} 25%, 
          ${getColumnColor(title) + "30"} 50%, 
          ${getColumnColor(title) + "20"} 75%)`,
        backgroundSize: '200% 100%',
        animation: `${shimmerAnimation} 2.5s infinite linear`,
        transition: 'all 0.3s ease'
        }} 
      />
    </Box>
  );
}
