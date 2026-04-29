import { create } from 'zustand';
import axios from 'axios';

interface CompareState {
  videos: any[];
  channels: any[];
  loading: boolean;
  error: string | null;
  compareVideos: (urls: string[], apiKey: string) => Promise<void>;
  compareChannels: (ids: string[], apiKey: string) => Promise<void>;
  clear: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  videos: [],
  channels: [],
  loading: false,
  error: null,
  compareVideos: async (urls, apiKey) => {
    set({ loading: true, error: null, videos: [] });
    try {
      const results = await Promise.all(
        urls.filter(url => url.trim() !== '').map(url => 
          axios.post('/api/video/analyze', { videoUrl: url, apiKey })
        )
      );
      set({ videos: results.map(r => r.data), loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to compare videos', loading: false });
    }
  },
  compareChannels: async (ids, apiKey) => {
    set({ loading: true, error: null, channels: [] });
    try {
      const results = await Promise.all(
        ids.filter(id => id.trim() !== '').map(id => 
          axios.post('/api/channel/analyze', { channelId: id, apiKey })
        )
      );
      set({ channels: results.map(r => r.data), loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to compare channels', loading: false });
    }
  },
  clear: () => set({ videos: [], channels: [], error: null })
}));
