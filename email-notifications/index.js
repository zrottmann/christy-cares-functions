const sdk = require('node-appwrite');
const nodemailer = require('nodemailer');

module.exports = async function(req, res) {
  const payload = JSON.parse(req.payload);

  try {
    // For testing, use Ethereal Email
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransporter({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: payload.from || '"Christy Cares" <noreply@christy-cares.com>',
      to: payload.to,
      subject: payload.subject || "Notification from Christy Cares",
      text: payload.content,
      html: `<p>${payload.content}</p>`,
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.json({
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    }, 500);
  }
};