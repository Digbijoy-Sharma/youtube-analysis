import { create } from 'zustand';
import axios from 'axios';

interface VideoData {
  id: string;
  snippet: any;
  statistics: any;
  contentDetails: any;
  analysis?: any;
}

interface VideoState {
  currentVideo: any | null;
  loading: boolean;
  error: string | null;
  recentAnalyses: any[];
  analyzeVideo: (videoUrl: string, apiKey: string) => Promise<any>;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideo: null,
  loading: false,
  error: null,
  recentAnalyses: [],
  analyzeVideo: async (videoUrl, apiKey) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/video/analyze', { videoUrl, apiKey });
      const data = response.data;
      set((state) => ({ 
        currentVideo: data,
        recentAnalyses: [data, ...state.recentAnalyses.filter(v => v.id !== data.id)].slice(0, 10),
        loading: false 
      }));
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to analyze video';
      set({ error: errorMsg, loading: false });
      return null;
    }
  }
}));
