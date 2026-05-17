import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import AnimatedPressable from '../shared/AnimatedPressable';

interface Props {
  label: string;
  selected: boolean;
  onPress: (label: string) => void;
}

/**
 * Pill/chip stilinde filtre butonu.
 * Seçildiğinde renk ve ölçek animasyonu gerçekleştirir.
 */
const FilterChip = React.memo(({ label, selected, onPress }: Props) => {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 200 });
  }, [selected, progress]);

  const handlePress = useCallback(() => {
    onPress(label);
  }, [label, onPress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.cardBg, colors.accent]
    );

    return {
      backgroundColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [colors.textSecondary, '#FFFFFF']
    );

    return {
      color,
    };
  });

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.container, animatedStyle]}
      scaleValue={0.95}
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <Animated.Text style={[styles.text, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </AnimatedPressable>
  );
});

FilterChip.displayName = 'FilterChip';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: typography.bodyFontMedium,
    fontSize: typography.label,
  },
});

export default FilterChip;
