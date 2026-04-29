import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistItem {
  id: string;
  type: 'video' | 'channel';
  title: string;
  thumbnail: string;
  labels: string[];
  addedAt: string;
  metadata?: any;
}

interface WatchlistState {
  items: WatchlistItem[];
  addItem: (item: Omit<WatchlistItem, 'addedAt' | 'labels'>) => void;
  removeItem: (id: string) => void;
  updateLabels: (id: string, labels: string[]) => void;
  clearWatchlist: () => void;
  // Aliases for components
  savedVideos: WatchlistItem[];
  savedChannels: WatchlistItem[];
  addVideo: (video: any) => void;
  removeVideo: (id: string) => void;
  addChannel: (channel: any) => void;
  removeChannel: (id: string) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      savedVideos: [],
      savedChannels: [],
      addItem: (item) => set((state) => {
        if (state.items.find(i => i.id === item.id)) return state;
        const newItem = { ...item, addedAt: new Date().toISOString(), labels: [] };
        const newItems = [newItem, ...state.items];
        return {
          items: newItems,
          savedVideos: newItems.filter(i => i.type === 'video'),
          savedChannels: newItems.filter(i => i.type === 'channel')
        };
      }),
      removeItem: (id) => set((state) => {
        const newItems = state.items.filter(i => i.id !== id);
        return {
          items: newItems,
          savedVideos: newItems.filter(i => i.type === 'video'),
          savedChannels: newItems.filter(i => i.type === 'channel')
        };
      }),
      updateLabels: (id, labels) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, labels } : i)
      })),
      clearWatchlist: () => set({ items: [], savedVideos: [], savedChannels: [] }),
      
      addVideo: (video) => get().addItem({ 
        id: video.id, 
        type: 'video', 
        title: video.title, 
        thumbnail: video.thumbnail,
        metadata: video 
      }),
      removeVideo: (id) => get().removeItem(id),
      addChannel: (channel) => get().addItem({ 
        id: channel.id, 
        type: 'channel', 
        title: channel.title, 
        thumbnail: channel.thumbnail,
        metadata: channel 
      }),
      removeChannel: (id) => get().removeItem(id),
    }),
    {
      name: 'yt-competitor-watchlist',
      //@ts-ignore
      onRehydrateStorage: (state) => {
        return (hydratedState) => {
          if (hydratedState) {
            hydratedState.savedVideos = hydratedState.items.filter(i => i.type === 'video');
            hydratedState.savedChannels = hydratedState.items.filter(i => i.type === 'channel');
          }
        }
      }
    }
  )
);
