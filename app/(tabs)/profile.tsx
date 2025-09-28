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
  User,
  MapPin,
  CreditCard,
  Package,
  Heart,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Gift,
  Shield,
  Truck,
  Clock,
  Edit3,
  Phone,
  Mail
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface MenuItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  rightContent?: React.ReactNode;
}

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  date: string;
}

const recentOrders: OrderItem[] = [
  {
    id: '1',
    name: ' Black Finish Smart Electronic Door Lock',
    image: 'https://www.europalocks.com/assets/images/product_details/Electronic-lock/2.%20EMB0318BL%20(L2)/1.-EMB0318BL-front-back-(L2).jpg',
    price: 20999,
    status: 'delivered',
    date: '2025-08-10'
  },
  {
    id: '2',
    name: 'Bosch Washing machines Series 6 washing machine, front loader 7.5 kg 1200 rpm',
    image: 'data:image/jpeg;base64,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',
    price: 29500.00,
    status: 'shipped',
    date: '2025-08-12'
  }
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [showAllOrders, setShowAllOrders] = useState(false);

  const isDark = colorScheme === 'dark';
  const bgColor = isDark ? '#000000' : '#f8f9fa';
  const cardBg = isDark ? '#1a1a1a' : '#ffffff';
  const borderColor = isDark ? '#333' : '#e5e5e5';
  const textColor = isDark ? '#ffffff' : '#000000';
  const mutedColor = isDark ? '#888888' : '#666666';
  const successColor = '#22c55e';
  const warningColor = '#f59e0b';
  const errorColor = '#ef4444';
  const primaryColor = '#f97316';

  const MenuItem: React.FC<MenuItemProps> = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    rightContent 
  }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: cardBg, borderColor }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#f3f4f6' }]}>
          <Icon size={20} color={primaryColor} />
        </View>
        <View style={styles.menuItemText}>
          <ThemedText style={[styles.menuItemTitle, { color: textColor }]}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={[styles.menuItemSubtitle, { color: mutedColor }]}>{subtitle}</ThemedText>
          )}
        </View>
      </View>
      {rightContent || (showChevron && <ChevronRight size={16} color={mutedColor} />)}
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return successColor;
      case 'shipped': return primaryColor;
      case 'processing': return warningColor;
      case 'cancelled': return errorColor;
      default: return mutedColor;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handlePress = (action: string) => {
    console.log('Profile action:', action);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ThemedView style={[styles.container, { backgroundColor: bgColor }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <ThemedView style={[styles.profileHeader, { backgroundColor: cardBg }]}>
            <View style={styles.profileInfo}>
              <Image 
                source={{ uri: 'https://i.pinimg.com/736x/6a/fc/5c/6afc5c43a5050054d7482202e3b75239.jpg' }} 
                style={styles.profileImage} 
                contentFit="cover" 
              />
              <View style={styles.profileDetails}>
                <ThemedText style={[styles.userName, { color: textColor }]}>Talha Shaikh</ThemedText>
                <ThemedText style={[styles.userEmail, { color: mutedColor }]}>talhatalha1971@gmail.com</ThemedText>
                <View style={styles.membershipBadge}>
                  <Star size={12} color={warningColor} fill={warningColor} />
                  <ThemedText style={[styles.membershipText, { color: warningColor }]}>Godwin Pro Member</ThemedText>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => handlePress('edit_profile')}
              activeOpacity={0.7}
            >
              <Edit3 size={16} color={primaryColor} />
            </TouchableOpacity>
          </ThemedView>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}
              onPress={() => handlePress('orders')}
              activeOpacity={0.7}
            >
              <Package size={24} color={primaryColor} />
              <ThemedText style={[styles.statNumber, { color: textColor }]}>24</ThemedText>
              <ThemedText style={[styles.statLabel, { color: mutedColor }]}>Orders</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}
              onPress={() => handlePress('wishlist')}
              activeOpacity={0.7}
            >
              <Heart size={24} color={errorColor} />
              <ThemedText style={[styles.statNumber, { color: textColor }]}>12</ThemedText>
              <ThemedText style={[styles.statLabel, { color: mutedColor }]}>Wishlist</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}
              onPress={() => handlePress('rewards')}
              activeOpacity={0.7}
            >
              <Gift size={24} color={successColor} />
              <ThemedText style={[styles.statNumber, { color: textColor }]}>₹2,450</ThemedText>
              <ThemedText style={[styles.statLabel, { color: mutedColor }]}>Rewards</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Recent Orders */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Recent Orders</ThemedText>
              <TouchableOpacity onPress={() => handlePress('view_all_orders')} activeOpacity={0.7}>
                <ThemedText style={[styles.viewAllText, { color: primaryColor }]}>View All</ThemedText>
              </TouchableOpacity>
            </View>
            
            {recentOrders.map(order => (
              <TouchableOpacity
                key={order.id}
                style={[styles.orderItem, { backgroundColor: cardBg, borderColor }]}
                onPress={() => handlePress(`order_${order.id}`)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: order.image }} style={styles.orderImage} contentFit="cover" />
                <View style={styles.orderDetails}>
                  <ThemedText style={[styles.orderName, { color: textColor }]} numberOfLines={1}>
                    {order.name}
                  </ThemedText>
                  <ThemedText style={[styles.orderPrice, { color: mutedColor }]}>
                    ₹{order.price.toLocaleString()}
                  </ThemedText>
                  <View style={styles.orderMeta}>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
                      <ThemedText style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                        {getStatusText(order.status)}
                      </ThemedText>
                    </View>
                    <ThemedText style={[styles.orderDate, { color: mutedColor }]}>
                      {new Date(order.date).toLocaleDateString()}
                    </ThemedText>
                  </View>
                </View>
                <ChevronRight size={16} color={mutedColor} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Your Account        {'\n'}          </ThemedText>
            
            <MenuItem
              icon={User}
              title="Login & security"
              subtitle="Edit login, name, and mobile number"
              onPress={() => handlePress('login_security')}
            />
            
            <MenuItem
              icon={MapPin}
              title="Your addresses"
              subtitle="Edit addresses for orders and gifts"
              onPress={() => handlePress('addresses')}
            />
            
            <MenuItem
              icon={CreditCard}
              title="Payment options"
              subtitle="Edit or add payment methods"
              onPress={() => handlePress('payment_options')}
            />
            
            <MenuItem
              icon={Phone}
              title="Contact preferences"
              subtitle="Email, SMS and push notifications"
              onPress={() => handlePress('contact_preferences')}
            />
          </View>

          {/* Orders Section */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Your Orders {'\n'} </ThemedText>
            
            <MenuItem
              icon={Package}
              title="Your orders"
              subtitle="Track, return, or buy things again"
              onPress={() => handlePress('your_orders')}
            />
            
            <MenuItem
              icon={Clock}
              title="Not yet shipped"
              onPress={() => handlePress('not_shipped')}
            />
            
            <MenuItem
              icon={Truck}
              title="Your returns"
              onPress={() => handlePress('returns')}
            />
            
            <MenuItem
              icon={Heart}
              title="Your lists"
              subtitle="Wishlist and shopping lists"
              onPress={() => handlePress('lists')}
            />
          </View>

          {/* Digital Content */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Content & Devices {'\n'} </ThemedText>
            
            <MenuItem
              icon={Gift}
              title="Your Godwin membership"
              subtitle="View benefits and manage membership"
              onPress={() => handlePress('prime_membership')}
              rightContent={
                <View style={styles.primeBadge}>
                  <ThemedText style={[styles.primeText, { color: primaryColor }]}>PRIME</ThemedText>
                </View>
              }
            />
            
            <MenuItem
              icon={Bell}
              title="Manage notifications"
              subtitle="Choose what updates you want to receive"
              onPress={() => handlePress('notifications')}
            />
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Customer Service {'\n'} </ThemedText>
            
            <MenuItem
              icon={HelpCircle}
              title="Help & Customer Service"
              subtitle="Find answers and contact us"
              onPress={() => handlePress('help')}
            />
            
            <MenuItem
              icon={Mail}
              title="Message Center"
              onPress={() => handlePress('message_center')}
            />
            
            <MenuItem
              icon={Shield}
              title="Your Account & Security"
              subtitle="Two-step verification, password"
              onPress={() => handlePress('account_security')}
            />
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Settings {'\n'} </ThemedText>
            
            <MenuItem
              icon={Settings}
              title="App settings"
              subtitle="Push notifications, country/region"
              onPress={() => handlePress('app_settings')}
            />
            
            <MenuItem
              icon={LogOut}
              title="Sign Out"
              onPress={() => handlePress('sign_out')}
              showChevron={false}
            />
          </View>

          {/* App Info */}
          <View style={[styles.appInfo, { borderTopColor: borderColor }]}>
            <ThemedText style={[styles.appVersion, { color: mutedColor }]}>
              GodwinToolStore v1.0.0 Made by Talha Shaikh
            </ThemedText>
            <View style={styles.legalLinks}>
              <TouchableOpacity onPress={() => handlePress('privacy')} activeOpacity={0.7}>
                <ThemedText style={[styles.legalLink, { color: mutedColor }]}>Privacy</ThemedText>
              </TouchableOpacity>
              <ThemedText style={[styles.separator, { color: mutedColor }]}>•</ThemedText>
              <TouchableOpacity onPress={() => handlePress('terms')} activeOpacity={0.7}>
                <ThemedText style={[styles.legalLink, { color: mutedColor }]}>Terms</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
  },
  profileDetails: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
    
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  orderImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  orderDetails: {
    flex: 1,
    marginLeft: 12,
  },
  orderName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderPrice: {
    fontSize: 13,
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  orderDate: {
    fontSize: 12,
    
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    
    
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    
    
  },
  menuItemSubtitle: {
    fontSize: 13,
    marginTop: 2,
    
  },
  primeBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  primeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    marginTop: 20,
  },
  appVersion: {
    fontSize: 12,
    marginBottom: 8,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legalLink: {
    fontSize: 12,
  },
  separator: {
    fontSize: 12,
    
  },
});