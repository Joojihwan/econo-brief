import { Card, CardContent, Typography, Skeleton } from '@mui/material';
import ArrowDropUpIcon   from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon        from '@mui/icons-material/Remove';
import type { FearGreedResult } from '../../hooks/useFearGreed';
import styles from './MacroWidget.module.scss';

const RATING_COLOR: Record<string, string> = {
  'Extreme Fear':  '#f87171',
  'Fear':          '#fb923c',
  'Neutral':       '#64748b',
  'Greed':         '#a3e635',
  'Extreme Greed': '#34d399',
};

interface Props { data: FearGreedResult }

export default function FearGreedCard({ data }: Props) {
  const color     = RATING_COLOR[data.rating] ?? '#64748b';
  const changeAbs = data.changeAbs;
  const signal    = changeAbs === null || Math.abs(changeAbs) < 1
    ? 'neutral'
    : changeAbs > 0 ? 'positive' : 'negative';

  const changeText = changeAbs !== null
    ? `${changeAbs > 0 ? '+' : ''}${changeAbs}`
    : null;

  const date = data.timestamp
    ? new Date(data.timestamp).toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
      }).replace(/\.\s?/g, '-').replace(/-$/, '')
    : '';

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
        {/* Label */}
        <div className={styles.cardLabel}>
          <Typography className={styles.labelText}>Fear & Greed</Typography>
          <span className={styles.signalDot} />
        </div>

        {/* Score */}
        <div className={styles.valueRow}>
          <Typography className={styles.valueNumber}>{data.score}</Typography>
          <span className={styles.valueUnit}>/ 100</span>
        </div>

        {/* Rating badge */}
        <span
          className={`${styles.changeBadge} ${styles[signal]}`}
          style={{ color, background: `${color}18`, border: 'none' }}
        >
          <ChangeIcon sx={{ fontSize: 14 }} />
          {data.ratingKr}
          {changeText && ` (${changeText})`}
        </span>

        {/* Date */}
        <div className={styles.cardMeta}>
          <Typography className={styles.cardDate}>{date}</Typography>
          <span className={styles.frequencyBadge}>일별</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function FearGreedCardSkeleton() {
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
