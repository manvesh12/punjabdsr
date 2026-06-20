import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  // Development-only account. Production deployments must provision administrators through a controlled process.
  { username: "admin.super", fullName: "Administrator", email: "admin.super@dsr.gov.demo", password: "Admin@2026!DSR", role: Role.ADMIN, district: "", blockName: "", sectionName: "", accessScope: "Full Access" },
  { username: "portal.admin@dsr.gov.demo", fullName: "Portal Administrator", email: "portal.admin@dsr.gov.demo", password: "Portal#Admin26", role: Role.ADMIN, district: "", blockName: "", sectionName: "", accessScope: "Full Access" },
  { username: "dc.jalandhar@dsr.gov.demo", fullName: "District Commissioner (Jalandhar)", email: "dc.jalandhar@dsr.gov.demo", password: "DC@Jal2026!", role: Role.DISTRICT_OWNER, district: "Jalandhar", blockName: "", sectionName: "", accessScope: "District Review" },
  { username: "geology.officer@dsr.gov.demo", fullName: "Geology Officer", email: "geology.officer@dsr.gov.demo", password: "Geo#Officer26", role: Role.OFFICER, district: "Jalandhar", blockName: "", sectionName: "", accessScope: "Legacy Data Entry" },
  { username: "state.reviewer@dsr.gov.demo", fullName: "State Reviewer", email: "state.reviewer@dsr.gov.demo", password: "State@Review26", role: Role.REVIEWER, district: "", blockName: "", sectionName: "", accessScope: "State Review" },
  { username: "survey.team@iit.demo", fullName: "IIT Ropar Survey Team", email: "survey.team@iit.demo", password: "IIT#Survey26", role: Role.IIT_ROPAR, district: "", blockName: "", sectionName: "", accessScope: "Front Matter + Chapters 1-4 + Review" },
  { username: "sdlc.committee@dsr.gov.demo", fullName: "SDLC Committee", email: "sdlc.committee@dsr.gov.demo", password: "SDLC@Data26", role: Role.SDLC, district: "Jalandhar", blockName: "", sectionName: "", accessScope: "District SDLC" },
  { username: "axen.sectiona@dsr.gov.demo", fullName: "Assistant Executive Engineer (AXEN)", email: "axen.sectiona@dsr.gov.demo", password: "AXEN@Section26", role: Role.AXEN, district: "Jalandhar", blockName: "", sectionName: "Section A", accessScope: "Controls assigned section + manages SDO + JE" },
  { username: "sdo.blocka@dsr.gov.demo", fullName: "Sub Divisional Officer (SDO)", email: "sdo.blocka@dsr.gov.demo", password: "SDO@BlockA26", role: Role.SDO, district: "Jalandhar", blockName: "Block A", sectionName: "", accessScope: "Reports to AXEN, handles Chapters 5-10" },
  { username: "je.field@dsr.gov.demo", fullName: "Junior Engineer Field Team (JE)", email: "je.field@dsr.gov.demo", password: "JE#Field26", role: Role.JE, district: "Jalandhar", blockName: "Block A", sectionName: "Field Data", accessScope: "Reports to AXEN, field data collection" },
  { username: "gis.team@dsr.gov.demo", fullName: "GIS Team", email: "gis.team@dsr.gov.demo", password: "GIS@Maps26", role: Role.GIS, district: "", blockName: "", sectionName: "", accessScope: "Plates + Graphs + Annexures" },
  { username: "gov.review1@dsr.gov.demo", fullName: "Government Reviewer", email: "gov.review1@dsr.gov.demo", password: "Gov#Review26", role: Role.REVIEWER_1, district: "", blockName: "", sectionName: "", accessScope: "Final Govt Review" }
] as const;

async function main() {
  for (const user of users) {
    const { username, fullName, email, password, role, district, blockName, sectionName, accessScope } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
      where: { username },
      update: {
        fullName,
        email,
        password: hashedPassword,
        role,
        district,
        blockName,
        sectionName,
        accessScope,
        active: true
      },
      create: {
        username,
        fullName,
        email,
        password: hashedPassword,
        role,
        district,
        blockName,
        sectionName,
        accessScope,
        active: true
      }
    });
  }
}

main()
  .then(async () => {
    console.log("Seed users created.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
