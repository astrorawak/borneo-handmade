export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceUSD: number;
  category: string;
  categorySlug: string;
  description: string;
  shortDesc: string;
  image: string;
  stock: number;
  isActive: boolean;
  origin: string;
  badge?: string;
  material?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCountry: string;
  buyerAddress: string;
  buyerCity: string;
  buyerPostalCode: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  currency: string;
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  trackingNumber?: string;
  proofImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingOption {
  id: string;
  label: string;
  estimatedDays: string;
  costIDR: number;
  costUSD: number;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  whatsapp: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  paypalEmail: string;
  usdtAddress: string;
  usdtNetwork: string;
  westernUnionName: string;
  westernUnionCountry: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  shippingNote: string;
  announcementText: string;
  announcementActive: boolean;
  shippingOptions: ShippingOption[];
}

export type Language = 'en' | 'id';
export type Currency = 'IDR' | 'USD';
