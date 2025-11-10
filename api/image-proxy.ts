import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query['url'] as string;

  if (!url) {
    res.status(400).send('Missing URL');
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      res.status(response.status).send('Failed to fetch image');
      return;
    }

    const arrayBuffer = await response.arrayBuffer();

    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
}
