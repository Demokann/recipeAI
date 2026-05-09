import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { shadows } from '../../constants/shadows';
import AnimatedPressable from '../shared/AnimatedPressable';
import { mockCameraService } from '../../services/mockCameraService';
import { useCalorieStore } from '../../store/calorieStore';

/**
 * Kamera başlatma ve fotoğraf çekme işlemlerini yöneten bileşen.
 * mockCameraService kullanarak izin ve çekim süreçlerini simüle eder.
 */
const CameraCapture = React.memo(() => {
  const analyzeImage = useCalorieStore((state) => state.analyzeImage);

  const handleCapture = useCallback(async () => {
    try {
      // 1. İzin kontrolü
      const hasPermission = await mockCameraService.requestPermission();
      if (!hasPermission) {
        Alert.alert('Hata', 'Kamera izni verilmedi.');
        return;
      }

      // 2. Fotoğraf çekimi (mock)
      const imageUri = await mockCameraService.captureFood();
      
      // 3. Analiz başlatma
      if (imageUri) {
        await analyzeImage(imageUri);
      }
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu.');
    }
  }, [analyzeImage]);

  return (
    <View style={styles.container}>
      <AnimatedPressable 
        onPress={handleCapture}
        style={styles.cameraButton} 
        scaleValue={0.9}
      >
        <MaterialCommunityIcons name="camera" size={32} color="#FFFFFF" />
      </AnimatedPressable>
      <Text style={styles.cameraText}>Yemeğini fotoğrafla, kalorisini öğren</Text>
    </View>
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
    shadowColor: colors.accent, // Accent renginde gölge için override
  },
  cameraText: {
    fontFamily: typography.bodyFontMedium,
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default CameraCapture;
