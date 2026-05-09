import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import FilterChipRow from '../../components/home/FilterChipRow';
import RecipeSearchBox from '../../components/home/RecipeSearchBox';
import CameraCapture from '../../components/home/CameraCapture';
import LoadingAnalysis from '../../components/home/LoadingAnalysis';
import CalorieResultCard from '../../components/home/CalorieResultCard';
import { useCalorieStore } from '../../store/calorieStore';

/**
 * Ana Sayfa (Home) ekranı.
 * Filtreler, yapay zeka destekli arama ve kalori takip başlatma butonunu içerir.
 */
export default function HomeScreen() {
  const isAnalyzing = useCalorieStore((state) => state.isAnalyzing);
  const currentResult = useCalorieStore((state) => state.currentResult);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>İyi günler 👋</Text>
            <Text style={styles.headerTitle}>Bugün ne pişiriyoruz?</Text>
          </View>

          {/* Filter Chips */}
          <FilterChipRow />

          {/* AI Search Box */}
          <RecipeSearchBox />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.line} />
          </View>

          {/* Calorie Tracker Section */}
          <View style={styles.calorieSection}>
            {!currentResult ? (
              <CameraCapture />
            ) : (
              <CalorieResultCard result={currentResult} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      <LoadingAnalysis visible={isAnalyzing} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  greeting: {
    fontFamily: typography.bodyFont,
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontFamily: typography.displayFont,
    fontSize: typography.heading1,
    color: colors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  dividerText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  calorieSection: {
    paddingBottom: spacing.xxl,
  },
});
