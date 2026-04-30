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
      const data = results.map(r => r.data);
      if (data.some(d => !d || typeof d !== 'object' || !d.id)) throw new Error('Received an invalid response from the server.');
      set({ videos: data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.message || 'Failed to compare videos', loading: false });
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
      const data = results.map(r => r.data);
      if (data.some(d => !d || typeof d !== 'object' || !d.id)) throw new Error('Received an invalid response from the server.');
      set({ channels: data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || err.message || 'Failed to compare channels', loading: false });
    }
  },
  clear: () => set({ videos: [], channels: [], error: null })
}));
