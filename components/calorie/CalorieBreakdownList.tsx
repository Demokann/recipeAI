import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { CalorieBreakdown } from '../../types/calorie';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface BreakdownRowProps {
  item: CalorieBreakdown;
  maxCalories: number;
  index: number;
}

/**
 * Tek bir besin öğesinin kalori satırını gösterir.
 * Progress bar genişliği stagger delay ile Reanimated withTiming ile animate edilir.
 */
const BreakdownRow = React.memo(({ item, maxCalories, index }: BreakdownRowProps) => {
  const progressWidth = useSharedValue(0);
  const rowOpacity = useSharedValue(0);
  const rowTranslateX = useSharedValue(-16);
  const containerWidth = useSharedValue(0);

  const targetRatio = maxCalories > 0 ? item.calories / maxCalories : 0;
  const staggerDelay = index * 150;

  useEffect(() => {
    rowOpacity.value = withDelay(
      staggerDelay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
    );
    rowTranslateX.value = withDelay(
      staggerDelay,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) })
    );
  }, [staggerDelay, rowOpacity, rowTranslateX]);

  const onContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width;
      containerWidth.value = width;
      progressWidth.value = withDelay(
        staggerDelay + 100,
        withTiming(width * targetRatio, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );
    },
    [targetRatio, staggerDelay, containerWidth, progressWidth]
  );

  const rowStyle = useAnimatedStyle(() => ({
    opacity: rowOpacity.value,
    transform: [{ translateX: rowTranslateX.value }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  return (
    <Animated.View
      style={[styles.row, rowStyle]}
      accessibilityRole="text"
      accessibilityLabel={`${item.name}: ${item.calories} kalori, ${item.grams} gram`}
    >
      {/* Renkli nokta */}
      <View style={[styles.dot, { backgroundColor: item.color }]} />

      {/* Besin adı */}
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>

      {/* Progress bar */}
      <View style={styles.barTrack} onLayout={onContainerLayout}>
        <Animated.View
          style={[styles.barFill, barStyle, { backgroundColor: item.color }]}
        />
      </View>

      {/* Kalori değeri */}
      <Text style={styles.calories}>{item.calories} kcal</Text>
    </Animated.View>
  );
});

BreakdownRow.displayName = 'BreakdownRow';

interface Props {
  breakdown: CalorieBreakdown[];
}

/**
 * Kalori dağılım listesi — her besin öğesi için animasyonlu progress bar satırı.
 */
const CalorieBreakdownList = React.memo(({ breakdown }: Props) => {
  const maxCalories = Math.max(...breakdown.map((b) => b.calories), 1);

  return (
    <View
      style={styles.container}
      accessibilityRole="list"
      accessibilityLabel="Besin dağılımı"
    >
      {breakdown.map((item, index) => (
        <BreakdownRow
          key={item.name}
          item={item}
          maxCalories={maxCalories}
          index={index}
        />
      ))}
    </View>
  );
});

CalorieBreakdownList.displayName = 'CalorieBreakdownList';

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  name: {
    fontFamily: typography.bodyFont,
    fontSize: typography.label,
    color: colors.textSecondary,
    width: 96,
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  calories: {
    fontFamily: typography.bodyFontBold,
    fontSize: typography.label,
    color: colors.textPrimary,
    width: 68,
    textAlign: 'right',
    flexShrink: 0,
  },
});

export default CalorieBreakdownList;
