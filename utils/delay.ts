/**
 * Test ve mock servislerde kullanılan simüle edilmiş gecikme yardımcısı.
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
