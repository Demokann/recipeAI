
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ayarlar</Text>
      </View>
      <View style={styles.content}>
        <Feather name="settings" size={64} color={colors.border} />
        <Text style={styles.placeholderText}>
          Ayarlar ekranı yakında burada olacak.
        </Text>
        <Text style={styles.subPlaceholderText}>
          Uygulama tercihlerinizi, profil bilgilerinizi ve daha fazlasını buradan yönetebileceksiniz.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: colors.dark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  placeholderText: {
    ...typography.subtitle,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  subPlaceholderText: {
    ...typography.body,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
