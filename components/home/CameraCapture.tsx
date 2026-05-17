import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { shadows } from '../../constants/shadows';
import AnimatedPressable from '../shared/AnimatedPressable';
import { cameraService } from '../../services/cameraService';
import { useCalorieStore } from '../../store/calorieStore';

const SPRING = { mass: 0.6, damping: 18, stiffness: 200 };

const CameraCapture = React.memo(() => {
  const analyzeImage = useCalorieStore((state) => state.analyzeImage);
  const [sheetVisible, setSheetVisible] = useState(false);

  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(300);

  const openSheet = useCallback(() => {
    // Reset to start position before making visible to avoid flash
    sheetTranslateY.value = 300;
    backdropOpacity.value = 0;
    setSheetVisible(true);
    backdropOpacity.value = withTiming(1, { duration: 250 });
    sheetTranslateY.value = withSpring(0, SPRING);
  }, [backdropOpacity, sheetTranslateY]);

  const closeSheet = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    sheetTranslateY.value = withTiming(300, {
      duration: 220,
      easing: Easing.in(Easing.quad),
    }, (finished) => {
      if (finished) runOnJS(setSheetVisible)(false);
    });
  }, [backdropOpacity, sheetTranslateY]);

  const handleCapture = useCallback(() => {
    closeSheet();
    // Wait for sheet animation + modal unmount before opening system camera
    setTimeout(async () => {
      try {
        const hasPermission = await cameraService.requestPermission();
        if (!hasPermission) {
          Alert.alert('İzin Gerekli', 'Kamera izni verilmedi. Lütfen ayarlardan izin verin.');
          return;
        }
        const base64 = await cameraService.captureFood();
        await analyzeImage(base64);
      } catch (err: any) {
        if (!err.message?.includes('iptal')) {
          Alert.alert('Hata', err.message || 'Bir hata oluştu.');
        }
      }
    }, 350);
  }, [closeSheet, analyzeImage]);

  const handleGallery = useCallback(() => {
    closeSheet();
    setTimeout(async () => {
      try {
        const base64 = await cameraService.pickFromGallery();
        await analyzeImage(base64);
      } catch (err: any) {
        if (!err.message?.includes('iptal')) {
          Alert.alert('Hata', err.message || 'Bir hata oluştu.');
        }
      }
    }, 350);
  }, [closeSheet, analyzeImage]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  return (
    <>
      <View style={styles.container}>
        <AnimatedPressable
          onPress={openSheet}
          style={styles.cameraButton}
          scaleValue={0.9}
          accessibilityLabel="Yemeği fotoğrafla"
          accessibilityHint="Fotoğraf çekme veya galeriden seçme seçeneklerini gösterir"
        >
          <MaterialCommunityIcons name="camera" size={32} color="#FFFFFF" />
        </AnimatedPressable>
        <Text style={styles.cameraText}>Yemeğini fotoğrafla, kalorisini öğren</Text>
      </View>

      <Modal
        transparent
        visible={sheetVisible}
        animationType="none"
        onRequestClose={closeSheet}
        statusBarTranslucent
      >
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
        </Animated.View>

        <View style={styles.sheetWrapper} pointerEvents="box-none">
          <Animated.View style={[styles.sheet, sheetStyle]}>
            <View style={styles.handle} />

            <AnimatedPressable
              onPress={handleCapture}
              style={styles.option}
              accessibilityRole="button"
              accessibilityLabel="Fotoğraf çek"
            >
              <View style={styles.optionIcon}>
                <MaterialCommunityIcons name="camera-outline" size={22} color={colors.accent} />
              </View>
              <Text style={styles.optionLabel}>Fotoğraf çek</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
            </AnimatedPressable>

            <View style={styles.separator} />

            <AnimatedPressable
              onPress={handleGallery}
              style={styles.option}
              accessibilityRole="button"
              accessibilityLabel="Galeriden yükle"
            >
              <View style={styles.optionIcon}>
                <MaterialCommunityIcons name="image-outline" size={22} color={colors.accent} />
              </View>
              <Text style={styles.optionLabel}>Galeriden yükle</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
            </AnimatedPressable>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
});

CameraCapture.displayName = 'CameraCapture';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.medium,
    shadowColor: colors.accent,
  },
  cameraText: {
    fontFamily: typography.bodyFontMedium,
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'rgba(250,247,242,0.98)',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingBottom: spacing.xxl + spacing.xl,
    ...shadows.glass,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.textMuted,
    opacity: 0.3,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: `${colors.accent}18`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    flex: 1,
    fontFamily: typography.bodyFontMedium,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.xl,
  },
});

export default CameraCapture;
