import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArticleIcon from '@mui/icons-material/Article';

const NAV_TABS = [
  { label: '경제 브리핑', path: '/', icon: <BarChartIcon fontSize="small" /> },
  { label: '주식 뉴스', path: '/stock-news', icon: <ArticleIcon fontSize="small" /> },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentTab = NAV_TABS.findIndex((t) => t.path === pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px', mr: 4 }}>
            econo-brief
          </Typography>
          <Tabs
            value={currentTab === -1 ? 0 : currentTab}
            onChange={(_, idx) => navigate(NAV_TABS[idx].path)}
            textColor="inherit"
            TabIndicatorProps={{ style: { backgroundColor: '#fff' } }}
          >
            {NAV_TABS.map((tab) => (
              <Tab key={tab.path} label={tab.label} icon={tab.icon} iconPosition="start" />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
