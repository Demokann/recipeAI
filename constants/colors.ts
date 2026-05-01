/**
 * Uygulama genelinde kullanılan tüm renk sabitleri.
 * Kaynak: PROJECT_SPEC.md → "Renk Paleti" bölümü
 * Hiçbir bileşen bu dosya dışında raw hex string kullanmaz.
 */
export const colors = {
  // Arka planlar
  background: '#F5F0E8',
  cardBg: 'rgba(255,255,255,0.80)',
  glassBg: 'rgba(245,240,232,0.75)',
  bottomNavBg: 'rgba(255,255,255,0.90)',
  // Metin
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#A0A0A0',
  // Vurgu & sınır
  accent: '#E76F51',
  border: 'rgba(255,255,255,0.5)',
  borderSubtle: 'rgba(0,0,0,0.06)',
  // Besin değeri renkleri
  nutrientProtein: '#E76F51',
  nutrientCarbs: '#F4A261',
  nutrientFats: '#457B9D',
  nutrientFiber: '#2A9D8F',
  // Favoriler
  favoriteActive: '#E63946',
  favoriteInactive: '#A0A0A0',
} as const;

export type ColorKey = keyof typeof colors;
