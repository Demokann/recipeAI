import React, { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { spacing } from '../../constants/spacing';
import FilterChip from './FilterChip';
import { useFilterStore } from '../../store/filterStore';

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
  const selectedFilters = useFilterStore((state) => state.selectedFilters);
  const toggleFilter = useFilterStore((state) => state.toggleFilter);

  const handlePress = useCallback((label: string) => {
    toggleFilter(label);
  }, [toggleFilter]);

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
          selected={selectedFilters.includes(chip)}
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
