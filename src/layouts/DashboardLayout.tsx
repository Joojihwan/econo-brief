import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import styles from './DashboardLayout.module.scss';

const NAV_TABS = [
  { label: '경제 브리핑', path: '/' },
  { label: '주식 뉴스', path: '/stock-news' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar className={styles.toolbar}>
          {/* Logo */}
          <Box className={styles.logo} onClick={() => navigate('/')}>
            <ShowChartIcon sx={{ fontSize: 18, color: '#60a5fa' }} />
            <Typography variant="subtitle1" fontWeight={700} letterSpacing="-0.3px">
              econo<span className={styles.logoAccent}>brief</span>
            </Typography>
          </Box>

          {/* Nav */}
          <nav className={styles.nav}>
            {NAV_TABS.map((tab) => {
              const active = pathname === tab.path;
              return (
                <button
                  key={tab.path}
                  className={`${styles.navBtn} ${active ? styles.navBtnActive : ''}`}
                  onClick={() => navigate(tab.path)}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right: date */}
          <Typography variant="caption" sx={{ color: 'text.disabled', ml: 'auto' }}>
            {new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
