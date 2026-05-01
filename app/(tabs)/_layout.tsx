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
