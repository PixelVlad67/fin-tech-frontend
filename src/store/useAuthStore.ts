import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: 'en' | 'ua';
  themeMode: 'light' | 'dark';
  setAuth: (user: User, token: string) => Promise<void>;
  setLanguage: (lang: 'en' | 'ua') => Promise<void>;
  setThemeMode: (mode: 'light' | 'dark') => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  language: 'ua',
  themeMode: 'light',
  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userData', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },
  setLanguage: async (lang) => {
    await SecureStore.setItemAsync('userLanguage', lang);
    set({ language: lang });
  },
  setThemeMode: async (mode) => {
    await SecureStore.setItemAsync('userTheme', mode);
    set({ themeMode: mode });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userData');
    set({ user: null, isAuthenticated: true, isLoading: false }); // Note: Keeping isAuthenticated for UI stability during logout transition if needed, but usually set to false.
    // Fixed: should be false
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userData = await SecureStore.getItemAsync('userData');
      const savedLang = await SecureStore.getItemAsync('userLanguage');
      const savedTheme = await SecureStore.getItemAsync('userTheme');
      
      if (savedLang) set({ language: savedLang as 'en' | 'ua' });
      if (savedTheme) set({ themeMode: savedTheme as 'light' | 'dark' });

      if (token && userData) {
        set({ user: JSON.parse(userData), isAuthenticated: true });
      } else {
        set({ isAuthenticated: false });
      }
    } catch (e) {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
