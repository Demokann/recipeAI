import { create } from 'zustand';
import { CalorieResult } from '../types/calorie';
import { analyzeFood } from '../services/geminiService';

interface CalorieStore {
  currentResult: CalorieResult | null;
  isAnalyzing: boolean;
  error: string | null;
  setAnalyzing: (v: boolean) => void;
  analyzeImage: (uri: string) => Promise<void>;
  setResult: (r: CalorieResult) => void;
  clearResult: () => void;
}

/**
 * Kalori analizi sürecini yöneten Zustand store.
 * Persist içermez, sadece oturum süresince veriyi tutar.
 */
export const useCalorieStore = create<CalorieStore>((set) => ({
  currentResult: null,
  isAnalyzing: false,
  error: null,

  setAnalyzing: (v: boolean) => set({ isAnalyzing: v }),

  analyzeImage: async (uri: string) => {
    set({ isAnalyzing: true, error: null });
    try {
      const result = await analyzeFood(uri);
      set({ currentResult: result, isAnalyzing: false });
    } catch (err: any) {
      set({
        isAnalyzing: false,
        error: err.message || 'Analiz sırasında bir hata oluştu.',
      });
    }
  },

  setResult: (r: CalorieResult) => set({ currentResult: r }),

  clearResult: () => set({ currentResult: null, error: null }),
}));
