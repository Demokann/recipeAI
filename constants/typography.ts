/**
 * Font ailesi isimleri ve boyut skalası.
 * Kaynak: PROJECT_SPEC.md → "Tipografi" bölümü
 * Font yüklemesi: app/_layout.tsx içinde useFonts hook'u ile yapılır.
 */
export const typography = {
  // Font aileleri (expo-google-fonts isimleri)
  displayFont: 'PlayfairDisplay_700Bold',
  displayFontItalic: 'PlayfairDisplay_700BoldItalic',
  bodyFont: 'DMSans_400Regular',
  bodyFontMedium: 'DMSans_500Medium',
  bodyFontBold: 'DMSans_700Bold',
  labelFont: 'DMSans_300Light',
  // Boyut skalası
  display: 72,   // kalori sayısı gibi hero rakamlar
  heading1: 32,
  heading2: 24,
  subheading: 18,
  body: 16,
  bodySmall: 15,
  caption: 14,
  label: 13,
  micro: 11,
  // Line height çarpanları
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightLoose: 1.8,
} as const;
