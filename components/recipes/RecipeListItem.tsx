import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Recipe } from '../../types/recipe';
import FavoriteButton from './FavoriteButton';

interface Props {
  recipe: Recipe;
  onPress?: () => void;
}

const RecipeListItem = React.memo(({ recipe, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={`${recipe.name}, ${recipe.description}, ${recipe.calories} kalori`}
    >
      {/* Thumbnail Mock */}
      <View style={[styles.thumbnail, { backgroundColor: recipe.thumbnail }]} />

      {/* Text Group */}
      <View style={styles.textGroup}>
        <Text style={styles.name} numberOfLines={1}>
          {recipe.name}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {recipe.description}
        </Text>
      </View>

      {/* Action */}
      <FavoriteButton recipeId={recipe.id} recipe={recipe} />
    </Pressable>
  );
});

RecipeListItem.displayName = 'RecipeListItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
  },
  textGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: typography.bodyFontMedium,
    fontSize: typography.bodySmall,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  description: {
    fontFamily: typography.bodyFont,
    fontSize: typography.caption,
    color: colors.textMuted,
  },
});

export default RecipeListItem;
