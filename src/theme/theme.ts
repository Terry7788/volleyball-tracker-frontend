import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#22c55e', // Clean green for Team 1
      light: '#4ade80',
      dark: '#16a34a',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ef4444', // Clean red for Team 2
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    background: {
      default: '#171717', // Very dark grey background
      paper: '#262626',   // Slightly lighter grey for cards
    },
    text: {
      primary: '#ffffff',   // Pure white text
      secondary: '#a1a1aa', // Light grey for secondary text
      disabled: '#525252',  // Darker grey for disabled text
    },
    divider: '#404040',
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    warning: {
      main: '#a1a1aa',
      light: '#d4d4d8',
      dark: '#71717a',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#6b7280',
      light: '#9ca3af',
      dark: '#4b5563',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 200,
      letterSpacing: '-0.025em',
      color: '#ffffff',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 300,
      letterSpacing: '-0.02em',
      color: '#ffffff',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
      color: '#ffffff',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 400,
      color: '#ffffff',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 400,
      color: '#ffffff',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#ffffff',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#a1a1aa',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: '#71717a',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#171717',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#262626',
          backgroundImage: 'none',
          boxShadow: 'none',
          border: '1px solid #404040',
          '&.MuiCard-elevation0': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
          padding: '12px 24px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
          '&:disabled': {
            backgroundColor: '#404040',
            color: '#525252',
          },
        },
        outlined: {
          borderColor: '#525252',
          color: '#ffffff',
          backgroundColor: 'transparent',
          '&:hover': {
            borderColor: '#71717a',
            backgroundColor: '#262626',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#404040',
          color: '#ffffff',
          border: 'none',
          fontSize: '0.75rem',
          fontWeight: 500,
        },
        outlined: {
          borderColor: '#525252',
          backgroundColor: 'transparent',
          color: '#a1a1aa',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#404040',
          color: '#ffffff',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#262626',
            '& fieldset': {
              borderColor: '#525252',
            },
            '&:hover fieldset': {
              borderColor: '#71717a',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff',
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#a1a1aa',
            '&.Mui-focused': {
              color: '#ffffff',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#262626',
          backgroundImage: 'none',
          border: '1px solid #404040',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            color: '#71717a',
            fontWeight: 400,
            textTransform: 'none',
            '&.Mui-selected': {
              color: '#ffffff',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#ffffff',
            height: 1,
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#e5e5e5',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#404040',
          opacity: 1,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body2': {
            color: '#a1a1aa',
          },
        },
      },
    },
  },
});

// Add custom color declarations for TypeScript
declare module '@mui/material/styles' {
  interface Palette {
    surface: Palette['primary'];
  }

  interface PaletteOptions {
    surface?: PaletteOptions['primary'];
  }
}