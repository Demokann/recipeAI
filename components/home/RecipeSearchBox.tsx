import React, { useState, useCallback } from 'react';
import { StyleSheet, TextInput, View, ActivityIndicator, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { shadows } from '../../constants/shadows';
import { mockLLMService } from '../../services/mockLLMService';
import { LLMResponse } from '../../types/recipe';
import AnimatedPressable from '../shared/AnimatedPressable';
import GlassContainer from '../shared/GlassContainer';

/**
 * Yapay zeka destekli tarif arama kutusu.
 * Kullanıcının girdiği malzemelere göre mockLLMService üzerinden öneri alır.
 */
const RecipeSearchBox = React.memo(() => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LLMResponse | null>(null);

  const handleSearch = useCallback(async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await mockLLMService.query(input);
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  return (
    <View style={styles.outerContainer}>
      <GlassContainer style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Malzemelerini yaz veya ne yemek istediğini sor..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={input}
          onChangeText={setInput}
        />
        
        <View style={styles.actionRow}>
          {loading ? (
            <ActivityIndicator color={colors.accent} size="small" />
          ) : (
            <AnimatedPressable
              onPress={handleSearch}
              disabled={!input.trim()}
              style={styles.sendButton}
            >
              <Feather name="arrow-right" size={20} color="#FFFFFF" />
            </AnimatedPressable>
          )}
        </View>
      </GlassContainer>

      {result && (
        <Animated.View 
          entering={FadeInUp.springify()} 
          layout={Layout.springify()}
          style={styles.resultContainer}
        >
          <Text style={styles.resultTitle}>Önerimiz ✨</Text>
          <Text style={styles.resultText}>{result.suggestion}</Text>
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
  resultText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: typography.caption * 1.4,
  },
});

export default RecipeSearchBox;
