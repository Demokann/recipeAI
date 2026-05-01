import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesStore {
  favorites: string[]; // recipe id'leri
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

/**
 * Favori tarifleri yöneten Zustand store.
 * AsyncStorage kullanılarak oturumlar arası kalıcı hale getirilmiştir.
 */
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

      isFavorite: (id: string) => {
        return get().favorites.includes(id);
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
