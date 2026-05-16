/**
 * Yemek tarifi veri yapısı.
 * Kaynak: PROJECT_SPEC.md → TypeScript Tip Tanımları
 */
export interface Recipe {
  id: string;
  name: string;
  description: string;
  calories: number;
  prepTime: number; // dakika cinsinden
  tags: string[];
  thumbnail: string; // hex renk kodu veya resim URL'si
  ingredients: string[];
  steps: string[];
}

/**
 * LLM servisinden dönen yanıt yapısı.
 */
export interface LLMResponse {
  suggestion: string;
  recipes: Recipe[];
}
