import { useCallback } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';
import { Recipe } from '../types/recipe';

export const useFavorites = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isFavoriteStore = useFavoritesStore((state) => state.isFavorite);

  const savedAiRecipes = useFavoritesStore((state) => state.savedAiRecipes);
  const saveAiRecipe = useFavoritesStore((state) => state.saveAiRecipe);
  const unsaveAiRecipeStore = useFavoritesStore((state) => state.unsaveAiRecipe);
  const isAiSavedStore = useFavoritesStore((state) => state.isAiSaved);

  const toggleFavorite = useCallback((id: string) => {
    if (isFavoriteStore(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  }, [addFavorite, removeFavorite, isFavoriteStore]);

  const unsaveAiRecipe = useCallback((id: string) => {
    unsaveAiRecipeStore(id);
  }, [unsaveAiRecipeStore]);

  const toggleAiRecipe = useCallback((recipe: Recipe) => {
    if (isAiSavedStore(recipe.id)) {
      unsaveAiRecipeStore(recipe.id);
    } else {
      saveAiRecipe(recipe);
    }
  }, [saveAiRecipe, unsaveAiRecipeStore, isAiSavedStore]);

  return {
    favorites,
    toggleFavorite,
    isFavorite: isFavoriteStore,
    savedAiRecipes,
    toggleAiRecipe,
    unsaveAiRecipe,
    isAiSaved: isAiSavedStore,
  };
};
