const nodemailer = require("nodemailer");

const sendEmailToAdmin = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "surplussmile@gmail.com", // Replace with your email
        pass: "tvna crtu chwk srfx", // Use an app password for security
      },
    });

    const mailOptions = {
      from: "surplussmile@gmail.com",
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log("Admin email sent successfully");
  } catch (error) {
    console.error("Error sending admin email:", error);
  }
};

module.exports = sendEmailToAdmin;
