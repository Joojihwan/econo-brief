import { Typography, Grid, Box } from '@mui/material';
import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.root}>
      <Box mb={3}>
        <Typography variant="h4">경제 브리핑</Typography>
        <Typography variant="body2" color="text.secondary">
          산업 동향 및 매크로 경제 요약
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 매크로 지표 위젯 영역 */}
        <Grid size={12}>
          <Box className={styles.section}>
            <Typography variant="h6" gutterBottom>매크로 지표</Typography>
            {/* TODO: MacroWidget 컴포넌트 */}
          </Box>
        </Grid>

        {/* 산업 동향 카드 영역 */}
        <Grid size={12}>
          <Typography variant="h6" gutterBottom>산업 동향</Typography>
          {/* TODO: BriefCard 컴포넌트 */}
        </Grid>
      </Grid>
    </div>
  );
}
