import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmotionEntry, ChatMessage, DailyCheckIn, BreathingSession } from '../types';

export type BackgroundTheme = 'default' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'lavender' | 'custom';

export interface User {
  id: string;
  username: string;
  password: string;
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
}

export type AIVoice = 'default' | 'female' | 'male' | 'neutral';

const STORAGE_KEYS = {
  APP_STATE: '@confidente_app_state',
  USERS: '@confidente_users',
  CURRENT_USER: '@confidente_current_user',
};

interface AppState {
  isLoading: boolean;
  isLoggedIn: boolean;
  currentUser: User | null;
  users: User[];
  register: (username: string, password: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  chatMessages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  entries: EmotionEntry[];
  addEntry: (entry: EmotionEntry) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (entry: EmotionEntry) => void;
  checkIns: DailyCheckIn[];
  addCheckIn: (checkIn: DailyCheckIn) => void;
  breathingSessions: BreathingSession[];
  addBreathingSession: (session: BreathingSession) => void;
  userName: string;
  setUserName: (name: string) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  backgroundTheme: BackgroundTheme;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
  customBackgroundColor: string;
  setCustomBackgroundColor: (color: string) => void;
  customBackgroundImage: string | null;
  setCustomBackgroundImage: (uri: string | null) => void;
  currentStreak: number;
  setCurrentStreak: (streak: number) => void;
  aiName: string;
  setAIName: (name: string) => void;
  aiVoice: AIVoice;
  setAIVoice: (voice: AIVoice) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  completeOnboarding: () => void;
  loadPersistedData: () => Promise<void>;
  persistData: () => Promise<void>;
  isNewUser: () => boolean;
}

export const useStore = create<AppState>()((set, get) => ({
  isLoading: true,
  isLoggedIn: false,
  currentUser: null,
  users: [],
  register: (username, password) => {
    const { users } = get();
    if (!username.trim() || !password.trim()) return false;
    if (users.find(u => u.username === username.trim())) return false;
    const newUser: User = {
      id: Date.now().toString(),
      username: username.trim(),
      password,
      isNewUser: true,
      hasCompletedOnboarding: false,
    };
    set({ users: [...users, newUser], currentUser: newUser, isLoggedIn: true });
    get().persistData();
    return true;
  },
  login: (username, password) => {
    const { users } = get();
    const user = users.find(u => u.username === username.trim() && u.password === password);
    if (!user) return false;
    set({ currentUser: user, isLoggedIn: true });
    get().persistData();
    return true;
  },
  logout: () => {
    set({ currentUser: null, isLoggedIn: false });
    get().persistData();
  },
  chatMessages: [],
  addMessage: (message) => {
    set((state) => ({ chatMessages: [...state.chatMessages, message] }));
    get().persistData();
  },
  clearChat: () => {
    set({ chatMessages: [] });
    get().persistData();
  },
  entries: [],
  addEntry: (entry) => {
    set((state) => ({ entries: [entry, ...state.entries] }));
    get().persistData();
  },
  deleteEntry: (id) => {
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
    get().persistData();
  },
  updateEntry: (entry) => {
    set((state) => ({ entries: state.entries.map((e) => (e.id === entry.id ? entry : e)) }));
    get().persistData();
  },
  checkIns: [],
  addCheckIn: (checkIn) => {
    set((state) => ({ checkIns: [checkIn, ...state.checkIns] }));
    get().persistData();
  },
  breathingSessions: [],
  addBreathingSession: (session) => {
    set((state) => ({ breathingSessions: [session, ...state.breathingSessions] }));
    get().persistData();
  },
  userName: '',
  setUserName: (name) => {
    set({ userName: name });
    get().persistData();
  },
  onboardingComplete: false,
  setOnboardingComplete: (complete) => {
    set({ onboardingComplete: complete });
    get().persistData();
  },
  darkMode: false,
  setDarkMode: (dark) => {
    set({ darkMode: dark });
    get().persistData();
  },
  backgroundTheme: 'default',
  setBackgroundTheme: (theme) => {
    set({ backgroundTheme: theme });
    get().persistData();
  },
  customBackgroundColor: '#F5F5F5',
  setCustomBackgroundColor: (color) => {
    set({ customBackgroundColor: color });
    get().persistData();
  },
  customBackgroundImage: null,
  setCustomBackgroundImage: (uri) => {
    set({ customBackgroundImage: uri });
    get().persistData();
  },
  currentStreak: 0,
  setCurrentStreak: (streak) => {
    set({ currentStreak: streak });
    get().persistData();
  },
  aiName: 'Confidente',
  setAIName: (name) => {
    set({ aiName: name });
    get().persistData();
  },
  aiVoice: 'default',
  setAIVoice: (voice) => {
    set({ aiVoice: voice });
    get().persistData();
  },
  voiceEnabled: true,
  setVoiceEnabled: (enabled) => {
    set({ voiceEnabled: enabled });
    get().persistData();
  },
  voiceSpeed: 1.0,
  setVoiceSpeed: (speed) => {
    set({ voiceSpeed: speed });
    get().persistData();
  },
  isNewUser: () => {
    const { currentUser } = get();
    return currentUser?.isNewUser ?? true;
  },
  completeOnboarding: () => {
    const { currentUser, users } = get();
    if (currentUser) {
      const updatedUser = { ...currentUser, isNewUser: false, hasCompletedOnboarding: true };
      set({ 
        currentUser: updatedUser,
        users: users.map(u => u.id === currentUser.id ? updatedUser : u),
        onboardingComplete: true 
      });
      get().persistData();
    }
  },
  loadPersistedData: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.APP_STATE);
      if (jsonValue) {
        const data = JSON.parse(jsonValue);
        set({
          users: data.users || [],
          currentUser: data.currentUser || null,
          isLoggedIn: data.isLoggedIn || false,
          chatMessages: data.chatMessages || [],
          entries: data.entries || [],
          checkIns: data.checkIns || [],
          breathingSessions: data.breathingSessions || [],
          userName: data.userName || '',
          onboardingComplete: data.onboardingComplete || false,
          darkMode: data.darkMode || false,
          backgroundTheme: data.backgroundTheme || 'default',
          customBackgroundColor: data.customBackgroundColor || '#F5F5F5',
          customBackgroundImage: data.customBackgroundImage || null,
          currentStreak: data.currentStreak || 0,
          aiName: data.aiName || 'Confidente',
          aiVoice: data.aiVoice || 'default',
          voiceEnabled: data.voiceEnabled !== undefined ? data.voiceEnabled : true,
          voiceSpeed: data.voiceSpeed || 1.0,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Error loading persisted data:', e);
      set({ isLoading: false });
    }
  },
  persistData: async () => {
    try {
      const state = get();
      const dataToStore = {
        users: state.users,
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
        chatMessages: state.chatMessages,
        entries: state.entries,
        checkIns: state.checkIns,
        breathingSessions: state.breathingSessions,
        userName: state.userName,
        onboardingComplete: state.onboardingComplete,
        darkMode: state.darkMode,
        backgroundTheme: state.backgroundTheme,
        customBackgroundColor: state.customBackgroundColor,
        customBackgroundImage: state.customBackgroundImage,
        currentStreak: state.currentStreak,
        aiName: state.aiName,
        aiVoice: state.aiVoice,
        voiceEnabled: state.voiceEnabled,
        voiceSpeed: state.voiceSpeed,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(dataToStore));
    } catch (e) {
      console.error('Error persisting data:', e);
    }
  },
}));
