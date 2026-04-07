import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const r = await fetch(
      'https://production.dataviz.cnn.io/index/fearandgreed/graphdata',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer':    'https://edition.cnn.com/',
          'Origin':     'https://edition.cnn.com',
          'Accept':     'application/json',
        },
      },
    );
    if (!r.ok) return res.status(r.status).json({ error: 'upstream error' });
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=3600'); // 1시간 캐시
    return res.json(data);
  } catch {
    return res.status(500).json({ error: 'fetch failed' });
  }
}
