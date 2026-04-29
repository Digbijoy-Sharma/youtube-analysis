import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiKey {
  id: string;
  nickname: string;
  key: string;
  isActive: boolean;
  quotaUsed: number;
}

interface SettingsState {
  apiKeys: ApiKey[];
  activeKeyId: string | null;
  quotaUsed: number;
  theme: 'dark' | 'light';
  preferences: {
    dateArrival: string;
    numberFormat: string;
    cacheDuration: number;
  };
  addKey: (key: Omit<ApiKey, 'isActive' | 'quotaUsed'>) => void;
  removeKey: (id: string) => void;
  setActiveKey: (id: string) => void;
  toggleTheme: () => void;
  incrementQuota: (units: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKeys: [],
      activeKeyId: null,
      quotaUsed: 0,
      theme: 'dark',
      preferences: {
        dateArrival: 'DD/MM/YYYY',
        numberFormat: 'US',
        cacheDuration: 3600,
      },
      addKey: (key) => set((state) => {
        const newKey = { ...key, isActive: state.apiKeys.length === 0, quotaUsed: 0 };
        return {
          apiKeys: [...state.apiKeys, newKey],
          activeKeyId: state.activeKeyId || newKey.id
        };
      }),
      removeKey: (id) => set((state) => ({
        apiKeys: state.apiKeys.filter((k) => k.id !== id),
        activeKeyId: state.activeKeyId === id ? (state.apiKeys[0]?.id || null) : state.activeKeyId
      })),
      setActiveKey: (id) => set((state) => ({
        activeKeyId: id,
        apiKeys: state.apiKeys.map(k => ({ ...k, isActive: k.id === id }))
      })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      incrementQuota: (units) => set((state) => ({ quotaUsed: state.quotaUsed + units })),
    }),
    {
      name: 'yt-settings-storage',
    }
  )
);
