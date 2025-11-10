import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env['TMDB_ACCESS_TOKEN']) {
    return res.status(500).json({ error: 'TMDB_ACCESS_TOKEN not set' });
  }

  const url = `https://api.themoviedb.org/3/genre/movie/list?language=ru-RU`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env['TMDB_ACCESS_TOKEN']}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('TMDB API error:', errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
