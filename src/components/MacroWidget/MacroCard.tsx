import { Card, CardContent, Typography, Skeleton } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';
import type { MacroDataPoint } from '../../hooks/useMacro';
import styles from './MacroWidget.module.scss';

const SIGNAL_COLOR = {
  positive: '#34d399',
  negative: '#f87171',
  neutral:  '#64748b',
};

interface MacroCardProps {
  data: MacroDataPoint;
}

export default function MacroCard({ data }: MacroCardProps) {
  const { config, value, changeAbs, changePct, date, signal } = data;
  const color = SIGNAL_COLOR[signal];

  const formatValue = (v: number) => {
    if (config.unit === '$') return v.toFixed(2);
    if (config.unit === '₩') return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (config.unit === '¥') return v.toFixed(2);
    if (config.isPercent)    return v.toFixed(2);
    if (v >= 1000)           return v.toLocaleString('en-US', { maximumFractionDigits: 1 });
    return v.toFixed(2);
  };

  const changeText = (() => {
    if (changeAbs === null) return null;
    const sign   = changeAbs > 0 ? '+' : '';
    const absStr = Math.abs(changeAbs) >= 100
      ? Math.abs(changeAbs).toFixed(1)
      : Math.abs(changeAbs).toFixed(2);
    const pct    = changePct !== null ? ` (${sign}${changePct.toFixed(2)}%)` : '';
    return `${sign}${absStr}${pct}`;
  })();

  const ChangeIcon = signal === 'positive'
    ? ArrowDropUpIcon
    : signal === 'negative'
    ? ArrowDropDownIcon
    : RemoveIcon;

  return (
    <Card
      className={styles.card}
      style={{ ['--signal-color' as string]: color }}
    >
      <CardContent className={styles.cardContent}>
        {/* Label row */}
        <div className={styles.cardLabel}>
          <Typography className={styles.labelText}>{config.label}</Typography>
          <span className={styles.signalDot} />
        </div>

        {/* Value */}
        <div className={styles.valueRow}>
          {config.unit === '$' && <span className={styles.valueUnit}>$</span>}
          <Typography className={styles.valueNumber}>
            {formatValue(value)}
          </Typography>
          {config.unit !== '$' && config.unit && (
            <span className={styles.valueUnit}>{config.unit}</span>
          )}
        </div>

        {/* Change badge */}
        {changeText && (
          <span className={`${styles.changeBadge} ${styles[signal]}`}>
            <ChangeIcon sx={{ fontSize: 14 }} />
            {changeText}
          </span>
        )}

        {/* Date + Frequency */}
        <div className={styles.cardMeta}>
          <Typography className={styles.cardDate}>{date}</Typography>
          <span className={styles.frequencyBadge}>{config.frequency}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function MacroCardSkeleton() {
  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <Skeleton variant="text" width="55%" height={14} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="70%" height={32} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="50%" height={22} />
        <Skeleton variant="text" width="40%" height={12} sx={{ mt: 0.5 }} />
      </CardContent>
    </Card>
  );
}
