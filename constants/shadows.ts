/**
 * Gölge stilleri — iOS shadow + Android elevation birlikte tanımlı.
 * Kaynak: PROJECT_SPEC.md → "Gölge & Derinlik Sistemi" bölümü
 */
import { Platform } from 'react-native';

const buildShadow = (
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number
) => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: radius,
  ...Platform.select({
    android: { elevation },
    ios: {},
  }),
});

export const shadows = {
  soft: buildShadow(2, 0.06, 8, 3),
  medium: buildShadow(4, 0.10, 16, 6),
  card: buildShadow(8, 0.12, 24, 10),
  glass: buildShadow(16, 0.18, 40, 20),
} as const;
