import React, { createContext, useContext } from 'react';
import { useStore, BackgroundTheme } from '../store/useStore';
import { getTheme, ThemeConfig } from '../theme/backgrounds';

const ThemeContext = createContext<ThemeConfig>(null as any);

export function useAppTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const backgroundTheme = useStore((state) => state.backgroundTheme);
  const customBackgroundColor = useStore((state) => state.customBackgroundColor);
  const theme = getTheme(backgroundTheme, customBackgroundColor);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const themeOptions: { key: BackgroundTheme; name: string; colors: string[] }[] = [
  { key: 'default', name: 'Padrão', colors: ['#F5F5F5', '#7C6F9B'] },
  { key: 'dark', name: 'Escuro', colors: ['#1A1A1A', '#A89CC8'] },
  { key: 'ocean', name: 'Oceano', colors: ['#E8F4F8', '#2A7A8A'] },
  { key: 'forest', name: 'Floresta', colors: ['#E8F5E8', '#3A8A3A'] },
  { key: 'sunset', name: 'Pôr do Sol', colors: ['#FDF0E8', '#D47050'] },
  { key: 'lavender', name: 'Lavanda', colors: ['#F5F0FA', '#8A6AA8'] },
  { key: 'custom', name: 'Personalizado', colors: ['#FFFFFF', '#7C6F9B'] },
];