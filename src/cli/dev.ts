#!/usr/bin/env node
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

async function main() {
  const projectRoot = process.cwd();
  const vite = await createServer({
    root: path.join(projectRoot),
    plugins: [react()],
    server: { port: 5173 },
  });
  await vite.listen();
  console.log(`[nanojs]: running at http://localhost:5173`);
}

main();
