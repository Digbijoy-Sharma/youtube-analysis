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
      set({ keywordResults: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to search keywords', loading: false });
    }
  },
  setTags: (tags) => set({ analyzedTags: tags })
}));
