import { useQuery } from '@tanstack/react-query';
import { fetchMacroIndicators } from '../services/fredApi';

export type MacroCategory = 'macro' | 'sentiment' | 'fx';

export interface MacroIndicatorConfig {
  id: string;
  label: string;
  unit: string;
  description: string;
  frequency: string;
  category: MacroCategory;
  invertSignal?: boolean;
  isPercent?: boolean;
}

export const MACRO_SERIES: MacroIndicatorConfig[] = [
  // ── 매크로 지표 ──────────────────────────────────────────────────────────────
  { id: 'FEDFUNDS',   label: '기준금리',    unit: '%', description: '연방기금금리',       frequency: '월별', category: 'macro', isPercent: true },
  { id: 'DGS10',      label: '10년 국채',   unit: '%', description: '미국 10년 국채금리',  frequency: '일별', category: 'macro', isPercent: true },
  { id: 'CPIAUCSL',   label: 'CPI',        unit: '',  description: '소비자물가지수',      frequency: '월별', category: 'macro', invertSignal: true },
  { id: 'UNRATE',     label: '실업률',      unit: '%', description: '미국 실업률',         frequency: '월별', category: 'macro', isPercent: true, invertSignal: true },
  { id: 'SP500',      label: 'S&P 500',    unit: '',  description: 'S&P 500 지수',       frequency: '일별', category: 'macro' },
  { id: 'DCOILWTICO', label: 'WTI 원유',    unit: '$', description: 'WTI 원유 선물가격',   frequency: '일별', category: 'macro' },
  // ── 시장 심리 ────────────────────────────────────────────────────────────────
  { id: 'VIXCLS',     label: 'VIX',        unit: '',  description: 'CBOE 변동성지수',     frequency: '일별', category: 'sentiment', invertSignal: true },
  // ── 환율 ─────────────────────────────────────────────────────────────────────
  { id: 'DTWEXBGS',   label: '달러 인덱스',  unit: '',  description: '무역가중 달러 인덱스', frequency: '주별', category: 'fx' },
  { id: 'DEXKOUS',    label: '원 / 달러',   unit: '₩', description: '원화 대미달러 환율',   frequency: '일별', category: 'fx' },
  { id: 'DEXJPUS',    label: '엔 / 달러',   unit: '¥', description: '엔화 대미달러 환율',   frequency: '일별', category: 'fx' },
];

export interface MacroDataPoint {
  config: MacroIndicatorConfig;
  value: number;
  previousValue: number | null;
  changeAbs: number | null;
  changePct: number | null;
  date: string;
  signal: 'positive' | 'negative' | 'neutral';
}

function toSignal(
  changeAbs: number | null,
  invertSignal: boolean,
): 'positive' | 'negative' | 'neutral' {
  if (changeAbs === null || Math.abs(changeAbs) < 0.001) return 'neutral';
  const up = changeAbs > 0;
  return (up !== invertSignal) ? 'positive' : 'negative';
}

export function useMacro() {
  return useQuery({
    queryKey: ['macro'],
    queryFn: async (): Promise<MacroDataPoint[]> => {
      const ids = MACRO_SERIES.map((s) => s.id);
      const results = await fetchMacroIndicators(ids);

      return results.map((r, i) => {
        const config = MACRO_SERIES[i];
        const value = parseFloat(r.latest.value);
        const previousValue = r.previous ? parseFloat(r.previous.value) : null;
        const changeAbs = previousValue !== null ? value - previousValue : null;
        const changePct =
          previousValue !== null && previousValue !== 0
            ? (changeAbs! / previousValue) * 100
            : null;

        return {
          config,
          value,
          previousValue,
          changeAbs,
          changePct,
          date: r.latest.date,
          signal: toSignal(changeAbs, config.invertSignal ?? false),
        };
      });
    },
    staleTime: 1000 * 60 * 30, // 30분 캐시
  });
}
