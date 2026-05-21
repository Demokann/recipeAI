import React, { useState, useCallback } from 'react';
import { StyleSheet, TextInput, View, ActivityIndicator, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { shadows } from '../../constants/shadows';
import { suggestRecipes } from '../../services/geminiService';
import { useFilterStore } from '../../store/filterStore';
import { LLMResponse, Recipe } from '../../types/recipe';
import AnimatedPressable from '../shared/AnimatedPressable';
import GlassContainer from '../shared/GlassContainer';
import RecipeDetailOverlay from '../recipes/RecipeDetailOverlay';

/**
 * Yapay zeka destekli tarif arama kutusu.
 * Kullanıcının girdiği malzemelere göre mockLLMService üzerinden öneri alır.
 */
const RecipeSearchBox = React.memo(() => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LLMResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const selectedFilters = useFilterStore((state) => state.selectedFilters);

  const handleSearch = useCallback(async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setSelectedRecipe(null);
    setError(null);
    try {
      const response = await suggestRecipes(input, selectedFilters);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [input, loading, selectedFilters]);

  return (
    <View style={styles.outerContainer}>
      <GlassContainer style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Malzemelerini yaz..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={input}
          onChangeText={setInput}
          accessibilityLabel="Tarif veya malzeme ara"
          accessibilityHint="Malzemelerini yaz, ardından gönder butonuna bas"
          accessibilityRole="search"
        />
        
        <View style={styles.actionRow}>
          {loading ? (
            <ActivityIndicator color={colors.accent} size="small" />
          ) : (
            <AnimatedPressable
              onPress={handleSearch}
              disabled={!input.trim()}
              style={styles.sendButton}
              accessibilityLabel="Tarif ara"
              accessibilityHint="Yapay zeka ile tarif önerisi al"
            >
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </AnimatedPressable>
          )}
        </View>
      </GlassContainer>

      {result && result.recipes.length > 0 && (
        <Animated.View
          entering={FadeInUp.springify()}
          layout={Layout.springify()}
          style={styles.resultContainer}
        >
          <Text style={styles.resultTitle}>Önerilen Tarifler ✨</Text>
          {result.recipes.map((recipe) => (
            <AnimatedPressable
              key={recipe.id}
              onPress={() => setSelectedRecipe(recipe)}
              style={styles.recipeRow}
              accessibilityLabel={`${recipe.name} tarifinin detayını aç`}
              accessibilityRole="button"
            >
              <View style={[styles.recipeDot, { backgroundColor: recipe.thumbnail }]} />
              <Text style={styles.resultText}>{recipe.name}</Text>
              <Feather name="chevron-right" size={16} color={colors.textMuted} />
            </AnimatedPressable>
          ))}
        </Animated.View>
      )}

      <RecipeDetailOverlay
        visible={selectedRecipe !== null}
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      {error && (
        <Animated.View
          entering={FadeInUp.springify()}
          layout={Layout.springify()}
          style={[styles.resultContainer, styles.errorContainer]}
        >
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
});

RecipeSearchBox.displayName = 'RecipeSearchBox';

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
  },
  container: {
    borderRadius: radius.lg,
    padding: spacing.md,
    backgroundColor: colors.cardBg,
    minHeight: 100,
    ...shadows.soft,
  },
  input: {
    flex: 1,
    fontFamily: typography.bodyFont,
    fontSize: typography.body,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    paddingTop: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  sendButton: {
    backgroundColor: colors.accent,
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.soft,
  },
  resultContainer: {
    marginTop: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    ...shadows.medium,
  },
  resultTitle: {
    fontFamily: typography.bodyFontBold,
    fontSize: typography.bodySmall,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  recipeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  resultText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: typography.caption * 1.4,
    flex: 1,
  },
  errorContainer: {
    borderColor: '#FFCDD2',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.caption,
    color: '#C62828',
    lineHeight: typography.caption * 1.4,
  },
});

export default RecipeSearchBox;
