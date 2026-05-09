import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NutrientItem } from '../../types/calorie';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface CardProps {
  item: NutrientItem;
  index: number;
}

/**
 * Tek bir besin makro kartı — daire şeklinde, stagger pop animasyonlu.
 */
const SingleNutrientCard = React.memo(({ item, index }: CardProps) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const staggerDelay = index * 100;

  useEffect(() => {
    scale.value = withDelay(
      staggerDelay,
      withSpring(1, { mass: 0.5, damping: 12, stiffness: 200 })
    );
    opacity.value = withDelay(
      staggerDelay,
      withSpring(1, { mass: 0.5, damping: 15, stiffness: 200 })
    );
  }, [staggerDelay, scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const softBg = item.color + '26'; // ~15% opacity
  const softBorder = item.color + '66'; // ~40% opacity

  return (
    <Animated.View
      style={[styles.card, animStyle, { backgroundColor: softBg, borderColor: softBorder }]}
      accessibilityRole="text"
      accessibilityLabel={`${item.label}: ${item.value}${item.unit}`}
    >
      {/* Dekoratif iç halka */}
      <View style={[styles.innerRing, { borderColor: item.color + '4D' }]}>
        {/* İkon */}
        <MaterialCommunityIcons
          name={item.icon as any}
          size={26}
          color={item.color}
          style={styles.icon}
        />

        {/* Değer */}
        <Text style={[styles.value, { color: item.color }]}>
          {item.value}{item.unit}
        </Text>

        {/* Etiket */}
        <Text style={styles.label}>{item.label}</Text>
      </View>
    </Animated.View>
  );
});

SingleNutrientCard.displayName = 'SingleNutrientCard';

interface Props {
  nutrients: NutrientItem[];
}

/**
 * Besin makrolarını yatay ScrollView içinde oval kartlar olarak gösterir.
 * "Makrolar" başlığı yoktur — spec gereği kaldırıldı.
 */
const NutrientCard = React.memo(({ nutrients }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      accessibilityRole="list"
      accessibilityLabel="Besin değerleri"
    >
      {nutrients.map((item, index) => (
        <SingleNutrientCard key={item.label} item={item} index={index} />
      ))}
    </ScrollView>
  );
});

NutrientCard.displayName = 'NutrientCard';

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    width: 100,
    height: 110,
    borderRadius: 999,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  innerRing: {
    width: 86,
    height: 96,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    marginBottom: 0,
  },
  value: {
    fontFamily: typography.bodyFontBold,
    fontSize: 18,
    lineHeight: 20,
  },
  label: {
    fontFamily: typography.bodyFont,
    fontSize: typography.micro,
    color: colors.textMuted,
  },
});

export default NutrientCard;
