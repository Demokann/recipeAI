
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import GlassContainer from '../shared/GlassContainer';

interface SuggestionCardProps {
  suggestion: string;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  return (
    <GlassContainer style={styles.container}>
      <Feather name="info" size={24} color={colors.accent} style={styles.icon} />
      <Text style={styles.text}>{suggestion}</Text>
    </GlassContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    margin: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    ...typography.body,
    color: colors.dark,
    flex: 1,
  },
});

export default SuggestionCard;
