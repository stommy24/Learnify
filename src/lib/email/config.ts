import { createTransport } from 'nodemailer';

export const emailConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

export const transporter = createTransport(emailConfig);

export const emailFrom = process.env.SMTP_FROM || 'noreply@learnify.com'; 