import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Search as SearchIcon, X, Plus, Check, Minus, Star, ShoppingCart, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;
const isDesktop = Platform.OS === 'web' && width > 1024;

// Primitive alias
type FeatureValue = boolean | string | number;

// Normalized money representation
type Money = {
  amount: number;          // e.g., 58990
  currency: 'INR';         // could extend to other ISO 4217 codes
  display: string;         // e.g., "₹58,990.00"
};

type Rating = {
  value: number;           // 0..5
  count: number;           // number of reviews
};

type Inventory = {
  sku: string;
  inStock: boolean;
  stockQty?: number;       // undefined if not tracked
  lowStockThreshold?: number;
};

type Shipping = {
  weightKg?: number;
  dimensionsCm?: { l: number; w: number; h: number };
  shipsFrom?: string;      // e.g., "Mumbai, IN"
  deliveryEstimateDays?: { min: number; max: number };
  codAvailable?: boolean;
};

type Media = {
  images: string[];        // product gallery
  videos?: string[];       // optional product videos
};

type Seo = {
  slug: string;            // e.g., "bosch-90cm-self-clean-chimney"
  title?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalPath?: string;  // e.g., "/products/ka-1"
};

type WarrantyInfo = {
  summary?: string;        // e.g., "2 years"
  termsUrl?: string;       // if you host terms
};

type Badge =
  | 'New'
  | 'Bestseller'
  | 'Limited'
  | 'Online Exclusive'
  | 'Clearance';

type Product = {
  id: string;
  name: string;
  desc: string;
  size: string;
  rating: number;                  // retained for compatibility
  ratingDetail?: Rating;           // richer rating metadata
  image: string;                   // primary image
  media?: Media;                   // gallery
  price: string;                   // retained for compatibility
  priceDetail?: Money;             // normalized price
  brand: string;
  features: Record<string, FeatureValue>;
  category:
    | 'kitchen-appliances'
    | 'architectural-hardware'
    | 'kitchen-storage'
    | 'locks-security'
    | 'bathroom-fittings';
  productUrl?: string;

  // New, practical commerce fields
  inventory?: Inventory;
  shipping?: Shipping;
  warrantyInfo?: WarrantyInfo;
  seo?: Seo;
  badges?: Badge[];
  tags?: string[];                 // free-form search facets
  published?: boolean;             // for CMS control
  createdAt?: string;              // ISO date
  updatedAt?: string;              // ISO date
};

type CategoryMeta = {
  id: Product['category'] | 'all';
  label: string;
  commonFeatures: string[];
  slug?: string;                   // for routes/SEO
  description?: string;            // category description
  filters?: Record<
    string,
    {
      type: 'enum' | 'range' | 'boolean' | 'text';
      options?: string[];          // for enum
      unit?: string;               // for ranges
    }
  >;                               // declarative filter UI
};


const CATEGORIES: CategoryMeta[] = [
  {
    id: 'all',
    label: 'All',
    slug: 'all',
    description: 'Browse all products across categories.',
    commonFeatures: [
      'Description',
      'Size',
      'Rating',
      'Price Range',
      'Brand',
      'Warranty',
      'Category',
    ],
    filters: {
      Brand: { type: 'enum' },
      'Price Range': { type: 'enum' },
      Rating: { type: 'range', unit: 'stars' },
    },
  },
  {
    id: 'kitchen-appliances',
    label: 'Kitchen Appliances',
    slug: 'kitchen-appliances',
    description: 'Chimneys, hobs, ovens, and smart kitchen appliances.',
    commonFeatures: [
      'Description',
      'Size',
      'Rating',
      'Price Range',
      'Brand',
      'Warranty',
      'Self-Clean Technology',
      'Smart Motor',
      'Home Connect',
      'Burner Type',
    ],
    filters: {
      Brand: { type: 'enum', options: ['Bosch', 'Siemens', 'Whirlpool'] },
      Size: { type: 'enum', options: ['60cm', '75cm', '90cm'] },
      'Self-Clean Technology': { type: 'boolean' },
      'Home Connect': { type: 'boolean' },
      'Price Range': { type: 'enum' },
    },
  },
  {
    id: 'architectural-hardware',
    label: 'Architectural Hardware',
    slug: 'architectural-hardware',
    description: 'Handles, knobs, and hardware with multiple finishes and materials.',
    commonFeatures: [
      'Description',
      'Size',
      'Rating',
      'Price Range',
      'Brand',
      'Warranty',
      'Finish',
      'Material',
      'Application',
      'Handle Type',
    ],
    filters: {
      Finish: { type: 'enum' },
      Material: { type: 'enum', options: ['Brass', 'Zinc Alloy', 'SS 304'] },
      Application: { type: 'enum', options: ['Cabinet', 'Wardrobe', 'Main Door'] },
    },
  },
  {
    id: 'kitchen-storage',
    label: 'Kitchen & Wardrobe Storage',
    slug: 'kitchen-storage',
    description: 'Pull-outs, pantry units, and storage systems.',
    commonFeatures: [
      'Description',
      'Size',
      'Rating',
      'Price Range',
      'Brand',
      'Warranty',
      'Material',
      'Load Capacity',
      'Mechanism',
      'No. of Layers',
    ],
    filters: {
      'No. of Layers': { type: 'range' },
      Mechanism: { type: 'enum', options: ['Pull-out', 'Swing', 'Soft-close'] },
      Material: { type: 'enum' },
    },
  },
  {
    id: 'locks-security',
    label: 'Locks & Security',
    slug: 'locks-security',
    description: 'Door locks, security levels, and bolt configurations.',
    commonFeatures: [
      'Description',
      'Size',
      'Rating',
      'Price Range',
      'Brand',
      'Warranty',
      'Security Level',
      'Key Type',
      'No. of Bolts',
      'Application',
    ],
    filters: {
      'Security Level': { type: 'enum' },
      'No. of Bolts': { type: 'range' },
      Application: { type: 'enum', options: ['Main Door', 'Bedroom', 'Bathroom'] },
    },
  },
  {
    id: 'bathroom-fittings',
    label: 'Bathroom Fittings',
    slug: 'bathroom-fittings',
    description: 'Accessories and fittings in various materials and finishes.',
    commonFeatures: [
      'Description',
      'Size',
      'Rating',
      'Price Range',
      'Brand',
      'Warranty',
      'Material',
      'Finish',
      'Set Includes',
    ],
    filters: {
      Material: { type: 'enum', options: ['SS 304', 'Brass', 'Zinc Alloy'] },
      Finish: { type: 'enum', options: ['Chrome', 'Matte Black', 'Brushed Nickel'] },
      'Set Includes': { type: 'text' },
    },
  },
];

const formatINR = (amount: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount); // uses proper Indian digit grouping[7]


const MOCK_PRODUCTS: Product[] = [
  // Kitchen Appliances
  {
    id: 'ka-1',
    name: 'Bosch 90cm Self-Clean Chimney',
    desc:
      'Filterless chimney with Self-Clean technology, Smart Motor, and gesture control for modern kitchens.',
    size: '90cm',
    rating: 4.7,
    ratingDetail: { value: 4.7, count: 214 },
    image: 'https://media3.bosch-home.com/Images/600x/20129084_600x458_banners1.jpg',
    media: {
      images: [
        'https://media3.bosch-home.com/Images/600x/20129084_600x458_banners1.jpg',
      ],
    },
    price: '₹58,990',
    priceDetail: {
      amount: 58990,
      currency: 'INR',
      display: '₹58,990.00', // generate with Intl for reliability[7]
    },
    brand: 'Bosch',
    productUrl: '/products/ka-1',
    features: {
      'Self-Clean Technology': true,
      'Smart Motor': true,
      'Home Connect': false,
      'Burner Type': 'N/A',
      Warranty: '2 years',
      Category: 'Kitchen Appliances',
      'Price Range': '> ₹50,000',
      Brand: 'Bosch',
      Rating: '4.7/5',
      Description:
        'Filterless chimney with Self-Clean technology, Smart Motor, and gesture control for modern kitchens.',
      Size: '90cm',
      'Airflow (m³/hr)': 1200,
      'Noise Level (dB)': 58,
      'Control Type': 'Gesture + Touch',
      'Filter Type': 'Filterless',
    },
    category: 'kitchen-appliances',
    inventory: {
      sku: 'BOS-CHIM-90-SC',
      inStock: true,
      stockQty: 12,
      lowStockThreshold: 3,
    },
    shipping: {
      weightKg: 18.5,
      dimensionsCm: { l: 95, w: 45, h: 60 },
      shipsFrom: 'Mumbai, IN',
      deliveryEstimateDays: { min: 3, max: 7 },
      codAvailable: true,
    },
    warrantyInfo: { summary: '2 years' },
    seo: {
      slug: 'bosch-90cm-self-clean-chimney',
      title: 'Bosch 90cm Self-Clean Chimney | Filterless, Smart Motor',
      metaDescription:
        'Bosch 90cm filterless chimney with self-clean, smart motor, gesture control, 1200 m³/hr airflow.',
      keywords: ['Bosch', 'chimney', 'self-clean', 'filterless', '90cm'],
      canonicalPath: '/products/ka-1',
    },
    badges: ['Bestseller'],
    tags: ['chimney', 'filterless', 'smart'],
    published: true,
    createdAt: '2025-08-01T10:00:00.000Z',
    updatedAt: '2025-08-10T12:00:00.000Z',
  },
  {
    id: 'ka-2',
    name: 'Bosch True Brass 3D Hob',
    desc:
      'Made in Spain with pure brass burners and Flame Failure Safety Device for intense Indian cooking.',
    size: '90cm',
    rating: 4.8,
    ratingDetail: { value: 4.8, count: 156 },
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYPf9tVht6zCa0b0vrbljxgKkiAmPQajrfsw&s',
    media: {
      images: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYPf9tVht6zCa0b0vrbljxgKkiAmPQajrfsw&s',
      ],
    },
    price: '₹79,990',
    priceDetail: { amount: 79990, currency: 'INR', display: '₹79,990.00' }, // via Intl[7]
    brand: 'Bosch',
    productUrl: '/products/ka-2',
    features: {
      'Self-Clean Technology': false,
      'Smart Motor': false,
      'Home Connect': false,
      'Burner Type': 'True Brass 3D',
      Warranty: '2 years',
      Category: 'Kitchen Appliances',
      'Price Range': '> ₹70,000',
      Brand: 'Bosch',
      Rating: '4.8/5',
      Description:
        'Made in Spain with pure brass burners and Flame Failure Safety Device for intense Indian cooking.',
      Size: '90cm',
      'No. of Burners': 5,
      'Ignition Type': 'Auto',
      'Flame Failure Device': true,
      'Pan Support': 'Cast Iron',
    },
    category: 'kitchen-appliances',
    inventory: { sku: 'BOS-HOB-90-3D', inStock: true, stockQty: 7 },
    shipping: {
      weightKg: 14.2,
      dimensionsCm: { l: 90, w: 52, h: 12 },
      shipsFrom: 'Pune, IN',
      deliveryEstimateDays: { min: 2, max: 6 },
    },
    warrantyInfo: { summary: '2 years' },
    seo: {
      slug: 'bosch-true-brass-3d-hob-90cm',
      title: 'Bosch 90cm True Brass 3D Hob | FFD, Auto Ignition',
      metaDescription:
        'Bosch 90cm hob with true brass 3D burners, FFD safety, auto ignition, cast iron supports.',
      canonicalPath: '/products/ka-2',
    },
    badges: ['New'],
    tags: ['hob', 'brass', 'FFD'],
    published: true,
    createdAt: '2025-08-05T09:00:00.000Z',
    updatedAt: '2025-08-10T12:00:00.000Z',
  },

  // Architectural Hardware
  {
    id: 'ah-1',
    name: 'Pisa Cabinet Handle PS-021',
    desc:
      'Modern cabinet handle available in Gold, CP, Satin, and Black finishes with PVD coating.',
    size: '96mm - 416mm',
    rating: 4.5,
    ratingDetail: { value: 4.5, count: 98 },
    image: 'https://pisahardware.com/assets/images/product/PS-10.webp',
    media: { images: ['https://pisahardware.com/assets/images/product/PS-10.webp'] },
    price: '₹125',
    priceDetail: { amount: 125, currency: 'INR', display: '₹125.00' }, // via Intl[7]
    brand: 'Pisa',
    productUrl: '/products/ah-1',
    features: {
      Finish: 'PVD Gold, Chrome, Satin, Black',
      Material: 'Zinc Alloy',
      Application: 'Cabinet, Wardrobe',
      'Handle Type': 'Pull Handle',
      Warranty: 'Not specified',
      Category: 'Architectural Hardware',
      'Price Range': '₹125 - ₹1,760',
      Brand: 'Pisa',
      Rating: '4.5/5',
      Description:
        'Modern cabinet handle available in Gold, CP, Satin, and Black finishes with PVD coating.',
      Size: '96mm - 416mm',
      'Hole Centers': '96mm, 128mm, 160mm, 192mm, 224mm, 288mm, 416mm',
      'Finish Process': 'PVD',
    },
    category: 'architectural-hardware',
    inventory: { sku: 'PISA-PS021', inStock: true, stockQty: 230 },
    shipping: { weightKg: 0.22, shipsFrom: 'Delhi, IN', codAvailable: true },
    seo: {
      slug: 'pisa-ps-021-cabinet-handle',
      title: 'Pisa PS-021 Cabinet Handle | PVD Finishes',
      metaDescription:
        'Pisa PS-021 cabinet handle in PVD Gold, Chrome, Satin, and Black finishes with multiple sizes.',
      canonicalPath: '/products/ah-1',
    },
    badges: ['Bestseller'],
    tags: ['handle', 'cabinet', 'PVD'],
    published: true,
    createdAt: '2025-08-02T08:00:00.000Z',
    updatedAt: '2025-08-12T12:00:00.000Z',
  },
  {
    id: 'ah-2',
    name: 'Enarc Main Door Handle MDH-LION',
    desc:
      'Ornate lion-themed main door handle for a statement entrance, available in multiple premium finishes.',
    size: '250mm',
    rating: 4.8,
    ratingDetail: { value: 4.8, count: 61 },
    image:
      'https://enarchardware.com/wp-content/uploads/2022/09/MDH_5-300x300.png',
    media: {
      images: [
        'https://enarchardware.com/wp-content/uploads/2022/09/MDH_5-300x300.png',
      ],
    },
    price: '₹6,070',
    priceDetail: { amount: 6070, currency: 'INR', display: '₹6,070.00' }, // via Intl[7]
    brand: 'Enarc',
    productUrl: '/products/ah-2',
    features: {
      Finish: 'Antique, Black, PVD Gold, PVD Rose Gold',
      Material: 'Brass',
      Application: 'Main Door',
      'Handle Type': 'Pull Handle',
      Warranty: 'Not specified',
      Category: 'Architectural Hardware',
      'Price Range': '₹6,000 - ₹7,200',
      Brand: 'Enarc',
      Rating: '4.8/5',
      Description:
        'Ornate lion-themed main door handle for a statement entrance, available in multiple premium finishes.',
      Size: '250mm',
      'Mount Type': 'Through Bolt',
    },
    category: 'architectural-hardware',
    inventory: { sku: 'ENARC-MDH-LION', inStock: true, stockQty: 18 },
    shipping: {
      weightKg: 1.1,
      shipsFrom: 'Ahmedabad, IN',
      deliveryEstimateDays: { min: 4, max: 8 },
    },
    seo: {
      slug: 'enarc-mdh-lion-door-handle-250mm',
      title: 'Enarc MDH-LION Main Door Handle | Premium Finishes',
      metaDescription:
        'Enarc MDH-LION ornate main door handle in antique, black, PVD gold, and PVD rose gold finishes.',
      canonicalPath: '/products/ah-2',
    },
    badges: ['Online Exclusive'],
    tags: ['door handle', 'brass', 'PVD'],
    published: true,
    createdAt: '2025-08-03T07:00:00.000Z',
    updatedAt: '2025-08-12T12:00:00.000Z',
  },

  // Kitchen & Wardrobe Storage
  {
    id: 'ks-1',
    name: 'Wudnox Satin Pantry Unit',
    desc:
      '6-layer satin finish pantry unit with SS baskets and wooden base for tall kitchen cabinets.',
    size: 'For 450mm Cabinet',
    rating: 4.6,
    ratingDetail: { value: 4.6, count: 73 },
    image: 'https://5.imimg.com/data5/SELLER/Default/2021/3/KV/CQ/QZ/124487145/satin-pantry.jpg',
    media: {
      images: [
        'https://5.imimg.com/data5/SELLER/Default/2021/3/KV/CQ/QZ/124487145/satin-pantry.jpg',
      ],
    },
    price: '₹22,200',
    priceDetail: { amount: 22200, currency: 'INR', display: '₹22,200.00' }, // via Intl[7]
    brand: 'Wudnox',
    productUrl: '/products/ks-1',
    features: {
      Material: 'Stainless Steel & Wood',
      'Load Capacity': 'Not Specified',
      Mechanism: 'Pull-out',
      'No. of Layers': 6,
      Warranty: 'Not specified',
      Category: 'Kitchen & Wardrobe Storage',
      'Price Range': '> ₹20,000',
      Brand: 'Wudnox',
      Rating: '4.6/5',
      Description:
        '6-layer satin finish pantry unit with SS baskets and wooden base for tall kitchen cabinets.',
      Size: '450x540x(1900-2160)mm',
      'Soft Close': true,
      'Carcass Width': '450mm',
    },
    category: 'kitchen-storage',
    inventory: { sku: 'WUD-PANTRY-450', inStock: true, stockQty: 9 },
    shipping: {
      weightKg: 28.0,
      dimensionsCm: { l: 55, w: 50, h: 210 },
      shipsFrom: 'Navi Mumbai, IN',
      deliveryEstimateDays: { min: 5, max: 10 },
    },
    seo: {
      slug: 'wudnox-satin-pantry-unit-450mm',
      title: 'Wudnox Satin Pantry Unit | 6-Layer Pull-out',
      metaDescription:
        'Wudnox pantry unit for 450mm cabinets, 6 layers, SS baskets, wooden base, soft-close mechanism.',
      canonicalPath: '/products/ks-1',
    },
    badges: ['Limited'],
    tags: ['pantry', 'pull-out', 'storage'],
    published: true,
    createdAt: '2025-08-04T06:00:00.000Z',
    updatedAt: '2025-08-12T12:00:00.000Z',
  },

  // Locks & Security
  {
    id: 'ls-1',
    name: 'Europa Hexabolt Main Door Lock',
    desc:
      'High-security main door lock with 5 dead bolts & 1 latch bolt for ultimate protection.',
    size: 'Standard',
    rating: 4.9,
    ratingDetail: { value: 4.9, count: 342 },
    image: 'https://m.media-amazon.com/images/I/61MkptxAWsL.jpg',
    media: { images: ['https://m.media-amazon.com/images/I/61MkptxAWsL.jpg'] },
    price: '₹5,050',
    priceDetail: { amount: 5050, currency: 'INR', display: '₹5,050.00' }, // via Intl[7]
    brand: 'Europa',
    productUrl: '/products/ls-1',
    features: {
      'Security Level': '14 Pin Dimple Key',
      'Key Type': 'Dimple Key with Light',
      'No. of Bolts': 6,
      Application: 'Main Door',
      Warranty: '15 years',
      Category: 'Locks & Security',
      'Price Range': '₹4,500 - ₹5,500',
      Brand: 'Europa',
      Rating: '4.9/5',
      Description:
        'High-security main door lock with 5 dead bolts & 1 latch bolt for ultimate protection.',
      Size: 'Standard',
      'Reversible Latch': true,
      'Body Material': 'Steel',
    },
    category: 'locks-security',
    inventory: { sku: 'EUR-HEX-LOCK', inStock: true, stockQty: 44 },
    shipping: {
      weightKg: 2.6,
      dimensionsCm: { l: 28, w: 18, h: 10 },
      shipsFrom: 'Bengaluru, IN',
      deliveryEstimateDays: { min: 3, max: 7 },
      codAvailable: true,
    },
    warrantyInfo: { summary: '15 years' },
    seo: {
      slug: 'europa-hexabolt-main-door-lock',
      title: 'Europa Hexabolt Main Door Lock | 6-Bolt Security',
      metaDescription:
        'Europa Hexabolt lock with 5 dead bolts, 1 latch bolt, 14-pin dimple key, steel body, reversible latch.',
      canonicalPath: '/products/ls-1',
    },
    badges: ['Bestseller'],
    tags: ['lock', 'main door', 'security'],
    published: true,
    createdAt: '2025-08-01T05:00:00.000Z',
    updatedAt: '2025-08-12T12:00:00.000Z',
  },

  // Bathroom Fittings
  {
    id: 'bf-1',
    name: 'Enarc Optimal Bathroom Set',
    desc:
      'Complete SS 304 bathroom accessory set including towel rack, soap dish, and robe hook.',
    size: 'Standard Set',
    rating: 4.5,
    ratingDetail: { value: 4.5, count: 129 },
    image: 'https://enarchardware.com/wp-content/uploads/2022/09/BS_1-300x300.jpeg',
    media: {
      images: [
        'https://enarchardware.com/wp-content/uploads/2022/09/BS_1-300x300.jpeg',
      ],
    },
    price: '₹4,321',
    priceDetail: { amount: 4321, currency: 'INR', display: '₹4,321.00' }, // via Intl[7]
    brand: 'Enarc',
    productUrl: '/products/bf-1',
    features: {
      Material: 'SS 304',
      Finish: 'Chrome',
      'Set Includes':
        'Towel Rack, Robe Hook, Soap Dish, Tumbler Holder, Paper Holder',
      Warranty: 'Not Specified',
      Category: 'Bathroom Fittings',
      'Price Range': '₹4,000 - ₹5,000',
      Brand: 'Enarc',
      Rating: '4.5/5',
      Description:
        'Complete SS 304 bathroom accessory set including towel rack, soap dish, and robe hook.',
      Size: 'Standard Set',
      'Installation Type': 'Wall-mounted',
      'Corrosion Resistant': true,
    },
    category: 'bathroom-fittings',
    inventory: { sku: 'ENARC-BATH-SET-OPTIMAL', inStock: true, stockQty: 36 },
    shipping: {
      weightKg: 3.4,
      dimensionsCm: { l: 60, w: 20, h: 15 },
      shipsFrom: 'Surat, IN',
      deliveryEstimateDays: { min: 4, max: 9 },
    },
    seo: {
      slug: 'enarc-optimal-bathroom-set-ss304',
      title: 'Enarc Optimal Bathroom Set | SS 304 Chrome',
      metaDescription:
        'Enarc SS 304 bathroom accessory set in chrome finish including towel rack, robe hook, soap dish, tumbler holder, and paper holder.',
      canonicalPath: '/products/bf-1',
    },
    badges: ['Bestseller'],
    tags: ['bathroom', 'SS304', 'accessories'],
    published: true,
    createdAt: '2025-08-06T04:00:00.000Z',
    updatedAt: '2025-08-12T12:00:00.000Z',
  },
  
  {
    "id": "ks-2",
    "name": "Hettich Tandem Pantry Pull-Out",
    "desc": "Tall unit pantry pull-out system with soft-close slides and adjustable shelves for 450mm carcass.",
    "size": "For 450mm Cabinet",
    "rating": 4.7,
    "image": "data:image/jpeg;base64,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",
    "price": "₹28,900",
    "brand": "Hettich",
    "productUrl": "/products/ks-2",
    "features": {
      "Material": "Steel & Wood",
      "Load Capacity": "Up to 80kg",
      "Mechanism": "Pull-out, Soft-close",
      "No. of Layers": 6,
      "Warranty": "Not specified",
      "Category": "Kitchen & Wardrobe Storage",
      "Price Range": "> ₹20,000",
      "Brand": "Hettich",
      "Rating": "4.7/5",
      "Description": "Tall unit pantry pull-out system with soft-close slides and adjustable shelves for 450mm carcass.",
      "Size": "450mm Carcass",
      "Soft Close": true,
      "Finish": "Satin"
    },
    "category": "kitchen-storage"
  },
  {
    "id": "ks-3",
    "name": "EBCO Corner Carousel 3/4 Round",
    "desc": "Space-saving 3/4 round carousel trays for corner cabinets with smooth swivel action.",
    "size": "800–900mm Corner",
    "rating": 4.4,
    "image": "https://m.media-amazon.com/images/I/71PA-FsyMqS._UF1000,1000_QL80_.jpg",
    "price": "₹9,850",
    "brand": "EBCO",
    "productUrl": "/products/ks-3",
    "features": {
      "Material": "SS & PP",
      "Load Capacity": "20kg per tray",
      "Mechanism": "Swivel",
      "No. of Layers": 2,
      "Warranty": "Not specified",
      "Category": "Kitchen & Wardrobe Storage",
      "Price Range": "₹8,000 - ₹10,000",
      "Brand": "EBCO",
      "Rating": "4.4/5",
      "Description": "Space-saving 3/4 round carousel trays for corner cabinets with smooth swivel action.",
      "Size": "800–900mm Corner",
      "Tray Diameter": "710mm",
      "Finish": "Chrome"
    },
    "category": "kitchen-storage"
  },
  {
    "id": "ks-4",
    "name": "Sleek Wardrobe Pull-Down Hanger",
    "desc": "Pull-down wardrobe lift with assisted mechanism for easy access to high-mounted clothes rails.",
    "size": "Wardrobe 800–1200mm",
    "rating": 4.5,
    "image": "https://m.media-amazon.com/images/I/61DRDns7FhL.jpg",
    "price": "₹6,490",
    "brand": "Sleek",
    "productUrl": "/products/ks-4",
    "features": {
      "Material": "Aluminium & ABS",
      "Load Capacity": "12kg",
      "Mechanism": "Pull-down, Assisted",
      "No. of Layers": 1,
      "Warranty": "Not specified",
      "Category": "Kitchen & Wardrobe Storage",
      "Price Range": "₹5,000 - ₹7,000",
      "Brand": "Sleek",
      "Rating": "4.5/5",
      "Description": "Pull-down wardrobe lift with assisted mechanism for easy access to high-mounted clothes rails.",
      "Size": "800–1200mm",
      "Finish": "Anodized",
      "Mount Type": "Side Mount"
    },
    "category": "kitchen-storage"
  },
  {
    "id": "ks-5",
    "name": "Indaux Soft-Close Drawer Kit",
    "desc": "Full-extension soft-close drawer system with 35kg load capacity for modular kitchens.",
    "size": "500mm Length",
    "rating": 4.6,
    "image": "https://m.media-amazon.com/images/I/71gwHquapgL.jpg",
    "price": "₹3,450",
    "brand": "Indaux",
    "productUrl": "/products/ks-5",
    "features": {
      "Material": "Steel",
      "Load Capacity": "35kg",
      "Mechanism": "Soft-close, Full-extension",
      "No. of Layers": 1,
      "Warranty": "Not specified",
      "Category": "Kitchen & Wardrobe Storage",
      "Price Range": "₹3,000 - ₹4,000",
      "Brand": "Indaux",
      "Rating": "4.6/5",
      "Description": "Full-extension soft-close drawer system with 35kg load capacity for modular kitchens.",
      "Size": "500mm",
      "Finish": "Grey",
      "Side Thickness": "13mm"
    },
    "category": "kitchen-storage"
  },
  {
    "id": "ls-2",
    "name": "Godrej Advantis Digital Door Lock",
    "desc": "Electronic lock with PIN, RFID, and mechanical key override, suitable for wooden doors.",
    "size": "Standard",
    "rating": 4.3,
    "image": "https://m.media-amazon.com/images/I/61qweotuKiL._UF1000,1000_QL80_.jpg",
    "price": "₹12,990",
    "brand": "Godrej",
    "productUrl": "/products/ls-2",
    "features": {
      "Security Level": "Digital + Mechanical",
      "Key Type": "RFID Card, PIN, Mechanical Key",
      "No. of Bolts": 2,
      "Application": "Main Door, Bedroom",
      "Warranty": "2 years",
      "Category": "Locks & Security",
      "Price Range": "₹12,000 - ₹14,000",
      "Brand": "Godrej",
      "Rating": "4.3/5",
      "Description": "Electronic lock with PIN, RFID, and mechanical key override, suitable for wooden doors.",
      "Size": "Standard",
      "Battery": "AA x 4",
      "Auto Lock": true
    },
    "category": "locks-security"
  },
  {
    "id": "ls-3",
    "name": "Dorset Mortise Lock DL-700",
    "desc": "Heavy-duty mortise lock set with solid lever handle and Euro profile cylinder.",
    "size": "60mm Backset",
    "rating": 4.5,
    "image": "https://m.media-amazon.com/images/I/21oq3WCNj5L._UF1000,1000_QL80_.jpg",
    "price": "₹4,250",
    "brand": "Dorset",
    "productUrl": "/products/ls-3",
    "features": {
      "Security Level": "Euro Cylinder",
      "Key Type": "Normal Key",
      "No. of Bolts": 1,
      "Application": "Main Door, Bedroom",
      "Warranty": "5 years",
      "Category": "Locks & Security",
      "Price Range": "₹4,000 - ₹5,000",
      "Brand": "Dorset",
      "Rating": "4.5/5",
      "Description": "Heavy-duty mortise lock set with solid lever handle and Euro profile cylinder.",
      "Size": "60mm Backset",
      "Finish": "Satin Nickel",
      "Handle Type": "Lever"
    },
    "category": "locks-security"
  },
  {
    "id": "ls-4",
    "name": "Ozone OZ-FDL-01 Smart Fingerprint Lock",
    "desc": "Ozone OZ-FDL-01 Smart Fingerprint Lock",
    "size": "Standard",
    "rating": 4.4,
    "image": "https://www.ozokart.com/cdn/shop/files/OZ-FDL-01LifeLite.jpg?v=1749645432",
    "price": "₹9,999",
    "brand": "Ozone",
    "productUrl": "/products/ls-4",
    "features": {
      "Security Level": "Biometric + App",
      "Key Type": "Fingerprint, PIN, RFID, Mechanical Key",
      "No. of Bolts": 1,
      "Application": "Main Door, Office",
      "Warranty": "2 years",
      "Category": "Locks & Security",
      "Price Range": "₹9,000 - ₹11,000",
      "Brand": "Ozone",
      "Rating": "4.4/5",
      "Description": "Biometric fingerprint door lock with mobile app and OTP access for guests.",
      "Size": "Standard",
      "Battery": "Rechargeable Li-ion",
      "Remote Access": true
    },
    "category": "locks-security"
  },
  {
    "id": "ls-5",
    "name": "Godrej Ultra Tribolt 1CK",
    "desc": "Rim lock with tri-bolt mechanism and steel body for enhanced door security.",
    "size": "Standard",
    "rating": 4.6,
    "image": "https://m.media-amazon.com/images/I/51QkP7z6LXL.jpg",
    "price": "₹3,250",
    "brand": "Godrej",
    "productUrl": "/products/ls-5",
    "features": {
      "Security Level": "High",
      "Key Type": "Dimple Key",
      "No. of Bolts": 3,
      "Application": "Main Door",
      "Warranty": "5 years",
      "Category": "Locks & Security",
      "Price Range": "₹3,000 - ₹4,000",
      "Brand": "Godrej",
      "Rating": "4.6/5",
      "Description": "Rim lock with tri-bolt mechanism and steel body for enhanced door security.",
      "Size": "Standard",
      "Body Material": "Steel",
      "Door Thickness": "32–60mm"
    },
    "category": "locks-security"
  },
  {
    "id": "bf-2",
    "name": "Jaquar Continental Bathroom Set",
    "desc": "5-piece bathroom accessory set in chrome finish including towel rack and robe hook.",
    "size": "Standard Set",
    "rating": 4.6,
    "image": "https://m.media-amazon.com/images/I/51ebwOZ2mAL.jpg",
    "price": "₹5,990",
    "brand": "Jaquar",
    "productUrl": "/products/bf-2",
    "features": {
      "Material": "Brass & SS",
      "Finish": "Chrome",
      "Set Includes": "Towel Rack, Robe Hook, Soap Dish, Tumbler Holder, Tissue Holder",
      "Warranty": "10 years",
      "Category": "Bathroom Fittings",
      "Price Range": "₹5,000 - ₹6,500",
      "Brand": "Jaquar",
      "Rating": "4.6/5",
      "Description": "5-piece bathroom accessory set in chrome finish including towel rack and robe hook.",
      "Size": "Standard Set",
      "Corrosion Resistant": true,
      "Installation Type": "Wall-mounted"
    },
    "category": "bathroom-fittings"
  },
  {
    "id": "bf-3",
    "name": "Hindware Arc Bathroom Set",
    "desc": "Matte black bathroom accessory set with minimal design for modern bathrooms.",
    "size": "Standard Set",
    "rating": 4.4,
    "image": "https://hindware.com/wp-content/uploads/2021/03/519009.jpeg",
    "price": "₹4,780",
    "brand": "Hindware",
    "productUrl": "/products/bf-3",
    "features": {
      "Material": "SS 304",
      "Finish": "Matte Black",
      "Set Includes": "Towel Bar, Robe Hook, Soap Dish, Paper Holder, Shelf",
      "Warranty": "Not Specified",
      "Category": "Bathroom Fittings",
      "Price Range": "₹4,000 - ₹5,000",
      "Brand": "Hindware",
      "Rating": "4.4/5",
      "Description": "Matte black bathroom accessory set with minimal design for modern bathrooms.",
      "Size": "Standard Set",
      "Anti-Fingerprint": true,
      "Mount Type": "Concealed"
    },
    "category": "bathroom-fittings"
  },
  {
    "id": "bf-4",
    "name": "Kohler Stillness Towel Rack Set",
    "desc": "Premium SS towel rack and accessories with brushed finish and solid build.",
    "size": "Standard Set",
    "rating": 4.8,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCzorV31WBVIJ0srMDf4AbMSQDPGdbPpm_BA&s",
    "price": "₹12,400",
    "brand": "Kohler",
    "productUrl": "/products/bf-4",
    "features": {
      "Material": "SS 304",
      "Finish": "Brushed Nickel",
      "Set Includes": "Towel Rack, Towel Bar, Robe Hook, Paper Holder",
      "Warranty": "Limited Lifetime",
      "Category": "Bathroom Fittings",
      "Price Range": "₹12,000 - ₹13,000",
      "Brand": "Kohler",
      "Rating": "4.8/5",
      "Description": "Premium SS towel rack and accessories with brushed finish and solid build.",
      "Size": "Standard Set",
      "Rust Resistant": true,
      "Installation Type": "Wall-mounted"
    },
    "category": "bathroom-fittings"
  },


];


const CompareSearch: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = (colorScheme ?? 'light') === 'dark';

  const [category, setCategory] = useState<Product['category'] | 'all'>('all');
  const [query, setQuery] = useState('');
  const [compare, setCompare] = useState<Product[]>([]);
  const [comparisonMode, setComparisonMode] = useState<'table' | 'visual'>('visual');

  const colors = {
    bg: isDark ? '#151515ff' : '#f8fafc',
    card: isDark ? '#1e1e1e' : '#ffffff',
    border: isDark ? '#2f2f2f' : '#e5e7eb',
    subtle: isDark ? '#cbd5e1' : '#475569',
    strong: isDark ? '#f8f8f8' : '#111827',
    accent: '#f97316',
    inputBg: isDark ? '#1b1b1b' : '#f3f4f6',
    inputText: isDark ? '#f8f8f8' : '#111827',
    placeholder: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
    pillBg: isDark ? '#374151' : '#eef2f7',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  const meta = useMemo(() => CATEGORIES.find(c => c.id === category)!, [category]);

  const results = useMemo(() => {
    const base = category === 'all' 
      ? MOCK_PRODUCTS 
      : MOCK_PRODUCTS.filter(p => p.category === category);
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }, [category, query]);

  const toggleCompare = (p: Product) => {
    setCompare(cur => {
      const exists = cur.find(x => x.id === p.id);
      if (exists) return cur.filter(x => x.id !== p.id);
      if (cur.length >= 3) return cur;
      return [...cur, p];
    });
  };

  const inCompare = (id: string) => compare.some(x => x.id === id);
  const removeFromCompare = (id: string) => setCompare(cur => cur.filter(x => x.id !== id));

  const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          color={star <= rating ? '#fbbf24' : '#d1d5db'}
          fill={star <= rating ? '#fbbf24' : 'transparent'}
        />
      ))}
      <Text style={[styles.ratingText, { color: colors.subtle }]}>({rating})</Text>
    </View>
  );

  const compareProducts = compare.slice(0, 3);

  const handleProductPress = (product: Product) => {
    // Handle navigation to product page
    console.log('Navigate to product:', product.productUrl || `/products/${product.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Category pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c.id}
            onPress={() => setCategory(c.id as any)}
            style={[
              styles.pill,
              { 
                backgroundColor: category === c.id ? colors.accent : colors.pillBg, 
                borderColor: colors.border 
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, { color: category === c.id ? '#fff' : colors.strong }]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
        <SearchIcon size={18} color={colors.subtle} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={`Search ${meta.label.toLowerCase()}...`}
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { color: colors.inputText }]}
        />
        {!!query && (
          <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
            <X size={18} color={colors.subtle} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search results list - Now properly scrollable */}
      <View style={[styles.resultsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ScrollView 
          style={styles.resultsList}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {results.map(p => (
            <TouchableOpacity 
              key={p.id} 
              style={[styles.resultItem, { borderBottomColor: colors.border }]}
              onPress={() => handleProductPress(p)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: p.image }} style={styles.resultImage} />
              
              <View style={styles.productInfo}>
                <Text style={[styles.resultName, { color: colors.strong }]}>{p.name}</Text>
                <Text style={[styles.resultDesc, { color: colors.subtle }]} numberOfLines={2}>{p.desc}</Text>
                
                <View style={styles.productMeta}>
                  <StarRating rating={p.rating} size={12} />
                </View>
                
                <Text style={[styles.sizeText, { color: colors.subtle }]}>{p.size}</Text>
                
                <View style={styles.priceRow}>
                  <Text style={[styles.resultPrice, { color: colors.accent }]}>{p.price}</Text>
                  <Text style={[styles.brandText, { color: colors.subtle }]}>{p.brand}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  toggleCompare(p);
                }}
                style={[
                  styles.addBtn,
                  { backgroundColor: inCompare(p.id) ? colors.error : colors.accent },
                ]}
                activeOpacity={0.85}
              >
                <Text style={styles.addBtnText}>{inCompare(p.id) ? 'Remove' : 'Compare'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Compare tray */}
      <View style={[styles.compareTray, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.trayHeader}>
          <Text style={[styles.trayTitle, { color: colors.strong }]}>Compare</Text>
          <View style={styles.trayHeaderRight}>
            <Text style={[styles.compareCount, { color: colors.subtle }]}>{compareProducts.length}/3 selected</Text>
            {compareProducts.length >= 2 && (
              <View style={styles.modeToggle}>
                <TouchableOpacity
                  onPress={() => setComparisonMode('table')}
                  style={[
                    styles.modeBtn,
                    { backgroundColor: comparisonMode === 'table' ? colors.accent : colors.pillBg }
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.modeBtnText, { color: comparisonMode === 'table' ? '#fff' : colors.strong }]}>
                    Table
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setComparisonMode('visual')}
                  style={[
                    styles.modeBtn,
                    { backgroundColor: comparisonMode === 'visual' ? colors.accent : colors.pillBg }
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.modeBtnText, { color: comparisonMode === 'visual' ? '#fff' : colors.strong }]}>
                    Visual
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {compareProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.border }]}>
              <Plus size={24} color={colors.subtle} />
            </View>
            <Text style={[styles.emptyText, { color: colors.subtle }]}>Select products to compare</Text>
          </View>
        ) : compareProducts.length === 1 ? (
          <View style={styles.singleState}>
            <Text style={[styles.singleText, { color: colors.subtle }]}>Add at least one more product to compare</Text>
          </View>
        ) : comparisonMode === 'visual' ? (
          <VisualComparison 
            products={compareProducts} 
            colors={colors} 
            onProductPress={handleProductPress}
          />
        ) : (
          <>
            {/* Selected products preview */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {compareProducts.map(p => (
                <TouchableOpacity 
                  key={p.id} 
                  style={[styles.trayCard, { backgroundColor: colors.bg, borderColor: colors.border }]}
                  onPress={() => handleProductPress(p)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: p.image }} style={styles.trayImage} />
                  <Text style={[styles.trayName, { color: colors.strong }]} numberOfLines={2}>{p.name}</Text>
                  <StarRating rating={p.rating} size={10} />
                  <Text style={[styles.trayPrice, { color: colors.accent }]}>{p.price}</Text>
                  
                  <TouchableOpacity 
                    onPress={(e) => {
                      e.stopPropagation();
                      removeFromCompare(p.id);
                    }} 
                    style={styles.trayRemove}
                  >
                    <X size={12} color="#fff" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Comparison table */}
            <View style={[styles.featuresHeader, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
              <Text style={[styles.featuresHeaderText, { color: colors.strong }]}>
                {meta.label} Features Comparison
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.table}>
                {/* Header row with images */}
                <View style={styles.tableRow}>
                  <View style={[styles.featureCol, { borderRightColor: colors.border }]} />
                  {compareProducts.map(p => (
                    <TouchableOpacity 
                      key={p.id} 
                      style={styles.productCol}
                      onPress={() => handleProductPress(p)}
                      activeOpacity={0.7}
                    >
                      <Image source={{ uri: p.image }} style={styles.tableImage} />
                      <Text style={[styles.productColTitle, { color: colors.strong }]} numberOfLines={2}>{p.name}</Text>
                      <Text style={[styles.productColPrice, { color: colors.accent }]}>{p.price}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Body rows for common features */}
                {meta.commonFeatures.map(feat => (
                  <View key={feat} style={[styles.tableRow, { borderBottomColor: colors.border, borderBottomWidth: 0.5 }]}>
                    <View style={[styles.featureCol, { borderRightColor: colors.border }]}>
                      <Text style={[styles.featureText, { color: colors.strong }]}>{feat}</Text>
                    </View>
                    {compareProducts.map(p => {
                      const val = p.features[feat];
                      return (
                        <View key={`${p.id}-${feat}`} style={styles.valueCol}>
                          {typeof val === 'boolean' ? (
                            val ? <Check size={20} color={colors.success} /> : <Minus size={20} color={colors.subtle} />
                          ) : (
                            <Text style={[styles.valueText, { color: colors.strong }]} numberOfLines={feat === 'Description' ? 3 : 2}>
                              {String(val)}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

// Visual Comparison Component
const VisualComparison: React.FC<{
  products: Product[];
  colors: any;
  onProductPress: (product: Product) => void;
}> = ({ products, colors, onProductPress }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.visualScrollContainer}>
      <View style={styles.visualContainer}>
        {products.map((product, index) => (
          <React.Fragment key={product.id}>
            <TouchableOpacity 
              style={[styles.visualCard, { backgroundColor: colors.bg, borderColor: colors.border }]}
              onPress={() => onProductPress(product)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: product.image }} style={styles.visualImage} />
              
              <View style={styles.visualProductInfo}>
                <Text style={[styles.visualProductName, { color: colors.strong }]}>{product.name}</Text>
                <Text style={[styles.visualProductDesc, { color: colors.subtle }]} numberOfLines={3}>
                  {product.desc}
                </Text>
                
                <View style={styles.visualMetaRow}>
                  <View style={styles.starContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        color={star <= product.rating ? '#fbbf24' : '#d1d5db'}
                        fill={star <= product.rating ? '#fbbf24' : 'transparent'}
                      />
                    ))}
                    <Text style={[styles.ratingText, { color: colors.subtle, fontSize: 11 }]}>({product.rating})</Text>
                  </View>
                </View>
                
                <Text style={[styles.visualSize, { color: colors.subtle, marginBottom: 8 }]}>
                  Size: {product.size}
                </Text>
                
                <View style={styles.visualPriceRow}>
                  <Text style={[styles.visualPrice, { color: colors.accent }]}>{product.price}</Text>
                  <Text style={[styles.visualBrand, { color: colors.subtle }]}>{product.brand}</Text>
                </View>

                {/* Action buttons */}
                <View style={styles.visualActions}>
                  <TouchableOpacity style={[styles.cartBtn, { backgroundColor: colors.accent }]} activeOpacity={0.8}>
                    <ShoppingCart size={14} color="#fff" />
                    <Text style={styles.cartBtnText}>Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.heartBtn, { borderColor: colors.border }]} activeOpacity={0.8}>
                    <Heart size={14} color={colors.subtle} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* VS indicator between cards */}
            {index < products.length - 1 && (
              <View style={styles.vsContainer}>
                <View style={[styles.vsCircle, { backgroundColor: colors.accent }]}>
                  <Text style={styles.vsText}>VS</Text>
                </View>
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    borderWidth: Platform.OS === 'web' ? 1 : 0.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  resultsContainer: {
    borderWidth: Platform.OS === 'web' ? 1 : 0.5,
    borderRadius: 10,
    height: 280,
    marginBottom: 12,
  },
  resultsList: {
    paddingHorizontal: 12,
    flex: 1,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: Platform.OS === 'web' ? 1 : 0.5,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultDesc: {
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 8,
  },
  productMeta: {
    marginBottom: 6,
  },
  sizeText: {
    fontSize: 10,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  brandText: {
    fontSize: 10,
  },
  addBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  compareTray: {
    borderWidth: Platform.OS === 'web' ? 1 : 0.5,
    borderRadius: 12,
    padding: 12,
  },
  trayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trayTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  trayHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compareCount: {
    fontSize: 12,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: 4,
  },
  modeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  modeBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
  },
  singleState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  singleText: {
    fontSize: 13,
  },
  trayCard: {
    width: 120,
    borderWidth: Platform.OS === 'web' ? 1 : 0.5,
    borderRadius: 10,
    padding: 8,
    marginRight: 8,
    alignItems: 'center',
    position: 'relative',
  },
  trayImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    marginBottom: 6,
  },
  trayName: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  trayPrice: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  trayRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  featuresHeader: {
    paddingVertical: 10,
    marginTop: 12,
    borderTopWidth: Platform.OS === 'web' ? 1 : 0.5,
    borderBottomWidth: Platform.OS === 'web' ? 1 : 0.5,
    alignItems: 'center',
  },
  featuresHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  table: {
    minWidth: 420,
    paddingTop: 8,
    paddingRight: 8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  featureCol: {
    width: 120,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0.5,
    justifyContent: 'center',
  },
  productCol: {
    width: 140,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  productColTitle: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },
  productColPrice: {
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 4,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '700',
  },
  valueCol: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  valueText: {
    fontSize: 11,
    textAlign: 'center',
  },
  // Visual comparison styles
  visualScrollContainer: {
    paddingVertical: 8,
  },
  visualContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  visualCard: {
    width: isTablet ? 200 : 160,
    borderWidth: Platform.OS === 'web' ? 1 : 0.5,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
  },
  visualImage: {
    width: '100%',
    height: isTablet ? 140 : 100,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    marginBottom: 8,
  },
  visualProductInfo: {
    gap: 6,
  },
  visualProductName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  visualProductDesc: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
  },
  visualMetaRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualSize: {
    fontSize: 9,
    textAlign: 'center',
  },
  visualPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visualPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  visualBrand: {
    fontSize: 9,
  },
  visualActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  cartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  cartBtnText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
  },
  heartBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  vsCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
});

export default CompareSearch;