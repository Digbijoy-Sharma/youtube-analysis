import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HistoryItem {
  id: string;
  type: 'video' | 'channel' | 'compare' | 'seo' | 'strategy' | 'comments';
  title: string;
  timestamp: string;
  metadata?: any;
}

interface HistoryState {
  items: HistoryItem[];
  addHistory: (item: Omit<HistoryItem, 'timestamp' | 'id'>) => void;
  addToHistory: (item: any) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      addHistory: (item) => set((state) => ({
        items: [{ 
          ...item, 
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString() 
        }, ...state.items.slice(0, 99)] // Keep last 100 items
      })),
      addToHistory: (item) => set((state) => ({
        items: [{
          id: Math.random().toString(36).substring(7),
          type: item.type,
          title: item.title,
          timestamp: new Date().toISOString(),
          metadata: item
        }, ...state.items.slice(0, 99)]
      })),
      removeHistory: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      clearHistory: () => set({ items: [] }),
    }),
    {
      name: 'yt-competitor-history'
    }
  )
);
