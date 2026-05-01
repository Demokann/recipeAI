
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { useCalorieStore } from '@/store/calorieStore';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import AnimatedPressable from '@/components/shared/AnimatedPressable';
import BubbleCloud from '@/components/calorie/BubbleCloud';
import SuggestionCard from '@/components/calorie/SuggestionCard';

export default function CalorieResultScreen() {
  const router = useRouter();
  const analysis = useCalorieStore((state) => state.analysisResult);

  if (!analysis) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Analiz sonucu bulunamadı.</Text>
        <AnimatedPressable onPress={() => router.replace('/')} style={styles.button}>
          <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
        </AnimatedPressable>
      </SafeAreaView>
    );
  }

  const { foodName, totalCalories, suggestion } = analysis;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.foodName}>{foodName}</Text>
        <Text style={styles.totalCalories}>{totalCalories.toFixed(0)} kcal</Text>
      </View>

      <BubbleCloud analysis={analysis} />

      <View style={styles.footer}>
        <SuggestionCard suggestion={suggestion} />
        <AnimatedPressable onPress={() => router.replace('/')} style={styles.button}>
          <Text style={styles.buttonText}>Harika, Teşekkürler!</Text>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  foodName: {
    ...typography.title,
    color: colors.dark,
    textAlign: 'center',
  },
  totalCalories: {
    ...typography.subtitle,
    color: colors.accent,
    fontSize: 28,
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: 16,
    marginHorizontal: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.body,
    color: colors.light,
    fontWeight: 'bold',
  },
  errorText: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
