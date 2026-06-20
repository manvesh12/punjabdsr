import { Role } from "@prisma/client";

export type Permission = 
  | "view_all"
  | "edit_all"
  | "approve_reports"
  | "submit_reports"
  | "view_district"
  | "edit_district"
  | "view_block"
  | "edit_block";

export const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: ["view_all", "edit_all", "approve_reports", "submit_reports"],
  STATE_ADMIN: ["view_all", "approve_reports"],
  DISTRICT_OWNER: ["view_district", "approve_reports"],
  REVIEWER: ["view_district", "approve_reports"],
  REVIEWER_1: ["view_district", "approve_reports"],
  REVIEWER_2: ["view_district", "approve_reports"],
  IIT_ROPAR: ["view_all", "submit_reports"],
  SDLC: ["view_district", "submit_reports"],
  SDO: ["view_block", "submit_reports"],
  JE: ["view_block", "submit_reports"],
  AXEN: ["view_block", "submit_reports"],
  GIS: ["view_all", "submit_reports"],
  OFFICER: ["view_district", "submit_reports"]
};

export const hasPermission = (role: Role, permission: Permission) => {
  return rolePermissions[role]?.includes(permission) || false;
};
