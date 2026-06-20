import { Router } from "express";
import { ProjectStatus, ReportStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export const dashboardRouter = Router();

dashboardRouter.get("/stats", async (_req, res) => {
  const [totalProjects, completedReports, generatedPdfs, reportsByStatus, templates, finalDsrs] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { OR: [{ status: ProjectStatus.COMPLETED }, { progress: 100 }] } }),
    prisma.dsrFile.count({ where: { annexureId: "final" } }),
    prisma.report.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.modelDsr.count({ where: { status: "PUBLISHED" } }),
    prisma.generatedDsr.count({ where: { status: "FINAL" } })
  ]);

  res.json({
    totalProjects,
    completedReports,
    pendingReports: Math.max(totalProjects - completedReports, 0),
    generatedPdfs,
    publishedTemplates: templates,
    finalizedModelDsrs: finalDsrs,
    reportsByStatus: Object.fromEntries(reportsByStatus.map((item) => [item.status, item._count._all]))
  });
});
