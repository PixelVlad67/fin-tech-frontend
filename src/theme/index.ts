import { useAuthStore } from '../store/useAuthStore';

export const lightTheme = {
  colors: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    primaryLight: '#818cf8',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    inputBackground: '#ffffff',
  },
};

export const darkTheme = {
  colors: {
    primary: '#818cf8',
    primaryDark: '#6366f1',
    primaryLight: '#a5b4fc',
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
    background: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#334155',
    inputBackground: '#1e293b',
  },
};

export const commonTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 24, fontWeight: '700' as const },
    h2: { fontSize: 20, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 14, fontWeight: '400' as const },
    button: { fontSize: 16, fontWeight: '600' as const },
  },
};

export const theme = {
  ...commonTheme,
  colors: lightTheme.colors,
  isDark: false,
};

export type Theme = typeof theme;

export const useAppTheme = (): Theme => {
  const themeMode = useAuthStore((state) => state.themeMode);
  const currentColors = themeMode === 'dark' ? darkTheme.colors : lightTheme.colors;
  
  return {
    ...commonTheme,
    colors: currentColors,
    isDark: themeMode === 'dark',
  };
};
