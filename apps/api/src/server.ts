import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { auditMutations } from "./lib/audit.js";
import { config } from "./lib/config.js";
import { requireAuth } from "./lib/auth.js";
import { apiLimiter, authLimiter, uploadLimiter } from "./lib/security.js";
import { authRouter } from "./routes/auth.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { filesRouter } from "./routes/files.js";
import { jobsRouter } from "./routes/jobs.js";
import { pdfRouter } from "./routes/pdf.js";
import { projectsRouter } from "./routes/projects.js";
import { reportsRouter } from "./routes/reports.js";
import { usersRouter } from "./routes/users.js";
import { modelDsrRouter } from "./routes/model-dsr.js";
import crypto from "node:crypto";

const app = express();
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "frame-ancestors": ["'self'"],
        "object-src": ["'none'"]
      }
    },
    crossOriginResourcePolicy: { policy: "same-site" }
  })
);
app.use(cors({ origin: config.webOrigin, credentials: true }));
app.use(apiLimiter);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
import { prisma } from "./lib/prisma.js";
import { redisConnection } from "./jobs/queues.js";

morgan.token("userId", (req: any) => req.user?.id?.toString() || "guest");
morgan.token("requestId", (req: any) => req.requestId || "-");
app.use((req: express.Request & { requestId?: string }, res: express.Response, next: express.NextFunction) => {
  req.requestId = req.header("x-request-id") || crypto.randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
});
app.use(morgan(":requestId :method :url :status :res[content-length] - :response-time ms - user::userId - ip::remote-addr"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/live", (_req, res) => res.json({ status: "up" }));

app.get("/ready", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const connection = redisConnection();
    res.json({ status: "ready", db: "ok", queue: `${connection.host}:${connection.port}` });
  } catch (e: any) {
    res.status(503).json({ status: "error", message: e.message });
  }
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth", authRouter);
app.use("/api/dashboard", requireAuth, auditMutations, dashboardRouter);
app.use("/api/files", requireAuth, uploadLimiter, auditMutations, filesRouter);
app.use("/api/jobs", requireAuth, auditMutations, jobsRouter);
app.use("/api/projects", requireAuth, auditMutations, projectsRouter);
app.use("/api/reports", requireAuth, auditMutations, reportsRouter);
app.use("/api/users", requireAuth, auditMutations, usersRouter);
app.use("/api/model-dsrs", requireAuth, auditMutations, modelDsrRouter);
app.use("/api", requireAuth, uploadLimiter, auditMutations, pdfRouter);

app.use((error: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error", requestId: (req as any).requestId });
});

app.listen(config.apiPort, () => {
  console.log(`DSR API running on http://localhost:${config.apiPort}`);
});
