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
      const data = response.data;
      if (!data || typeof data !== 'object' || !data.threads) throw new Error('Received an invalid response from the server.');
      set({ analysis: data, loading: false });
    } catch (err: any) {
      const errorData = err.response?.data?.error;
      const errorMsg = typeof errorData === 'string' ? errorData : (errorData?.message || err.message || 'Failed to analyze comments');
      set({ error: errorMsg, loading: false });
    }
  }
}));
