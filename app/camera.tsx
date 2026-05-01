
import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useRouter } from 'expo-router';

import CameraCapture from '@/components/camera/CameraCapture';
import LoadingAnalysis from '@/components/camera/LoadingAnalysis';
import { useCalorieStore } from '@/store/calorieStore';
import { mockCalorieService } from '@/services/mockCalorieService';
import { colors } from '@/constants/colors';

export default function CameraScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const setAnalysisResult = useCalorieStore((state) => state.setAnalysisResult);

  const handlePictureTaken = async (uri: string) => {
    setImageUri(uri);
    setIsLoading(true);
    try {
      const result = await mockCalorieService.analyzeImage(uri);
      setAnalysisResult(result);
      router.replace('/calorie-result');
    } catch (error) {
      console.error('Analysis failed:', error);
      // Handle error state in UI
      setIsLoading(false);
      setImageUri(null);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      ) : (
        <CameraCapture onPictureTaken={handlePictureTaken} />
      )}
      {isLoading && <LoadingAnalysis />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  previewImage: {
    flex: 1,
  },
});
