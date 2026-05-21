import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import { Recipe } from '../../types/recipe';
import GlassContainer from '../shared/GlassContainer';
import RecipeListItem from './RecipeListItem';
// RecipeDetailOverlay bu bileşen içinde fragment olarak render edilir.
// recipes.tsx'ten değil buradan mount edilmesi zorunlu — aksi hâlde
// ExpandedOverlay Modal'ının arkasında kalır ve tıklama bloke olur.
import RecipeDetailOverlay from './RecipeDetailOverlay';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SPRING_CONFIG = { mass: 0.7, damping: 18, stiffness: 180 };

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  recipes?: Recipe[];
  initialLayout: { x: number; y: number; width: number; height: number } | null;
}

interface ListItemProps {
  recipe: Recipe;
  index: number;
  onPress?: () => void;
}

const StaggeredItem = React.memo(({ recipe, index, onPress }: ListItemProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const staggerDelay = 150 + index * 50;

  useEffect(() => {
    opacity.value = withDelay(staggerDelay, withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) }));
    translateY.value = withDelay(staggerDelay, withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) }));
  }, [staggerDelay, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={style}>
      <RecipeListItem recipe={recipe} onPress={onPress} />
      <View style={styles.itemDivider} />
    </Animated.View>
  );
});

StaggeredItem.displayName = 'StaggeredItem';

/**
 * Widget genişlediğinde açılan glassmorphism overlay.
 * Spec animasyon sekansı:
 *   t=0ms   backdrop fade in (withTiming 300ms)
 *   t=50ms  içerik container translateY: 60→0 + opacity: 0→1 (withSpring)
 *   t=150ms list stagger, her öğe +50ms delay
 * Kapanma: swipe down (velocityY>500 || translationY>100) veya X butonu
 */
const ExpandedOverlay = React.memo(({
  visible,
  onClose,
  title,
  icon,
  recipes,
  initialLayout,
}: Props) => {
  const backdropOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(60);
  const contentOpacity = useSharedValue(0);
  const panTranslateY = useSharedValue(0);

  const displayRecipes = recipes ?? [];

  // Detay overlay state — burada tutulur, recipes.tsx'e taşınmaz.
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleRecipePress = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleDetailClose = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) });
      contentTranslateY.value = withDelay(50, withSpring(0, SPRING_CONFIG));
      contentOpacity.value = withDelay(50, withTiming(1, { duration: 250 }));
      panTranslateY.value = 0;
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      contentOpacity.value = withTiming(0, { duration: 200 });
      contentTranslateY.value = withTiming(60, { duration: 200 });
    }
  }, [visible, backdropOpacity, contentTranslateY, contentOpacity, panTranslateY]);

  const handleClose = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    contentTranslateY.value = withTiming(60, { duration: 200 });
    contentOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  }, [onClose, backdropOpacity, contentTranslateY, contentOpacity]);

  const onGestureEvent = useCallback((event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationY > 0) {
      panTranslateY.value = event.nativeEvent.translationY;
    }
  }, [panTranslateY]);

  const onGestureEnd = useCallback((event: PanGestureHandlerGestureEvent) => {
    const { translationY, velocityY } = event.nativeEvent;
    if (translationY > 100 || velocityY > 500) {
      runOnJS(handleClose)();
    } else {
      panTranslateY.value = withSpring(0, SPRING_CONFIG);
    }
  }, [handleClose, panTranslateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { translateY: contentTranslateY.value + panTranslateY.value },
      { scale: interpolate(contentOpacity.value, [0, 1], [0.95, 1], 'clamp') },
    ],
  }));

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      accessibilityViewIsModal
    >
      {/* Yarı saydam arka plan */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Arka plana bas, kapat"
        />
      </Animated.View>

      {/* Kart container */}
      <View style={styles.centerContainer} pointerEvents="box-none">
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={(e) => e.nativeEvent.state === 5 && onGestureEnd(e as PanGestureHandlerGestureEvent)}
        >
          <Animated.View style={[styles.cardContainer, containerStyle]}>
            <GlassContainer style={styles.glass}>
              {/* Swipe handle */}
              <View
                style={styles.handleBar}
                accessibilityRole="none"
                accessibilityLabel="Aşağı kaydır, kapat"
              />

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <MaterialCommunityIcons name={icon} size={28} color={colors.accent} />
                  <Text
                    style={styles.title}
                    accessibilityRole="header"
                  >
                    {title}
                  </Text>
                </View>
                <Pressable
                  onPress={handleClose}
                  style={styles.closeButton}
                  accessibilityRole="button"
                  accessibilityLabel={`${title} panelini kapat`}
                  hitSlop={8}
                >
                  <MaterialCommunityIcons name="close" size={24} color={colors.textMuted} />
                </Pressable>
              </View>

              <View style={styles.divider} />

              {/* Tarif listesi — stagger animasyonuyla */}
              {displayRecipes.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="heart-off-outline"
                    size={48}
                    color={colors.accent}
                    style={styles.emptyIcon}
                  />
                  <Text style={styles.emptyText}>Henüz favori tarifin yok</Text>
                </View>
              ) : (
                <ScrollView
                  style={styles.content}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollList}
                  accessibilityRole="list"
                  accessibilityLabel={`${title} tarif listesi`}
                >
                  {displayRecipes.map((recipe, index) => (
                    <StaggeredItem
                      key={recipe.id}
                      recipe={recipe}
                      index={index}
                      onPress={() => handleRecipePress(recipe)}
                    />
                  ))}
                </ScrollView>
              )}
            </GlassContainer>
          </Animated.View>
        </PanGestureHandler>
      </View>

      {/* RecipeDetailOverlay bu Modal'ın JSX'i içinde render edilir.
          Böylece iç Modal, dış Modal'ın VC'sinden (iOS) / Dialog context'inden (Android)
          sunulur ve liste overlay'inin ÜSTÜNDE görünür.
          Fragment sibling pattern'da root VC'den sunulan iç Modal, dış Modal'ın
          arkasında kalıyordu. */}
      <RecipeDetailOverlay
        visible={!!selectedRecipe}
        onClose={handleDetailClose}
        recipe={selectedRecipe}
      />
    </Modal>
  );
});

ExpandedOverlay.displayName = 'ExpandedOverlay';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.40)',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 500,
    height: SCREEN_HEIGHT * 0.70,
    ...shadows.glass,
  },
  glass: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: 'rgba(250,247,242,0.78)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.textMuted,
    opacity: 0.3,
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.bodyFontBold,
    fontSize: typography.heading2,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
  },
  scrollList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    opacity: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    opacity: 0.4,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default ExpandedOverlay;
