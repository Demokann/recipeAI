import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../constants/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

/**
 * Glassmorphism efekti sağlayan sarmalayıcı bileşen.
 * iOS'ta BlurView kullanırken, Android'de performans için yarı şeffaf arka plan fallback'i kullanır.
 */
const GlassContainer = React.memo(({
  children,
  style,
  intensity = 80,
  tint = 'light'
}: Props) => {
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.androidContainer, style]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={[styles.iosContainer, style]}
    >
      {children}
    </BlurView>
  );
});

GlassContainer.displayName = 'GlassContainer';

const styles = StyleSheet.create({
  iosContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  androidContainer: {
    backgroundColor: 'rgba(245,240,232,0.92)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
});

export default GlassContainer;
