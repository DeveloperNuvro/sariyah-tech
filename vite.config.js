import path from "path" 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Add the plugin
  ],
  resolve: { // <-- Add this 'resolve' object
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      // All requests starting with /api will be proxied
      '/api': {
        // The target is your backend server
        target: 'http://localhost:5000', 
        // This is needed for virtual hosted sites and for security
        changeOrigin: true, 
        // You can optionally rewrite the path, but we don't need to here
        // rewrite: (path) => path.replace(/^\/api/, '') 
      },
    }
  },

})