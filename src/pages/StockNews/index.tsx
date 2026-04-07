import { Typography, Grid, Box } from '@mui/material';
import styles from './StockNews.module.scss';

export default function StockNews() {
  return (
    <div className={styles.root}>
      <Box mb={3}>
        <Typography variant="h4">주식 뉴스</Typography>
        <Typography variant="body2" color="text.secondary">
          주식투자 관련 뉴스 요약 및 통계
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={12}>
          {/* TODO: BriefCard 목록 */}
        </Grid>
      </Grid>
    </div>
  );
}
