import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { ArrowRight } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');
const isTablet = width > 768;
const isDesktop = Platform.OS === 'web' && width > 1024;

const getColumns = () => {
  if (isDesktop) return 4;
  if (isTablet) return 2;
  return 1;
};

const cardWidth = Math.max((width - 32) / getColumns() - 16, 160);

interface CardItem {
  name: string;
  image: string;
}

interface ToolCard {
  title: string;
  image?: string;
  description?: string;
  items?: CardItem[];
  link: string;
}

const Card: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const ProductListing_HomePage: React.FC = () => {
  const colorScheme = useColorScheme();

  const bgCard = colorScheme === 'dark' ? '#1e1e1e' : '#ffffff';
  const textColor = colorScheme === 'dark' ? '#f5f5f5' : '#1f2937';
  const descColor = colorScheme === 'dark' ? '#c2c2c2' : '#6b7280';
  const sectionTitleColor = colorScheme === 'dark' ? '#f8f8f8' : '#000';
  const itemNameColor = colorScheme === 'dark' ? '#d9dadb' : '#000';

  const toolCards: ToolCard[] = [
        {
      title: 'Smart Kitchen Appliances',
      image: 'https://media3.bosch-home.com/Images/1200x/16226574_KitchenPlanning-WhyBosch-RichMeta_1200x630.jpg',
      description: 'German-engineered chimneys, hobs, and ovens',
      link: 'Discover Bosch',
    },
    {
      title: 'Designer Architectural Hardware',
      items: [
        {
          name: 'Cabinet Handles',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZmU_r9c48Yi5zJ6cYZpAzSmD1mHNlZldG5Q&s',
        },
        {
          name: 'Main Door Handles',
          image: 'https://www.glenviewdoors.com/HARDWARE/EURO-LOCK/HDWR-EURO-SET-HORIZONTAL-T-SINTESI-Black.jpg',
        },
        {
          name: 'Mortise Locks',
          image: 'https://www.lockshop-warehouse.co.uk/info/wp-content/uploads/2024/05/internal-mortice-locks.jpg',
        },
        {
          name: 'Knobs & Kadi',
          image: 'https://bhoomihardware.com/wp-content/uploads/2024/08/Adobe_Express_20240802_1132140_1.png',
        },
      ],
      link: 'Explore all Handles',
    },
     {
      title: 'Elegant Bathroom Accessories',
      image: 'https://www.aorbis.com/wp-content/uploads/2024/09/Shower-Seat.webp',
      description: 'Complete your bathroom with our premium SS 304 sets',
      link: 'View Collections',
    },
    {
      title: 'Kitchen & Wardrobe Solutions',
      items: [
        {
          name: 'Pantry Units',
          image: 'https://kandm.london/wp-content/uploads/2021/02/PANTRY-UNITS-%E2%80%93-STORAGE-FIT-FOR-A-KING.jpg',
        },
        {
          name: 'Drawer Baskets',
          image: 'https://5.imimg.com/data5/SELLER/Default/2022/3/GG/NS/AV/70670887/tandem-drawer-unit.jpg',
        },
        {
          name: 'Corner Systems',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbXqLVg3y5WnnNkX7IH6QstUK3W1rZBHc79g&s',
        },
        {
          name: 'Wardrobe Racks',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaTUFWTnmPzPhE9fC80RenEgZ_onV2nD9fqA&s',
        },
      ],
      link: 'See all solutions',
    },
    {
      title: 'Advanced Home Security',
      image: 'https://www.europalocks.com/assets/images/product/Web%20banner%201922x523%20Mechanical.jpg',
      description: 'High-security main door locks with anti-theft engineering',
      link: 'Shop Europa Locks',
    },
    
  ];

  // Handlers: replace with your navigation logic
  const handleItemPress = (name: string) => {
    console.log('Item pressed:', name);
    // e.g., router.push(`/category/${encodeURIComponent(name)}`)
  };

  const handleCardImagePress = (title: string) => {
    console.log('Card image pressed:', title);
    // e.g., navigate to collection or feature page based on title
  };

  const handleLinkPress = (title: string) => {
    console.log('Link pressed:', title);
    // e.g., navigate to a listing for this card
  };

  const renderCard = (card: ToolCard, index: number) => (
    <View key={index} style={[styles.cardContainer, { width: cardWidth }]}>
      <Card style={[{ backgroundColor: bgCard }]}>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: textColor }]} numberOfLines={2}>
            {card.title}
          </Text>

          {card.items ? (
            <View style={styles.itemsGrid}>
              {card.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.itemContainer}>
                  {/* Image as a link */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleItemPress(item.name)}
                    style={styles.itemImageContainer}
                  >
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.itemImage} 
                      contentFit="cover" 
                    />
                  </TouchableOpacity>

                  {/* Name as a link */}
                  <TouchableOpacity activeOpacity={0.7} onPress={() => handleItemPress(item.name)}>
                    <Text style={[styles.itemName, { color: itemNameColor }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.singleImageContainer}>
              {card.image && (
                <TouchableOpacity activeOpacity={0.7} onPress={() => handleCardImagePress(card.title)}>
                  <Image 
                    source={{ uri: card.image }} 
                    style={styles.singleImage} 
                    contentFit="cover" 
                  />
                </TouchableOpacity>
              )}
              {card.description && (
                <Text style={[styles.description, { color: descColor }]} numberOfLines={2}>
                  {card.description}
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={styles.linkContainer}
            activeOpacity={0.6}
            onPress={() => handleLinkPress(card.title)}
          >
            <Text style={styles.linkText}>{card.link}</Text>
            <ArrowRight size={16} color="#f97316" style={styles.arrow} />
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
        
     {/*<Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>
        Deals You Cant Miss
        
      </Text>*/}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {toolCards.map((card, index) => renderCard(card, index))}
        </View>
      </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    
    paddingTop:25,
  },
  sectionTitle: {
    fontSize: isDesktop ? 32 : 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardContainer: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: isDesktop ? 20 : 18,
    fontWeight: 'bold',
    marginBottom: 16,
    minHeight: isDesktop ? 56 : 48,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemContainer: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImageContainer: {
    width: '100%',
    height: isDesktop ? 80 : 64,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    marginBottom: 8,
    
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemName: {
    fontSize: isDesktop ? 12 : 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  singleImageContainer: {
    marginBottom: 16,
  },
  singleImage: {
    width: '100%',
    height: isDesktop ? 160 : 128,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginBottom: 8,
  },
  description: {
    fontSize: isDesktop ? 14 : 13,
    textAlign: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: isDesktop ? 14 : 13,
    color: '#f97316',
    fontWeight: '600',
    marginRight: 4,
  },
  arrow: {
    marginLeft: 4,
  },
});

export default ProductListing_HomePage;