import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { House, ShoppingCart, UserRound } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: isDark ? '#ccc' : 'rgba(0,0,0,0.5)',
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 1,
          borderTopColor: isDark ? '#333' : '#ddd',
          height: 110, // Reduced from 110 for better proportions
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2, // Reduced margin
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <House 
              color={color as string} 
              size={size ?? 18} 
              strokeWidth={focused ? 2.5 : 2} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size, focused }) => (
            <ShoppingCart 
              color={color as string} 
              size={size ?? 18} 
              strokeWidth={focused ? 2.5 : 2} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: 'Compare',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons 
              name="compare-arrows" 
              size={size ?? 24} 
              color={color as string} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <UserRound 
              color={color as string} 
              size={size ?? 18} 
              strokeWidth={focused ? 2.5 : 2} 
            />
          ),
        }}
      />
    </Tabs>
  );
}