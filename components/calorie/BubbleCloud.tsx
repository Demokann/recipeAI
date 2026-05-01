
import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { CalorieAnalysis } from '@/types/calorie';
import CalorieBubble from './CalorieBubble';
import { colors } from '@/constants/colors';

interface BubbleCloudProps {
  analysis: CalorieAnalysis;
}

const BubbleCloud: React.FC<BubbleCloudProps> = ({ analysis }) => {
  const { width, height } = useWindowDimensions();
  const center = { x: width / 2, y: height / 3 };

  const { totalCalories, macros, nutrients } = analysis;

  const bubblesData = [
    { name: 'Protein', grams: macros.protein, calories: macros.protein * 4, color: colors.protein },
    { name: 'Karbonhidrat', grams: macros.carbs, calories: macros.carbs * 4, color: colors.carbs },
    { name: 'Yağ', grams: macros.fat, calories: macros.fat * 9, color: colors.fat },
    { name: 'Şeker', grams: nutrients.sugar, calories: nutrients.sugar * 4, color: '#FF6B6B' },
    { name: 'Lif', grams: nutrients.fiber, calories: nutrients.fiber * 2, color: '#4ECDC4' },
  ];

  // Simple non-overlapping positioning logic
  const positions = [];
  let angle = 0;
  const radiusIncrement = 60;
  let currentRadius = 0;

  const getBubbleSize = (calories: number) => {
    const minSize = 60;
    const maxSize = 150;
    const scale = (calories / totalCalories) * (maxSize - minSize);
    return Math.max(minSize, minSize + scale * 2);
  };

  bubblesData.forEach((bubble, index) => {
    const size = getBubbleSize(bubble.calories);
    if (index === 0) {
      currentRadius = size / 1.5;
    } else {
      currentRadius += (getBubbleSize(bubblesData[index-1].calories) + size) / 2.5;
    }
    
    const x = center.x + currentRadius * Math.cos(angle) - size / 2;
    const y = center.y + currentRadius * Math.sin(angle) - size / 2;
    
    positions.push({ x, y });
    angle += Math.PI / 2.5; // Adjust angle for spiral
  });

  return (
    <View style={styles.container}>
      {bubblesData.map((bubble, index) => (
        <CalorieBubble
          key={bubble.name}
          {...bubble}
          size={getBubbleSize(bubble.calories)}
          initialPosition={positions[index]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BubbleCloud;
