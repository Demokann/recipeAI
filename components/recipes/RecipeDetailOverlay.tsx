import React, { useEffect, useCallback } from 'react';
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SPRING_CONFIG = { mass: 0.7, damping: 18, stiffness: 180 };

interface Props {
  visible: boolean;
  onClose: () => void;
  recipe: Recipe | null;
}

interface StaggeredItemProps {
  children: React.ReactNode;
  index: number;
  baseDelay?: number;
}

const StaggeredItem = React.memo(({ children, index, baseDelay = 150 }: StaggeredItemProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const staggerDelay = baseDelay + index * 50;

  useEffect(() => {
    opacity.value = withDelay(staggerDelay, withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) }));
    translateY.value = withDelay(staggerDelay, withTiming(0, { duration: 250, easing: Easing.out(Easing.quad) }));
  }, [staggerDelay, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
});

StaggeredItem.displayName = 'StaggeredItem';

const RecipeDetailOverlay = React.memo(({ visible, onClose, recipe }: Props) => {
  const backdropOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(60);
  const contentOpacity = useSharedValue(0);
  const panTranslateY = useSharedValue(0);

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

  if (!recipe) return null;

  const ingredientCount = recipe.ingredients.length;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      accessibilityViewIsModal
      accessibilityLabel={`${recipe.name} detayları`}
    >
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Arka plana bas, kapat"
        />
      </Animated.View>

      <View style={styles.centerContainer} pointerEvents="box-none">
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={(e) =>
            e.nativeEvent.state === 5 && onGestureEnd(e as PanGestureHandlerGestureEvent)
          }
        >
          <Animated.View style={[styles.cardContainer, containerStyle]}>
            <GlassContainer style={styles.glass}>
              <View style={styles.handleBar} accessibilityRole="none" />

              <View style={styles.header}>
                <View style={[styles.thumbnailCircle, { backgroundColor: recipe.thumbnail }]} />
                <View style={styles.titleGroup}>
                  <Text style={styles.title} numberOfLines={2}>{recipe.name}</Text>
                  <Text style={styles.meta} numberOfLines={2}>{recipe.prepTime} dk · {recipe.calories} kcal · P {recipe.protein}g · K {recipe.carbs}g · Y {recipe.fat}g</Text>
                </View>
                <Pressable
                  onPress={handleClose}
                  style={styles.closeButton}
                  accessibilityRole="button"
                  accessibilityLabel={`${recipe.name} detayını kapat`}
                  hitSlop={8}
                >
                  <MaterialCommunityIcons name="close" size={24} color={colors.textMuted} />
                </Pressable>
              </View>

              <View style={styles.divider} />

              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <Text style={styles.sectionTitle}>İçindekiler</Text>
                {recipe.ingredients.map((ingredient, index) => (
                  <StaggeredItem key={`ing-${index}`} index={index} baseDelay={150}>
                    <View style={styles.ingredientRow}>
                      <View style={styles.dot} />
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  </StaggeredItem>
                ))}

                <View style={styles.sectionSpacer} />

                <Text style={styles.sectionTitle}>Yapılışı</Text>
                {recipe.steps.map((step, index) => (
                  <StaggeredItem key={`step-${index}`} index={ingredientCount + index} baseDelay={150}>
                    <View style={styles.stepRow}>
                      <Text style={styles.stepNumber}>{index + 1}.</Text>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  </StaggeredItem>
                ))}

                <View style={styles.bottomSpacer} />
              </ScrollView>
            </GlassContainer>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
});

RecipeDetailOverlay.displayName = 'RecipeDetailOverlay';

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
    height: SCREEN_HEIGHT * 0.75,
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
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  thumbnailCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    flexShrink: 0,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontFamily: typography.displayFont,
    fontSize: typography.heading2,
    color: colors.textPrimary,
    lineHeight: typography.heading2 * typography.lineHeightTight,
  },
  meta: {
    fontFamily: typography.bodyFont,
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    padding: spacing.xs,
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontFamily: typography.bodyFontBold,
    fontSize: typography.subheading,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    flexShrink: 0,
  },
  ingredientText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  sectionSpacer: {
    height: spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  stepNumber: {
    fontFamily: typography.bodyFontBold,
    fontSize: typography.body,
    color: colors.accent,
    flexShrink: 0,
    minWidth: 20,
  },
  stepText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: typography.body * typography.lineHeightNormal,
    flex: 1,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

export default RecipeDetailOverlay;
