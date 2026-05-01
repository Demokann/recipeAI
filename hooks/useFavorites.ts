import { useCallback } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';

/**
 * Favori işlemleri için kolay erişim sağlayan custom hook.
 * Store ile component'lar arasında katman oluşturur.
 */
export const useFavorites = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isFavoriteStore = useFavoritesStore((state) => state.isFavorite);

  const toggleFavorite = useCallback((id: string) => {
    if (isFavoriteStore(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  }, [addFavorite, removeFavorite, isFavoriteStore]);

  return {
    favorites,
    toggleFavorite,
    isFavorite: isFavoriteStore,
  };
};
