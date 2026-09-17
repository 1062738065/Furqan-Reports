import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// "base" must match your GitHub repo name exactly (case-sensitive) so
// GitHub Pages can find the built JS/CSS files at
// https://<username>.github.io/T1/
export default defineConfig({
  plugins: [react()],
  base: "/T1/",
});
