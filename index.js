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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2E7D8A, #8B5A96); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Christy Cares</h1>
            <p style="color: white; margin: 5px 0;">Personalized Assisted Living Services</p>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ${payload.content.split('\n').map(line => `<p style="margin: 10px 0;">${line}</p>`).join('')}
            </div>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">
                This email was sent by Christy Cares<br>
                If you have questions, please contact your caregiver directly.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.json({
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error('Email send error:', error);
    res.json({
      success: false,
      error: error.message
    }, 500);
  }
};