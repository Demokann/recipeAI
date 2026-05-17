import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types/recipe';

interface FavoritesStore {
  // DB tarifler — sadece ID saklanır, veri DB'den çekilir
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // AI önerisi tarifler — tam Recipe objesi saklanır (DB'de kaydı yok)
  savedAiRecipes: Recipe[];
  saveAiRecipe: (recipe: Recipe) => void;
  unsaveAiRecipe: (id: string) => void;
  isAiSaved: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (id: string) => {
        if (!get().favorites.includes(id)) {
          set((state) => ({ favorites: [...state.favorites, id] }));
        }
      },

      removeFavorite: (id: string) => {
        set((state) => ({
          favorites: state.favorites.filter((favId) => favId !== id),
        }));
      },

      isFavorite: (id: string) => get().favorites.includes(id),

      savedAiRecipes: [],

      saveAiRecipe: (recipe: Recipe) => {
        if (!get().savedAiRecipes.find((r) => r.id === recipe.id)) {
          set((state) => ({ savedAiRecipes: [...state.savedAiRecipes, recipe] }));
        }
      },

      unsaveAiRecipe: (id: string) => {
        set((state) => ({
          savedAiRecipes: state.savedAiRecipes.filter((r) => r.id !== id),
        }));
      },

      isAiSaved: (id: string) => !!get().savedAiRecipes.find((r) => r.id === id),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
