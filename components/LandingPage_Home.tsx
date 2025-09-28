import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const SLIDE_WIDTH = screenWidth - 32;

interface HeroSlide {
  title: string;
  subtitle: string;
  buttonText: string;
  img: string;
}

const heroSlides: HeroSlide[] = [
  {
    title: 'German Kitchen Engineering',
    subtitle: 'Discover Bosch self-cleaning chimneys, true brass hobs, and smart ovens. Invented for life.',
    buttonText: 'Explore Bosch',
    img: 'https://themedialab.ch/wp-content/uploads/2025/08/4.png',
  },
  {
    title: 'Architectural Hardware.',
    subtitle: 'Find the perfect details for every room, from cabinet handles and sofa legs to mortise locks.',
    buttonText: 'View the Enarc',
    img: 'https://themedialab.ch/wp-content/uploads/2025/08/Godwin-1.png',
  },
  {
    title: "Creative Power in Hardware",
    subtitle: 'Transform your space with an elegant collection of cabinet, wardrobe, and door handles with premium PVD finishes.',
    buttonText: 'Discover Pisa',
    img: 'https://themedialab.ch/wp-content/uploads/2025/08/Godwin-3.png',
  },
];

const LandingPage_Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % heroSlides.length;
        scrollRef.current?.scrollTo({ x: next * SLIDE_WIDTH, animated: true });
        return next;
      });
    }, 8000);
    return () => clearInterval(slideInterval);
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SLIDE_WIDTH);
    if (idx !== currentSlide) {
      setCurrentSlide(Math.max(0, Math.min(heroSlides.length - 1, idx)));
    }
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SLIDE_WIDTH);
    const clampedIdx = Math.max(0, Math.min(heroSlides.length - 1, idx));
    const targetX = clampedIdx * SLIDE_WIDTH;
    if (Math.abs(x - targetX) > 0.5) {
      scrollRef.current?.scrollTo({ x: targetX, animated: false });
    }
  };

  const goToSlide = (index: number) => {
    if (index < 0 || index >= heroSlides.length) return;
    setCurrentSlide(index);
    scrollRef.current?.scrollTo({ x: index * SLIDE_WIDTH, animated: true });
  };

  const handleButtonPress = (buttonText: string) => {
    console.log('Button pressed:', buttonText);
  };

  return (
    <View style={styles.container}>
      <View style={styles.heroContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumEnd}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToOffsets={heroSlides.map((_, i) => i * SLIDE_WIDTH)}
          snapToAlignment="start"
          bounces={false}
          alwaysBounceHorizontal={false}
          overScrollMode="never"
          directionalLockEnabled
          style={styles.scrollView}
        >
          {heroSlides.map((slide, index) => (
            <View key={index} style={styles.slide}>
              <Image source={{ uri: slide.img }} style={styles.backgroundImage} contentFit="cover" />
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'rgba(0, 0, 0, 0.26)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              />
              <View style={styles.content}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <Text style={styles.subtitle}>{slide.subtitle}</Text>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={() => handleButtonPress(slide.buttonText)}
                  >
                    <Text style={styles.buttonText}>{slide.buttonText}</Text>
                    <ArrowRight size={18} color="#ffffff" style={styles.arrow} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.indicators}>
          {heroSlides.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: currentSlide === index ? '#f97316' : 'rgba(255,255,255,0.5)',
                  width: currentSlide === index ? 24 : 8,
                },
              ]}
              onPress={() => goToSlide(index)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  heroContainer: {
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: Platform.OS === 'android' ? 12 : 0,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  slide: {
    width: SLIDE_WIDTH,
    height: 400,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
    zIndex: 2,
  },
  textContainer: {
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 17,
    color: '#ffffff',
    marginBottom: 28,
    lineHeight: 24,
    opacity: 0.95,
  },
  button: {
    backgroundColor: '#f97316',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: 160,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  arrow: {
    marginLeft: 4,
  },
  indicators: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    zIndex: 3,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
});

export default LandingPage_Home;
