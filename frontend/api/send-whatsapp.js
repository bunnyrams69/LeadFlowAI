import axios from 'axios';

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

  const { to, message, token, phoneId } = req.body || {};

  const metaToken = token || process.env.VITE_WHATSAPP_TOKEN || 'EAAOkCOC7S8UBSTdu2WmYYIOhP9BBK1mFkJ2SQ2LP18x3yVyL4XJ6mPEQw7R16m1ZCurZCZBS35iaojamiicLxDAx5ZBfYwRNYDOtcdmw2Kit5UBIIbXKE8ejANLNoZA3wBNAQqE6uZAuaosMZAZAuF4NaCPNPm38tpeZAp5BOwXifmOnBfIthhQIDaF0VVA8NZBFBRo8jvNrZCDDVEYzUxOQ75N6ZAoafRMVv0PZCCXEu53gfUZCa77Qr1n6YmLW86ZC9BQSghCBAhguJDkb9CqvHDOwh05';
  const metaPhoneId = phoneId || process.env.VITE_WHATSAPP_PHONE_ID || '1209038115629162';

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing recipient phone (to) or message' });
  }

  const cleanPhone = String(to).replace(/[^0-9]/g, '').slice(-10);
  const targetNumber = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

  try {
    const metaRes = await axios.post(
      `https://graph.facebook.com/v19.0/${metaPhoneId}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: targetNumber,
        type: "text",
        text: {
          preview_url: true,
          body: message
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${metaToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(200).json({
      success: true,
      deliveredTo: targetNumber,
      data: metaRes.data
    });
  } catch (error) {
    const errorData = error.response?.data?.error || {};
    console.error('Meta WhatsApp API error:', errorData);

    return res.status(error.response?.status || 500).json({
      error: errorData.message || error.message || 'Failed to dispatch WhatsApp message',
      code: errorData.code,
      details: errorData.error_data?.details || 'Check recipient whitelist in Meta Developer Dashboard'
    });
  }
}
