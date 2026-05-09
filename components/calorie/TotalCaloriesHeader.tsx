import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface Props {
  totalCalories: number;
}

/**
 * Kalori analiz sonucunun büyük görsel özetini gösterir.
 * countUp animasyonu TextInput üzerinden Reanimated ile sağlanır.
 */
const TotalCaloriesHeader = React.memo(({ totalCalories }: Props) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const countValue = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });
    translateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });
    countValue.value = withTiming(totalCalories, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [totalCalories, opacity, translateY, countValue]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const animatedProps = useAnimatedProps(() => ({
    value: `${Math.round(countValue.value)}`,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Text
        style={styles.label}
        accessibilityRole="text"
        accessibilityLabel="Toplam Kalori"
      >
        Toplam Kalori
      </Text>

      <AnimatedTextInput
        animatedProps={animatedProps}
        editable={false}
        style={styles.number}
        accessibilityLabel={`${totalCalories} kalori`}
        accessibilityRole="text"
      />

      <Text
        style={styles.unit}
        accessibilityRole="text"
        accessibilityLabel="kilocalorie"
      >
        kcal
      </Text>
    </Animated.View>
  );
});

TotalCaloriesHeader.displayName = 'TotalCaloriesHeader';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  label: {
    fontFamily: typography.bodyFont,
    fontSize: typography.micro,
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  number: {
    fontFamily: typography.displayFont,
    fontSize: typography.display,
    color: colors.textPrimary,
    lineHeight: typography.display * typography.lineHeightTight,
    textAlign: 'center',
    padding: 0,
    margin: 0,
    // TextInput sıfırlama — salt okunur sayı gibi görünsün
    borderWidth: 0,
    backgroundColor: 'transparent',
    minWidth: 180,
  },
  unit: {
    fontFamily: typography.bodyFontBold,
    fontSize: typography.subheading,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

export default TotalCaloriesHeader;
