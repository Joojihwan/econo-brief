import { Typography, Alert, Box } from '@mui/material';
import { useMacro } from '../../hooks/useMacro';
import MacroCard, { MacroCardSkeleton } from './MacroCard';
import MacroAnalysis from './MacroAnalysis';
import styles from './MacroWidget.module.scss';

export default function MacroWidget() {
  const { data, isLoading, isError, dataUpdatedAt } = useMacro();

  const updatedTime = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          매크로 지표
        </Typography>
        {updatedTime && (
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {updatedTime} 기준 · FRED
          </Typography>
        )}
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 2, fontSize: '0.8rem' }}>
          FRED API 호출 실패. 잠시 후 다시 시도해주세요.
        </Alert>
      )}

      {/* Grid */}
      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <MacroCardSkeleton key={i} />)
          : data?.map((d) => <MacroCard key={d.config.id} data={d} />)}
      </div>

      {/* Analysis */}
      {data && <MacroAnalysis data={data} />}
    </div>
  );
}
