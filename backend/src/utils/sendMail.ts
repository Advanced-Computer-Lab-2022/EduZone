import nodemailer from 'nodemailer';
const sendMail = async (options: any) => {
  // generate test account
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: 587,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });
  const message = {
    from: 'HAKIM <hakimACL@gmail.com>',
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

export default sendMail;
