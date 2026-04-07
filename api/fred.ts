export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);

  const apiKey = process.env.FRED_API_KEY;
  if (apiKey) searchParams.set('api_key', apiKey);

  const res = await fetch(
    `https://api.stlouisfed.org/fred/series/observations?${searchParams}`,
  );
  const body = await res.text();

  return new Response(body, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
