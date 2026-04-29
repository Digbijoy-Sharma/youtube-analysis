import { create } from 'zustand';
import axios from 'axios';

interface CommentState {
  analysis: any | null;
  loading: boolean;
  error: string | null;
  analyzeComments: (videoId: string, apiKey: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set) => ({
  analysis: null,
  loading: false,
  error: null,
  analyzeComments: async (videoId, apiKey) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/video/comments', { videoId, apiKey });
      set({ analysis: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to analyze comments', loading: false });
    }
  }
}));
