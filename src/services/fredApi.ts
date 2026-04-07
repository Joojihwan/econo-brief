// 로컬 dev: Vite 프록시가 FRED로 직접 포워딩 (VITE_FRED_API_KEY 사용)
// 프로덕션: /api/fred Edge Function이 서버사이드 FRED_API_KEY로 처리
const IS_DEV = import.meta.env.DEV;
const API_KEY = import.meta.env.VITE_FRED_API_KEY as string;
const BASE_URL = IS_DEV ? '/dev-fred/fred/series/observations' : '/api/fred';

export interface FredObservation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: FredObservation[];
}

async function fetchSeries(seriesId: string, limit = 2): Promise<FredObservation[]> {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: API_KEY,
    file_type: 'json',
    limit: String(limit),
    sort_order: 'desc',
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`FRED API error: ${res.status}`);
  const data: FredResponse = await res.json();

  return data.observations.filter((o) => o.value !== '.');
}

export interface MacroSeriesResult {
  id: string;
  latest: FredObservation;
  previous: FredObservation | null;
}

// 병렬로 여러 시리즈 fetch
export async function fetchMacroIndicators(seriesIds: string[]): Promise<MacroSeriesResult[]> {
  const results = await Promise.all(
    seriesIds.map(async (id) => {
      const obs = await fetchSeries(id, 5); // 최신 5개 중 유효값 2개 확보
      const valid = obs.filter((o) => o.value !== '.' && o.value !== 'NA');
      return {
        id,
        latest: valid[0],
        previous: valid[1] ?? null,
      };
    }),
  );
  return results;
}
