import React from "react";
import { Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "./styles/ThemeProvider";
import KanbanBoard from "./components/KanbanBoard.js";

export default function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <KanbanBoard />
      </Container>
    </ThemeProvider>
  );
}
