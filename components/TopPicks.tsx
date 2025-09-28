import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;
const isDesktop = Platform.OS === 'web' && screenWidth > 1024;

// Card width — larger on desktop/tablet
const itemWidth = isDesktop ? 200 : isTablet ? 160 : 140;

// =============== Types ===============
interface Product {
  name: string;
  price: string;
  imgSrc: string;
  alt?: string;
}
interface CarouselItemProps {
  product: Product;
}
interface ProductCarouselProps {
  title: string;
  products: Product[];
}

// =============== Single Item ===============
const CarouselItem: React.FC<CarouselItemProps> = ({ product }) => {
  const safeColorScheme = useColorScheme() ?? 'light';
  const isDark = safeColorScheme === 'dark';
  const scaleAnim = useState(new Animated.Value(1))[0];

  const colors = {
    imageBg: isDark ? '#fdfdfdff' : '#f3f4f6',
    textPrimary: isDark ? '#f5f5f5' : '#374151',
    textSecondary: isDark ? '#f9f9f9' : '#111827',
  };

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.carouselItem, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => console.log('Product pressed:', product.name)}
      >
        <View style={[styles.productImageContainer, { backgroundColor: colors.imageBg }]}>
          <Image
            source={{ uri: product.imgSrc }}
            style={styles.productImage}
            contentFit="contain"
            transition={300}
          />
          <TouchableOpacity
            style={styles.addToCartButton}
            activeOpacity={0.8}
            onPress={() => console.log('Add to cart:', product.name)}
          >
            <ShoppingCart size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.textPrimary }]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[styles.productPrice, { color: colors.textSecondary }]}>
            {product.price}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// =============== Carousel ===============
const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products }) => {
  const safeColorScheme = useColorScheme() ?? 'light';
  const isDark = safeColorScheme === 'dark';
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const colors = {
    containerBg: isDark ? '#1e1e1e' : '#ffffff', // Match ProductListing card background
    titleText: isDark ? '#f8f8f8' : '#000', // Match ProductListing section title
    navButtonBg: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)',
    navButtonIcon: isDark ? '#ffffff' : '#374151',
  };

  // Auto scroll
  useEffect(() => {
    if (!isAutoScrolling) return;
    const interval = setInterval(() => {
      if (scrollViewRef.current && products.length > 0) {
        const nextIndex = (currentIndex + 1) % Math.max(1, products.length - 2);
        scrollViewRef.current.scrollTo({ x: nextIndex * itemWidth, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, products.length, isAutoScrolling]);

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollViewRef.current?.scrollTo({ x: newIndex * itemWidth, animated: true });
    setCurrentIndex(newIndex);
  };
  const scrollRight = () => {
    const maxIndex = Math.max(0, products.length - 3);
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollViewRef.current?.scrollTo({ x: newIndex * itemWidth, animated: true });
    setCurrentIndex(newIndex);
  };

  const handleSeeMorePress = () => {
    console.log('See more pressed for:', title);
    // Add your navigation logic here
  };

  return (
    <View style={[styles.carouselOuter, { backgroundColor: colors.containerBg }]}>
      <View style={styles.carouselHeader}>
        <Text style={[styles.carouselTitle, { color: colors.titleText }]} numberOfLines={1}>
          {title}
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={handleSeeMorePress}>
          <Text style={styles.seeMoreText}>See more</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.carouselWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          decelerationRate="fast"
          snapToInterval={itemWidth}
          snapToAlignment="start"
          onScrollBeginDrag={() => setIsAutoScrolling(false)}
          onScrollEndDrag={() => setTimeout(() => setIsAutoScrolling(true), 3000)}
          bounces={false}
        >
          {products.map((product, index) => (
            <CarouselItem key={index} product={product} />
          ))}
        </ScrollView>

        {/* Nav Buttons */}
        <TouchableOpacity
          style={[styles.navButton, styles.leftNavButton, { backgroundColor: colors.navButtonBg }]}
          onPress={scrollLeft}
        >
          <ChevronLeft size={20} color={colors.navButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, styles.rightNavButton, { backgroundColor: colors.navButtonBg }]}
          onPress={scrollRight}
        >
          <ChevronRight size={20} color={colors.navButtonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// =============== Main Component ===============
const TopPicks = () => {
  // No background color needed - let parent handle it, just like ProductListing_HomePage

const handles = [
  {
    name: "Pisa Cabinet Handle PS-021 (CP)",
    price: "₹125",
    imgSrc: "https://themedialab.ch/wp-content/uploads/2025/08/7.png"
  },
  {
    name: "Pisa Cabinet Handle PS-022 (CP)",
    price: "₹175",
    imgSrc: "https://themedialab.ch/wp-content/uploads/2025/08/8.png"
  },
  {
    name: "Pisa Cabinet Handle PS-24 (CP/TT)",
    price: "₹147",
    imgSrc: "https://themedialab.ch/wp-content/uploads/2025/08/9.png"
  },
  {
    name: "Enarc Cabinet Handle CH-135 (Antique)",
    price: "₹188",
    imgSrc: "https://themedialab.ch/wp-content/uploads/2025/08/10.png"
  },
  {
    name: "Enarc Cabinet Handle CH-116 (Antique)",
    price: "₹229",
    imgSrc: "https://themedialab.ch/wp-content/uploads/2025/08/11.png"
  },
  {
    name: "Enarc Cabinet Handle CH-POLO (Antique)",
    price: "₹232",
    imgSrc: "https://themedialab.ch/wp-content/uploads/2025/08/12.png"
  }
]

  const appliances = [
    { name: 'Bosch DWKA98H60I -  Self Clean Chimneys', price: '₹58,990', imgSrc: 'https://themedialab.ch/wp-content/uploads/2025/08/13.png' },
    { name: 'Bosch DIB128G50I - Self Clean Chimneys', price: '₹82,990', imgSrc: 'https://themedialab.ch/wp-content/uploads/2025/08/14.png' },
    { name: 'Bosch PNH6B6B12I - True Al 2D Hobs', price: '₹36,990', imgSrc: 'https://themedialab.ch/wp-content/uploads/2025/08/15.png' },
    { name: 'Bosch HGVDA0Q59K - Range Cooker', price: '₹1,89,990', imgSrc: 'https://themedialab.ch/wp-content/uploads/2025/08/16.png' },
  ];

  return (
    <ScrollView style={styles.mainContainer}>
      <ProductCarousel title="Top Picks in Handles" products={handles} />
      <ProductCarousel title="German Engineering" products={appliances} />
    </ScrollView>
  );
};

// =============== Styles ===============
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // No background color - let parent handle it like ProductListing_HomePage
  },
  carouselOuter: {
    paddingVertical: 20,
    width: '100%',
    // Remove the centering alignment to make it edge-to-edge
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, // Add horizontal padding to header only
    marginBottom: 16,
  },
  carouselTitle: { 
    fontSize: isDesktop ? 24 : 20, 
    fontWeight: '700', 
    flex: 1 
  },
  seeMoreText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#f97316', 
    marginLeft: 16 
  },
  carouselWrapper: { 
    position: 'relative', 
    width: '100%',
    // Remove padding on mobile for edge-to-edge, add on desktop/tablet for arrow space
    paddingHorizontal: isDesktop || isTablet ? 16 : 0,
  },
  carouselContent: { 
    // Edge-to-edge on mobile, with proper padding on larger screens
    paddingHorizontal: isDesktop || isTablet ? 0 : 16,
    paddingRight: 16, // Add some right padding for last item
  },
  carouselItem: {
    width: itemWidth,
    marginRight: 12,
  },
  productImageContainer: {
    height: isDesktop ? 180 : isTablet ? 150 : 120,
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 8 
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#f97316',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  productInfo: { 
    alignItems: 'center' 
  },
  productName: { 
    fontSize: 13, 
    fontWeight: '500', 
    textAlign: 'center', 
    marginBottom: 4, 
    height: 32 
  },
  productPrice: { 
    fontSize: 14, 
    fontWeight: '700' 
  },
  navButton: {
    position: 'absolute', 
    top: '50%', 
    marginTop: -20,
    width: 40, 
    height: 40, 
    borderRadius: 20,
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, 
    elevation: 4, 
    zIndex: 1,
    // Hide navigation buttons on mobile for clean edge-to-edge experience
    display: isDesktop || isTablet ? 'flex' : 'none',
  },
  leftNavButton: { 
    left: 0, // Keep within padding bounds on desktop/tablet
  },
  rightNavButton: { 
    right: 0, // Keep within padding bounds on desktop/tablet
  },
});

export default TopPicks;