import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CalorieResult } from '../../types/calorie';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import TotalCaloriesHeader from '../calorie/TotalCaloriesHeader';
import CalorieBreakdownList from '../calorie/CalorieBreakdownList';
import NutrientCard from '../calorie/NutrientCard';
import AnimatedPressable from '../shared/AnimatedPressable';
import { useCalorieStore } from '../../store/calorieStore';

interface Props {
  result: CalorieResult;
}

/**
 * Kalori analiz sonucunu gösteren ana kart.
 * TotalCaloriesHeader, CalorieBreakdownList ve NutrientCard bileşenlerini birleştirir.
 */
const CalorieResultCard = React.memo(({ result }: Props) => {
  const clearResult = useCalorieStore((state) => state.clearResult);

  const handleReset = useCallback(() => {
    clearResult();
  }, [clearResult]);

  return (
    <View
      style={styles.card}
      accessibilityRole="summary"
      accessibilityLabel={`${result.foodName} kalori analizi`}
    >
      {/* Yemek adı */}
      <View style={styles.foodNameRow}>
        <Text style={styles.foodName} numberOfLines={1}>
          {result.foodName}
        </Text>
        <AnimatedPressable
          onPress={handleReset}
          style={styles.resetButton}
          scaleValue={0.88}
          accessibilityRole="button"
          accessibilityLabel="Sonucu temizle"
        >
          <Text style={styles.resetText}>Temizle</Text>
        </AnimatedPressable>
      </View>

      {/* Büyük kalori sayısı + countUp */}
      <TotalCaloriesHeader totalCalories={result.totalCalories} />

      {/* Ayırıcı çizgi */}
      <View style={styles.separator} />

      {/* Besin dağılım listesi (karbonhidrat, protein, yağ) */}
      <CalorieBreakdownList breakdown={result.breakdown} />

      {/* Ayırıcı çizgi */}
      <View style={styles.separator} />

      {/* Oval besin makro kartları (protein, carbs, fats) */}
      <NutrientCard nutrients={result.nutrients} />
    </View>
  );
});

CalorieResultCard.displayName = 'CalorieResultCard';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.xxl,
    backgroundColor: colors.cardBg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  foodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.xs,
  },
  foodName: {
    fontFamily: typography.displayFont,
    fontSize: typography.heading2,
    color: colors.textPrimary,
    flex: 1,
  },
  resetButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.borderSubtle,
    borderRadius: radius.pill,
    marginLeft: spacing.sm,
  },
  resetText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.label,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.xxl,
  },
});

export default CalorieResultCard;
