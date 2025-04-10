const nodemailer = require("nodemailer");

const sendEmailToNgo = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "surplussmile@gmail.com",  // your email
        pass: "tvna crtu chwk srfx"  
    },
  });

  await transporter.sendMail({
    from: `"Donation Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,
  });
};

module.exports = sendEmailToNgo;
