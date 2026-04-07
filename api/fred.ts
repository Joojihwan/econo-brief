import type { VercelRequest, VercelResponse } from '@vercel/node';

// Node.js 런타임 — CPU 제한 없음, 최대 30초 타임아웃
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const raw = req.query.series_ids;
  const ids = (Array.isArray(raw) ? raw[0] : (raw ?? ''))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!ids.length) {
    return res.status(400).json({ error: 'series_ids is required' });
  }

  const apiKey = process.env.FRED_API_KEY ?? '';
  const limit  = String(req.query.limit ?? '5');
  const order  = String(req.query.sort_order ?? 'desc');

  // 서버에서 FRED를 병렬 호출 — CORS 없음, 빠른 응답
  const results = await Promise.all(
    ids.map(async (id) => {
      const params = new URLSearchParams({
        series_id:  id,
        api_key:    apiKey,
        file_type:  'json',
        limit,
        sort_order: order,
      });
      try {
        const r = await fetch(
          `https://api.stlouisfed.org/fred/series/observations?${params}`,
        );
        return r.ok ? r.json() : { observations: [] };
      } catch {
        return { observations: [] };
      }
    }),
  );

  res.setHeader('Cache-Control', 's-maxage=1800'); // Vercel CDN 30분 캐시
  return res.json(results);
}
