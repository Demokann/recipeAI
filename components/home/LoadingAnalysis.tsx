import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import GlassContainer from '../shared/GlassContainer';

interface Props {
  visible: boolean;
}

/**
 * Görüntü analizi sırasında gösterilen yükleme ekranı.
 * Merkezi bir pulse animasyonu ve bilgilendirme metinleri içerir.
 */
const LoadingAnalysis = React.memo(({ visible }: Props) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      opacity.value = 1;
      scale.value = 1;
    }
  }, [visible, opacity, scale]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <GlassContainer intensity={90} style={styles.glass}>
          <View style={styles.content}>
            {/* Animated Circle */}
            <Animated.View style={[styles.pulseCircle, animatedCircleStyle]}>
              <View style={styles.innerCircle} />
            </Animated.View>

            <Text style={styles.title}>Yemeğin analiz ediliyor...</Text>
            <Text style={styles.subtitle}>Bu birkaç saniye sürebilir</Text>
          </View>
        </GlassContainer>
      </View>
    </Modal>
  );
});

LoadingAnalysis.displayName = 'LoadingAnalysis';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  glass: {
    width: '85%',
    padding: spacing.xxxl,
    borderRadius: 32,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  pulseCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent + '20', // %12 civarı opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  innerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  title: {
    fontFamily: typography.bodyFontBold,
    fontSize: typography.subheading,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontStyle: 'italic',
  },
  subtitle: {
    fontFamily: typography.bodyFont,
    fontSize: typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default LoadingAnalysis;
