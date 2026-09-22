export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  badge?: {
    text: string;
    type: 'discount' | 'new' | 'hot' | 'best' | 'combo';
  };
  isNew?: boolean;
  isBannerFeatured?: boolean;
  colors?: string[];
  sizes?: string[];
  stockCount?: number;
  description: string;
  features?: string[];
  inStock: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  bnName?: string;
  itemCount: number;
  iconName: string;
  image: string;
}

export interface ComboBundle {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  badge: string;
  bundlePrice: number;
  originalPrice: number;
  savings: number;
  image: string;
  items: Product[];
}

export interface BannerHotspot {
  id: string;
  productId: string;
  title: string;
  price: number;
  originalPrice?: number;
  top: string; // Percentage e.g. "45%"
  left: string; // Percentage e.g. "12%"
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Review {
  id: string;
  author: string;
  location?: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  productName: string;
  verified: boolean;
}

export interface CheckoutFormData {
  fullName: string;
  phoneNumber: string;
  deliveryArea: 'inside_dhaka' | 'outside_dhaka';
  fullAddress: string;
  district: string;
  orderNotes?: string;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
}

export interface OrderConfirmation {
  orderId: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: string;
  status: 'confirmed' | 'processing';
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  image?: string;
}

export interface Order {
  id: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  district?: string;
  deliveryCharge: number;
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  note?: string;
  items: OrderItem[];
  userId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Subscriber {
  id: string;
  contact: string;
  source?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  address?: string;
  district?: string;
  role?: 'customer' | 'admin';
  createdAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleBn: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  excerptBn: string;
  readTime: string;
  content: string;
  contentBn: string;
}

export interface BrandItem {
  id: string;
  name: string;
  category: string;
}

export interface StatHighlight {
  id: string;
  value: string;
  label: string;
  labelBn: string;
  iconName: string;
}




