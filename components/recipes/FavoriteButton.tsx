import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { Recipe } from '../../types/recipe';
import { useFavorites } from '../../hooks/useFavorites';
import AnimatedPressable from '../shared/AnimatedPressable';

interface Props {
  recipeId: string;
  recipe?: Recipe;
  size?: number;
}

const FavoriteButton = React.memo(({ recipeId, recipe, size = 20 }: Props) => {
  const { isFavorite, toggleFavorite, isAiSaved, unsaveAiRecipe, toggleAiRecipe } = useFavorites();
  const active = isFavorite(recipeId) || isAiSaved(recipeId);

  const scale = useSharedValue(1);
  const fillOpacity = useSharedValue(active ? 1 : 0);

  const handlePress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isAiSaved(recipeId)) {
      unsaveAiRecipe(recipeId);
    } else if (recipe && !isFavorite(recipeId)) {
      toggleAiRecipe(recipe);
    } else {
      toggleFavorite(recipeId);
    }

    scale.value = withSpring(1.4, { mass: 0.3, damping: 8 }, () => {
      scale.value = withSpring(1.0);
    });
    fillOpacity.value = withTiming(active ? 0 : 1, { duration: 300 });
  }, [recipeId, recipe, isFavorite, toggleFavorite, isAiSaved, unsaveAiRecipe, toggleAiRecipe, active, scale, fillOpacity]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const filledStyle = useAnimatedStyle(() => ({
    opacity: fillOpacity.value,
  }));

  const emptyStyle = useAnimatedStyle(() => ({
    opacity: 1 - fillOpacity.value,
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.container, scaleStyle]}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      accessibilityState={{ selected: active }}
    >
      {/* Boş kalp (gri) */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.iconCenter, emptyStyle]}>
        <Ionicons name="heart-outline" size={size} color={colors.favoriteInactive} />
      </Animated.View>

      {/* Dolu kalp (kırmızı) */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.iconCenter, filledStyle]}>
        <Ionicons name="heart" size={size} color={colors.favoriteActive} />
      </Animated.View>

      {/* Invisible placeholder for sizing */}
      <Ionicons name="heart-outline" size={size} color="transparent" />
    </AnimatedPressable>
  );
});

FavoriteButton.displayName = 'FavoriteButton';

const styles = StyleSheet.create({
  container: {
    padding: spacing.xs,
    position: 'relative',
  },
  iconCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    top: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
    bottom: spacing.xs,
  },
});

export default FavoriteButton;
