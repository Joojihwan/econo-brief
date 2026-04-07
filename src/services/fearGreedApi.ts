export interface FearGreedResult {
  score: number;
  rating: string;
  ratingKr: string;
  previousScore: number | null;
  changeAbs: number | null;
  timestamp: string;
}

const RATING_KR: Record<string, string> = {
  'Extreme Fear': '극도의 공포',
  'Fear':         '공포',
  'Neutral':      '중립',
  'Greed':        '탐욕',
  'Extreme Greed': '극도의 탐욕',
};

// ── 프로덕션: /api/fear-greed 서버리스 프록시 ─────────────────────────────────
async function fetchProd(): Promise<FearGreedResult> {
  const res = await fetch('/api/fear-greed');
  if (!res.ok) throw new Error(`Fear & Greed API ${res.status}`);
  return parseResponse(await res.json());
}

// ── 로컬 dev: Vite 프록시 → CNN 직접 ─────────────────────────────────────────
async function fetchDev(): Promise<FearGreedResult> {
  const res = await fetch('/dev-fng/index/fearandgreed/graphdata');
  if (!res.ok) throw new Error(`Fear & Greed dev ${res.status}`);
  return parseResponse(await res.json());
}

function parseResponse(data: {
  fear_and_greed?: { score: number; rating: string; timestamp: string };
  fear_and_greed_historical?: { data: { x: number; y: number; rating: string }[] };
}): FearGreedResult {
  const current  = data.fear_and_greed;
  if (!current) throw new Error('unexpected response shape');

  const hist     = data.fear_and_greed_historical?.data ?? [];
  const previous = hist.length > 1 ? hist[1] : null;
  const score    = Math.round(current.score);
  const prevScore = previous ? Math.round(previous.y) : null;

  return {
    score,
    rating:        current.rating,
    ratingKr:      RATING_KR[current.rating] ?? current.rating,
    previousScore: prevScore,
    changeAbs:     prevScore !== null ? score - prevScore : null,
    timestamp:     current.timestamp,
  };
}

export async function fetchFearGreed(): Promise<FearGreedResult> {
  return import.meta.env.DEV ? fetchDev() : fetchProd();
}
