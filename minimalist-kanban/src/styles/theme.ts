import { createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

// Create a theme instance for both light and dark modes
export const createAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: { main: "#1976d2" },
    background: mode === 'light' 
      ? { default: "#f7f8fa", paper: "#ffffff" }
      : { default: "#121212", paper: "#1e1e1e" },
    info: { main: "#3f51b5" },
    warning: { main: "#ff9800" },
    error: { main: "#f44336" },
    success: { main: "#4caf50" }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { 
          borderRadius: 12,
          transition: "all 0.25s ease"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#bbbbbb",
            borderRadius: "4px",
            "&:hover": {
              background: "#888888",
            }
          }
        }
      }
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    subtitle1: {
      fontWeight: 500
    }
  }
});

// Create default light theme for initial rendering
const lightTheme = createAppTheme('light');
export default lightTheme;
