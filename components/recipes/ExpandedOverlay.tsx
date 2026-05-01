import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
  FadeInDown,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import { Recipe } from '../../types/recipe';
import GlassContainer from '../shared/GlassContainer';
import RecipeListItem from './RecipeListItem';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  initialLayout: { x: number; y: number; width: number; height: number } | null;
}

const SPRING_CONFIG = {
  mass: 0.7,
  damping: 18,
  stiffness: 180,
};

/**
 * Widget genişlediğinde açılan overlay bileşeni.
 * Karmaşık Reanimated animasyonları ve jest yönetimi içerir.
 */
const ExpandedOverlay = React.memo(({
  visible,
  onClose,
  title,
  icon,
  initialLayout
}: Props) => {
  const progress = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      progress.value = withSpring(1, SPRING_CONFIG);
      translateY.value = 0;
    } else {
      progress.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    progress.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  }, [onClose]);

  // Jest yönetimi
  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationY > 0) {
      translateY.value = event.nativeEvent.translationY;
    }
  };

  const onGestureEnd = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationY > 100 || event.nativeEvent.velocityY > 500) {
      runOnJS(handleClose)();
    } else {
      translateY.value = withSpring(0, SPRING_CONFIG);
    }
  };

  // Animasyon stilleri
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const containerStyle = useAnimatedStyle(() => {
    if (!initialLayout) return {};

    // Kartın genişlemiş hali: ekranın %90'ı genişlik, %70'i yükseklik
    return {
      opacity: progress.value,
      transform: [
        { translateY: translateY.value },
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [0.9, 1],
            Extrapolate.CLAMP
          )
        }
      ],
    };
  });

  if (!visible && progress.value === 0) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      <View style={styles.centerContainer}>
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={(e) => e.nativeEvent.state === 5 && onGestureEnd(e as any)}>
          <Animated.View style={[styles.cardContainer, containerStyle]}>
            <GlassContainer style={styles.glass}>
              {/* Handle Bar */}
              <View style={styles.handleBar} />
              
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <MaterialCommunityIcons name={icon} size={28} color={colors.accent} />
                  <Text style={styles.title}>{title}</Text>
                </View>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                  <MaterialCommunityIcons name="close" size={24} color={colors.textMuted} />
                </Pressable>
              </View>

              <View style={styles.divider} />

              {/* Content Area */}
              <View style={styles.content}>
                <Text style={styles.placeholderText}>
                  İçerik listesi Adım 9'da eklenecek...
                </Text>
              </View>
            </GlassContainer>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
});

ExpandedOverlay.displayName = 'ExpandedOverlay';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 500,
    height: SCREEN_HEIGHT * 0.7,
    ...shadows.glass,
  },
  glass: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: colors.glassBg,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.textMuted,
    opacity: 0.3,
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.bodyFontBold,
    fontSize: typography.heading2,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default ExpandedOverlay;
roundColor: colors.borderSubtle,
    marginHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
  },
  scrollList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    opacity: 0.5,
  },
  placeholderText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default ExpandedOverlay;
