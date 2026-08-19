import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, body, senderEmail, appPassword } = req.body || {};

  const userEmail = senderEmail || process.env.VITE_SENDER_EMAIL || 'ganeshgunda777@gmail.com';
  const pass = appPassword || process.env.VITE_GMAIL_APP_PASSWORD || 'jwsp ptsh mbtu hcmk';

  if (!to || !body) {
    return res.status(400).json({ error: 'Missing recipient email (to) or body' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: userEmail,
        pass: pass.replace(/\s+/g, '')
      }
    });

    const info = await transporter.sendMail({
      from: `"LeadFlow AI" <${userEmail}>`,
      to: to,
      subject: subject || 'Custom AI Demo & Partnership',
      text: body
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      deliveredTo: to
    });
  } catch (error) {
    console.error('Nodemailer error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to send email via Gmail SMTP'
    });
  }
}
