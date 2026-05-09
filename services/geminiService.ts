import { CalorieResult } from '../types/calorie';
import { LLMResponse } from '../types/recipe';
import { colors } from '../constants/colors';

const BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function callGemini(parts: object[]): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const response = await fetch(`${BASE_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }] }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Gemini API hatası: ${response.status}`);
  }

  const data = await response.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return text;
}

function extractJson(text: string): unknown {
  // Strip markdown code fences if present
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return JSON.parse(fenced[1]);
  // Fall back to first { } or [ ] block
  const bare = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (bare) return JSON.parse(bare[1]);
  throw new Error('Geçersiz API yanıtı.');
}

export async function analyzeFood(base64Image: string): Promise<CalorieResult> {
  const prompt =
    'You are a nutrition expert. Analyze this food image and estimate the nutritional values for a typical serving.\n' +
    'Return ONLY a valid JSON object with NO markdown, NO explanation:\n' +
    '{"name":"food name in Turkish","calories":300,"protein":10,"carbs":40,"fat":8}\n' +
    'Replace the example numbers with real estimated values. calories must be a positive integer.';

  const text = await callGemini([
    { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
    { text: prompt },
  ]);

  console.log('[Gemini] analyzeFood raw response:', text);

  let parsed: any;
  try {
    parsed = extractJson(text);
  } catch {
    throw new Error('Yemek analizi yapılamadı. Lütfen daha net bir fotoğraf çekin.');
  }

  console.log('[Gemini] parsed:', JSON.stringify(parsed));

  const protein = Number(parsed.protein ?? 0);
  const carbs = Number(parsed.carbs ?? parsed.carbohydrates ?? 0);
  const fat = Number(parsed.fat ?? parsed.fats ?? 0);
  const apiCalories = Number(parsed.calories ?? parsed.kcal ?? parsed.total_calories ?? 0);
  const calories = apiCalories || Math.round(protein * 4 + carbs * 4 + fat * 9);

  return {
    foodName: parsed.name ?? 'Bilinmeyen yemek',
    totalCalories: calories,
    breakdown: [
      {
        name: 'Karbonhidrat',
        calories: Math.round(carbs * 4),
        grams: carbs,
        color: colors.nutrientCarbs,
      },
      {
        name: 'Protein',
        calories: Math.round(protein * 4),
        grams: protein,
        color: colors.nutrientProtein,
      },
      {
        name: 'Yağ',
        calories: Math.round(fat * 9),
        grams: fat,
        color: colors.nutrientFats,
      },
    ],
    nutrients: [
      { label: 'Protein', value: protein, unit: 'g', icon: 'food-drumstick', color: colors.nutrientProtein },
      { label: 'Carbs', value: carbs, unit: 'g', icon: 'barley', color: colors.nutrientCarbs },
      { label: 'Fats', value: fat, unit: 'g', icon: 'oil', color: colors.nutrientFats },
    ],
  };
}

export async function suggestRecipes(userInput: string, filters: string[]): Promise<LLMResponse> {
  const filterText = filters.length > 0 ? filters.join(', ') : 'belirtilmedi';
  const prompt =
    `Suggest 3 recipes based on: "${userInput}". Filters: ${filterText}.\n` +
    'Return ONLY a JSON array, no markdown, no explanation, all text in Turkish:\n' +
    '[{"id":"1","name":"Tarif Adı","description":"1 cümle açıklama","calories":400,"prepTime":20,"tags":[],"thumbnail":"#FF6B6B"}]';

  const text = await callGemini([{ text: prompt }]);

  let parsed: any;
  try {
    parsed = extractJson(text);
  } catch {
    throw new Error('Tarif önerisi alınamadı. Lütfen tekrar deneyin.');
  }

  const recipeList = Array.isArray(parsed) ? parsed : (parsed.recipes ?? []);

  return {
    suggestion: '',
    recipes: recipeList.map((r: any, i: number) => ({
      id: r.id ?? `gemini-${i}`,
      name: r.name,
      description: r.description ?? '',
      calories: r.calories ?? 0,
      prepTime: r.prepTime ?? 30,
      tags: r.tags ?? [],
      thumbnail: r.thumbnail ?? '#FF6B6B',
    })),
  };
}
