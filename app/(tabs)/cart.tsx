import React, { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  View, 
  Dimensions,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart,
  Shield,
  Truck,
  ArrowRight,
  MapPin
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
  brand: string;
  rating: number;
  reviews: number;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Bosch 90cm Self-Clean Chimney (DWKA98H60I)',
    price: 58990,
    originalPrice: 64990,
    image: 'https://5.imimg.com/data5/ANDROID/Default/2025/1/482013490/WV/DD/CM/9316894/product-jpeg-500x500.jpg',
    quantity: 1,
    inStock: true,
    brand: 'Bosch',
    rating: 4.5,
    reviews: 195
  },
  {
    id: '2',
    name: 'Pisa Cabinet Handle PS-021 (160mm, PVD Gold)',
    price: 600,
    image: 'https://m.media-amazon.com/images/I/71lKStFLi-L.jpg',
    quantity: 6,
    inStock: true,
    brand: 'Pisa',
    rating: 4.3,
    reviews: 325
  },
  {
    id: '3',
    name: 'Europa Hexabolt Main Door Lock (H341)',
    price: 4945,
    originalPrice: 5999,
    image: 'https://www.europalocks.com/assets/images/product_details/Hexabolt/H-641AB/2.jpg',
    quantity: 1,
    inStock: false,
    brand: 'Europa',
    rating: 4.7,
    reviews: 180
  }
];

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const [cartItems, setCartItems] = useState(mockCartItems);

  const isDark = colorScheme === 'dark';
  const bgColor = isDark ? '#000000' : '#ffffff';
  const cardBg = isDark ? '#1a1a1a' : '#ffffff';
  const borderColor = isDark ? '#333' : '#e5e5e5';
  const textColor = isDark ? '#ffffff' : '#000000';
  const mutedColor = isDark ? '#888888' : '#666666';
  const successColor = '#22c55e';
  const warningColor = '#f59e0b';
  const errorColor = '#ef4444';

  const updateQuantity = (id: string, delta: number) => {
    console.log(`Update quantity for item ${id} by ${delta}`);
    setCartItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    console.log(`Remove item ${id} from cart`);
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleWishlist = (id: string) => {
    console.log(`Toggle wishlist for item ${id}`);
  };

  const handleCheckout = () => {
    console.log('Proceed to checkout');
  };

  const handleContinueShopping = () => {
    console.log('Continue shopping');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => 
    sum + ((item.originalPrice || item.price) - item.price) * item.quantity, 0
  );
  const shipping = subtotal > 5000 ? 0 : 199;
  const total = subtotal + shipping;

  const renderCartItem = (item: CartItem) => (
    <ThemedView key={item.id} style={[styles.cartItem, { backgroundColor: cardBg, borderColor }]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
      
      <View style={styles.itemDetails}>
        <ThemedText style={[styles.brandText, { color: mutedColor }]}>{item.brand}</ThemedText>
        <ThemedText style={[styles.itemName, { color: textColor }]} numberOfLines={2}>
          {item.name}
        </ThemedText>
        
        <View style={styles.ratingRow}>
          <ThemedText style={[styles.rating, { color: warningColor }]}>★ {item.rating}</ThemedText>
          <ThemedText style={[styles.reviews, { color: mutedColor }]}>({item.reviews})</ThemedText>
        </View>

        <View style={styles.priceRow}>
          <ThemedText style={[styles.price, { color: textColor }]}>₹{item.price.toLocaleString()}</ThemedText>
          {item.originalPrice && (
            <ThemedText style={[styles.originalPrice, { color: mutedColor }]}>
              ₹{item.originalPrice.toLocaleString()}
            </ThemedText>
          )}
        </View>

        <View style={styles.stockStatus}>
          {item.inStock ? (
            <View style={styles.stockRow}>
              <View style={[styles.stockDot, { backgroundColor: successColor }]} />
              <ThemedText style={[styles.stockText, { color: successColor }]}>In Stock</ThemedText>
            </View>
          ) : (
            <View style={styles.stockRow}>
              <View style={[styles.stockDot, { backgroundColor: errorColor }]} />
              <ThemedText style={[styles.stockText, { color: errorColor }]}>Out of Stock</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.actionRow}>
          <View style={[styles.quantityControls, { borderColor }]}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, -1)}
              style={[styles.quantityBtn, { borderColor }]}
              activeOpacity={0.7}
            >
              <Minus size={16} color={textColor} />
            </TouchableOpacity>
            <ThemedText style={[styles.quantity, { color: textColor }]}>{item.quantity}</ThemedText>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, 1)}
              style={[styles.quantityBtn, { borderColor }]}
              activeOpacity={0.7}
            >
              <Plus size={16} color={textColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.itemActions}>
            <TouchableOpacity
              onPress={() => toggleWishlist(item.id)}
              style={styles.actionBtn}
              activeOpacity={0.7}
            >
              <Heart size={18} color={mutedColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => removeItem(item.id)}
              style={styles.actionBtn}
              activeOpacity={0.7}
            >
              <Trash2 size={18} color={errorColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ThemedView>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ThemedView style={[styles.container, { backgroundColor: bgColor }]}>
          <View style={styles.header}>
            <ThemedText style={[styles.headerTitle, { color: textColor }]}>Shopping Cart</ThemedText>
          </View>
          
          <View style={styles.emptyContainer}>
            <ShoppingCart size={80} color={mutedColor} />
            <ThemedText style={[styles.emptyTitle, { color: textColor }]}>Your cart is empty</ThemedText>
            <ThemedText style={[styles.emptySubtitle, { color: mutedColor }]}>
              Add some tools to get started building your project!
            </ThemedText>
            
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinueShopping}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.continueButtonText}>Continue Shopping</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ThemedView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.header}>
          <ThemedText style={[styles.headerTitle, { color: textColor }]}>Shopping Cart</ThemedText>
          <ThemedText style={[styles.itemCount, { color: mutedColor }]}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </ThemedText>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryRow}>
              <MapPin size={16} color={successColor} />
              <ThemedText style={[styles.deliveryText, { color: textColor }]}>
                Deliver to Mumbai 400097
              </ThemedText>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <ThemedText style={[styles.changeText, { color: '#f97316' }]}>Change</ThemedText>
            </TouchableOpacity>
          </View>

          {cartItems.map(renderCartItem)}

          <ThemedView style={[styles.recommendedSection, { backgroundColor: cardBg, borderColor }]}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              Frequently bought together
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScroll}>
              {[1, 2, 3].map(i => (
                <TouchableOpacity key={i} style={[styles.recommendedItem, { borderColor }]} activeOpacity={0.7}>
                  <Image 
                    source={{ uri: 'https://numalis.com/wp-content/uploads/2023/10/Maxx-Studio-Shutterstock.jpg' }} 
                    style={styles.recommendedImage} 
                    contentFit="cover" 
                  />
                  <ThemedText style={[styles.recommendedPrice, { color: textColor }]}>₹1,299</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>
        </ScrollView>

        <ThemedView style={[styles.bottomSection, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, { color: mutedColor }]}>Subtotal</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: textColor }]}>₹{subtotal.toLocaleString()}</ThemedText>
          </View>
          
          {savings > 0 && (
            <View style={styles.summaryRow}>
              <ThemedText style={[styles.summaryLabel, { color: successColor }]}>You Save</ThemedText>
              <ThemedText style={[styles.summaryValue, { color: successColor }]}>-₹{savings.toLocaleString()}</ThemedText>
            </View>
          )}
          
          <View style={styles.summaryRow}>
            <View style={styles.shippingRow}>
              <ThemedText style={[styles.summaryLabel, { color: mutedColor }]}>Shipping</ThemedText>
              {shipping === 0 && (
                <View style={styles.freeShippingBadge}>
                  <Truck size={12} color={successColor} />
                  <ThemedText style={[styles.freeShippingText, { color: successColor }]}>FREE</ThemedText>
                </View>
              )}
            </View>
            <ThemedText style={[styles.summaryValue, { color: textColor }]}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </ThemedText>
          </View>

          <View style={[styles.totalRow, { borderTopColor: borderColor }]}>
            <ThemedText style={[styles.totalLabel, { color: textColor }]}>Total</ThemedText>
            <ThemedText style={[styles.totalValue, { color: textColor }]}>₹{total.toLocaleString()}</ThemedText>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.checkoutButtonText}>Proceed to Checkout</ThemedText>
            <ArrowRight size={18} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContinueShopping}
            style={styles.continueShoppingBtn}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.continueShoppingText, { color: '#f97316' }]}>
              Continue Shopping
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 16,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviews: {
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  stockStatus: {
    marginTop: 6,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
  },
  quantityBtn: {
    padding: 8,
    borderRightWidth: 1,
  },
  quantity: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    padding: 4,
  },
  recommendedSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  recommendedScroll: {
    marginHorizontal: -4,
  },
  recommendedItem: {
    width: 80,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: 60,
  },
  recommendedPrice: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    padding: 6,
  },
  bottomSection: {
    padding: 14,
    borderTopWidth: 1,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: '35%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  shippingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  freeShippingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeShippingText: {
    fontSize: 10,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 6,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#f97316',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueShoppingBtn: {
    alignItems: 'center',
    padding: 8,
    marginTop: 4,
  },
  continueShoppingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});