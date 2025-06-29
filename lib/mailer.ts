import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import React from "react";

const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  const html = await render(react);
  return transporter.sendMail({
    from: `TrenClad <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
