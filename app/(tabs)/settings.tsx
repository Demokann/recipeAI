import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

/**
 * Settings ekranı — placeholder.
 * Sonradan profil, dil ve bildirim ayarları eklenecek.
 */
export default function SettingsScreen() {
  return (
    <SafeAreaView
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel="Ayarlar ekranı"
    >
      <View style={styles.center}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel="Settings"
        >
          Settings
        </Text>
        <Text
          style={styles.subtitle}
          accessibilityRole="text"
          accessibilityLabel="Yakında geliyor"
        >
          Yakında...
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.displayFont,
    fontSize: typography.heading1,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: typography.bodyFont,
    fontSize: typography.body,
    color: colors.textMuted,
  },
});
