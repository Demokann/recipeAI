
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface CalorieBubbleProps {
  name: string;
  grams: number;
  calories: number;
  color: string;
  size: number;
  initialPosition: { x: number; y: number };
}

const CalorieBubble: React.FC<CalorieBubbleProps> = ({
  name,
  grams,
  calories,
  color,
  size,
  initialPosition,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);
  const position = useSharedValue(initialPosition);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      position.value = {
        x: initialPosition.x + e.translationX,
        y: initialPosition.y + e.translationY,
      };
    })
    .onEnd(() => {
      position.value = withSpring(initialPosition);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      transform: [{ translateX: position.value.x }, { translateY: position.value.y }, { scale: scale.value }],
    };
  });

  const handlePress = () => {
    setIsPressed(!isPressed);
    scale.value = withSpring(isPressed ? 1 : 1.2, { damping: 15, stiffness: 150 });
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <BlurView intensity={30} tint="light" style={styles.blurView}>
          <AnimatedPressable onPress={handlePress} style={styles.pressable}>
            {!isPressed ? (
              <Text style={styles.nameText}>{name}</Text>
            ) : (
              <Animated.View>
                <Text style={styles.detailText}>{calories.toFixed(0)} kcal</Text>
                <Text style={styles.detailText}>{grams.toFixed(1)} g</Text>
              </Animated.View>
            )}
          </AnimatedPressable>
        </BlurView>
      </Animated.View>
    </GestureDetector>
  );
};

// A simple AnimatedPressable, replace with your own if you have one
const AnimatedPressable = ({ children, onPress, style }) => {
    const scale = useSharedValue(1);
    const tapGesture = Gesture.Tap()
        .onBegin(() => {
            scale.value = withTiming(0.95);
        })
        .onFinalize(() => {
            scale.value = withTiming(1);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <GestureDetector gesture={tapGesture}>
            <Animated.View style={[style, animatedStyle]}>
                {children}
            </Animated.View>
        </GestureDetector>
    );
};


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    ...typography.body,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  detailText: {
    ...typography.body,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default CalorieBubble;
