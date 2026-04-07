import { Typography, Alert, Box } from '@mui/material';
import { useMacro }      from '../../hooks/useMacro';
import { useFearGreed }  from '../../hooks/useFearGreed';
import MacroCard, { MacroCardSkeleton }         from './MacroCard';
import FearGreedCard, { FearGreedCardSkeleton } from './FearGreedCard';
import MacroAnalysis     from './MacroAnalysis';
import styles from './MacroWidget.module.scss';

function SectionHeader({ title }: { title: string }) {
  return (
    <Typography className={styles.sectionTitle}>{title}</Typography>
  );
}

export default function MacroWidget() {
  const { data, isLoading, isError, dataUpdatedAt } = useMacro();
  const { data: fgData, isLoading: fgLoading, isError: fgError } = useFearGreed();

  const updatedTime = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : null;

  const macroData     = data?.filter((d) => d.config.category === 'macro')     ?? [];
  const sentimentData = data?.filter((d) => d.config.category === 'sentiment') ?? [];
  const fxData        = data?.filter((d) => d.config.category === 'fx')        ?? [];

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

      {/* 매크로 지표 */}
      <div className={styles.grid}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <MacroCardSkeleton key={i} />)
          : macroData.map((d) => <MacroCard key={d.config.id} data={d} />)}
      </div>

      {/* 시장 심리 */}
      <div className={styles.section}>
        <SectionHeader title="시장 심리" />
        <div className={styles.gridSm}>
          {isLoading || fgLoading
            ? Array.from({ length: 2 }).map((_, i) => <MacroCardSkeleton key={i} />)
            : (
              <>
                {sentimentData.map((d) => <MacroCard key={d.config.id} data={d} />)}
                {fgError
                  ? null
                  : fgData
                    ? <FearGreedCard data={fgData} />
                    : <FearGreedCardSkeleton />}
              </>
            )}
        </div>
      </div>

      {/* 환율 */}
      <div className={styles.section}>
        <SectionHeader title="환율" />
        <div className={styles.gridSm}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <MacroCardSkeleton key={i} />)
            : fxData.map((d) => <MacroCard key={d.config.id} data={d} />)}
        </div>
      </div>

      {/* Analysis */}
      {data && <MacroAnalysis data={data} />}
    </div>
  );
}
