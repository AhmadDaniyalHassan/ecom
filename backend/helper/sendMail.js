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
};

const mailData = {
  from: "youremail@gmail.com", // sender address
  to: "myfriend@gmail.com", // list of receivers
  subject: "Sending Email using Node.js",
  text: "That was easy!",
  html: "<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>",
};
