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
import AnimatedPressable from '../../components/shared/AnimatedPressable';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Ana Sayfa (Home) ekranı.
 * Filtreler, yapay zeka destekli arama ve kalori takip başlatma butonunu içerir.
 */
export default function HomeScreen() {
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

          {/* Calorie Tracker Start Placeholder */}
          <View style={styles.cameraSection}>
            <AnimatedPressable style={styles.cameraButton} scaleValue={0.9}>
              <MaterialCommunityIcons name="camera" size={32} color="#FFFFFF" />
            </AnimatedPressable>
            <Text style={styles.cameraText}>Yemeğini fotoğrafla, kalorisini öğren</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  cameraSection: {
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
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cameraText: {
    fontFamily: typography.bodyFontMedium,
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
