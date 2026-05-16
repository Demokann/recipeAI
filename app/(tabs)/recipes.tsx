import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, LayoutRectangle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Recipe } from '../../types/recipe';
import { mockRecipes } from '../../data/mockRecipes';
import { useFavorites } from '../../hooks/useFavorites';
import WidgetCard from '../../components/recipes/WidgetCard';
import ExpandedOverlay from '../../components/recipes/ExpandedOverlay';

/**
 * Recipes (Tarifler) ana ekranı.
 * Widget tıklamalarında ExpandedOverlay glassmorphism paneli açılır.
 */
export default function RecipesScreen() {
  const { favorites } = useFavorites();

  const widgetRecipes = useMemo<Record<string, Recipe[]>>(() => ({
    'Popüler': mockRecipes,
    'Favoriler': mockRecipes.filter((r) => favorites.includes(r.id)),
    'Sana Özel': mockRecipes.slice(0, 5),
    'Hızlı Tarifler': mockRecipes.filter((r) => r.prepTime <= 20),
  }), [favorites]);

  const [expandedWidget, setExpandedWidget] = useState<{
    title: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    layout: LayoutRectangle;
    recipes: Recipe[];
  } | null>(null);

  const handleExpand = useCallback(
    (
      title: string,
      icon: keyof typeof MaterialCommunityIcons.glyphMap,
      layout: LayoutRectangle,
      recipes: Recipe[],
    ) => {
      setExpandedWidget({ title, icon, layout, recipes });
    },
    []
  );

  const handleClose = useCallback(() => {
    setExpandedWidget(null);
  }, []);

  return (
    <SafeAreaView
      style={styles.safeArea}
      accessibilityRole="none"
      accessibilityLabel="Tarifler ekranı"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={styles.headerTitle}
          accessibilityRole="header"
          accessibilityLabel="Tarifler"
        >
          Tarifler
        </Text>

        <View style={styles.row}>
          <WidgetCard
            title="Popüler"
            icon="fire"
            recipes={widgetRecipes['Popüler']}
            accessibilityLabel="Popüler tarifler"
            onExpand={(layout, recipes) => handleExpand('Popüler', 'fire', layout, recipes ?? [])}
          />
          <WidgetCard
            title="Favoriler"
            icon="heart"
            recipes={widgetRecipes['Favoriler']}
            accessibilityLabel="Favori tarifler"
            onExpand={(layout, recipes) => handleExpand('Favoriler', 'heart', layout, recipes ?? [])}
          />
        </View>

        <WidgetCard
          title="Sana Özel"
          icon="star"
          variant="large"
          recipes={widgetRecipes['Sana Özel']}
          style={styles.largeWidget}
          accessibilityLabel="Sana özel tarifler"
          onExpand={(layout, recipes) => handleExpand('Sana Özel', 'star', layout, recipes ?? [])}
        />

        <WidgetCard
          title="Hızlı Tarifler"
          icon="timer-outline"
          variant="large"
          recipes={widgetRecipes['Hızlı Tarifler']}
          style={styles.largeWidget}
          accessibilityLabel="Hızlı hazırlanan tarifler"
          onExpand={(layout, recipes) => handleExpand('Hızlı Tarifler', 'timer-outline', layout, recipes ?? [])}
        />
      </ScrollView>

      {expandedWidget && (
        <ExpandedOverlay
          visible={!!expandedWidget}
          onClose={handleClose}
          title={expandedWidget.title}
          icon={expandedWidget.icon}
          recipes={expandedWidget.recipes}
          initialLayout={expandedWidget.layout}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.xxl,
    paddingBottom: 100,
  },
  headerTitle: {
    fontFamily: typography.displayFont,
    fontSize: typography.heading1,
    color: colors.textPrimary,
    marginBottom: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  largeWidget: {
    marginBottom: spacing.md,
  },
});
