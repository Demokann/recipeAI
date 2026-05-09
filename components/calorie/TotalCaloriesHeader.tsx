import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface Props {
  totalCalories: number;
}

/**
 * Kalori analiz sonucunun büyük görsel özetini gösterir.
 * countUp animasyonu setState ile sağlanır (Fabric uyumlu).
 */
const TotalCaloriesHeader = React.memo(({ totalCalories }: Props) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) });
    translateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) });

    if (totalCalories <= 0) {
      setDisplayCount(0);
      return;
    }

    const duration = 800;
    const fps = 60;
    const totalFrames = Math.round((duration / 1000) * fps);
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(eased * totalCalories));
      if (frame >= totalFrames) {
        setDisplayCount(totalCalories);
        clearInterval(interval);
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [totalCalories, opacity, translateY]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
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

      <Text
        style={styles.number}
        accessibilityLabel={`${totalCalories} kalori`}
        accessibilityRole="text"
      >
        {displayCount}
      </Text>

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
