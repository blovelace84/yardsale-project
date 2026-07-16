import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (
            id.includes("firebase/auth") ||
            id.includes("@firebase/auth")
          ) {
            return "firebase-auth";
          }

          if (
            id.includes("firebase/firestore") ||
            id.includes("@firebase/firestore")
          ) {
            return "firebase-firestore";
          }

          if (
            id.includes("firebase/storage") ||
            id.includes("@firebase/storage")
          ) {
            return "firebase-storage";
          }

          if (id.includes("firebase")) {
            return "firebase";
          }

          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (
            id.includes("react") ||
            id.includes("scheduler")
          ) {
            return "react-vendor";
          }
        },
      },
    },
  },
});