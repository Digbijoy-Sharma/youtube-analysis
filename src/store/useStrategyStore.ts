import { create } from 'zustand';
import axios from 'axios';

interface TopicTheme {
  id: string;
  name: string;
  count: number;
  avgViews: number;
  engagement: number;
  examples: string[];
}

interface StrategyState {
  suggestions: any[];
  trends: any[];
  patterns: any | null;
  gaps: any[];
  themes: TopicTheme[];
  loading: boolean;
  error: string | null;
  generateTopics: (niche: string, apiKey: string) => Promise<void>;
  fetchTrends: (category: string, apiKey: string) => Promise<void>;
  analyzePatterns: (handle: string, apiKey: string) => Promise<void>;
  findGaps: (handles: string[], apiKey: string) => Promise<void>;
  fetchThemes: (handle: string, apiKey: string) => Promise<void>;
}

export const useStrategyStore = create<StrategyState>((set) => ({
  suggestions: [],
  trends: [],
  patterns: null,
  gaps: [],
  themes: [],
  loading: false,
  error: null,
  generateTopics: async (niche, apiKey) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/keywords/search', { query: niche, apiKey });
      const data = response.data;
      if (!Array.isArray(data)) throw new Error('Received an invalid response from the server.');
      set({ suggestions: data, loading: false });
    } catch (err: any) {
      const errorData = err.response?.data?.error;
      const errorMsg = typeof errorData === 'string' ? errorData : (errorData?.message || err.message || 'Failed to generate topics');
      set({ error: errorMsg, loading: false });
    }
  },
  fetchTrends: async (category, apiKey) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/keywords/search', { query: `trending ${category} youtube titles`, apiKey });
      const data = response.data;
      if (!Array.isArray(data)) throw new Error('Received an invalid response from the server.');
      set({ trends: data, loading: false });
    } catch (err: any) {
      const errorData = err.response?.data?.error;
      const errorMsg = typeof errorData === 'string' ? errorData : (errorData?.message || err.message || 'Failed to fetch trends');
      set({ error: errorMsg, loading: false });
    }
  },
  analyzePatterns: async (handle, apiKey) => {
    set({ loading: true, error: null });
    try {
      // Mocked for Demo as real implementation requires a custom backend for deep time analysis
      await new Promise(r => setTimeout(r, 1500));
      set({ 
        patterns: {
          consistencyScore: 92,
          currentStreak: 12,
          peakDay: 'Wednesday',
          peakHour: '18:00',
          heatmapData: Array(7).fill(0).map(() => Array(24).fill(0).map(() => Math.floor(Math.random() * 5)))
        }, 
        loading: false 
      });
    } catch (err: any) {
      set({ error: 'Failed to analyze patterns', loading: false });
    }
  },
  findGaps: async (handles, apiKey) => {
    set({ loading: true, error: null });
    try {
      await new Promise(r => setTimeout(r, 2000));
      set({ 
        gaps: [
          { id: '1', title: 'Why I stopped using Mac for coding', opportunityScore: 94, reason: 'High demand in niche with low competition' },
          { id: '2', title: 'Building a SaaS in 24 hours with AI', opportunityScore: 89, reason: 'Viral potential based on current competitor trends' },
          { id: '3', title: 'My $10k/mo developer setup (Budget Edition)', opportunityScore: 85, reason: 'Highly requested comparison format' }
        ], 
        loading: false 
      });
    } catch (err: any) {
      set({ error: 'Failed to find content gaps', loading: false });
    }
  },
  fetchThemes: async (handle, apiKey) => {
    set({ loading: true, error: null });
    try {
      await new Promise(r => setTimeout(r, 1200));
      set({ 
        themes: [
          { id: '1', name: 'Software Career', count: 45, avgViews: 120000, engagement: 4.5, examples: ['How to get hired', 'My first job'] },
          { id: '2', name: 'Tech Reviews', count: 32, avgViews: 85000, engagement: 3.2, examples: ['Keyboard review', 'Laptop roundup'] },
          { id: '3', name: 'Coding Tutorials', count: 28, avgViews: 45000, engagement: 5.8, examples: ['React guide', 'TypeScript tips'] }
        ], 
        loading: false 
      });
    } catch (err: any) {
      set({ error: 'Failed to fetch topic themes', loading: false });
    }
  }
}));
