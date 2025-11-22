#!/usr/bin/env node
import path from "path";
import fs from "fs";
import { createServer, mergeConfig, InlineConfig } from "vite";
import react from "@vitejs/plugin-react";

async function main() {
  const projectRoot = process.cwd();
  let userConfig: any = {};

  const configPath = path.join(projectRoot, "nano.config.js");
  if (fs.existsSync(configPath)) {
    const loaded = await import(configPath);
    userConfig = loaded.default || {};
  }

  const defaultConfig: InlineConfig = {
    root: projectRoot,
    plugins: [react()],
    server: { port: 5173 },
  };

  const finalConfig = mergeConfig(
    defaultConfig,
    userConfig.vite || {
      root: userConfig.root,
      server: { port: userConfig.port },
    }
  );

  const vite = await createServer(finalConfig);
  await vite.listen();
  console.log(
    `[nanojs]: running at http://localhost:${finalConfig.server?.port}`
  );
}

main();
