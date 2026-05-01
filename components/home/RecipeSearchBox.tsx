
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Text,
  Keyboard,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { shadows } from '@/constants/shadows';
import { mockLLMService } from '@/services/mockLLMService';
import AnimatedPressable from '../shared/AnimatedPressable';
import GlassContainer from '../shared/GlassContainer';

const RecipeSearchBox = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setIsLoading(true);
    setResult(null);
    const response = await mockLLMService.query(query);
    setResult(response);
    setIsLoading(false);
  };

  return (
    <View style={styles.wrapper}>
      <GlassContainer style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Malzemelerini yaz veya ne yemek istediğini sor..."
          placeholderTextColor={colors.darkGray}
          multiline
          value={query}
          onChangeText={setQuery}
        />
        <AnimatedPressable style={styles.sendButton} onPress={handleSearch}>
          {isLoading ? (
            <ActivityIndicator color={colors.light} />
          ) : (
            <Feather name="arrow-up" size={20} color={colors.light} />
          )}
        </AnimatedPressable>
      </GlassContainer>

      {result && !isLoading && (
        <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(300)}>
          <GlassContainer style={styles.resultContainer}>
            <Text style={styles.resultText}>{result}</Text>
          </GlassContainer>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    margin: spacing.md,
  },
  container: {
    borderRadius: 24,
    padding: spacing.md,
    minHeight: 80,
    justifyContent: 'space-between',
  },
  input: {
    ...typography.body,
    color: colors.dark,
    flex: 1,
    marginRight: spacing.xl + spacing.md,
  },
  sendButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  resultContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
  },
  resultText: {
    ...typography.body,
    color: colors.dark,
  },
});

export default RecipeSearchBox;
