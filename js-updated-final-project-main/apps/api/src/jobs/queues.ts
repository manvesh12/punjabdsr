import { Queue } from "bullmq";
import { config } from "../lib/config.js";

export function redisConnection() {
  const url = new URL(config.queueRedisUrl);
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username || undefined,
    password: url.password || undefined,
    ...(url.protocol === 'rediss:' ? { tls: {} } : {})
  };
}

const defaultJobOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 1000 },
  removeOnComplete: 10,  // Reduced from 100 for Render free tier (Redis memory)
  removeOnFail: 50       // Reduced from 1000 for Render free tier (Redis memory)
};

export const pdfQueue = new Queue("pdf-jobs", { connection: redisConnection(), defaultJobOptions });
export const excelQueue = new Queue("excel-jobs", { connection: redisConnection(), defaultJobOptions });
export const auditQueue = new Queue("audit-jobs", { connection: redisConnection(), defaultJobOptions });
export const notificationsQueue = new Queue("notifications-jobs", { connection: redisConnection(), defaultJobOptions });

pdfQueue.on("error", (error) => console.warn("PDF queue connection error:", error.message));
excelQueue.on("error", (error) => console.warn("Excel queue connection error:", error.message));
auditQueue.on("error", (error) => console.warn("Audit queue connection error:", error.message));
notificationsQueue.on("error", (error) => console.warn("Notifications queue connection error:", error.message));
