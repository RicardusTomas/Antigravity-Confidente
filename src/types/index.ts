export type Mood = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'tired' | 'lonely' | 'grateful' | 'hopeful' | 'overwhelmed';

export interface EmotionEntry {
  id: string;
  date: string;
  mood: Mood;
  note: string;
  tags: string[];
  gratitude?: string;
  sleepHours?: number;
  stressLevel: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DailyCheckIn {
  date: string;
  completed: boolean;
  mood: Mood;
  energy: number;
}

export interface BreathingSession {
  id: string;
  type: '4-7-8' | 'box' | 'calm' | 'energy';
  duration: number;
  completedAt: string;
}

export interface Affirmation {
  id: string;
  text: string;
  category: string;
}

export interface Tip {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export type TabScreen = 'home' | 'journal' | 'chat' | 'wellness' | 'profile';
