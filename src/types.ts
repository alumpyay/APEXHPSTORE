export type SportCategory = 'MLBB' | 'Football';
export type JerseyStyle = 'Home' | 'Away' | 'Other';

export interface SiteContent {
  topBannerText: string;
  topBannerCode: string;
  heroFlameBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  showcaseBadge: string;
  catalogHeading: string;
  catalogSubtitle: string;
  footerAbout: string;
  footerCurrencyNote: string;
  footerCopyright: string;
  tiktokLink?: string;
  viberLink?: string;
  telegramLink?: string;
}

export interface PlayerStats {
  playerName: string;
  number: number;
  position: string; // e.g. "Jungler / Assassin", "Gold Laner", "Fragger / Assaulter", "IGL Leader", "Attacking Midfielder"
  team: string;
  season: string;
  rating: number; // e.g., 9.8
  appearances: number;
  goalsOrPoints: number; // KDA / Kills / Goals
  assists: number;
  keyMetricName: string; // e.g., "KDA Ratio" or "Avg Damage / Match" or "Headshot %"
  keyMetricValue: string; // e.g., "7.4 KDA" or "845 Avg Dmg"
  trophies: string[];
  bioHighlight: string;
}

export interface SizeInventory {
  S: number;
  M: number;
  L: number;
  XL: number;
  '2XL': number;
  '3XL': number;
}

export type JerseySize = keyof SizeInventory;

export interface SquadMember {
  id: string;
  role: string; // e.g., "EXP Lane", "Jungler", "Mid Lane", "Gold Lane", "Roamer", "IGL", "Fragger", "Sniper", "Support"
  gamerTag: string;
  number: string;
  size: JerseySize;
}

export interface Product {
  id: string;
  name: string;
  team: string;
  league: string; // e.g. "MPL / M-Series", "PMGC / PMSL SEA", "La Liga", "Premier League"
  sport: SportCategory;
  player?: string;
  playerNumber?: number;
  style: JerseyStyle;
  season: string;
  baseCost: number; // Cost to store (for admin margin calculation)
  price: number; // Retail selling price in USD
  originalPrice?: number; // For sale discount badge
  imageFront: string;
  imageBack?: string;
  galleryImages?: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  inventory: SizeInventory;
  featured?: boolean;
  isNewDrop?: boolean;
  description: string;
  fabricDetails: string[];
  stats?: PlayerStats;
  tags: string[];
  // Stock Availability Type ('in-stock' | 'pre-order')
  stockStatus?: 'in-stock' | 'pre-order'; // "In Stock" (ပစ္စည်းအသင့်ရှိ) သို့ "Pre-Order" (ကြိုတင်မှာယူရန်)
  preOrderLeadTime?: string;              // e.g. "5-7 Days" or "၇-၁၀ ရက်အတွင်း ပို့ဆောင်ပေးမည်"
  // Custom Pop-Up Banners & Badges (ကိုယ်တိုင် စိတ်ကြိုက်ရေးနိုင်သော ဘန်နာ တံဆိပ်များ)
  dropBadgeText?: string;      // e.g. "24/25 DROP", "24/25", "NEW DROP", "M6 DROP"
  discountBadgeText?: string;  // e.g. "SAVE 19%", "SAVE 20%", "SPECIAL 15% OFF"
  editionBadgeText?: string;   // e.g. "World Champion Edition", "Home Edition", "Heritage Edition"
  customBadgeText?: string;    // e.g. "BEST SELLER", "LIMITED EDITION"
  showDropBadge?: boolean;     // Toggle visibility for Drop banner
  showDiscountBadge?: boolean; // Toggle visibility for Discount banner
  showEditionBadge?: boolean;  // Toggle visibility for Edition banner
}

export interface SquadMember {
  id: string;
  ign: string;
  role: string;
  number: string;
  size: JerseySize;
}

export type PhotoPlacement = 'front-chest-center' | 'front-chest-left' | 'front-chest-right' | 'back-upper' | 'back-center' | 'sleeve-left';
export type PhotoShape = 'rect' | 'circle' | 'shield' | 'diamond';

export interface CustomDesign {
  baseJerseyId?: string;
  teamName: string;
  gameTitle?: 'MLBB' | 'Football' | 'Custom Esports';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pattern: 'solid' | 'cyber-hex' | 'speed-lines' | 'camo-glitch' | 'stripes' | 'gradient';
  collarStyle: 'crew' | 'v-neck' | 'mandarin' | 'polo';
  customName: string; // IGN or Player Name
  customNumber: string;
  fontStyle: 'modern' | 'athletic' | 'classic' | 'neon' | 'cyber-esports';
  sleeveBadges: string[];
  sponsorText?: string;
  sponsorLogoUrl?: string;
  customPhotoUrl?: string;
  customPhotoPlacement?: PhotoPlacement;
  customPhotoScale?: number;
  customPhotoShape?: PhotoShape;
  customPhotoBorder?: boolean;
  size: JerseySize;
  viewAngle: 'front' | 'back';
  fabricType?: 'Pro Hexagon Breathable' | 'Ultra-Light Micro-Polyester' | 'Aeroknit Anti-Sweat';
  squadRoster?: SquadMember[];
}

export interface CartItem {
  id: string; // Unique cart item ID
  productId?: string;
  name: string;
  team: string;
  style: string;
  size: JerseySize;
  price: number;
  quantity: number;
  image: string;
  isCustom: boolean;
  customDetails?: {
    name: string;
    number: string;
    badges: string[];
    primaryColor: string;
    secondaryColor: string;
    customPhotoUrl?: string;
    customPhotoPlacement?: PhotoPlacement;
  };
}

export type OrderStatus = 'Pending Payment Verification' | 'Order Placed' | 'Customization & Printing' | 'Quality Check' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface TrackingEvent {
  timestamp: string;
  status: OrderStatus;
  location: string;
  description: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  currency: string;
  status: OrderStatus;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: 'KBZPay' | 'WavePay' | 'AYA Pay' | 'CB Pay' | string;
  paymentReceiptUrl?: string;
  transactionId?: string;
  timeline: TrackingEvent[];
  estimatedDelivery: string;
}

export interface PaymentAccount {
  id: 'KBZPay' | 'WavePay' | 'AYA Pay' | 'CB Pay' | string;
  name: string;
  accountName: string;
  accountNumber: string;
  qrCodeUrl?: string;
  instruction?: string;
  isEnabled: boolean;
  color?: string;
  badge?: string;
}

export interface CurrencyRate {
  code: string;
  symbol: string;
  name: string;
  rate: number; // relative to USD = 1.0
}

export interface FilterState {
  search: string;
  sport: string;
  team: string;
  player: string;
  style: string;
  league: string;
  maxPrice: number;
  onlyInStock: boolean;
  stockFilter?: 'all' | 'in-stock' | 'pre-order';
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest' | 'rating';
}
