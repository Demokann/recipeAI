
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import AnimatedPressable from '../shared/AnimatedPressable';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, isSelected, onPress }) => {
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring(isSelected ? colors.accent : colors.light, {
        damping: 18,
        stiffness: 220,
      }),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: withSpring(isSelected ? colors.light : colors.dark, {
        damping: 18,
        stiffness: 220,
      }),
    };
  });

  return (
    <AnimatedPressable onPress={onPress}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <Animated.Text style={[styles.label, animatedTextStyle]}>{label}</Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    marginHorizontal: spacing.xs,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
});

export default FilterChip;
