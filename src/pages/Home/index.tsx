import { Typography } from '@mui/material';
import MacroWidget from '../../components/MacroWidget';
import styles from './Home.module.scss';

export default function Home() {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  return (
    <div className={styles.root}>
      <div className={styles.pageHeader}>
        <Typography className={styles.pageTitle}>경제 브리핑</Typography>
        <Typography className={styles.pageSubtitle}>{today}</Typography>
      </div>

      <MacroWidget />
    </div>
  );
}
