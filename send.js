

// ============================================
// FILE: api/upload.js
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

  try {
    const { file, fileName } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const CLOUDINARY_CLOUD_NAME = 'dzhdgxjhl';
    const CLOUDINARY_API_KEY = '187996692313448';
    const CLOUDINARY_API_SECRET = '7TocgPLXqIoeUApZSGfwP645dJI';

    // Create signature for Cloudinary upload
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = fileName || `ecstacy_${timestamp}`;
    
    // Upload directly to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // You can create a preset in Cloudinary dashboard
    formData.append('public_id', publicId);
    formData.append('folder', 'ecstacy-emails');
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
    
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id
      });
    } else {
      return res.status(500).json({ error: 'Upload failed', details: result });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
}
