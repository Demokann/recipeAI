
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import GlassContainer from '../shared/GlassContainer';

const ANALYSIS_MESSAGES = [
  'Yemeğiniz analiz ediliyor...',
  'Besin değerleri hesaplanıyor...',
  'Kaloriler sayılıyor, lütfen bekleyin...',
  'Lezzetli görünüyor! Sonuçlar neredeyse hazır...',
];

const LoadingAnalysis = () => {
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % ANALYSIS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <GlassContainer style={styles.content}>
        <LottieView
          source={require('@/assets/animations/loading.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Animated.View key={messageIndex} entering={ZoomIn} exiting={ZoomOut}>
          <Text style={styles.loadingText}>{ANALYSIS_MESSAGES[messageIndex]}</Text>
        </Animated.View>
      </GlassContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  content: {
    width: '80%',
    padding: spacing.lg,
    borderRadius: 24,
    alignItems: 'center',
  },
  lottie: {
    width: 150,
    height: 150,
  },
  loadingText: {
    ...typography.body,
    color: colors.dark,
    marginTop: spacing.md,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default LoadingAnalysis;
