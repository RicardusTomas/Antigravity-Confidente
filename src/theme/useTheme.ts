import { useStore, BackgroundTheme } from '../store/useStore';
import { getTheme, ThemeConfig } from './backgrounds';

export function useTheme(): ThemeConfig {
  const backgroundTheme = useStore((state) => state.backgroundTheme);
  const customBackgroundColor = useStore((state) => state.customBackgroundColor);
  return getTheme(backgroundTheme, customBackgroundColor);
}

export const colorPickerOptions = [
  { name: 'Branco', color: '#FFFFFF' },
  { name: 'Cinza claro', color: '#F5F5F5' },
  { name: 'Rosa claro', color: '#FFE4E8' },
  { name: 'Azul claro', color: '#E4F0FF' },
  { name: 'Verde claro', color: '#E4FFE8' },
  { name: 'Amarelo claro', color: '#FFFDE4' },
  { name: 'Laranja', color: '#FFEFEA' },
  { name: 'Roxo claro', color: '#F0E4FF' },
  { name: 'Azul turquesa', color: '#E4FFFF' },
  { name: 'Verde menta', color: '#E4FFF0' },
  { name: 'Bege', color: '#F5F0E8' },
  { name: 'Azul escuro', color: '#1A3A5A' },
  { name: 'Verde escuro', color: '#1A3A2A' },
  { name: 'Roxo escuro', color: '#3A2A4A' },
  { name: 'Preto', color: '#1A1A1A' },
];

export const backgroundThumbnails: { key: BackgroundTheme; gradient: string[] }[] = [
  { key: 'default', gradient: ['#F5F5F5', '#E8E8E8'] },
  { key: 'dark', gradient: ['#2D2D2D', '#1A1A1A'] },
  { key: 'ocean', gradient: ['#D0E8EC', '#A8D8E4'] },
  { key: 'forest', gradient: ['#D0E8D0', '#A8D4A8'] },
  { key: 'sunset', gradient: ['#F0D0C0', '#E8A890'] },
  { key: 'lavender', gradient: ['#E8E0F0', '#D0C8E0'] },
  { key: 'custom', gradient: ['#FFFFFF', '#CCCCCC'] },
];