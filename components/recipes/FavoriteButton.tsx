import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import { useFavorites } from '../../hooks/useFavorites';
import AnimatedPressable from '../shared/AnimatedPressable';

interface Props {
  recipeId: string;
  size?: number;
}

/**
 * Trendyol tarzı animasyonlu favori butonu.
 * Tıklandığında büyüyüp küçülür ve renk değiştirir.
 */
const FavoriteButton = React.memo(({ recipeId, size = 24 }: Props) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(recipeId);
  
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(active ? 1 : 0);

  const handlePress = useCallback(async () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Toggle state
    toggleFavorite(recipeId);
    
    // Animasyonlar
    scale.value = withSpring(1.4, { mass: 0.3, damping: 8 }, () => {
      scale.value = withSpring(1);
    });
    
    colorProgress.value = withTiming(active ? 0 : 1, { duration: 300 });
  }, [recipeId, toggleFavorite, active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      colorProgress.value,
      [0, 1],
      [colors.favoriteInactive, colors.favoriteActive]
    ),
  }));

  return (
    <AnimatedPressable onPress={handlePress} style={[styles.container, animatedStyle]}>
      <Animated.View style={animatedIconStyle}>
        <AntDesign
          name={active ? 'heart' : 'hearto'}
          size={size}
        />
      </Animated.View>
    </AnimatedPressable>
  );
});

FavoriteButton.displayName = 'FavoriteButton';

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

export default FavoriteButton;
