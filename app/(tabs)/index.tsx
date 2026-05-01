
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import FilterChipRow from '@/components/home/FilterChipRow';
import RecipeSearchBox from '@/components/home/RecipeSearchBox';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Merhaba!</Text>
            <Text style={styles.subHeaderText}>Bugün ne pişirmek istersin?</Text>
          </View>

          <FilterChipRow />

          <RecipeSearchBox />

          <View style={styles.divider} />

          {/* Calorie Tracker Section Placeholder */}
          <View style={styles.calorieSection}>
            <Text style={styles.sectionTitle}>Kalori Takibi</Text>
            <Text style={styles.placeholderText}>
              Yakında burada kalori takibi özelliği yer alacak.
            </Text>
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
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerText: {
    ...typography.title,
    color: colors.dark,
  },
  subHeaderText: {
    ...typography.body,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
  },
  calorieSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  placeholderText: {
    ...typography.body,
    color: colors.darkGray,
    textAlign: 'center',
    padding: spacing.lg,
  },
});
