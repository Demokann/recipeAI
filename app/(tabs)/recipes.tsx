import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, LayoutRectangle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import WidgetCard from '../../components/recipes/WidgetCard';
import ExpandedOverlay from '../../components/recipes/ExpandedOverlay';

/**
 * Recipes (Tarifler) ana ekranı.
 * Widget'ların genişleme animasyonu ExpandedOverlay ile yönetilir.
 */
export default function RecipesScreen() {
  const [expandedWidget, setExpandedWidget] = useState<{
    title: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    layout: LayoutRectangle;
  } | null>(null);

  const handleExpand = useCallback((title: string, icon: keyof typeof MaterialCommunityIcons.glyphMap, layout: LayoutRectangle) => {
    setExpandedWidget({ title, icon, layout });
  }, []);

  const handleClose = useCallback(() => {
    setExpandedWidget(null);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Tarifler</Text>
        
        <View style={styles.row}>
          <WidgetCard 
            title="Popüler" 
            icon="fire" 
            onExpand={(layout) => handleExpand('Popüler', 'fire', layout)}
          />
          <WidgetCard 
            title="Favoriler" 
            icon="heart" 
            onExpand={(layout) => handleExpand('Favoriler', 'heart', layout)}
          />
        </View>
        
        <WidgetCard 
          title="Sana Özel" 
          icon="star" 
          variant="large"
          style={styles.largeWidget}
          onExpand={(layout) => handleExpand('Sana Özel', 'star', layout)}
        />

        <WidgetCard 
          title="Hızlı Tarifler" 
          icon="timer-outline" 
          variant="large"
          style={styles.largeWidget}
          onExpand={(layout) => handleExpand('Hızlı Tarifler', 'timer-outline', layout)}
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
