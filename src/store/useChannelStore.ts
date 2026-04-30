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
      const data = response.data;
      if (!data || typeof data !== 'object' || !data.id) throw new Error('Received an invalid response from the server.');
      set({ currentChannel: data, loading: false });
      return data;
    } catch (err: any) {
      const errorData = err.response?.data?.error;
      const errorMsg = typeof errorData === 'string' ? errorData : (errorData?.message || err.message || 'Failed to analyze channel');
      set({ error: errorMsg, loading: false });
      return null;
    }
  },
  fetchVideos: async (channelId, apiKey) => {
    try {
      const response = await axios.post('/api/channel/videos', { channelId, apiKey });
      const data = response.data;
      if (!Array.isArray(data)) throw new Error('Received an invalid response from the server.');
      set({ channelVideos: data });
    } catch (err: any) {
      console.error('Failed to fetch channel videos', err);
    }
  },
  clear: () => set({ currentChannel: null, channelVideos: [], error: null })
}));
