import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enhanced logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms${
      capturedJsonResponse ? ` :: ${JSON.stringify(capturedJsonResponse)}` : ''
    }`;

    log(logLine.length > 80 ? logLine.slice(0, 79) + "…" : logLine);
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  // Enhanced error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    log(`Error [${status}]: ${message}`);
    if (err.stack) {
      log(`Stack trace: ${err.stack}`);
    }

    res.status(status).json({ message });
  });

  if (app.get("env") === "development") {
    log("Starting server in development mode");
    await setupVite(app, server);
  } else {
    log("Starting server in production mode");

    // Serve static files from the dist/public directory
    const publicDir = path.join(__dirname, "public");
    log(`Serving static files from: ${publicDir}`);
    app.use(express.static(publicDir));

    // Handle client-side routing
    app.get("*", (req, res, next) => {
      try {
        const indexPath = path.join(publicDir, "index.html");
        log(`Serving index.html for path: ${req.path}`);
        if (!require('fs').existsSync(indexPath)) {
          log(`Warning: index.html not found at ${indexPath}`);
          return next(new Error('index.html not found'));
        }
        res.sendFile(indexPath);
      } catch (error) {
        log(`Error serving index.html: ${error}`);
        next(error);
      }
    });
  }

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server listening on port ${PORT} in ${app.get("env")} mode`);
  });
})();