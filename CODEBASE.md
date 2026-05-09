### ./app/(tabs)/_layout.tsx
```typescript
import React from 'react';
import { Tabs } from 'expo-router';
import CustomBottomTab from '../../components/navigation/CustomBottomTab';

/**
 * (tabs) grubu için layout tanımı.
 * CustomBottomTab bileşenini kullanarak navigasyon barını özelleştirir.
 */
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomBottomTab {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Tarifler',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
        }}
      />
    </Tabs>
  );
}
```

### ./app/(tabs)/recipes.tsx
```typescript
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
```

### ./components/navigation/CustomBottomTab.tsx
```typescript
import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import GlassContainer from '../shared/GlassContainer';

const { width } = Dimensions.get('window');

/**
 * Özelleştirilmiş Bottom Tab Bar bileşeni.
 * Floating (yüzen) yapıdadır ve Glassmorphism efekti kullanır.
 */
const CustomBottomTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.outerContainer}>
      <GlassContainer style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // İkon seçimi
          let iconName: React.ComponentProps<typeof Feather>['name'] = 'home';
          if (route.name === 'recipes') iconName = 'book-open';
          else if (route.name === 'index') iconName = 'home';
          else if (route.name === 'settings') iconName = 'settings';

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              iconName={iconName}
              onPress={onPress}
            />
          );
        })}
      </GlassContainer>
    </View>
  );
};

interface TabItemProps {
  isFocused: boolean;
  iconName: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
}

/**
 * Her bir tab öğesi ve animasyonları.
 */
const TabItem = React.memo(({ isFocused, iconName, onPress }: TabItemProps) => {
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isFocused ? 1.15 : 1) }],
    color: isFocused ? colors.accent : colors.textMuted,
  }));

  const animatedDotStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isFocused ? 1 : 0),
    transform: [{ scale: withSpring(isFocused ? 1 : 0) }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabItem}
      activeOpacity={0.7}
    >
      <Animated.View style={animatedIconStyle}>
        <Feather name={iconName} size={24} color={isFocused ? colors.accent : colors.textMuted} />
      </Animated.View>
      <Animated.View style={[styles.dot, animatedDotStyle]} />
    </TouchableOpacity>
  );
});

TabItem.displayName = 'TabItem';

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    height: 68,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    position: 'absolute',
    bottom: 12,
  },
});

export default CustomBottomTab;
```

### ./components/recipes/ExpandedOverlay.tsx
```typescript
import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
  FadeInDown,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import { Recipe } from '../../types/recipe';
import GlassContainer from '../shared/GlassContainer';
import RecipeListItem from './RecipeListItem';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  initialLayout: { x: number; y: number; width: number; height: number } | null;
}

const SPRING_CONFIG = {
  mass: 0.7,
  damping: 18,
  stiffness: 180,
};

/**
 * Widget genişlediğinde açılan overlay bileşeni.
 * Karmaşık Reanimated animasyonları ve jest yönetimi içerir.
 */
const ExpandedOverlay = React.memo(({
  visible,
  onClose,
  title,
  icon,
  initialLayout
}: Props) => {
  const progress = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      progress.value = withSpring(1, SPRING_CONFIG);
      translateY.value = 0;
    } else {
      progress.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    progress.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  }, [onClose]);

  // Jest yönetimi
  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationY > 0) {
      translateY.value = event.nativeEvent.translationY;
    }
  };

  const onGestureEnd = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationY > 100 || event.nativeEvent.velocityY > 500) {
      runOnJS(handleClose)();
    } else {
      translateY.value = withSpring(0, SPRING_CONFIG);
    }
  };

  // Animasyon stilleri
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const containerStyle = useAnimatedStyle(() => {
    if (!initialLayout) return {};

    // Kartın genişlemiş hali: ekranın %90'ı genişlik, %70'i yükseklik
    return {
      opacity: progress.value,
      transform: [
        { translateY: translateY.value },
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [0.9, 1],
            Extrapolate.CLAMP
          )
        }
      ],
    };
  });

  if (!visible && progress.value === 0) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      <View style={styles.centerContainer}>
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={(e) => e.nativeEvent.state === 5 && onGestureEnd(e as any)}>
          <Animated.View style={[styles.cardContainer, containerStyle]}>
            <GlassContainer style={styles.glass}>
              {/* Handle Bar */}
              <View style={styles.handleBar} />
              
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <MaterialCommunityIcons name={icon} size={28} color={colors.accent} />
                  <Text style={styles.title}>{title}</Text>
                </View>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                  <MaterialCommunityIcons name="close" size={24} color={colors.textMuted} />
                </Pressable>
              </View>

              <View style={styles.divider} />

              {/* Content Area */}
              <View style={styles.content}>
                <Text style={styles.placeholderText}>
                  İçerik listesi Adım 9'da eklenecek...
                </Text>
              </View>
            </GlassContainer>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
});

ExpandedOverlay.displayName = 'ExpandedOverlay';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 500,
    height: SCREEN_HEIGHT * 0.7,
    ...shadows.glass,
  },
  glass: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: colors.glassBg,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.textMuted,
    opacity: 0.3,
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.bodyFontBold,
    fontSize: typography.heading2,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default ExpandedOverlay;
roundColor: colors.borderSubtle,
    marginHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
  },
  scrollList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    opacity: 0.5,
  },
  placeholderText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default ExpandedOverlay;
```

### ./components/recipes/FavoriteButton.tsx
```typescript
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import { useFavorites } from '../../hooks/useFavorites';
import AnimatedPressable from '../shared/AnimatedPressable';

interface Props {
  recipeId: string;
  size?: number;
}

/**
 * Trendyol tarzı animasyonlu favori butonu.
 * Tıklandığında büyüyüp küçülür ve renk değiştirir.
 */
const FavoriteButton = React.memo(({ recipeId, size = 24 }: Props) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(recipeId);
  
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(active ? 1 : 0);

  const handlePress = useCallback(async () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Toggle state
    toggleFavorite(recipeId);
    
    // Animasyonlar
    scale.value = withSpring(1.4, { mass: 0.3, damping: 8 }, () => {
      scale.value = withSpring(1);
    });
    
    colorProgress.value = withTiming(active ? 0 : 1, { duration: 300 });
  }, [recipeId, toggleFavorite, active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      colorProgress.value,
      [0, 1],
      [colors.favoriteInactive, colors.favoriteActive]
    ),
  }));

  return (
    <AnimatedPressable onPress={handlePress} style={[styles.container, animatedStyle]}>
      <Animated.View style={animatedIconStyle}>
        <AntDesign
          name={active ? 'heart' : 'hearto'}
          size={size}
        />
      </Animated.View>
    </AnimatedPressable>
  );
});

FavoriteButton.displayName = 'FavoriteButton';

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

export default FavoriteButton;
```

### ./components/recipes/RecipeListItem.tsx
```typescript
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Recipe } from '../../types/recipe';
import FavoriteButton from './FavoriteButton';

interface Props {
  recipe: Recipe;
}

/**
 * Tarif listesi öğesi.
 * Görsel (mock renk), metinler ve favori butonu içerir.
 */
const RecipeListItem = React.memo(({ recipe }: Props) => {
  return (
    <View style={styles.container}>
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
      <FavoriteButton recipeId={recipe.id} />
    </View>
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
```

### ./components/recipes/WidgetCard.tsx
```typescript
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
```

### ./components/shared/AnimatedPressable.tsx
```typescript
import React, { useCallback } from 'react';
import { Pressable, ViewStyle, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface Props extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  scaleValue?: number;
}

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

/**
 * Dokunulduğunda hafifçe küçülme animasyonu yapan (scale) Pressable bileşeni.
 * Reanimated 3 withSpring kullanır.
 */
const AnimatedPressable = React.memo(({
  children,
  style,
  scaleValue = 0.96,
  disabled,
  onPress,
  ...rest
}: Props) => {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!disabled) {
      scale.value = withSpring(scaleValue, { mass: 0.3, damping: 10, stiffness: 300 });
    }
  }, [disabled, scaleValue]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <AnimatedPressableBase
      {...rest}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressableBase>
  );
});

AnimatedPressable.displayName = 'AnimatedPressable';

export default AnimatedPressable;
```

### ./components/shared/GlassContainer.tsx
```typescript
import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../constants/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

/**
 * Glassmorphism efekti sağlayan sarmalayıcı bileşen.
 * iOS'ta BlurView kullanırken, Android'de performans için yarı şeffaf arka plan fallback'i kullanır.
 */
const GlassContainer = React.memo(({
  children,
  style,
  intensity = 80,
  tint = 'light'
}: Props) => {
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.androidContainer, style]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={[styles.iosContainer, style]}
    >
      {children}
    </BlurView>
  );
});

GlassContainer.displayName = 'GlassContainer';

const styles = StyleSheet.create({
  iosContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  androidContainer: {
    backgroundColor: 'rgba(245,240,232,0.92)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
});

export default GlassContainer;
```

### ./constants/colors.ts
```typescript
/**
 * Uygulama genelinde kullanılan tüm renk sabitleri.
 * Kaynak: PROJECT_SPEC.md → "Renk Paleti" bölümü
 * Hiçbir bileşen bu dosya dışında raw hex string kullanmaz.
 */
export const colors = {
  // Arka planlar
  background: '#F5F0E8',
  cardBg: 'rgba(255,255,255,0.80)',
  glassBg: 'rgba(245,240,232,0.75)',
  bottomNavBg: 'rgba(255,255,255,0.90)',
  // Metin
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#A0A0A0',
  // Vurgu & sınır
  accent: '#E76F51',
  border: 'rgba(255,255,255,0.5)',
  borderSubtle: 'rgba(0,0,0,0.06)',
  // Besin değeri renkleri
  nutrientProtein: '#E76F51',
  nutrientCarbs: '#F4A261',
  nutrientFats: '#457B9D',
  nutrientFiber: '#2A9D8F',
  // Favoriler
  favoriteActive: '#E63946',
  favoriteInactive: '#A0A0A0',
} as const;

export type ColorKey = keyof typeof colors;
```

### ./constants/shadows.ts
```typescript
/**
 * Gölge stilleri — iOS shadow + Android elevation birlikte tanımlı.
 * Kaynak: PROJECT_SPEC.md → "Gölge & Derinlik Sistemi" bölümü
 */
import { Platform } from 'react-native';

const buildShadow = (
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number
) => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: radius,
  ...Platform.select({
    android: { elevation },
    ios: {},
  }),
});

export const shadows = {
  soft: buildShadow(2, 0.06, 8, 3),
  medium: buildShadow(4, 0.10, 16, 6),
  card: buildShadow(8, 0.12, 24, 10),
  glass: buildShadow(16, 0.18, 40, 20),
} as const;
```

### ./constants/spacing.ts
```typescript
/**
 * Spacing scale (4px tabanlı) ve border radius sistemi.
 * Kaynak: PROJECT_SPEC.md → "Köşe Yarıçapları" bölümü
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
  cardInner: 20,
} as const;
```

### ./constants/typography.ts
```typescript
/**
 * Font ailesi isimleri ve boyut skalası.
 * Kaynak: PROJECT_SPEC.md → "Tipografi" bölümü
 * Font yüklemesi: app/_layout.tsx içinde useFonts hook'u ile yapılır.
 */
export const typography = {
  // Font aileleri (expo-google-fonts isimleri)
  displayFont: 'PlayfairDisplay_700Bold',
  displayFontItalic: 'PlayfairDisplay_700BoldItalic',
  bodyFont: 'DMSans_400Regular',
  bodyFontMedium: 'DMSans_500Medium',
  bodyFontBold: 'DMSans_700Bold',
  labelFont: 'DMSans_300Light',
  // Boyut skalası
  display: 72,   // kalori sayısı gibi hero rakamlar
  heading1: 32,
  heading2: 24,
  subheading: 18,
  body: 16,
  bodySmall: 15,
  caption: 14,
  label: 13,
  micro: 11,
  // Line height çarpanları
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightLoose: 1.8,
} as const;
```

### ./data/mockRecipes.ts
```typescript
import { Recipe } from '../types/recipe';

/**
 * Uygulama genelinde kullanılacak mock tarif verileri.
 * 8 adet tarif, farklı tag kombinasyonları ile.
 */
export const mockRecipes: Recipe[] = [
  {
    id: 'r001',
    name: 'Mercimek Çorbası',
    description: 'Geleneksel Türk lezzeti, protein deposu.',
    calories: 220,
    prepTime: 25,
    tags: ['vejetaryen', 'düşük-kalori', 'yüksek-protein'],
    thumbnail: '#E8D5B7',
  },
  {
    id: 'r002',
    name: 'Tavuk Salatası',
    description: 'Yüksek proteinli, hafif öğle yemeği seçeneği.',
    calories: 380,
    prepTime: 15,
    tags: ['yüksek-protein', '15-dk'],
    thumbnail: '#B7D5E8',
  },
  {
    id: 'r003',
    name: 'Avokadolu Tost',
    description: 'Sağlıklı yağlar içeren pratik kahvaltı.',
    calories: 290,
    prepTime: 10,
    tags: ['vejetaryen', '15-dk'],
    thumbnail: '#B7E8C8',
  },
  {
    id: 'r004',
    name: 'Sebzeli Makarna',
    description: 'Tek tencerede kolayca hazırlanan vitamin deposu.',
    calories: 420,
    prepTime: 20,
    tags: ['vejetaryen', 'tek-tencere'],
    thumbnail: '#E8C8B7',
  },
  {
    id: 'r005',
    name: 'Chia Puding',
    description: 'Besleyici ve hafif bir atıştırmalık.',
    calories: 180,
    prepTime: 5,
    tags: ['vegan', 'düşük-kalori', '15-dk'],
    thumbnail: '#D5B7E8',
  },
  {
    id: 'r006',
    name: 'Izgara Somon',
    description: 'Omega-3 kaynağı, sağlıklı akşam yemeği.',
    calories: 460,
    prepTime: 20,
    tags: ['yüksek-protein', 'glutensiz'],
    thumbnail: '#E8B7B7',
  },
  {
    id: 'r007',
    name: 'Falafel Wrap',
    description: 'Vegan dostu, doyurucu sokak lezzeti.',
    calories: 350,
    prepTime: 30,
    tags: ['vegan'],
    thumbnail: '#E8E0B7',
  },
  {
    id: 'r008',
    name: 'Muzlu Pancake',
    description: 'Sadece 3 malzemeyle hazırlanan sağlıklı tatlı.',
    calories: 310,
    prepTime: 15,
    tags: ['vejetaryen', 'tatlı', '15-dk'],
    thumbnail: '#F5DEB3',
  },
];
```

### ./hooks/useFavorites.ts
```typescript
import { useCallback } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';

/**
 * Favori işlemleri için kolay erişim sağlayan custom hook.
 * Store ile component'lar arasında katman oluşturur.
 */
export const useFavorites = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isFavoriteStore = useFavoritesStore((state) => state.isFavorite);

  const toggleFavorite = useCallback((id: string) => {
    if (isFavoriteStore(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  }, [addFavorite, removeFavorite, isFavoriteStore]);

  return {
    favorites,
    toggleFavorite,
    isFavorite: isFavoriteStore,
  };
};
```

### ./services/mockCalorieService.ts
```typescript
import { delay } from '../utils/delay';
import { CalorieResult } from '../types/calorie';
import { colors } from '../constants/colors';

/**
 * Görüntü analizi ve kalori hesaplamayı simüle eden servis.
 * Gerçek implementasyonda bir Computer Vision API'ına bağlanacaktır.
 */
export const mockCalorieService = {
  /**
   * Gönderilen görseli analiz ederek kalori ve besin değerlerini döner.
   */
  analyzeFood: async (imageUri: string): Promise<CalorieResult> => {
    // "Hesaplanıyor..." durumunu simüle etmek için uzun gecikme
    await delay(2000);

    // Mock hata simülasyonu (%10 ihtimalle)
    if (Math.random() < 0.1) {
      throw new Error('Görüntü analiz edilemedi. Lütfen daha net bir fotoğraf çekin.');
    }

    return {
      totalCalories: 615,
      foodName: 'Yaban Mersinli Pankek',
      breakdown: [
        { name: 'Karbonhidrat', calories: 372, grams: 93, color: colors.nutrientCarbs },
        { name: 'Protein', calories: 44, grams: 11, color: colors.nutrientProtein },
        { name: 'Yağ', calories: 189, grams: 21, color: colors.nutrientFats },
      ],
      nutrients: [
        { label: 'Protein', value: 11, unit: 'g', icon: 'food-drumstick', color: colors.nutrientProtein },
        { label: 'Carbs', value: 93, unit: 'g', icon: 'barley', color: colors.nutrientCarbs },
        { label: 'Fats', value: 21, unit: 'g', icon: 'oil', color: colors.nutrientFats },
      ],
    };
  },
};
```

### ./services/mockCameraService.ts
```typescript
import { delay } from '../utils/delay';

/**
 * Kamera işlemlerini simüle eden servis.
 * Gerçek implementasyonda expo-camera ve expo-image-picker kullanılacaktır.
 */
export const mockCameraService = {
  /**
   * Kamera izni ister.
   */
  requestPermission: async (): Promise<boolean> => {
    await delay(500);
    return true;
  },

  /**
   * Fotoğraf çekme işlemini simüle eder ve geçici bir URI döner.
   */
  captureFood: async (): Promise<string> => {
    await delay(1000);
    return 'mock://food-image-captured-uri';
  },
};
```

### ./services/mockLLMService.ts
```typescript
import { delay } from '../utils/delay';
import { LLMResponse } from '../types/recipe';
import { mockRecipes } from '../data/mockRecipes';

/**
 * Yapay zeka sorgularını simüle eden servis.
 * Gerçek implementasyonda OpenAI veya Anthropic API'larına bağlanacaktır.
 */
export const mockLLMService = {
  /**
   * Kullanıcının yazdığı malzemelere veya isteğe göre tarif önerir.
   */
  query: async (prompt: string): Promise<LLMResponse> => {
    // Ağ gecikmesini simüle et
    await delay(1200);

    // Mock hata simülasyonu (%5 ihtimalle)
    if (Math.random() < 0.05) {
      throw new Error('LLM servisine şu an ulaşılamıyor.');
    }

    return {
      suggestion: `"${prompt}" için önerimiz: Elindeki malzemelerle harika bir sebzeli makarna yapabilirsin. Hem pratik hem de besleyici!`,
      recipes: mockRecipes.slice(0, 3),
    };
  },
};
```

### ./store/calorieStore.ts
```typescript
import { create } from 'zustand';
import { CalorieResult } from '../types/calorie';
import { mockCalorieService } from '../services/mockCalorieService';

interface CalorieStore {
  currentResult: CalorieResult | null;
  isAnalyzing: boolean;
  error: string | null;
  setAnalyzing: (v: boolean) => void;
  analyzeImage: (uri: string) => Promise<void>;
  setResult: (r: CalorieResult) => void;
  clearResult: () => void;
}

/**
 * Kalori analizi sürecini yöneten Zustand store.
 * Persist içermez, sadece oturum süresince veriyi tutar.
 */
export const useCalorieStore = create<CalorieStore>((set) => ({
  currentResult: null,
  isAnalyzing: false,
  error: null,

  setAnalyzing: (v: boolean) => set({ isAnalyzing: v }),

  analyzeImage: async (uri: string) => {
    set({ isAnalyzing: true, error: null });
    try {
      const result = await mockCalorieService.analyzeFood(uri);
      set({ currentResult: result, isAnalyzing: false });
    } catch (err: any) {
      set({
        isAnalyzing: false,
        error: err.message || 'Analiz sırasında bir hata oluştu.',
      });
    }
  },

  setResult: (r: CalorieResult) => set({ currentResult: r }),

  clearResult: () => set({ currentResult: null, error: null }),
}));
```

### ./store/favoritesStore.ts
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesStore {
  favorites: string[]; // recipe id'leri
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

/**
 * Favori tarifleri yöneten Zustand store.
 * AsyncStorage kullanılarak oturumlar arası kalıcı hale getirilmiştir.
 */
export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (id: string) => {
        if (!get().favorites.includes(id)) {
          set((state) => ({ favorites: [...state.favorites, id] }));
        }
      },

      removeFavorite: (id: string) => {
        set((state) => ({
          favorites: state.favorites.filter((favId) => favId !== id),
        }));
      },

      isFavorite: (id: string) => {
        return get().favorites.includes(id);
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### ./types/calorie.ts
```typescript
/**
 * Kalori analizi ve besin değerleri ile ilgili tipler.
 * Kaynak: PROJECT_SPEC.md → TypeScript Tip Tanımları
 */

export interface CalorieBreakdown {
  name: string;
  calories: number;
  grams: number;
  color: string;
}

export interface NutrientItem {
  label: string;
  value: number;
  unit: string;
  icon: string; // MaterialCommunityIcons ikon adı
  color: string;
}

export interface CalorieResult {
  totalCalories: number;
  breakdown: CalorieBreakdown[];
  nutrients: NutrientItem[];
  foodName: string;
}
```

### ./types/common.ts
```typescript
/**
 * Uygulama genelinde paylaşılan temel tipler.
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ServiceError {
  message: string;
  code?: number;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  hasMore: boolean;
}
```

### ./types/recipe.ts
```typescript
/**
 * Yemek tarifi veri yapısı.
 * Kaynak: PROJECT_SPEC.md → TypeScript Tip Tanımları
 */
export interface Recipe {
  id: string;
  name: string;
  description: string;
  calories: number;
  prepTime: number; // dakika cinsinden
  tags: string[];
  thumbnail: string; // hex renk kodu veya resim URL'si
  ingredients?: string[];
}

/**
 * LLM servisinden dönen yanıt yapısı.
 */
export interface LLMResponse {
  suggestion: string;
  recipes: Recipe[];
}
```

### ./utils/delay.ts
```typescript
/**
 * Test ve mock servislerde kullanılan simüle edilmiş gecikme yardımcısı.
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
```

