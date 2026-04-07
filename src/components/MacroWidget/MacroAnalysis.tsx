import { Typography } from '@mui/material';
import type { MacroDataPoint } from '../../hooks/useMacro';
import styles from './MacroWidget.module.scss';

interface Signal {
  label: string;
  color: string;
  text: string;
}

const C = {
  warn:    '#fbbf24',
  danger:  '#f87171',
  success: '#34d399',
  info:    '#60a5fa',
  neutral: '#94a3b8',
};

function analyzeIndicators(data: MacroDataPoint[]): Signal[] {
  const signals: Signal[] = [];
  const get = (id: string) => data.find((d) => d.config.id === id);

  const fedfunds = get('FEDFUNDS');
  const cpi      = get('CPIAUCSL');
  const unrate   = get('UNRATE');
  const dgs10    = get('DGS10');
  const vix      = get('VIXCLS');
  const sp500    = get('SP500');

  if (fedfunds) {
    if (fedfunds.value >= 5.0)
      signals.push({ label: '긴축 국면', color: C.warn,
        text: `기준금리 ${fedfunds.value.toFixed(2)}%로 고금리 환경 지속 — 차입 비용 상승, 성장주 밸류에이션 압박.` });
    else if (fedfunds.value <= 2.0)
      signals.push({ label: '완화 국면', color: C.success,
        text: `기준금리 ${fedfunds.value.toFixed(2)}%로 저금리 환경 — 유동성 확대, 위험자산 선호 심리 지지.` });

    if (fedfunds.changeAbs && fedfunds.changeAbs < -0.01)
      signals.push({ label: '금리 인하', color: C.success,
        text: `전월 대비 ${Math.abs(fedfunds.changeAbs).toFixed(2)}%p 인하 — 통화 완화 사이클 진입 신호.` });
    else if (fedfunds.changeAbs && fedfunds.changeAbs > 0.01)
      signals.push({ label: '금리 인상', color: C.warn,
        text: `전월 대비 ${fedfunds.changeAbs.toFixed(2)}%p 인상 — 인플레 대응 긴축 지속.` });
  }

  if (fedfunds && dgs10) {
    const spread = dgs10.value - fedfunds.value;
    if (spread < 0)
      signals.push({ label: '수익률 역전', color: C.danger,
        text: `10년 국채(${dgs10.value.toFixed(2)}%) < 기준금리(${fedfunds.value.toFixed(2)}%) — 장단기 스프레드 역전, 경기 침체 선행 지표.` });
    else if (spread > 1.5)
      signals.push({ label: '스프레드 확대', color: C.info,
        text: `장단기 스프레드 +${spread.toFixed(2)}%p — 경기 확장 기대 반영.` });
  }

  if (cpi?.changeAbs !== null && cpi) {
    const mom = cpi.changeAbs!;
    if (mom > 0.5)
      signals.push({ label: '물가 상승', color: C.warn,
        text: `CPI 전월 대비 +${mom.toFixed(2)}pt — 인플레이션 압력 지속.` });
    else if (mom < -0.1)
      signals.push({ label: '물가 둔화', color: C.success,
        text: `CPI 전월 대비 ${mom.toFixed(2)}pt — 디스인플레이션 진행 중.` });
  }

  if (unrate) {
    if (unrate.value >= 5.0)
      signals.push({ label: '고용 약화', color: C.warn,
        text: `실업률 ${unrate.value.toFixed(1)}% — 노동시장 냉각, 소비 둔화 가능성.` });
    else if (unrate.value <= 4.0)
      signals.push({ label: '완전고용', color: C.success,
        text: `실업률 ${unrate.value.toFixed(1)}% — 타이트한 노동시장, 소비 지탱 요인.` });
    if (unrate.changeAbs && unrate.changeAbs > 0.2)
      signals.push({ label: '실업률 급등', color: C.danger,
        text: `전월 대비 +${unrate.changeAbs.toFixed(1)}%p 상승 — 경기 하강 초기 신호.` });
  }

  if (vix) {
    if (vix.value >= 30)
      signals.push({ label: '시장 공포', color: C.danger,
        text: `VIX ${vix.value.toFixed(1)} — 극도의 변동성 구간, 리스크 관리 우선.` });
    else if (vix.value >= 20)
      signals.push({ label: '변동성 확대', color: C.warn,
        text: `VIX ${vix.value.toFixed(1)} — 시장 불안 고조, 방어적 포지션 고려.` });
    else if (vix.value < 15)
      signals.push({ label: '시장 안정', color: C.success,
        text: `VIX ${vix.value.toFixed(1)} — 낮은 변동성, 시장 안도감 우세.` });
  }

  if (sp500?.changePct !== null && sp500) {
    if (sp500.changePct! <= -2)
      signals.push({ label: 'S&P 하락', color: C.danger,
        text: `S&P 500 전일 대비 ${sp500.changePct!.toFixed(2)}% 하락 — 위험회피 심리 확산.` });
    else if (sp500.changePct! >= 1.5)
      signals.push({ label: 'S&P 강세', color: C.success,
        text: `S&P 500 전일 대비 +${sp500.changePct!.toFixed(2)}% 상승 — 위험선호 심리 개선.` });
  }

  return signals;
}

interface MacroAnalysisProps {
  data: MacroDataPoint[];
}

export default function MacroAnalysis({ data }: MacroAnalysisProps) {
  const signals = analyzeIndicators(data);
  if (signals.length === 0) return null;

  return (
    <div className={styles.analysisSection}>
      <div className={styles.analysisHeader}>
        <Typography className={styles.analysisTitle}>시그널 분석</Typography>
      </div>

      <div className={styles.signalList}>
        {signals.map((s, i) => (
          <div
            key={i}
            className={styles.signalItem}
            style={{ ['--signal-color' as string]: s.color }}
          >
            <div className={styles.signalIndicator} />
            <div className={styles.signalBody}>
              <Typography className={styles.signalLabel}>{s.label}</Typography>
              <Typography className={styles.signalText}>{s.text}</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
