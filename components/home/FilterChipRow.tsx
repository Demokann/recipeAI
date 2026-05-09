import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { spacing } from '../../constants/spacing';
import FilterChip from './FilterChip';

const CHIPS = [
  "⚡ 15 dk'da Hazır",
  "🌾 Gluten-free",
  "🌿 Vegan",
  "💪 Yüksek Protein",
  "🥦 Vejetaryen",
  "📉 Düşük Kalori",
  "🍲 Tek Tencere",
  "🍰 Tatlı"
];

/**
 * Yatay kaydırılabilir filtre chip satırı.
 * Çoklu seçimi destekler.
 */
const FilterChipRow = React.memo(() => {
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());

  const handlePress = useCallback((label: string) => {
    setSelectedChips((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CHIPS.map((chip) => (
        <FilterChip
          key={chip}
          label={chip}
          selected={selectedChips.has(chip)}
          onPress={handlePress}
        />
      ))}
    </ScrollView>
  );
});

FilterChipRow.displayName = 'FilterChipRow';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
});

export default FilterChipRow;
