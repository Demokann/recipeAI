import { delay } from '../utils/delay';
import { CalorieResult } from '../types/calorie';
import { colors } from '../constants/colors';

/**
 * Görüntü analizi ve kalori hesaplamayı simüle eden servis.
 * Gerçek implementasyonda bir Computer Vision API'ına bağlanacaktır.
 */
export const mockCalorieService = {
  /**
   * Gönderilen görseli analiz ederek kalori ve besin değerlerini döner.
   */
  analyzeFood: async (imageUri: string): Promise<CalorieResult> => {
    // "Hesaplanıyor..." durumunu simüle etmek için uzun gecikme
    await delay(2000);

    // Mock hata simülasyonu (%10 ihtimalle)
    if (Math.random() < 0.1) {
      throw new Error('Görüntü analiz edilemedi. Lütfen daha net bir fotoğraf çekin.');
    }

    return {
      totalCalories: 615,
      foodName: 'Yaban Mersinli Pankek',
      breakdown: [
        { name: 'Karbonhidrat', calories: 372, grams: 93, color: colors.nutrientCarbs },
        { name: 'Protein', calories: 44, grams: 11, color: colors.nutrientProtein },
        { name: 'Yağ', calories: 189, grams: 21, color: colors.nutrientFats },
      ],
      nutrients: [
        { label: 'Protein', value: 11, unit: 'g', icon: 'food-drumstick', color: colors.nutrientProtein },
        { label: 'Carbs', value: 93, unit: 'g', icon: 'barley', color: colors.nutrientCarbs },
        { label: 'Fats', value: 21, unit: 'g', icon: 'oil', color: colors.nutrientFats },
      ],
    };
  },
};
