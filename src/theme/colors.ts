import { useStore, BackgroundTheme } from '../store/useStore';

export const LIGHT_COLORS = {
  primary: '#7C6F9B',
  primaryLight: '#A89CC8',
  primaryDark: '#5D5178',
  primaryBg: '#F0ECF5',

  accent: '#E8A87C',
  accentLight: '#F5C4A6',
  accentDark: '#D4845A',
  accentLightBg: '#FEF6EE',

  background: '#FAFAFA',
  backgroundAlt: '#F3F1F6',
  card: '#FFFFFF',
  cardDark: '#2D2B36',

  text: '#2D2B36',
  textSecondary: '#6B6876',
  textTertiary: '#9B98A6',
  textLight: '#FFFFFF',

  happy: '#F5C547',
  calm: '#7CB9A8',
  anxious: '#E8A87C',
  sad: '#7C8CB5',
  angry: '#C97B7B',
  tired: '#A89CC8',
  lonely: '#8BA7C8',
  grateful: '#8BC98A',
  hopeful: '#D4A8D3',
  overwhelmed: '#A08B9B',

  success: '#6BCB77',
  warning: '#F5C547',
  error: '#E07A7A',
  errorLight: '#FCEAEA',
  divider: '#ECEAF0',

  chatUser: '#7C6F9B',
  chatBot: '#F0ECF5',
};

export const DARK_COLORS = {
  ...LIGHT_COLORS,
  background: '#121212',
  backgroundAlt: '#1E1E1E',
  card: '#242424',
  text: '#F0ECF5',
  textSecondary: '#A89CC8',
  textTertiary: '#6B6876',
  divider: '#333333',
  primaryBg: '#2A2536',
  chatBot: '#2A2536',
};

export const OCEAN_COLORS = {
  ...LIGHT_COLORS,
  primary: '#4A90A4',
  primaryLight: '#6BB3CC',
  primaryDark: '#2E6B7A',
  primaryBg: '#E8F4F8',
  background: '#F0F7F9',
  backgroundAlt: '#E3EDF2',
  card: '#FFFFFF',
  calm: '#4A90A4',
  calmLight: '#E8F4F8',
};

export const FOREST_COLORS = {
  ...LIGHT_COLORS,
  primary: '#5D8A5D',
  primaryLight: '#7CB97C',
  primaryDark: '#3D6B3D',
  primaryBg: '#ECF5EC',
  background: '#F5F9F5',
  backgroundAlt: '#E8F2E8',
  card: '#FFFFFF',
  calm: '#5D8A5D',
  calmLight: '#ECF5EC',
};

export const SUNSET_COLORS = {
  ...LIGHT_COLORS,
  primary: '#E8866B',
  primaryLight: '#F5A88C',
  primaryDark: '#D45A3D',
  primaryBg: '#FEF0ED',
  background: '#FDF9F8',
  backgroundAlt: '#FAF3F0',
  card: '#FFFFFF',
  anxious: '#E8866B',
  sad: '#9B7CB5',
};

export const LAVENDER_COLORS = {
  ...LIGHT_COLORS,
  primary: '#9B8CB8',
  primaryLight: '#B8A8D0',
  primaryDark: '#7C6B9B',
  primaryBg: '#F3EFF8',
  background: '#F8F6FA',
  backgroundAlt: '#F0ECF5',
  card: '#FFFFFF',
  hopeful: '#9B8CB8',
  calm: '#8BA7C8',
};

export function useThemeColors() {
  const isDark = useStore((s) => s.darkMode);
  const theme = useStore((s) => s.backgroundTheme);
  
  if (theme === 'ocean') return OCEAN_COLORS;
  if (theme === 'forest') return FOREST_COLORS;
  if (theme === 'sunset') return SUNSET_COLORS;
  if (theme === 'lavender') return LAVENDER_COLORS;
  
  return isDark ? DARK_COLORS : LIGHT_COLORS;
}

export const GRADIENTS = {
  primary: ['#7C6F9B', '#A89CC8'] as [string, string],
  primarySoft: ['#9B8CB8', '#B8A8D0'] as [string, string],
  warm: ['#E8A87C', '#F5C4A6'] as [string, string],
  warmSoft: ['#F5C4A6', '#FAD4BC'] as [string, string],
  cool: ['#7CB9A8', '#A8D8C8'] as [string, string],
  coolSoft: ['#A8D8C8', '#C4E8DC'] as [string, string],
  sunset: ['#E8A87C', '#D4A8D3'] as [string, string],
  night: ['#2D2B36', '#5D5178'] as [string, string],
  dawn: ['#F5E6E8', '#E8D4DC'] as [string, string],
  calm: ['#8BA7C8', '#A8C4E0'] as [string, string],
  ocean: ['#4A90A4', '#6BB3CC'] as [string, string],
  forest: ['#5D8A5D', '#7CB97C'] as [string, string],
  lavender: ['#9B8CB8', '#B8A8D0'] as [string, string],
} as const;

export const SHADOWS = {
  soft: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  medium: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 5 },
  strong: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 8 },
  glow: (color: string) => ({ shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }),
} as const;
