import nodemailer from "nodemailer";

// transporter config (example: Gmail SMTP)
export const transporter = nodemailer.createTransport({
  service: "gmail", // or use `host`, `port`, `secure` for custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password or smtp password
  },
});
