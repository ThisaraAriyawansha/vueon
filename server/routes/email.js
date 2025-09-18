const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fueltrixteam@gmail.com', // Your email
    pass: 'eqnd bkeo iwqk egmh' // App-specific password
  }
});

// Route to handle form submission
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Email options with Apple-inspired HTML template
  const mailOptions = {
    from: 'Vueon Team <fueltrixteam@gmail.com>', // Sender address with display name
    to: 'thisara.a2001@gmail.com', // Admin email
    subject: `New Contact Submission: ${subject}`,
    text: `
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f7; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: #fafafa; padding: 40px 20px 20px; text-align: center; border-bottom: 1px solid #e8e8ed; }
          .header h1 { color: #1d1d1f; font-size: 24px; font-weight: 600; margin: 0; }
          .header p { color: #6e6e73; font-size: 16px; margin: 8px 0 0; }
          .content { padding: 32px; }
          .content h2 { color: #1d1d1f; font-size: 18px; font-weight: 600; margin: 0 0 16px; }
          .content p { color: #6e6e73; font-size: 16px; line-height: 1.5; margin: 8px 0; }
          .content .label { color: #1d1d1f; font-weight: 600; }
          .content .value { color: #6e6e73; }
          .divider { height: 1px; background: #e8e8ed; margin: 16px 0; }
          .footer { background: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #e8e8ed; }
          .footer p { color: #6e6e73; font-size: 12px; margin: 4px 0; }
          .footer a { color: #0071e3; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          @media only screen and (max-width: 600px) {
            .container { margin: 20px; border-radius: 12px; }
            .header { padding: 24px 16px 16px; }
            .content { padding: 24px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>Received from Vueon Contact Form</p>
          </div>
          <div class="content">
            <h2>Submission Details</h2>
            <p><span class="label">Name:</span> <span class="value">${name}</span></p>
            <div class="divider"></div>
            <p><span class="label">Email:</span> <span class="value">${email}</span></p>
            <div class="divider"></div>
            <p><span class="label">Subject:</span> <span class="value">${subject}</span></p>
            <div class="divider"></div>
            <p><span class="label">Message:</span> <span class="value">${message}</span></p>
          </div>
          <div class="footer">
            <p><a href="https://vueon.com">Vueon</a> | Your Creative Platform</p>
            <p>&copy; ${new Date().getFullYear()} Vueon. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;