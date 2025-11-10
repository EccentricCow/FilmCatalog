import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query, page = 1 } = req.query;
  const url = `https://api.themoviedb.org/3/search/movie?language=ru-RU&query=${encodeURIComponent(
    String(query)
  )}&page=${page}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env['TMDB_ACCESS_TOKEN']}`,
    },
  });

  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}
