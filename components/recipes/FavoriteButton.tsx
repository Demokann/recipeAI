import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
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
 * Dolu/boş kalp çift katman cross-fade ile renk değişimi sağlar,
 * scale spring ile Reanimated 3'e uygun animasyon verir.
 */
const FavoriteButton = React.memo(({ recipeId, size = 24 }: Props) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(recipeId);

  const scale = useSharedValue(1);
  // 0 = boş/gri, 1 = dolu/kırmızı
  const fillOpacity = useSharedValue(active ? 1 : 0);

  const handlePress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(recipeId);

    // Scale spring: 1 → 1.4 → 1 (~350ms)
    scale.value = withSpring(1.4, { mass: 0.3, damping: 8 }, () => {
      scale.value = withSpring(1.0);
    });

    // Cross-fade between empty/filled icons
    fillOpacity.value = withTiming(active ? 0 : 1, { duration: 300 });
  }, [recipeId, toggleFavorite, active, scale, fillOpacity]);

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
        <AntDesign name="hearto" size={size} color={colors.favoriteInactive} />
      </Animated.View>

      {/* Dolu kalp (kırmızı) */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.iconCenter, filledStyle]}>
        <AntDesign name="heart" size={size} color={colors.favoriteActive} />
      </Animated.View>

      {/* Invisible placeholder for sizing */}
      <AntDesign name="hearto" size={size} color="transparent" />
    </AnimatedPressable>
  );
});

FavoriteButton.displayName = 'FavoriteButton';

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: 'relative',
  },
  iconCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    // padding offset to match container
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
  },
});

export default FavoriteButton;
