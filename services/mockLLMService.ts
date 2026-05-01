import { delay } from '../utils/delay';
import { LLMResponse } from '../types/recipe';
import { mockRecipes } from '../data/mockRecipes';

/**
 * Yapay zeka sorgularını simüle eden servis.
 * Gerçek implementasyonda OpenAI veya Anthropic API'larına bağlanacaktır.
 */
export const mockLLMService = {
  /**
   * Kullanıcının yazdığı malzemelere veya isteğe göre tarif önerir.
   */
  query: async (prompt: string): Promise<LLMResponse> => {
    // Ağ gecikmesini simüle et
    await delay(1200);

    // Mock hata simülasyonu (%5 ihtimalle)
    if (Math.random() < 0.05) {
      throw new Error('LLM servisine şu an ulaşılamıyor.');
    }

    return {
      suggestion: `"${prompt}" için önerimiz: Elindeki malzemelerle harika bir sebzeli makarna yapabilirsin. Hem pratik hem de besleyici!`,
      recipes: mockRecipes.slice(0, 3),
    };
  },
};
