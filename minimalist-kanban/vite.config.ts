// vite.config.js
import { defineConfig } from 'vite';
// Dynamic import to handle ESM module
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Add this to resolve import errors
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
});
