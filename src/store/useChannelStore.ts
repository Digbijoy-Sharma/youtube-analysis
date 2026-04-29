import { create } from 'zustand';
import axios from 'axios';

interface ChannelData {
  id: string;
  snippet: any;
  statistics: any;
  brandingSettings: any;
  analysis?: any;
}

interface ChannelState {
  currentChannel: any | null;
  channelVideos: any[];
  loading: boolean;
  error: string | null;
  analyzeChannel: (channelId: string, apiKey: string) => Promise<any>;
  fetchVideos: (channelId: string, apiKey: string) => Promise<void>;
  clear: () => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  currentChannel: null,
  channelVideos: [],
  loading: false,
  error: null,
  analyzeChannel: async (channelId, apiKey) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/channel/analyze', { channelId, apiKey });
      set({ currentChannel: response.data, loading: false });
      return response.data;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to analyze channel', loading: false });
      return null;
    }
  },
  fetchVideos: async (channelId, apiKey) => {
    try {
      const response = await axios.post('/api/channel/videos', { channelId, apiKey });
      set({ channelVideos: response.data });
    } catch (err: any) {
      console.error('Failed to fetch channel videos', err);
    }
  },
  clear: () => set({ currentChannel: null, channelVideos: [], error: null })
}));
