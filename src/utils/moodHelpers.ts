import { Mood } from '../types';
import { LIGHT_COLORS } from '../theme/colors';

export interface MoodInfo {
  key: Mood;
  emoji: string;
  label: string;
  color: string;
  message: string;
}

export const MOODS: MoodInfo[] = [
  { key: 'happy', emoji: '😊', label: 'Feliz', color: LIGHT_COLORS.happy, message: 'Que bom!' },
  { key: 'calm', emoji: '😌', label: 'Calmo', color: LIGHT_COLORS.calm, message: 'Aproveite.' },
  { key: 'grateful', emoji: '🙏', label: 'Grato', color: LIGHT_COLORS.grateful, message: 'Lindo!' },
  { key: 'hopeful', emoji: '🌟', label: 'Esperançoso', color: LIGHT_COLORS.hopeful, message: 'Força!' },
  { key: 'anxious', emoji: '😰', label: 'Ansioso', color: LIGHT_COLORS.anxious, message: 'Respire.' },
  { key: 'sad', emoji: '😢', label: 'Triste', color: LIGHT_COLORS.sad, message: 'Estou aqui.' },
  { key: 'angry', emoji: '😤', label: 'Irritado', color: LIGHT_COLORS.angry, message: 'Válido.' },
  { key: 'tired', emoji: '😴', label: 'Cansado', color: LIGHT_COLORS.tired, message: 'Descanse.' },
  { key: 'lonely', emoji: '🥺', label: 'Solitário', color: LIGHT_COLORS.lonely, message: 'Não está só.' },
  { key: 'overwhelmed', emoji: '😵', label: 'Sobrecarregado', color: LIGHT_COLORS.overwhelmed, message: 'Devagar.' },
];

export function getMoodInfo(mood: Mood): MoodInfo {
  return MOODS.find((m) => m.key === mood) || MOODS[0];
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function formatDate(ds: string): string {
  const d = new Date(ds);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) return `${diff} dias atrás`;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
