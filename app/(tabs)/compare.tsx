import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import Header from '@/components/Header';
import CompareSearch from '@/components/CompareSearch';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function CompareScreen() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ThemedView style={{ flex: 1 }}>
        <Header 
          addressLine="Mumbai 400097" 
          cartCount={3} 
          theme={colorScheme ?? 'light'} 
          onMenuPress={() => console.log('menu pressed')}
          onLocationPress={() => console.log('location pressed')}
          onSearch={(q) => console.log('compare search:', q)}
          onAccountPress={() => console.log('account pressed')}
          onReturnsPress={() => console.log('returns pressed')}
          onCartPress={() => console.log('go to cart')} 
        />
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <CompareSearch />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
});