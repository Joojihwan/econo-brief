export interface FredObservation {
  date: string;
  value: string;
}

export interface MacroSeriesResult {
  id: string;
  latest: FredObservation;
  previous: FredObservation | null;
}

function parseObs(raw: { observations?: FredObservation[] }): FredObservation[] {
  return (raw.observations ?? []).filter(
    (o) => o.value !== '.' && o.value !== 'NA',
  );
}

// ── 프로덕션: 단일 배치 요청 → /api/fred (Node.js 서버리스) ─────────────────
async function fetchBatched(seriesIds: string[]): Promise<MacroSeriesResult[]> {
  const params = new URLSearchParams({
    series_ids: seriesIds.join(','),
    limit:      '5',
    sort_order: 'desc',
  });
  const res = await fetch(`/api/fred?${params}`);
  if (!res.ok) throw new Error(`API ${res.status}`);

  const arr: { observations?: FredObservation[] }[] = await res.json();
  return arr.map((data, i) => {
    const valid = parseObs(data);
    return { id: seriesIds[i], latest: valid[0], previous: valid[1] ?? null };
  });
}

// ── 로컬 dev: Vite 프록시 → FRED 직접 (CORS 우회) ───────────────────────────
async function fetchDev(seriesId: string): Promise<FredObservation[]> {
  const params = new URLSearchParams({
    series_id:  seriesId,
    api_key:    import.meta.env.VITE_FRED_API_KEY as string,
    file_type:  'json',
    limit:      '5',
    sort_order: 'desc',
  });
  const res = await fetch(`/dev-fred/fred/series/observations?${params}`);
  if (!res.ok) throw new Error(`FRED ${res.status}`);
  const data: { observations: FredObservation[] } = await res.json();
  return parseObs(data);
}

// ── 공개 API ─────────────────────────────────────────────────────────────────
export async function fetchMacroIndicators(
  seriesIds: string[],
): Promise<MacroSeriesResult[]> {
  if (import.meta.env.DEV) {
    const all = await Promise.all(
      seriesIds.map(async (id) => {
        const obs = await fetchDev(id);
        return { id, latest: obs[0], previous: obs[1] ?? null };
      }),
    );
    return all;
  }
  return fetchBatched(seriesIds);
}
