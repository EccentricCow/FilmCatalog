import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query['url'] as string;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' });
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(arrayBuffer));
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Image fetch error:', err);
    res.status(500).json({ error: 'Server error' });
    return res.status(500).json({ error: 'Server error' });
  }
}
