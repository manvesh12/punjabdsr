import nodemailer from "nodemailer";
import { config } from "./config.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
  },
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP_HOST is not configured. Email will not be sent.");
    console.warn(`[MOCKED EMAIL] To: ${to} | Subject: ${subject}`);
    console.warn(`[MOCKED EMAIL BODY]:\n${text}`);
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"DSR Portal" <noreply@dsr.gov.demo>',
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
