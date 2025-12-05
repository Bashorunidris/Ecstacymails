

// ============================================
// FILE: api/open.js
// ============================================
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emailId } = req.query;

  try {
    console.log('Email opened:', emailId, new Date().toISOString());

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Content-Length', pixel.length);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return res.status(200).send(pixel);

  } catch (error) {
    console.error('Tracking error:', error);
    return res.status(500).json({ error: 'Tracking failed' });
  }
}


