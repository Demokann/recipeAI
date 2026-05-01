/**
 * Kalori analizi ve besin değerleri ile ilgili tipler.
 * Kaynak: PROJECT_SPEC.md → TypeScript Tip Tanımları
 */

export interface CalorieBreakdown {
  name: string;
  calories: number;
  grams: number;
  color: string;
}

export interface NutrientItem {
  label: string;
  value: number;
  unit: string;
  icon: string; // MaterialCommunityIcons ikon adı
  color: string;
}

export interface CalorieResult {
  totalCalories: number;
  breakdown: CalorieBreakdown[];
  nutrients: NutrientItem[];
  foodName: string;
}
