import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreUploadState {
  finalTitle: string;
  setFinalTitle: (title: string) => void;
  titles: { text: string; score: number }[];
  tags: string[];
  description: {
    hook: string;
    valueProp: string;
    chapters: string;
    cta: string;
    resources: string;
  };
  checklist: Record<string, boolean>;
  
  setTitles: (titles: { text: string; score: number }[]) => void;
  setTags: (tags: string[]) => void;
  updateDescription: (field: string, value: string) => void;
  toggleChecklist: (id: string) => void;
  setChecklistBulk: (items: Record<string, boolean>) => void;
  resetChecklist: () => void;
}

export const usePreUploadStore = create<PreUploadState>()(
  persist(
    (set) => ({
      finalTitle: '',
      titles: [],
      tags: [],
      description: {
        hook: '',
        valueProp: '',
        chapters: '',
        cta: '',
        resources: ''
      },
      checklist: {},
      
      setFinalTitle: (title) => set({ finalTitle: title }),
      setTitles: (titles) => set({ titles }),
      setTags: (tags) => set({ tags }),
      updateDescription: (field, value) => set((state) => ({
        description: { ...state.description, [field]: value }
      })),
      toggleChecklist: (id) => set((state) => ({
        checklist: { ...state.checklist, [id]: !state.checklist[id] }
      })),
      setChecklistBulk: (items) => set((state) => ({
        checklist: { ...state.checklist, ...items }
      })),
      resetChecklist: () => set({ checklist: {} }),
    }),
    {
      name: 'yt-pre-upload-state'
    }
  )
);
