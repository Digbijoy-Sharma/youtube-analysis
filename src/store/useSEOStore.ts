import { create } from 'zustand';
import axios from 'axios';

interface SEOState {
  keywordResults: any[];
  analyzedTags: string[];
  loading: boolean;
  error: string | null;
  searchKeywords: (query: string, apiKey: string) => Promise<void>;
  setTags: (tags: string[]) => void;
}

export const useSEOStore = create<SEOState>((set) => ({
  keywordResults: [],
  analyzedTags: [],
  loading: false,
  error: null,
  searchKeywords: async (query, apiKey) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/keywords/search', { query, apiKey });
      const data = response.data;
      if (!Array.isArray(data)) throw new Error('Received an invalid response from the server.');
      set({ keywordResults: data, loading: false });
    } catch (err: any) {
      const errorData = err.response?.data?.error;
      const errorMsg = typeof errorData === 'string' ? errorData : (errorData?.message || err.message || 'Failed to search keywords');
      set({ error: errorMsg, loading: false });
    }
  },
  setTags: (tags) => set({ analyzedTags: tags })
}));
