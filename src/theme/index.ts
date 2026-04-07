import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: palette.primary,
    secondary: palette.secondary,
    background: {
      default: palette.background.default,
      paper: palette.background.surface,
    },
    divider: 'rgba(255, 255, 255, 0.07)',
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
      disabled: '#475569',
    },
  },
  typography: {
    fontFamily: [
      'Pretendard',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
    ].join(','),
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700, letterSpacing: '-0.3px' },
    h6: { fontWeight: 600 },
    body2: { lineHeight: 1.6 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(8, 12, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#141d2e',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.72rem' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: 'rgba(255,255,255,0.06)' },
      },
    },
  },
});

export default theme;
