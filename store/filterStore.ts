import { create } from 'zustand';

interface FilterStore {
  selectedFilters: string[];
  toggleFilter: (label: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedFilters: [],

  toggleFilter: (label: string) =>
    set((state) => ({
      selectedFilters: state.selectedFilters.includes(label)
        ? state.selectedFilters.filter((f) => f !== label)
        : [...state.selectedFilters, label],
    })),

  clearFilters: () => set({ selectedFilters: [] }),
}));
