import { useQuery } from '@tanstack/react-query';
import { fetchMacroIndicators } from '../services/fredApi';

export interface MacroIndicatorConfig {
  id: string;           // FRED series ID
  label: string;        // 표시 이름
  unit: string;         // 단위 표시
  description: string;  // 간단 설명
  invertSignal?: boolean; // true이면 값 상승이 부정적 신호 (e.g. 실업률, VIX)
  isPercent?: boolean;
}

export const MACRO_SERIES: MacroIndicatorConfig[] = [
  { id: 'FEDFUNDS',      label: '기준금리',      unit: '%',  description: '연방기금금리 (월)',          isPercent: true },
  { id: 'DGS10',         label: '10년 국채',      unit: '%',  description: '미국 10년 국채금리 (일)',    isPercent: true },
  { id: 'CPIAUCSL',      label: 'CPI',           unit: '',   description: '소비자물가지수 (월)',         invertSignal: true },
  { id: 'UNRATE',        label: '실업률',         unit: '%',  description: '미국 실업률 (월)',            isPercent: true, invertSignal: true },
  { id: 'SP500',         label: 'S&P 500',       unit: '',   description: 'S&P 500 지수 (일)' },
  { id: 'VIXCLS',        label: 'VIX',           unit: '',   description: 'CBOE 변동성지수 (일)',        invertSignal: true },
  { id: 'DCOILWTICO',    label: 'WTI 원유',       unit: '$',  description: 'WTI 원유 선물가격 (일)' },
  { id: 'DTWEXBGS',      label: '달러 인덱스',    unit: '',   description: '무역가중 달러 인덱스 (일)' },
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
