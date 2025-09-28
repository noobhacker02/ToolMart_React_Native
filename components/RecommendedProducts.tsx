import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

// ---- Responsive sizing ----
const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const isDesktop = Platform.OS === 'web' && screenWidth > 1024;

const getColumns = () => {
  if (isDesktop) return 4;
  if (isTablet) return 2;
  return 1;
};

// Card width calculation - ensure proper sizing
const cardWidth = getColumns() === 1 ? screenWidth - 64 : Math.max((screenWidth - 32) / getColumns() - 16, 160);

// Types
interface CardImage {
  imgSrc: string;
}
interface DealCardData {
  title: string;
  productName: string;
  price: string;
  images: CardImage[];
}
interface DealCardProps {
  card: DealCardData;
  colorScheme: 'light' | 'dark';
}

const DealCard: React.FC<DealCardProps> = ({ card, colorScheme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  // Use consistent theming with other components
  const isDark = colorScheme === 'dark';
  const colors = {
    cardBg: isDark ? '#1e1e1e' : '#ffffff',
    textPrimary: isDark ? '#f5f5f5' : '#1f2937',
    textSecondary: isDark ? '#c2c2c2' : '#6b7280',
    imageBg: isDark ? '#374151' : '#f3f4f6',
    navButtonBg: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)',
    navButtonIcon: isDark ? '#ffffff' : '#000000',
    indicatorInactive: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)',
  };

  const changeImage = (newIdx: number) => {
    fadeAnim.setValue(0);
    setCurrentIndex(newIdx);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const nextImage = () => changeImage((currentIndex + 1) % card.images.length);
  const prevImage = () => changeImage((currentIndex - 1 + card.images.length) % card.images.length);

  return (
    <View style={[styles.dealCard, { backgroundColor: colors.cardBg, width: cardWidth }]}>
      <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={2}>
        {card.title}
      </Text>
      <View style={[styles.imageContainer, { backgroundColor: colors.imageBg }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => console.log('Card pressed:', card.title)}
          style={{ flex: 1 }}
        >
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <Image
              source={{ uri: card.images[currentIndex].imgSrc }}
              style={styles.cardImage}
              contentFit="cover"
            />
          </Animated.View>
        </TouchableOpacity>

        {card.images.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.navButton, styles.leftButton, { backgroundColor: colors.navButtonBg }]}
              onPress={prevImage}
            >
              <ChevronLeft size={18} color={colors.navButtonIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, styles.rightButton, { backgroundColor: colors.navButtonBg }]}
              onPress={nextImage}
            >
              <ChevronRight size={18} color={colors.navButtonIcon} />
            </TouchableOpacity>

            <View style={styles.indicators}>
              {card.images.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.indicator,
                    { backgroundColor: colors.indicatorInactive },
                    idx === currentIndex && { backgroundColor: '#f97316' },
                  ]}
                />
              ))}
            </View>
          </>
        )}
      </View>
      <Text style={[styles.productName, { color: colors.textSecondary }]} numberOfLines={1}>
        {card.productName}
      </Text>
      <Text style={styles.price}>{card.price}</Text>
    </View>
  );
};

const RecommendedProducts: React.FC = () => {
  const colorScheme = useColorScheme();
  
  // Narrow the colorScheme to match our prop type
  const safeColorScheme = colorScheme ?? 'light';
  const isDark = safeColorScheme === 'dark';
  const sectionTitleColor = isDark ? '#f8f8f8' : '#000';

  const dealCards: DealCardData[] = [
    {
      title: 'Starting ₹499 | Essential Kitchen and Wardrobe Solutions',
      productName: 'Various Kitchen Solutions',
      price: 'From ₹499.00',
      images: [
        { imgSrc: 'https://assets.architecturaldigest.in/photos/6045cf4607b8c2a9c90a31cc/16:9/w_1920,h_1080,c_limit/modular-kitchen-accessories-design-interiors.jpg' },
        { imgSrc: 'https://media.diy.com/is/image/Kingfisher/magnusson-8-piece-orange-yellow-tool-set-scs13~3663602818854_01i' },
        { imgSrc: 'https://5.imimg.com/data5/ANDROID/Default/2022/5/BX/NK/LM/1102370/product-jpeg.jpg' },
      ],
    },
    {
      title: 'Heavy-Duty Power Tools',
      productName: 'Cordless Drills & Drivers',
      price: 'From ₹4,999.00',
      images: [
        { imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBFuzJSSEsPbpkwqOvlkvunpjSYhAlzgAh-g&s' },
        { imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQssdF11KF2iH1m-WN8Q0QSBKrxBdVGsaxQaA&s' },
        { imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIORJIzfwkjP3rbCj22T7iJQGywTgcdpdgYw&s' },
      ],
    },
    {
      title: 'Up to 65% off | Safety Gear',
      productName: 'Helmets, Gloves & Goggles',
      price: 'From ₹799.00',
      images: [
        { imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqZSctowtOC97Nr3Ktjfo4_wivXZ-Zfrtnww&s' },
        { imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyRMADJZTtgYZ9mDQZ39-icHvRDmSiuUpfYQ&s' },
        { imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4EqYQ0X6-lGHndlgMwI5RiTQzrhC5NaYjRe5RjeuHgZuQF-MeCs58uZZedScPb7vfLXg&usqp=CAU' },
      ],
    },
    {
      title: "Customers' Most-Loved Tools",
      productName: 'Precision Measuring Tools',
      price: 'From ₹1,299.00',
      images: [
        { imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Y6nLGWInjg8UfFhDyr_fX1ZMvuOVYNqnx0SZZZr8jIiY6WnyRMjBTZU1XGPciytT6Uk&usqp=CAU' },
        { imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSjZ_hhE9tohHcXsVQI0eLdna_B4rB3omeYw&s' },
        { imgSrc: 'https://www.creeklinehouse.com/wp-content/uploads/2024/04/Tape-Measure-01-Web.jpg' },
      ],
    },
  ];

  const columns = getColumns();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionHeading, { color: sectionTitleColor }]}>
        Recommended Products
      </Text>
      {columns === 1 ? (
        // Fix: Proper horizontal scroll with padding and no overscroll
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + 16}
          decelerationRate="fast"
          contentContainerStyle={[styles.horizontalList, { paddingRight: 16 }]}
          style={styles.horizontalScrollContainer}
          bounces={false}
          overScrollMode="never"
        >
          {dealCards.map((card, idx) => (
            <View key={idx} style={{ marginRight: idx === dealCards.length - 1 ? 0 : 16 }}>
              <DealCard card={card} colorScheme={safeColorScheme} />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.gridContainer}>
          {dealCards.map((card, idx) => (
            <DealCard key={idx} card={card} colorScheme={safeColorScheme} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  sectionHeading: {
    fontSize: isDesktop ? 32 : 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    width: '100%',
  },
  horizontalScrollContainer: {
    width: '100%',
  },
  horizontalList: {
    paddingLeft: 0,
  },
  dealCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: { 
    fontSize: isDesktop ? 20 : 18, 
    fontWeight: 'bold', 
    marginBottom: 16,
    minHeight: isDesktop ? 56 : 48,
  },
  imageContainer: { 
    height: isDesktop ? 160 : 128, 
    borderRadius: 8, 
    marginBottom: 16, 
    position: 'relative', 
    overflow: 'hidden' 
  },
  cardImage: { width: '100%', height: '100%' },
  navButton: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    marginTop: -15,
  },
  leftButton: { left: 8 },
  rightButton: { right: 8 },
  indicators: { position: 'absolute', bottom: 8, flexDirection: 'row', alignSelf: 'center' },
  indicator: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2 },
  productName: { 
    fontSize: isDesktop ? 14 : 13, 
    marginBottom: 4,
    textAlign: 'center',
  },
  price: { 
    fontSize: isDesktop ? 14 : 13, 
    fontWeight: '600', 
    color: '#f97316',
    textAlign: 'center',
  },
});

export default RecommendedProducts;