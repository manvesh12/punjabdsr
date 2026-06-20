import { Router } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { putPdf } from "../lib/storage.js";

const allowedMimeTypes = new Set(["application/pdf"]);
const maxPdfSizeBytes = 50 * 1024 * 1024; // Reduced to 50MB for free tier RAM limit
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxPdfSizeBytes } });

export const filesRouter = Router();

filesRouter.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "File is required" });
    return;
  }
  if (!allowedMimeTypes.has(req.file.mimetype) || !req.file.originalname.toLowerCase().endsWith(".pdf")) {
    res.status(400).json({ error: "Only PDF uploads are allowed" });
    return;
  }
  const key = `uploads/${Date.now()}-${randomUUID()}-${req.file.originalname}`;
  await putPdf(key, req.file.buffer);
  res.status(201).json({
    success: true,
    fileName: req.file.originalname,
    objectKey: key,
    contentType: req.file.mimetype,
    sizeBytes: req.file.size
  });
});
