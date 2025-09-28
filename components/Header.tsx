import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Menu,
  MapPin,
  ChevronDown,
  Search as SearchIcon,
  ShoppingCart,
  UserRound,
  RotateCcw,
} from 'lucide-react-native';

type HeaderProps = {
  addressLine?: string; // e.g., "Mumbai 400097"
  cartCount?: number; // e.g., 3
  theme?: 'light' | 'dark';
  initialSearch?: string;
  onMenuPress?: () => void;
  onLocationPress?: () => void;
  onSearch?: (text: string) => void;
  onAccountPress?: () => void;
  onReturnsPress?: () => void;
  onCartPress?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  addressLine = 'Mumbai 400097',
  cartCount = 0,
  theme = 'light',
  initialSearch = '',
  onMenuPress,
  onLocationPress,
  onSearch,
  onAccountPress,
  onReturnsPress,
  onCartPress,
}) => {
  const [text, setText] = useState(initialSearch);
  const isDark = theme === 'dark';
  const { width } = Dimensions.get('window');
  const isDesktop = Platform.OS === 'web' && width > 768;

  const colors = {
    bg: isDark ? '#111' : '#fff',
    border: isDark ? '#2a2a2a' : '#e5e5e5',
    subtle: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
    strong: isDark ? '#fff' : '#111',
    accent: '#f97316',
    inputBg: isDark ? '#1b1b1b' : '#f7f7f7',
    inputText: isDark ? '#fff' : '#111',
    inputPlaceholder: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
  };

  return (
    <SafeAreaView edges={isDesktop ? ['top'] : []} style={[styles.safe, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
      <View style={styles.row}>
        {/* Left: menu + deliver to */}
        <View style={styles.leftWrap}>
          {/* Only show menu on mobile */}
          {!isDesktop && (
            <TouchableOpacity onPress={onMenuPress} accessibilityRole="button" style={styles.iconBtn}>
              <Menu color={colors.strong} size={22} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onLocationPress} style={[styles.locationWrap, isDesktop && styles.locationWrapDesktop]} accessibilityRole="button">
            <MapPin color={colors.accent} size={isDesktop ? 20 : 16} />
            <View style={{ marginLeft: isDesktop ? 8 : 6 }}>
              <Text style={[styles.small, { color: colors.subtle }, isDesktop && styles.smallDesktop]}>Deliver to</Text>
              <View style={styles.addressRow}>
                <Text numberOfLines={1} style={[styles.address, { color: colors.strong }, isDesktop && styles.addressDesktop]}>{addressLine}</Text>
                <ChevronDown color={colors.subtle} size={isDesktop ? 16 : 14} style={{ marginLeft: 4 }} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Right: account, returns, cart */}
        <View style={styles.rightWrap}>
          {/* Show account and returns only on desktop */}
          {isDesktop && (
            <>
              <TouchableOpacity onPress={onAccountPress} style={[styles.rightItem, styles.rightItemDesktop]} accessibilityLabel="Account and Lists">
                <UserRound color={colors.strong} size={24} />
                <Text style={[styles.rightText, { color: colors.subtle }, styles.rightTextDesktop]}>Account</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onReturnsPress} style={[styles.rightItem, styles.rightItemDesktop]} accessibilityLabel="Returns and Orders">
                <RotateCcw color={colors.strong} size={24} />
                <Text style={[styles.rightText, { color: colors.subtle }, styles.rightTextDesktop]}>Returns</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={onCartPress} style={[styles.rightItem, { paddingRight: 0 }, isDesktop && styles.rightItemDesktop]} accessibilityLabel="Cart">
            <View>
              <ShoppingCart color={colors.strong} size={isDesktop ? 26 : 22} />
              {cartCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.accent }, isDesktop && styles.badgeDesktop]}>
                  <Text style={[styles.badgeText, isDesktop && styles.badgeTextDesktop]}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.rightText, { color: colors.subtle, marginLeft: 4 }, isDesktop && styles.rightTextDesktop]}>Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }, isDesktop && styles.searchWrapDesktop]}>
        <SearchIcon color={colors.subtle} size={isDesktop ? 22 : 18} style={{ marginHorizontal: isDesktop ? 14 : 10 }} />
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => onSearch?.(text)}
          placeholder="Search for tools, brands, etc"
          placeholderTextColor={colors.inputPlaceholder}
          style={[styles.input, { color: colors.inputText }, isDesktop && styles.inputDesktop]}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={() => onSearch?.(text)} style={[styles.searchBtn, { backgroundColor: colors.accent }, isDesktop && styles.searchBtnDesktop]}>
          <SearchIcon color="#fff" size={isDesktop ? 22 : 18} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    borderBottomWidth: Platform.OS === 'web' ? 1 : 0.5,
    marginBottom: 13, // Added space between search bar and next component
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  leftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    paddingTop:12,
  },
  iconBtn: {
    padding: 8,
    marginRight: 6,
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 220,
    
  },
  locationWrapDesktop: {
    maxWidth: 280,
    paddingLeft: 8,
  },
  small: {
    fontSize: 12,
    fontWeight: '600',
    
  },
  smallDesktop: {
    fontSize: 14,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    fontWeight: '700',
    maxWidth: 170,
  },
  addressDesktop: {
    fontSize: 16,
    maxWidth: 220,
  },
  rightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop:12,
  },
  rightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  rightItemDesktop: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  rightText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rightTextDesktop: {
    fontSize: 14,
    marginLeft: 6,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    
  },
  badgeDesktop: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    top: -8,
    right: -12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  badgeTextDesktop: {
    fontSize: 12,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchWrapDesktop: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputDesktop: {
    paddingVertical: 16,
    fontSize: 18,
  },
  searchBtn: {
    padding: 10,
    borderRadius: 8,
    margin: 6,
  },
  searchBtnDesktop: {
    padding: 12,
    borderRadius: 10,
    margin: 8,
  },
});

export default Header;