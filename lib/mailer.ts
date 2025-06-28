import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import React from "react";

const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

type SendEmailProps = {
  to: string;
  subject: string;
  react: React.ReactElement;
};

export async function sendEmail({ to, subject, react }: SendEmailProps) {
  const content = await render(react); // Render the React component to HTML

  const email = {
    from: `TrenClad <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: content,
  };

  await transporter.sendMail(email);
}
