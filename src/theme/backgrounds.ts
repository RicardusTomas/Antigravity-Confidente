import { BackgroundTheme } from '../store/useStore';

export interface ThemeConfig {
  name: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  textSecondaryColor: string;
  primaryColor: string;
  primaryBgColor: string;
}

export const backgroundThemes: Record<BackgroundTheme, ThemeConfig> = {
  default: {
    name: 'Padrão',
    backgroundColor: '#F5F5F5',
    cardColor: '#FFFFFF',
    textColor: '#1A1A1A',
    textSecondaryColor: '#666666',
    primaryColor: '#7C6F9B',
    primaryBgColor: '#F0EDF5',
  },
  dark: {
    name: 'Escuro',
    backgroundColor: '#1A1A1A',
    cardColor: '#2D2D2D',
    textColor: '#FFFFFF',
    textSecondaryColor: '#AAAAAA',
    primaryColor: '#A89CC8',
    primaryBgColor: '#3D3D3D',
  },
  ocean: {
    name: 'Oceano',
    backgroundColor: '#E8F4F8',
    cardColor: '#FFFFFF',
    textColor: '#1A3A4A',
    textSecondaryColor: '#5A7A8A',
    primaryColor: '#2A7A8A',
    primaryBgColor: '#D0E8EC',
  },
  forest: {
    name: 'Floresta',
    backgroundColor: '#E8F5E8',
    cardColor: '#FFFFFF',
    textColor: '#1A3A1A',
    textSecondaryColor: '#5A7A5A',
    primaryColor: '#3A8A3A',
    primaryBgColor: '#D0E8D0',
  },
  sunset: {
    name: 'Pôr do Sol',
    backgroundColor: '#FDF0E8',
    cardColor: '#FFFFFF',
    textColor: '#4A301A',
    textSecondaryColor: '#8A6A5A',
    primaryColor: '#D47050',
    primaryBgColor: '#F0D0C0',
  },
  lavender: {
    name: 'Lavanda',
    backgroundColor: '#F5F0FA',
    cardColor: '#FFFFFF',
    textColor: '#3A2A4A',
    textSecondaryColor: '#7A6A8A',
    primaryColor: '#8A6AA8',
    primaryBgColor: '#E8E0F0',
  },
  custom: {
    name: 'Personalizado',
    backgroundColor: '#F5F5F5',
    cardColor: '#FFFFFF',
    textColor: '#1A1A1A',
    textSecondaryColor: '#666666',
    primaryColor: '#7C6F9B',
    primaryBgColor: '#F0EDF5',
  },
};

export function getTheme(theme: BackgroundTheme, customColor?: string): ThemeConfig {
  if (theme === 'custom' && customColor) {
    return {
      ...backgroundThemes.custom,
      backgroundColor: customColor,
    };
  }
  return backgroundThemes[theme];
}