import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

export type ThemeColor = '#4285F4' | '#34A853' | '#FBBC05' | '#EA4335';

export interface ThemeContextType {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
  primaryColor: ThemeColor;
  setPrimaryColor: (color: ThemeColor) => void;
}

const defaultPrimary: ThemeColor = '#4285F4';

const getTheme = (mode: 'light' | 'dark', primary: ThemeColor) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: primary,
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#FBBC05',
        contrastText: '#000000',
      },
      success: {
        main: '#34A853',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#FBBC05',
        contrastText: '#000000',
      },
      error: {
        main: '#EA4335',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'dark' ? '#000000' : '#ffffff',
        paper: mode === 'dark' ? '#111111' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#000000',
        secondary: mode === 'dark' ? '#cccccc' : '#222222',
      },
    },
    typography: {
      fontFamily: 'Poppins, Inter, Roboto, Helvetica, Arial, sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
  });

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  setMode: () => {},
  primaryColor: defaultPrimary,
  setPrimaryColor: () => {},
});

const getInitialMode = () => {
  const stored = localStorage.getItem('themeMode');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProviderWithContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<'light' | 'dark'>(getInitialMode());
  const [primary, setPrimary] = useState<ThemeColor>(defaultPrimary);

  const setMode = (newMode: 'light' | 'dark') => {
    setModeState(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const setPrimaryColor = (c: ThemeColor) => setPrimary(c);

  const theme = useMemo(() => getTheme(mode, primary), [mode, primary]);
  return (
    <ThemeContext.Provider value={{ mode, setMode, primaryColor: primary, setPrimaryColor }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext); 