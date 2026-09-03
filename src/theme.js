import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:        '#B89ADC',
      light:       '#D6C1E8',
      dark:        '#967BBF',
      contrastText: '#2E1065',
    },
    secondary: {
      main:        '#581C87',
      contrastText: '#FAF5FF',
    },
    background: {
      default: '#FAF5FF',
      paper:   '#FFFFFF',
    },
    text: {
      primary:   '#2E1065',
      secondary: '#581C87',
      disabled:  '#A855F7',
    },
    divider: '#E9D5FF',
    error: {
      main: '#EF4444',
    },
    success: {
      main: '#22C55E',
    },
    warning: {
      main: '#F59E0B',
    },
    grey: {
      900: '#FFFFFF',
      800: '#E9D5FF',
      700: '#D8B4FE',
      600: '#A855F7',
      500: '#7E22CE',
      400: '#581C87',
      300: '#D4D4D8',
      200: '#E4E4E7',
      100: '#F4F4F5',
    },
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 },
    h3: { fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2 },
    h4: { fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.3 },
    h5: { fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.4 },
    h6: { fontWeight: 600, letterSpacing: '-0.005em', lineHeight: 1.4 },
    subtitle1: { fontWeight: 500, letterSpacing: '-0.01em' },
    subtitle2: { fontWeight: 500, letterSpacing: '0em', color: '#581C87' },
    body1: { lineHeight: 1.65 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.6, color: '#581C87' },
    caption: { fontSize: '0.75rem', color: '#7E22CE', letterSpacing: '0.02em' },
    button: { fontWeight: 600, letterSpacing: '0.01em', textTransform: 'none' },
    overline: { fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.6875rem' },
  },

  shape: {
    borderRadius: 8,
  },

  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.4)',
    '0 2px 6px rgba(0,0,0,0.45)',
    '0 4px 12px rgba(0,0,0,0.5)',
    '0 8px 24px rgba(0,0,0,0.55)',
    '0 16px 48px rgba(0,0,0,0.6)',
    ...Array(19).fill('none'),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FAF5FF',
          color: '#2E1065',
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          transition: 'all 150ms cubic-bezier(0.4,0,0.2,1)',
          fontSize: '0.8125rem',
          padding: '8px 16px',
          letterSpacing: '0.01em',
        },
        contained: {
          backgroundColor: '#B89ADC',
          color: '#2E1065',
          '&:hover': {
            backgroundColor: '#967BBF',
            boxShadow: '0 0 0 3px rgba(184, 154, 220,0.2)',
          },
        },
        outlined: {
          borderColor: '#D8B4FE',
          color: '#2E1065',
          '&:hover': {
            borderColor: '#B89ADC',
            backgroundColor: 'rgba(184, 154, 220,0.08)',
          },
        },
        text: {
          color: '#581C87',
          '&:hover': {
            backgroundColor: '#E9D5FF',
            color: '#2E1065',
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            '& fieldset': { borderColor: '#E9D5FF' },
            '&:hover fieldset': { borderColor: '#A855F7' },
            '&.Mui-focused fieldset': { borderColor: '#B89ADC', borderWidth: '1px' },
          },
          '& .MuiInputLabel-root': { color: '#7E22CE' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#B89ADC' },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& fieldset': { borderColor: '#E9D5FF' },
          '&:hover fieldset': { borderColor: '#A855F7' },
          '&.Mui-focused fieldset': { borderColor: '#B89ADC', borderWidth: '1px' },
        },
        input: {
          '&::placeholder': { color: '#A855F7' },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9D5FF',
          borderRadius: 12,
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#D8B4FE',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 24,
        },
        outlined: {
          borderColor: '#D8B4FE',
          '&:hover': { borderColor: '#B89ADC', backgroundColor: 'rgba(184, 154, 220,0.08)' },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.875rem',
          textTransform: 'none',
          letterSpacing: '-0.01em',
          color: '#7E22CE',
          minHeight: 44,
          '&.Mui-selected': { color: '#2E1065', fontWeight: 600 },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#B89ADC', height: 2 },
        root: { borderBottom: '1px solid #E9D5FF' },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: '#E9D5FF' } },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          backgroundImage: 'none',
          border: '1px solid #E9D5FF',
          borderRadius: 12,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid #E9D5FF' },
        head: { fontWeight: 600, color: '#581C87', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: '#E9D5FF', height: 6 },
        bar: { borderRadius: 4, backgroundColor: '#B89ADC' },
      },
    },

    MuiRating: {
      styleOverrides: {
        iconFilled: { color: '#F59E0B' },
        iconEmpty: { color: '#D8B4FE' },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: 'none',
          border: '1px solid #E9D5FF',
          borderRadius: '8px !important',
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: 0 },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: { minHeight: 48, '&.Mui-expanded': { minHeight: 48 } },
        content: { fontWeight: 500, fontSize: '0.875rem' },
      },
    },

    MuiSlider: {
      styleOverrides: {
        root: { color: '#B89ADC' },
        track: { height: 3 },
        rail: { height: 3, backgroundColor: '#D8B4FE' },
        thumb: {
          width: 16,
          height: 16,
          '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 6px rgba(184, 154, 220,0.2)' },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#E9D5FF',
          border: '1px solid #D8B4FE',
          fontSize: '0.75rem',
          borderRadius: 6,
          color: '#2E1065',
        },
        arrow: { color: '#E9D5FF' },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, border: '1px solid' },
      },
    },

    MuiSnackbar: {
      defaultProps: { anchorOrigin: { vertical: 'bottom', horizontal: 'right' } },
    },
  },
});

export default theme;
