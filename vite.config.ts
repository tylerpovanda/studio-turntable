// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'; // Use import

export default defineConfig({
  plugins: [tailwindcss()], // Add the plugin here
});