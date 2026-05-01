
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/spacing';
import FilterChip from './FilterChip';

const FILTERS = [
  "⚡ 15 dk'da Hazır",
  '🌾 Gluten-free',
  '🌿 Vegan',
  '💪 Yüksek Protein',
  '🥗 Salata',
  '🍲 Çorba',
];

const FilterChipRow = () => {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());

  const handlePress = (filter: string) => {
    setSelectedFilters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(filter)) {
        newSet.delete(filter);
      } else {
        newSet.add(filter);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {FILTERS.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            isSelected={selectedFilters.has(filter)}
            onPress={() => handlePress(filter)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
});

export default FilterChipRow;
