import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

export function startServer({
  port = 4000,
  root,
}: {
  port?: number;
  root: string;
}) {
  const app = express();
  app.use(express.json());

  const apiDir = path.join(root, "api");

  if (!fs.existsSync(apiDir)) {
    console.warn(`[nanojs] No API folder found at ${apiDir}`);
  } else {
    const files = walk(apiDir);

    for (const file of files) {
      const route = fileToRoute(apiDir, file);

      import(file).then((mod) => {
        const handler = mod.default ?? mod;
        app.all(route, (req: Request, res: Response) => handler(req, res));
        console.log(`[nanojs] API ${route}`);
      });
    }
  }

  app.listen(port, () => {
    console.log(`[nanojs] API server running http://localhost:${port}`);
  });
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((f) => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) return walk(full);
    if (/\.(ts|js)$/.test(f)) return [full];
    return [];
  });
}

function fileToRoute(root: string, file: string): string {
  let r = file.replace(root, "").replace(/\\/g, "/");
  r = r.replace(/\.(ts|js)$/, "");

  // dynamic path [id] → :id
  r = r.replace(/\[(.*?)\]/g, ":$1");

  // catch-all [...slug] → *
  r = r.replace(/\/\[\.\.\.(.*?)\]/, "/*");

  return `/api${r}`;
}
