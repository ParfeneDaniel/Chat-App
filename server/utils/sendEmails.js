const nodemailer = require("nodemailer");

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const sendValidEmail = async (user, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });
    const mailOption = {
      from: EMAIL,
      to: user.email,
      subject: "Validate your email",
      html: `<p>Your link for validate your email is <a href="http://localhost:5173/validate/${token}">here</a>. You have 2 minutes until it expires, so hurry up.</p>`,
    };
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.log(error.message);
  }
};

const sendSecurityEmail = async (user, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });
    const mailOption = {
      from: EMAIL,
      to: user.email,
      subject: "Security email",
      html: `<p>Your link for changeing your password is <a href="http://localhost:5173/resetPassword/${token}">here</a>. You have 3 minutes until it expires, so hurry up.</p>`,
    };
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { sendValidEmail, sendSecurityEmail };
