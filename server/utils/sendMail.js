import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, text, html }) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password (not normal password)
      },
    });

    // Mail options
    const mailOptions = {
      from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: text || "Please check the email content.", // fallback for old clients
      html: html || `<p>${text}</p>`, // fallback html
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error(" Email sending failed:", error.message);
    throw new Error("Email could not be sent, please try again later.");
  }
};

export default sendEmail;
