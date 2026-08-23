import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, FilterState, JerseySize, CurrencyRate, OrderStatus, SiteContent, PaymentAccount } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CURRENCIES, MOCK_ORDERS } from '../data/initialProducts';
import { MYANMAR_DELIVERY_REGIONS, MyanmarRegion, MyanmarTownshipRate } from '../data/myanmarDeliveryRates';
import { db, auth, googleProvider } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDoc, getDocs, query, where } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export const INITIAL_PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    id: 'KBZPay',
    name: 'KBZPay',
    accountName: 'U AUNG MYO (APEX MERCH MM)',
    accountNumber: '09 798 123456',
    qrCodeUrl: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' width='240' height='240'><rect width='240' height='240' fill='%23ffffff' rx='16'/><rect x='20' y='20' width='60' height='60' fill='none' stroke='%230066b2' stroke-width='8' rx='8'/><rect x='34' y='34' width='32' height='32' fill='%230066b2' rx='4'/><rect x='160' y='20' width='60' height='60' fill='none' stroke='%230066b2' stroke-width='8' rx='8'/><rect x='174' y='34' width='32' height='32' fill='%230066b2' rx='4'/><rect x='20' y='160' width='60' height='60' fill='none' stroke='%230066b2' stroke-width='8' rx='8'/><rect x='34' y='174' width='32' height='32' fill='%230066b2' rx='4'/><rect x='100' y='24' width='16' height='16' fill='%2318181b'/><rect x='124' y='24' width='16' height='24' fill='%2318181b'/><rect x='100' y='52' width='40' height='16' fill='%2318181b'/><rect x='24' y='100' width='24' height='16' fill='%2318181b'/><rect x='60' y='100' width='16' height='40' fill='%2318181b'/><rect x='24' y='128' width='24' height='16' fill='%2318181b'/><rect x='160' y='100' width='24' height='24' fill='%2318181b'/><rect x='196' y='100' width='20' height='16' fill='%2318181b'/><rect x='160' y='136' width='56' height='16' fill='%2318181b'/><rect x='100' y='160' width='16' height='32' fill='%2318181b'/><rect x='128' y='160' width='32' height='16' fill='%2318181b'/><rect x='100' y='204' width='56' height='16' fill='%2318181b'/><rect x='170' y='170' width='20' height='20' fill='%2318181b'/><rect x='200' y='170' width='20' height='48' fill='%2318181b'/><rect x='170' y='200' width='20' height='20' fill='%2318181b'/><rect x='86' y='86' width='68' height='68' fill='%23ffffff' rx='8'/><rect x='90' y='90' width='60' height='60' fill='%230066b2' rx='6'/><text x='120' y='125' fill='%23ffffff' font-family='sans-serif' font-size='11' font-weight='900' text-anchor='middle'>KPay</text></svg>`,
    instruction: 'KBZPay App ဖြင့် QR Scan ဖတ်၍ဖြစ်စေ၊ ဖုန်း 09798123456 သို့ဖြစ်စေ တိုက်ရိုက်လွှဲပေးပါရန်။',
    isEnabled: true,
    color: '#3b82f6',
    badge: 'Direct Transfer / Scan QR',
  },
  {
    id: 'WavePay',
    name: 'WavePay',
    accountName: 'U AUNG MYO (APEX MERCH MM)',
    accountNumber: '09 798 123456',
    qrCodeUrl: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' width='240' height='240'><rect width='240' height='240' fill='%23ffffff' rx='16'/><rect x='20' y='20' width='60' height='60' fill='none' stroke='%23f59e0b' stroke-width='8' rx='8'/><rect x='34' y='34' width='32' height='32' fill='%23f59e0b' rx='4'/><rect x='160' y='20' width='60' height='60' fill='none' stroke='%23f59e0b' stroke-width='8' rx='8'/><rect x='174' y='34' width='32' height='32' fill='%23f59e0b' rx='4'/><rect x='20' y='160' width='60' height='60' fill='none' stroke='%23f59e0b' stroke-width='8' rx='8'/><rect x='34' y='174' width='32' height='32' fill='%23f59e0b' rx='4'/><rect x='100' y='24' width='16' height='16' fill='%2318181b'/><rect x='124' y='24' width='16' height='24' fill='%2318181b'/><rect x='100' y='52' width='40' height='16' fill='%2318181b'/><rect x='24' y='100' width='24' height='16' fill='%2318181b'/><rect x='60' y='100' width='16' height='40' fill='%2318181b'/><rect x='24' y='128' width='24' height='16' fill='%2318181b'/><rect x='160' y='100' width='24' height='24' fill='%2318181b'/><rect x='196' y='100' width='20' height='16' fill='%2318181b'/><rect x='160' y='136' width='56' height='16' fill='%2318181b'/><rect x='100' y='160' width='16' height='32' fill='%2318181b'/><rect x='128' y='160' width='32' height='16' fill='%2318181b'/><rect x='100' y='204' width='56' height='16' fill='%2318181b'/><rect x='170' y='170' width='20' height='20' fill='%2318181b'/><rect x='200' y='170' width='20' height='48' fill='%2318181b'/><rect x='170' y='200' width='20' height='20' fill='%2318181b'/><rect x='86' y='86' width='68' height='68' fill='%23ffffff' rx='8'/><rect x='90' y='90' width='60' height='60' fill='%23f59e0b' rx='6'/><text x='120' y='125' fill='%23000000' font-family='sans-serif' font-size='10' font-weight='900' text-anchor='middle'>Wave</text></svg>`,
    instruction: 'WavePay Wallet ဖုန်းနံပါတ် 09798123456 သို့ ငွေလွှဲပေးပါရန်။',
    isEnabled: true,
    color: '#eab308',
    badge: 'Instant Wallet Pay',
  },
  {
    id: 'AYA Pay',
    name: 'AYA Pay',
    accountName: 'APEX ESPORTS MERCHANDISE MM',
    accountNumber: '400 1234 5678 9012',
    qrCodeUrl: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' width='240' height='240'><rect width='240' height='240' fill='%23ffffff' rx='16'/><rect x='20' y='20' width='60' height='60' fill='none' stroke='%23ef4444' stroke-width='8' rx='8'/><rect x='34' y='34' width='32' height='32' fill='%23ef4444' rx='4'/><rect x='160' y='20' width='60' height='60' fill='none' stroke='%23ef4444' stroke-width='8' rx='8'/><rect x='174' y='34' width='32' height='32' fill='%23ef4444' rx='4'/><rect x='20' y='160' width='60' height='60' fill='none' stroke='%23ef4444' stroke-width='8' rx='8'/><rect x='34' y='174' width='32' height='32' fill='%23ef4444' rx='4'/><rect x='100' y='24' width='16' height='16' fill='%2318181b'/><rect x='124' y='24' width='16' height='24' fill='%2318181b'/><rect x='100' y='52' width='40' height='16' fill='%2318181b'/><rect x='24' y='100' width='24' height='16' fill='%2318181b'/><rect x='60' y='100' width='16' height='40' fill='%2318181b'/><rect x='24' y='128' width='24' height='16' fill='%2318181b'/><rect x='160' y='100' width='24' height='24' fill='%2318181b'/><rect x='196' y='100' width='20' height='16' fill='%2318181b'/><rect x='160' y='136' width='56' height='16' fill='%2318181b'/><rect x='100' y='160' width='16' height='32' fill='%2318181b'/><rect x='128' y='160' width='32' height='16' fill='%2318181b'/><rect x='100' y='204' width='56' height='16' fill='%2318181b'/><rect x='170' y='170' width='20' height='20' fill='%2318181b'/><rect x='200' y='170' width='20' height='48' fill='%2318181b'/><rect x='170' y='200' width='20' height='20' fill='%2318181b'/><rect x='86' y='86' width='68' height='68' fill='%23ffffff' rx='8'/><rect x='90' y='90' width='60' height='60' fill='%23ef4444' rx='6'/><text x='120' y='125' fill='%23ffffff' font-family='sans-serif' font-size='11' font-weight='900' text-anchor='middle'>AYA</text></svg>`,
    instruction: 'AYA Pay (သို့) AYA Bank အကောင့် 400123456789012 သို့ လွှဲပေးပါရန်။',
    isEnabled: true,
    color: '#ef4444',
    badge: 'Bank & Wallet',
  },
  {
    id: 'CB Pay',
    name: 'CB Pay',
    accountName: 'APEX ESPORTS MERCHANDISE MM',
    accountNumber: '0012 3456 7890 1234',
    qrCodeUrl: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240' width='240' height='240'><rect width='240' height='240' fill='%23ffffff' rx='16'/><rect x='20' y='20' width='60' height='60' fill='none' stroke='%23d97706' stroke-width='8' rx='8'/><rect x='34' y='34' width='32' height='32' fill='%23d97706' rx='4'/><rect x='160' y='20' width='60' height='60' fill='none' stroke='%23d97706' stroke-width='8' rx='8'/><rect x='174' y='34' width='32' height='32' fill='%23d97706' rx='4'/><rect x='20' y='160' width='60' height='60' fill='none' stroke='%23d97706' stroke-width='8' rx='8'/><rect x='34' y='174' width='32' height='32' fill='%23d97706' rx='4'/><rect x='100' y='24' width='16' height='16' fill='%2318181b'/><rect x='124' y='24' width='16' height='24' fill='%2318181b'/><rect x='100' y='52' width='40' height='16' fill='%2318181b'/><rect x='24' y='100' width='24' height='16' fill='%2318181b'/><rect x='60' y='100' width='16' height='40' fill='%2318181b'/><rect x='24' y='128' width='24' height='16' fill='%2318181b'/><rect x='160' y='100' width='24' height='24' fill='%2318181b'/><rect x='196' y='100' width='20' height='16' fill='%2318181b'/><rect x='160' y='136' width='56' height='16' fill='%2318181b'/><rect x='100' y='160' width='16' height='32' fill='%2318181b'/><rect x='128' y='160' width='32' height='16' fill='%2318181b'/><rect x='100' y='204' width='56' height='16' fill='%2318181b'/><rect x='170' y='170' width='20' height='20' fill='%2318181b'/><rect x='200' y='170' width='20' height='48' fill='%2318181b'/><rect x='170' y='200' width='20' height='20' fill='%2318181b'/><rect x='86' y='86' width='68' height='68' fill='%23ffffff' rx='8'/><rect x='90' y='90' width='60' height='60' fill='%23d97706' rx='6'/><text x='120' y='125' fill='%23ffffff' font-family='sans-serif' font-size='11' font-weight='900' text-anchor='middle'>CB</text></svg>`,
    instruction: 'CB Pay / CB Bank Account 0012345678901234 သို့ လွှဲပေးပါရန်။',
    isEnabled: true,
    color: '#f59e0b',
    badge: 'Bank Special',
  },
];

const defaultSiteContent: SiteContent = {
  topBannerText: 'MLBB ESPORTS & FOOTBALL KITS • 4K SUBLIMATION JERSEY COLLECTION',
  topBannerCode: 'APEXPRO',
  heroFlameBadge: 'MLBB Esports & Football Pro Match Drops',
  heroTitle: 'PRO ESPORTS & FOOTBALL JERSEYS',
  heroSubtitle: 'Official authentic pro match apparel, sublimation kits, and tournament editions.',
  showcaseBadge: '360° PRO SHOWCASE',
  catalogHeading: 'AUTHENTIC JERSEY CATALOGUE',
  catalogSubtitle: 'Filtered by authentic player editions, club teams, and match day kits',
  footerAbout: 'The premier esports apparel & authentic jersey collection. Offering MLBB Pro League match jerseys, football kits, and high-precision 4K sublimation designs.',
  footerCurrencyNote: 'MMK (Ks)',
  footerCopyright: '© 2026 Apex Jerseys Co. All rights reserved. Built with precision for athletic fans worldwide.',
  tiktokLink: '',
  viberLink: '',
  telegramLink: '',
};

interface StoreContextType {
  products: Product[];
  currencies: Record<string, CurrencyRate>;
  currentCurrency: string;
  setCurrency: (code: string) => void;
  formatPrice: (amountInUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;
  
  // Site Content
  siteContent: SiteContent;
  updateSiteContent: (newContent: Partial<SiteContent>) => void;
  resetSiteContent: () => void;
  isSiteContentModalOpen: boolean;
  setIsSiteContentModalOpen: (open: boolean) => void;

  // Live Edit Mode & Product Editing
  isLiveEditMode: boolean;
  setIsLiveEditMode: (mode: boolean) => void;
  toggleLiveEditMode: () => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalUSD: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Tracking
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'trackingNumber' | 'createdAt' | 'timeline'>) => Order;
  findOrderByTracking: (trackingNumber: string) => Promise<Order | undefined>;
  updateOrderStatus: (orderId: string, status: OrderStatus, locationNote?: string) => void;

  // Admin Management
  isAdminLoggedIn: boolean;
  loginAdmin: () => Promise<boolean>;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateInventory: (productId: string, size: JerseySize, newCount: number) => void;
  resetToDefaultData: () => void;

  // Modals & Navigation State
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedPlayerStats: Product | null;
  setSelectedPlayerStats: (p: Product | null) => void;
  customizerBaseProduct: Product | null;
  setCustomizerBaseProduct: (p: Product | null) => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
  trackingSearchQuery: string;
  setTrackingSearchQuery: (q: string) => void;
  isAdminPortalOpen: boolean;
  setIsAdminPortalOpen: (open: boolean) => void;
  shareModalData: { title: string; imageUrl?: string; customName?: string; customNumber?: string } | null;
  setShareModalData: (data: { title: string; imageUrl?: string; customName?: string; customNumber?: string } | null) => void;

  // Myanmar Delivery Rates Management
  deliveryRegions: MyanmarRegion[];
  updateTownshipDeliveryRate: (regionId: string, townshipId: string, updates: Partial<MyanmarTownshipRate>) => void;
  adjustRegionDeliveryRates: (regionId: string, deltaMMK: number) => void;
  setRegionEstimatedDuration: (regionId: string, duration: string) => void;
  resetRegionDeliveryRates: (regionId: string) => void;
  resetDeliveryRates: () => void;

  // Myanmar Payment Accounts (KBZPay, WavePay, AYA Pay, CB Pay)
  paymentAccounts: PaymentAccount[];
  updatePaymentAccount: (accountId: string, updates: Partial<PaymentAccount>) => void;
  resetPaymentAccounts: () => void;

  // Theme (Dark / Light)
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
}

const defaultFilterState: FilterState = {
  search: '',
  sport: 'All',
  team: 'All',
  player: 'All',
  style: 'All',
  league: 'All',
  maxPrice: 200,
  onlyInStock: false,
  stockFilter: 'all',
  sortBy: 'featured',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const cleanUndefined = (obj: any) => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  return cleaned;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Firebase loaded states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>(INITIAL_PAYMENT_ACCOUNTS);
  const [deliveryRegions, setDeliveryRegions] = useState<MyanmarRegion[]>(MYANMAR_DELIVERY_REGIONS);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'alumpy841@gmail.com') {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
        if (user) {
          signOut(auth);
          alert("Unauthorized access. Your email is not authorized for the admin portal.");
        }
      }
    });
    
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
         const p: Product[] = [];
         snapshot.forEach(d => p.push(d.data() as Product));
         setProducts(p);
      } else {
         setProducts(INITIAL_PRODUCTS);
         if (isAdminLoggedIn) {
            // Seed DB with initial products
            INITIAL_PRODUCTS.forEach(prod => {
              setDoc(doc(db, 'products', prod.id), cleanUndefined(prod)).catch(console.error);
            });
         }
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
    };
  }, [isAdminLoggedIn]);

  useEffect(() => {
    let unsubOrders = () => {};
    let unsubPayment = () => {};
    let unsubDelivery = () => {};
    let unsubSite = () => {};

    if (isAdminLoggedIn) {
      unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const o: Order[] = [];
        snapshot.forEach(d => o.push(d.data() as Order));
        setOrders(o.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      });
    }

    unsubSite = onSnapshot(doc(db, 'site_content', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSiteContent({ ...defaultSiteContent, ...docSnap.data() as SiteContent });
      }
    });

    unsubPayment = onSnapshot(doc(db, 'payment_accounts', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setPaymentAccounts(docSnap.data().accounts as PaymentAccount[]);
      }
    });

    unsubDelivery = onSnapshot(doc(db, 'delivery_rates', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const reg = docSnap.data().regions;
        if (Array.isArray(reg) && reg.length > 0) {
          let totalTownshipsSaved = 0;
          reg.forEach((r: any) => totalTownshipsSaved += r.townships?.length || 0);
          
          let totalTownshipsNew = 0;
          MYANMAR_DELIVERY_REGIONS.forEach(r => totalTownshipsNew += r.townships.length);

          if (totalTownshipsSaved < totalTownshipsNew || (reg[0] && reg[0].townships[0] && reg[0].townships[0].wepoztFeeMMK === undefined)) {
            setDeliveryRegions(MYANMAR_DELIVERY_REGIONS);
            if (isAdminLoggedIn) { setDoc(doc(db, 'delivery_rates', 'main'), { regions: MYANMAR_DELIVERY_REGIONS }, { merge: true }).catch(console.error); }
          } else {
            setDeliveryRegions(reg as MyanmarRegion[]);
          }
        } else {
          setDeliveryRegions(MYANMAR_DELIVERY_REGIONS);
        }
      } else {
        setDeliveryRegions(MYANMAR_DELIVERY_REGIONS);
      }
    });

    return () => {
      unsubOrders();
      unsubSite();
      unsubPayment();
      unsubDelivery();
    }
  }, [isAdminLoggedIn]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('apex_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('apex_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
    return ['jersey-rm-bellingham-2425'];
  });

  const [currentCurrency, setCurrentCurrency] = useState<string>(() => {
    const saved = localStorage.getItem('apex_currency');
    if (saved && INITIAL_CURRENCIES[saved]) return saved;
    return 'MMK';
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('apex_theme_mode');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  useEffect(() => {
    localStorage.setItem('apex_theme_mode', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  const updateSiteContent = (newContent: Partial<SiteContent>) => {
    const updated = { ...siteContent, ...newContent };
    setSiteContent(updated);
    setDoc(doc(db, 'site_content', 'main'), updated, { merge: true });
  };

  const resetSiteContent = () => {
    setSiteContent(defaultSiteContent);
    setDoc(doc(db, 'site_content', 'main'), defaultSiteContent, { merge: true });
  };

  // Live Edit & Manual Product Edit states
  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(false);
  const toggleLiveEditMode = () => setIsLiveEditMode(prev => !prev);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSiteContentModalOpen, setIsSiteContentModalOpen] = useState<boolean>(false);

  // UI state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPlayerStats, setSelectedPlayerStats] = useState<Product | null>(null);
  const [customizerBaseProduct, setCustomizerBaseProduct] = useState<Product | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [trackingSearchQuery, setTrackingSearchQuery] = useState('');
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [shareModalData, setShareModalData] = useState<{ title: string; imageUrl?: string; customName?: string; customNumber?: string } | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);

  const updateTownshipDeliveryRate = (
    regionId: string,
    townshipId: string,
    updates: Partial<MyanmarTownshipRate>
  ) => {
    setDeliveryRegions(prev => {
      const next = prev.map(reg => {
        if (reg.id !== regionId) return reg;
        return {
          ...reg,
          townships: reg.townships.map(t => {
            if (t.id !== townshipId) return t;
            return {
              ...t,
              ...updates,
            };
          }),
        };
      });
      setDoc(doc(db, 'delivery_rates', 'main'), { regions: next }, { merge: true });
      return next;
    });
  };

  const adjustRegionDeliveryRates = (regionId: string, deltaMMK: number) => {
    setDeliveryRegions(prev => {
      const next = prev.map(reg => {
        if (reg.id !== regionId) return reg;
        return {
          ...reg,
          townships: reg.townships.map(t => ({
            ...t,
            wepoztFeeMMK: Math.max(1000, t.wepoztFeeMMK + deltaMMK),
          })),
        };
      });
      setDoc(doc(db, 'delivery_rates', 'main'), { regions: next }, { merge: true });
      return next;
    });
  };

  const setRegionEstimatedDuration = (regionId: string, duration: string) => {
    setDeliveryRegions(prev => {
      const next = prev.map(reg => {
        if (reg.id !== regionId) return reg;
        return {
          ...reg,
          townships: reg.townships.map(t => ({
            ...t,
            estimatedDays: duration,
          })),
        };
      });
      setDoc(doc(db, 'delivery_rates', 'main'), { regions: next }, { merge: true });
      return next;
    });
  };

  const resetRegionDeliveryRates = (regionId: string) => {
    const defaultRegion = MYANMAR_DELIVERY_REGIONS.find(r => r.id === regionId);
    if (!defaultRegion) return;
    setDeliveryRegions(prev => {
      const next = prev.map(reg => {
        if (reg.id !== regionId) return reg;
        return defaultRegion;
      });
      setDoc(doc(db, 'delivery_rates', 'main'), { regions: next }, { merge: true });
      return next;
    });
  };

  const resetDeliveryRates = () => {
    setDeliveryRegions(MYANMAR_DELIVERY_REGIONS);
    if (isAdminLoggedIn) { setDoc(doc(db, 'delivery_rates', 'main'), { regions: MYANMAR_DELIVERY_REGIONS }, { merge: true }).catch(console.error); }
  };

  const updatePaymentAccount = (accountId: string, updates: Partial<PaymentAccount>) => {
    setPaymentAccounts(prev => {
      const next = prev.map(acc => {
        if (acc.id !== accountId) return acc;
        return { ...acc, ...updates };
      });
      setDoc(doc(db, 'payment_accounts', 'main'), { accounts: next }, { merge: true });
      return next;
    });
  };

  const resetPaymentAccounts = () => {
    setPaymentAccounts(INITIAL_PAYMENT_ACCOUNTS);
    setDoc(doc(db, 'payment_accounts', 'main'), { accounts: INITIAL_PAYMENT_ACCOUNTS }, { merge: true });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('apex_products_v4', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('apex_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('apex_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('apex_orders', JSON.stringify(orders));
  }, [orders]);

  const setCurrency = (code: string) => {
    if (INITIAL_CURRENCIES[code]) {
      setCurrentCurrency(code);
      localStorage.setItem('apex_currency', code);
    }
  };

  const convertPrice = (amountInUSD: number): number => {
    const curr = INITIAL_CURRENCIES[currentCurrency] || INITIAL_CURRENCIES.MMK;
    return amountInUSD * curr.rate;
  };

  const formatPrice = (amountInUSD: number): string => {
    const curr = INITIAL_CURRENCIES[currentCurrency] || INITIAL_CURRENCIES.MMK;
    const converted = amountInUSD * curr.rate;
    if (curr.code === 'MMK') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    if (curr.code === 'JPY') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  const addToCart = (itemData: Omit<CartItem, 'id'>) => {
    const uniqueId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newItem: CartItem = {
      ...itemData,
      id: uniqueId,
    };

    setCart((prev) => {
      // Check if identical item (same product, same size, same customization) already in cart
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.size === newItem.size &&
          i.isCustom === newItem.isCustom &&
          JSON.stringify(i.customDetails) === JSON.stringify(newItem.customDetails)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });

    // Auto open cart drawer for great shopping UX
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotalUSD = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const createOrder = (orderData: Omit<Order, 'id' | 'trackingNumber' | 'createdAt' | 'timeline'>): Order => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const trackingNum = `APX-${randomCode}-US`;
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();
    const formattedNow = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      trackingNumber: trackingNum,
      createdAt: now,
      status: 'Pending Payment Verification',
      timeline: [
        {
          timestamp: formattedNow,
          status: 'Pending Payment Verification',
          location: 'Apex Global Fulfillment Center',
          description: 'Payment authorized & verified. Order queued for preparation.',
        },
      ],
    };

    // Decrement inventory for ordered products
    setProducts((prevProducts) => {
      const updated = [...prevProducts];
      orderData.items.forEach((item) => {
        if (item.productId) {
          const prodIdx = updated.findIndex((p) => p.id === item.productId);
          if (prodIdx > -1) {
            const currentStock = updated[prodIdx].inventory[item.size] || 0;
            const newStock = Math.max(0, currentStock - item.quantity);
            const newP = {
              ...updated[prodIdx],
              inventory: {
                ...updated[prodIdx].inventory,
                [item.size]: newStock,
              },
            };
            updated[prodIdx] = newP;
            setDoc(doc(db, 'products', item.productId), cleanUndefined(newP), { merge: true }).catch(console.error);
          }
        }
      });
      return updated;
    });

    setOrders((prev) => [newOrder, ...prev]);
    const orderToSave = { ...newOrder };
    Object.keys(orderToSave).forEach(key => {
      if (orderToSave[key as keyof Order] === undefined) {
        delete orderToSave[key as keyof Order];
      }
    });
    setDoc(doc(db, 'orders', newOrder.id), orderToSave).catch(console.error);
    clearCart();
    return newOrder;
  };

  const findOrderByTracking = async (trackingNumber: string): Promise<Order | undefined> => {
    const cleanQuery = trackingNumber.trim().toUpperCase();
    const cleanEmail = trackingNumber.trim().toLowerCase();
    
    const localFound = orders.find(
      (o) =>
        o.trackingNumber.toUpperCase() === cleanQuery ||
        o.id.toUpperCase() === cleanQuery ||
        o.customer.email.toLowerCase() === cleanEmail
    );

    if (localFound) return localFound;

    try {
      const trackingQuery = query(collection(db, 'orders'), where('trackingNumber', '==', cleanQuery));
      const trackingSnap = await getDocs(trackingQuery);
      if (!trackingSnap.empty) {
        return trackingSnap.docs[0].data() as Order;
      }

      const docRef = doc(db, 'orders', cleanQuery);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Order;
      }
      
      const emailQuery = query(collection(db, 'orders'), where('customer.email', '==', cleanEmail));
      const emailSnap = await getDocs(emailQuery);
      if (!emailSnap.empty) {
        return emailSnap.docs[0].data() as Order;
      }
    } catch (err) {
      console.error("Error finding order in DB:", err);
    }
    return undefined;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, locationNote?: string) => {
    const formattedNow = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const newEvent = {
            timestamp: formattedNow,
            status: newStatus,
            location: locationNote || 'Apex Regional Carrier Node',
            description: `Status updated to ${newStatus}.`,
          };
          const newOrder = {
            ...order,
            status: newStatus,
            timeline: [newEvent, ...order.timeline],
          };
          if (isAdminLoggedIn) {
            const orderToSave = { ...newOrder };
            Object.keys(orderToSave).forEach(key => {
              if (orderToSave[key as keyof Order] === undefined) {
                delete orderToSave[key as keyof Order];
              }
            });
            setDoc(doc(db, 'orders', orderId), orderToSave, { merge: true }).catch(console.error);
          }
          return newOrder;
        }
        return order;
      })
    );
  };

  const loginAdmin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== 'alumpy841@gmail.com') {
        await signOut(auth);
        throw new Error("Unauthorized access. Your email is not authorized for the admin portal.");
      }
      return true;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  const logoutAdmin = () => {
    signOut(auth);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = `jersey-${productData.team.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    if (isAdminLoggedIn) { setDoc(doc(db, 'products', newId), cleanUndefined(newProduct)).catch(console.error); }
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    if (isAdminLoggedIn) { setDoc(doc(db, 'products', id), cleanUndefined(updatedFields), { merge: true }).catch(console.error); }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (isAdminLoggedIn) { deleteDoc(doc(db, 'products', id)).catch(console.error); }
  };

  const updateInventory = (productId: string, size: JerseySize, newCount: number) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          const newP = {
            ...p,
            inventory: {
              ...p.inventory,
              [size]: Math.max(0, newCount),
            },
          };
          if (isAdminLoggedIn) {
            setDoc(doc(db, 'products', productId), cleanUndefined(newP), { merge: true }).catch(console.error);
          }
          return newP;
        }
        return p;
      });
      return updated;
    });
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(MOCK_ORDERS as unknown as Order[]);
    localStorage.setItem('apex_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('apex_orders', JSON.stringify(MOCK_ORDERS));
  };

  const resetFilters = () => {
    setFilters(defaultFilterState);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        currencies: INITIAL_CURRENCIES,
        currentCurrency,
        setCurrency,
        formatPrice,
        convertPrice,
        siteContent,
        updateSiteContent,
        resetSiteContent,
        isSiteContentModalOpen,
        setIsSiteContentModalOpen,
        isLiveEditMode,
        setIsLiveEditMode,
        toggleLiveEditMode,
        editingProduct,
        setEditingProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotalUSD,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        findOrderByTracking,
        updateOrderStatus,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        updateInventory,
        resetToDefaultData,
        selectedProduct,
        setSelectedProduct,
        selectedPlayerStats,
        setSelectedPlayerStats,
        customizerBaseProduct,
        setCustomizerBaseProduct,
        isCustomizerOpen,
        setIsCustomizerOpen,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        trackingSearchQuery,
        setTrackingSearchQuery,
        isAdminPortalOpen,
        setIsAdminPortalOpen,
        shareModalData,
        setShareModalData,
        deliveryRegions,
        updateTownshipDeliveryRate,
        adjustRegionDeliveryRates,
        setRegionEstimatedDuration,
        resetRegionDeliveryRates,
        resetDeliveryRates,
        paymentAccounts,
        updatePaymentAccount,
        resetPaymentAccounts,
        theme,
        toggleTheme,
        setTheme,
        filters,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
