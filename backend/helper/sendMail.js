import { createTransport } from "nodemailer";
// import dotenv from 'dotenv'
// dotenv.config()

export const sendMail = async (email, subject, text) => {
  const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: "daah",
    to: email,
    subject,
    text,
  });
};
