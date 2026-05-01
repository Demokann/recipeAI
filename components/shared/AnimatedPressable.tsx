import React, { useCallback } from 'react';
import { Pressable, ViewStyle, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Props extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  scaleValue?: number;
}

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

/**
 * Dokunulduğunda hafifçe küçülme animasyonu yapan (scale) Pressable bileşeni.
 * Reanimated 3 withSpring kullanır.
 */
const AnimatedPressable = React.memo(({
  children,
  style,
  scaleValue = 0.96,
  disabled,
  onPress,
  ...rest
}: Props) => {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!disabled) {
      scale.value = withSpring(scaleValue, { mass: 0.3, damping: 10, stiffness: 300 });
    }
  }, [disabled, scaleValue]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <AnimatedPressableBase
      {...rest}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressableBase>
  );
});

AnimatedPressable.displayName = 'AnimatedPressable';

export default AnimatedPressable;
