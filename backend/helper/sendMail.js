// import { createTransport } from "nodemailer";
// // import dotenv from 'dotenv'
// // dotenv.config()

// export const sendMail = async (email, subject, text) => {
//   const transporter = createTransport({
//     // Use the correct transport options, e.g., for Gmail, use 'smtp.gmail.com'
//     host: "your-smtp-host", // Replace with your SMTP server hostname
//     port: 587, // Replace with the correct SMTP port for your server
//     secure: false, // Set to true if your server requires a secure connection (e.g., TLS/SSL)
//     auth: {
//       user: "your-email@gmail.com", // Your email address
//       pass: "your-email-password", // Your email password or an application-specific password
//     },
//   });

//   const mailData = {
//     from: "youremail@gmail.com", // sender address (you can use the same as your 'user' above)
//     to: email, // recipient's email address (passed as a parameter)
//     subject: subject,
//     text: text,
//     // You can also include an 'html' property for HTML content.
//   };

//   try {
//     const info = await transporter.sendMail(mailData);
//     console.log("Email sent: " + info.response);
//   } catch (error) {
//     console.error("Error sending email: " + error);
//   }
// };
