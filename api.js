// ============================================
// FILE: api/send.js
// ============================================
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emails, subject, content } = req.body;

  if (!emails || !subject || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const RESEND_API_KEY = 're_XWYdPFbR_3QSjCKymKdSayojZdn3Fv8vS';
  const BATCH_SIZE = 50;

  try {
    let successCount = 0;
    let failCount = 0;
    const failedEmails = [];

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);

      for (const email of batch) {
        try {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'ECSTACY <onboarding@resend.dev>',
              to: [email],
              subject: subject,
              html: content
            })
          });

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
            failedEmails.push(email);
          }

          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          failCount++;
          failedEmails.push(email);
          console.error('Error sending to', email, error);
        }
      }
    }

    return res.status(200).json({
      success: true,
      sent: successCount,
      failed: failCount,
      failedEmails: failedEmails
    });

  } catch (error) {
    console.error('Send error:', error);
    return res.status(500).json({ error: 'Failed to send emails' });
  }
}
