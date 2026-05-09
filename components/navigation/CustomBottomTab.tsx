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
