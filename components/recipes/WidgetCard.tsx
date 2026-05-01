import React, { useRef, useCallback } from 'react';
import { StyleSheet, Text, View, ViewStyle, LayoutRectangle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import AnimatedPressable from '../shared/AnimatedPressable';

interface Props {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: 'small' | 'large';
  onExpand?: (layout: LayoutRectangle) => void;
  style?: ViewStyle;
}

/**
 * Recipes ekranındaki widget kartı bileşeni.
 * Artık basıldığında koordinatlarını ölçüp onExpand callback'ine iletir.
 */
const WidgetCard = React.memo(({
  title,
  icon,
  variant = 'small',
  onExpand,
  style
}: Props) => {
  const cardRef = useRef<View>(null);

  const handlePress = useCallback(() => {
    cardRef.current?.measure((x, y, width, height, pageX, pageY) => {
      onExpand?.({ x: pageX, y: pageY, width, height });
    });
  }, [onExpand]);

  return (
    <View ref={cardRef} collapsable={false} style={variant === 'large' ? styles.fullWidth : styles.flex1}>
      <AnimatedPressable
        onPress={handlePress}
        style={[
          styles.container,
          variant === 'large' ? styles.largeContainer : styles.smallContainer,
          style
        ]}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name={icon} size={28} color={colors.accent} />
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        
        {variant === 'large' && (
          <View style={styles.contentPlaceholder}>
            <Text style={styles.placeholderText}>Tarif listesi yakında burada...</Text>
          </View>
        )}
      </AnimatedPressable>
    </View>
  );
});

WidgetCard.displayName = 'WidgetCard';

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  smallContainer: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeContainer: {
    width: '100%',
    minHeight: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: typography.bodyFontBold,
    fontSize: typography.subheading,
    color: colors.textPrimary,
  },
  contentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  placeholderText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.caption,
    color: colors.textMuted,
  },
});

export default WidgetCard;
