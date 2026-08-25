import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Package, 
  DollarSign, 
  PlusCircle, 
  Layers, 
  TrendingUp, 
  Truck, 
  Trash2, 
  Edit3, 
  Check, 
  AlertTriangle,
  RotateCcw,
  Save,
  ChevronRight,
  LogOut,
  Clock,
  Percent,
  Calculator,
  Plus,
  Sparkles,
  MapPin,
  Search,
  Building,
  Navigation,
  CheckCircle2,
  Copy,
  Zap,
  Filter,
  ArrowRight,
  Wallet
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, JerseySize, OrderStatus, SportCategory, JerseyStyle, Order } from '../types';
import { 
  MYANMAR_DELIVERY_REGIONS, 
  calculateWepoztDeliveryFee, 
  getTownshipRate,
  MyanmarRegion, 
  MyanmarTownshipRate 
} from '../data/myanmarDeliveryRates';

export const AdminPortal: React.FC = () => {
  const { 
    isAdminPortalOpen, 
    setIsAdminPortalOpen, 
    isAdminLoggedIn, 
    loginAdmin, 
    logoutAdmin,
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    updateInventory,
    orders,
    updateOrderStatus,
    formatPrice,
    resetToDefaultData,
    deliveryRegions,
    updateTownshipDeliveryRate,
    adjustRegionDeliveryRates,
    setRegionEstimatedDuration,
    resetRegionDeliveryRates,
    resetDeliveryRates,
    paymentAccounts,
    updatePaymentAccount,
    setEditingProduct: setGlobalEditingProduct
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'pricing' | 'input' | 'delivery' | 'analytics' | 'payment'>('inventory');
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<Order | null>(null);

  // Delivery Fee & Wepozt Rates Tab State
  const [selectedRegionId, setSelectedRegionId] = useState<string>('yangon-region');
  const [townshipSearch, setTownshipSearch] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [copiedBranchCode, setCopiedBranchCode] = useState<string | null>(null);
  const [savedRateTownshipId, setSavedRateTownshipId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [deliveryToast, setDeliveryToast] = useState<string | null>(null);
  const [customBatchDuration, setCustomBatchDuration] = useState<string>('');

  // Live Calculator State
  const [calcRegionId, setCalcRegionId] = useState<string>('yangon-region');
  const [calcTownshipId, setCalcTownshipId] = useState<string>('yangon-region-kamayut');
  const [calcWeightKg, setCalcWeightKg] = useState<number>(0.5);
  const [calcIsExpress, setCalcIsExpress] = useState<boolean>(false);

  // Inline MMK Price editing state per product
  const [inlineMMKPrices, setInlineMMKPrices] = useState<Record<string, string>>({});
  const [inlineSavedId, setInlineSavedId] = useState<string | null>(null);
  
  // Interactive Profit Margin Dropdown & Delete Confirm state
  const [marginDropdownId, setMarginDropdownId] = useState<string | null>(null);
  const [customMarginInput, setCustomMarginInput] = useState<string>('50');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New Product Input form state (with MMK direct input)
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    team: '',
    league: 'MPL Myanmar / M-Series',
    sport: 'MLBB' as SportCategory,
    player: '',
    playerNumber: 10,
    style: 'Home' as JerseyStyle,
    season: '2024/25',
    baseCostMMK: '85000',
    priceMMK: '210000',
    originalPriceMMK: '250000',
    imageFront: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    primaryColor: '#F59E0B',
    secondaryColor: '#18181B',
    accentColor: '#FCD34D',
    inventory: { S: 10, M: 20, L: 15, XL: 8, '2XL': 4, '3XL': 2 },
    featured: true,
    isNewDrop: true,
    description: 'Authentic 2024/25 match jersey with moisture-wicking jacquard fabric.',
    fabricDetails: '100% Recycled Polyester, Heat-sealed club crest',
    tags: 'MLBB, Pro, Match',
  });

  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState<string | null>(null);
  const [orderStatusSelect, setOrderStatusSelect] = useState<OrderStatus>('In Transit');
  const [orderLocationNote, setOrderLocationNote] = useState('');

  if (!isAdminPortalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passwordInput)) {
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sellMMK = parseInt(newProductForm.priceMMK.replace(/[^0-9]/g, ''), 10) || 35000;
    const costMMK = parseInt(newProductForm.baseCostMMK.replace(/[^0-9]/g, ''), 10) || 18000;
    const origMMK = parseInt(newProductForm.originalPriceMMK.replace(/[^0-9]/g, ''), 10);

    addProduct({
      name: newProductForm.name,
      team: newProductForm.team,
      league: newProductForm.league,
      sport: newProductForm.sport,
      player: newProductForm.player || undefined,
      playerNumber: Number(newProductForm.playerNumber) || undefined,
      style: newProductForm.style,
      season: newProductForm.season,
      baseCost: costMMK / 4200,
      price: sellMMK / 4200,
      originalPrice: origMMK > 0 ? origMMK / 4200 : undefined,
      imageFront: newProductForm.imageFront,
      primaryColor: newProductForm.primaryColor,
      secondaryColor: newProductForm.secondaryColor,
      accentColor: newProductForm.accentColor,
      inventory: newProductForm.inventory,
      featured: newProductForm.featured,
      isNewDrop: newProductForm.isNewDrop,
      description: newProductForm.description,
      fabricDetails: newProductForm.fabricDetails.split(',').map(s => s.trim()),
      tags: newProductForm.tags.split(',').map(s => s.trim()),
    });

    alert('Jersey successfully added to live store catalogue!');
    setActiveTab('inventory');
  };

  // Analytics calculations
  const totalRevenueUSD = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUnitsSold = orders.reduce((sum, o) => sum + o.items.reduce((a, b) => a + b.quantity, 0), 0);
  const totalStockInWarehouse: number = products.reduce(
    (sum, p) => sum + (Object.values(p.inventory) as number[]).reduce((a, b) => a + (b || 0), 0),
    0
  );
  const avgMarginPercent = products.length > 0 
    ? Math.round(products.reduce((acc, p) => acc + ((p.price - p.baseCost) / p.price) * 100, 0) / products.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="admin-portal-modal"
        className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[95vh] flex flex-col text-left"
      >
        {/* Portal Header */}
        <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white font-mono uppercase">
                  APEX STORE BACKEND & INVENTORY CONSOLE
                </h2>
                <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-zinc-400">Manage live inventory, selling price margins, products & order fulfillment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={logoutAdmin}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-lg font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminPortalOpen(false)}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Portal Content */}
        {!isAdminLoggedIn ? (
          /* Login View */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Administrator Access Required</h3>
              <p className="text-xs text-zinc-400">Sign in with your Google Account to securely manage inventory, pricing, and fulfillment.</p>
            </div>

            <div className="w-full space-y-3">
              {loginError && (
                <div className="text-rose-400 text-xs font-semibold px-4">
                  {loginError}
                </div>
              )}

              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoginError(null);
                    await loginAdmin();
                  } catch (error: any) {
                    if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-closed-by-user') {
                      setLoginError('Sign-in popup was blocked or closed. Please click "Open App in New Tab" at the top right of the preview and try again, or ensure popups are allowed.');
                    } else {
                      setLoginError(error?.message ? `Login failed: ${error.message} (Note: If you are on Vercel, you may need to add your Vercel domain to Firebase Auth Authorized Domains)` : 'Authentication failed. You must be an authorized admin.');
                    }
                  }
                }}
                className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sign in with Google
              </button>

              <div className="text-[11px] text-zinc-500 pt-2">
                Secured by Firebase Auth & Google 2FA
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 overflow-y-auto flex flex-col">
            
            {/* Top Navigation Tabs */}
            <div className="bg-zinc-900/90 border-b border-zinc-800 px-6 py-2 flex flex-wrap gap-2 text-xs font-bold">
              {[
                { id: 'inventory', name: 'Live Inventory Matrix', icon: Package },
                { id: 'pricing', name: 'Selling Price & Margin Method', icon: DollarSign },
                { id: 'input', name: 'Add / Edit Jersey Data', icon: PlusCircle },
                { id: 'delivery', name: `Delivery Fees (ပို့ဆောင်ခများ)`, icon: Truck },
                { id: 'payment', name: 'Payment Accounts', icon: Wallet },
                { id: 'analytics', name: 'Store Analytics KPIs', icon: TrendingUp },
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-400 text-zinc-950 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.name}</span>
                </button>
              ))}

              <button
                onClick={resetToDefaultData}
                title="Reset products and orders back to default"
                className="ml-auto flex items-center gap-1 text-[11px] text-zinc-400 hover:text-rose-400 bg-zinc-800 px-2.5 py-1.5 rounded-lg"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Data</span>
              </button>
            </div>

            {/* TAB 1: Live Inventory Matrix */}
            {activeTab === 'inventory' && (
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Inventory Warehouse Matrix</h3>
                    <p className="text-xs text-zinc-400">Directly adjust real-time stock units per size. Changes reflect instantly on customer cards.</p>
                  </div>
                  <span className="text-xs bg-zinc-800 px-3 py-1.5 rounded-xl font-mono text-amber-400 font-bold">
                    Total Warehouse Stock: {totalStockInWarehouse} units
                  </span>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Jersey / Team</th>
                        <th className="p-3">Order Mode</th>
                        <th className="p-3 text-center">Size S</th>
                        <th className="p-3 text-center">Size M</th>
                        <th className="p-3 text-center">Size L</th>
                        <th className="p-3 text-center">Size XL</th>
                        <th className="p-3 text-center">Size 2XL</th>
                        <th className="p-3 text-center">Size 3XL</th>
                        <th className="p-3 text-center">Total Stock</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {products.map(p => {
                        const total: number = (Object.values(p.inventory) as number[]).reduce((a, b) => a + (b || 0), 0);
                        const isPreOrder = p.stockStatus === 'pre-order';

                        return (
                          <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                            <td className="p-3 font-sans">
                              <div className="font-bold text-white text-xs">{p.name}</div>
                              <div className="text-[11px] text-amber-400">{p.team} • {p.league}</div>
                            </td>
                            <td className="p-3 font-sans">
                              <button
                                type="button"
                                onClick={() => {
                                  updateProduct(p.id, {
                                    stockStatus: isPreOrder ? 'in-stock' : 'pre-order',
                                    preOrderLeadTime: p.preOrderLeadTime || '5-7 Days'
                                  });
                                }}
                                title="Click to toggle In Stock / Pre-Order"
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                  isPreOrder
                                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700 hover:bg-cyan-900'
                                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                                }`}
                              >
                                {isPreOrder ? (
                                  <>
                                    <Clock className="w-3 h-3 text-cyan-400" />
                                    <span>Pre-Order</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    <span>In Stock</span>
                                  </>
                                )}
                              </button>
                            </td>
                            
                            {(['S', 'M', 'L', 'XL', '2XL', '3XL'] as JerseySize[]).map(size => {
                              const count = p.inventory[size] || 0;
                              return (
                                <td key={size} className="p-3 text-center">
                                  <div className="inline-flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg px-1.5 py-0.5">
                                    <button
                                      onClick={() => updateInventory(p.id, size, count - 1)}
                                      className="text-zinc-500 hover:text-white px-1"
                                    >
                                      -
                                    </button>
                                    <span className={`w-6 text-center font-bold ${count <= 2 ? 'text-rose-400' : 'text-zinc-200'}`}>
                                      {count}
                                    </span>
                                    <button
                                      onClick={() => updateInventory(p.id, size, count + 1)}
                                      className="text-zinc-500 hover:text-white px-1"
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                              );
                            })}

                            <td className="p-3 text-center font-bold">
                              <span className={`px-2 py-1 rounded-full text-[10px] ${
                                total === 0 ? 'bg-red-950 text-red-400 border border-red-800' : total <= 10 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}>
                                {total} units
                              </span>
                            </td>

                            <td className="p-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Quick restock all sizes to +10
                                    (['S', 'M', 'L', 'XL', '2XL', '3XL'] as JerseySize[]).forEach(s => {
                                      updateInventory(p.id, s, (p.inventory[s] || 0) + 10);
                                    });
                                  }}
                                  className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-amber-400 px-2.5 py-1 rounded-lg font-sans font-semibold cursor-pointer"
                                  title="Add +10 stock units to all sizes"
                                >
                                  +10 All
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setGlobalEditingProduct(p)}
                                  className="text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 p-1 rounded-lg transition-colors cursor-pointer"
                                  title="Edit full product details & photos"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Selling Price & Margin Method */}
            {activeTab === 'pricing' && (
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <span>Selling Price & Profit Margin Strategy</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Calculate base production wholesale cost, target gross margin %, and update retail prices in MMK (ကျပ်) directly.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGlobalEditingProduct({ id: 'new' } as any);
                      }}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950 px-3.5 py-2 rounded-xl font-black text-xs transition-all shadow-lg hover:shadow-amber-400/20 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Add New Jersey</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('input')}
                      className="text-xs font-bold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-xl border border-zinc-700 transition-colors"
                      title="Switch to direct input form tab"
                    >
                      Inline Form
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-visible">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Jersey Product</th>
                        <th className="p-3">Production Cost (ကျပ်)</th>
                        <th className="p-3">Selling Retail Price (ကျပ်)</th>
                        <th className="p-3">Direct Manual MMK Price (စိတ်ကြိုက်ပြင်ရန်)</th>
                        <th className="p-3">Profit Margin (အမြတ်ရာခိုင်နှုန်း)</th>
                        <th className="p-3 text-right">Actions (လုပ်ဆောင်ချက်များ)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {products.map(p => {
                        const profit = p.price - p.baseCost;
                        const marginPercent = Math.round((profit / (p.price || 1)) * 100);
                        const currentMMK = Math.round(p.price * 4200);
                        const currentCostMMK = Math.round((p.baseCost || 20) * 4200);
                        const isSaved = inlineSavedId === p.id;
                        const typedVal = inlineMMKPrices[p.id] !== undefined ? inlineMMKPrices[p.id] : String(currentMMK);
                        const isMarginOpen = marginDropdownId === p.id;
                        const isDeleting = deleteConfirmId === p.id;

                        const applyProfitMargin = (targetMargin: number) => {
                          const targetDecimal = Math.min(Math.max(targetMargin, 5), 90) / 100;
                          const targetPriceMMK = Math.max(1000, Math.round((currentCostMMK / (1 - targetDecimal)) / 500) * 500);
                          updateProduct(p.id, { price: targetPriceMMK / 4200 });
                          setInlineMMKPrices(prev => ({ ...prev, [p.id]: String(targetPriceMMK) }));
                          setInlineSavedId(p.id);
                          setMarginDropdownId(null);
                          setTimeout(() => setInlineSavedId(null), 1800);
                        };

                        return (
                          <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                            <td className="p-3 font-sans">
                              <div className="font-bold text-white text-xs">{p.name}</div>
                              <div className="text-[11px] text-zinc-400">{p.team} • {p.sport}</div>
                            </td>
                            <td className="p-3 text-zinc-300">
                              <div className="font-bold text-zinc-200">Ks {currentCostMMK.toLocaleString()}</div>
                              <div className="text-[10px] text-zinc-500 font-sans">(${p.baseCost.toFixed(2)})</div>
                            </td>
                            <td className="p-3 font-bold text-amber-400">
                              <div className="text-sm">Ks {currentMMK.toLocaleString()}</div>
                              <div className="text-[10px] text-zinc-400 font-normal font-sans">(${p.price.toFixed(2)} USD)</div>
                            </td>
                            <td className="p-3 font-sans">
                              <div className="flex items-center gap-1.5">
                                <div className="relative w-36">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={typedVal}
                                    onChange={(e) => setInlineMMKPrices(prev => ({ ...prev, [p.id]: e.target.value }))}
                                    placeholder="e.g. 35000"
                                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 text-amber-300 font-mono font-bold text-xs pl-2.5 pr-10 py-1.5 rounded-lg focus:outline-none"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-mono pointer-events-none">
                                    Ks
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const clean = typedVal.replace(/[^0-9]/g, '');
                                    const valNum = parseInt(clean, 10);
                                    if (!isNaN(valNum) && valNum > 0) {
                                      updateProduct(p.id, { price: valNum / 4200 });
                                      setInlineSavedId(p.id);
                                      setTimeout(() => setInlineSavedId(null), 1500);
                                    }
                                  }}
                                  className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                                    isSaved 
                                      ? 'bg-emerald-500 text-zinc-950 shadow-sm' 
                                      : 'bg-amber-400 hover:bg-amber-300 active:scale-95 text-zinc-950'
                                  }`}
                                >
                                  {isSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                                  <span>{isSaved ? 'Saved!' : 'Save'}</span>
                                </button>
                              </div>
                            </td>
                            <td className="p-3 relative font-sans">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setMarginDropdownId(isMarginOpen ? null : p.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                                    marginPercent >= 50 
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900' 
                                      : marginPercent >= 30
                                      ? 'bg-amber-950 text-amber-300 border-amber-700 hover:bg-amber-900'
                                      : 'bg-rose-950 text-rose-300 border-rose-700 hover:bg-rose-900'
                                  }`}
                                  title="Click to calculate and apply target margin %"
                                >
                                  <Percent className="w-3 h-3" />
                                  <span>{marginPercent}% Margin</span>
                                  <Calculator className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                                </button>
                              </div>

                              {/* Profit Margin Interactive Popover */}
                              {isMarginOpen && (
                                <div className="absolute left-0 top-full mt-1.5 z-30 w-64 bg-zinc-950 border border-zinc-700 rounded-xl p-3 shadow-2xl animate-in fade-in zoom-in-95">
                                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2">
                                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                                      <Calculator className="w-3 h-3" />
                                      Target Margin Presets
                                    </span>
                                    <button 
                                      type="button"
                                      onClick={() => setMarginDropdownId(null)}
                                      className="text-zinc-500 hover:text-white text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-zinc-400 mb-2 font-mono">
                                    Wholesale: Ks {currentCostMMK.toLocaleString()}
                                  </p>
                                  <div className="grid grid-cols-3 gap-1.5 mb-2.5 font-mono text-[10px]">
                                    {[30, 40, 50, 60, 70, 80].map((preset) => {
                                      const simulatedMMK = Math.round((currentCostMMK / (1 - preset / 100)) / 500) * 500;
                                      return (
                                        <button
                                          key={preset}
                                          type="button"
                                          onClick={() => applyProfitMargin(preset)}
                                          className={`px-1.5 py-1 rounded border text-center transition-all ${
                                            marginPercent === preset
                                              ? 'bg-amber-400 text-zinc-950 font-bold border-amber-400'
                                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-amber-400 hover:text-amber-300'
                                          }`}
                                        >
                                          <div className="font-bold">{preset}%</div>
                                          <div className="text-[8px] opacity-75">{Math.round(simulatedMMK / 1000)}k Ks</div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="flex items-center gap-1 pt-1 border-t border-zinc-800/80">
                                    <input
                                      type="number"
                                      min="5"
                                      max="90"
                                      value={customMarginInput}
                                      onChange={(e) => setCustomMarginInput(e.target.value)}
                                      placeholder="Custom %"
                                      className="w-20 bg-zinc-900 border border-zinc-700 text-white font-mono text-xs px-2 py-1 rounded focus:outline-none focus:border-amber-400"
                                    />
                                    <span className="text-[10px] text-zinc-400">%</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const val = parseInt(customMarginInput, 10);
                                        if (!isNaN(val)) {
                                          applyProfitMargin(val);
                                        }
                                      }}
                                      className="ml-auto bg-amber-400 hover:bg-amber-300 text-zinc-950 text-[10px] font-bold px-2 py-1 rounded transition-colors"
                                    >
                                      Apply
                                    </button>
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-right space-x-1.5 font-sans">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setGlobalEditingProduct(p);
                                  }}
                                  className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 px-2.5 py-1.5 rounded-lg font-bold transition-all inline-flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                                  title="Edit full specifications, gallery photos, sizes, 3XL stock"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit Full</span>
                                </button>

                                {isDeleting ? (
                                  <div className="inline-flex items-center gap-1 bg-rose-950 border border-rose-800 rounded-lg px-2 py-1">
                                    <span className="text-[10px] text-rose-300 font-bold">Delete?</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        deleteProduct(p.id);
                                        setDeleteConfirmId(null);
                                      }}
                                      className="text-[10px] bg-rose-600 hover:bg-rose-500 text-white px-1.5 py-0.5 rounded font-bold"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeleteConfirmId(null)}
                                      className="text-[10px] bg-zinc-800 text-zinc-400 hover:text-white px-1.5 py-0.5 rounded font-bold"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(p.id)}
                                    className="text-[11px] bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-800 p-1.5 rounded-lg transition-colors cursor-pointer"
                                    title="Delete product from catalogue"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: Add / Edit Product Data Input */}
            {activeTab === 'input' && (
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Jersey Product to Catalogue</h3>
                  <p className="text-xs text-zinc-400">Input product specifications, photos, inventory, and MMK prices directly.</p>
                </div>

                <form onSubmit={handleSaveNewProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">Jersey Title / Name</label>
                    <input
                      type="text"
                      required
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      placeholder="e.g. Burmese Ghouls 24/25 Heritage Pro Match Kit"
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">Team / Club</label>
                    <input
                      type="text"
                      required
                      value={newProductForm.team}
                      onChange={(e) => setNewProductForm({ ...newProductForm, team: e.target.value })}
                      placeholder="e.g. Burmese Ghouls"
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">League</label>
                    <input
                      type="text"
                      required
                      value={newProductForm.league}
                      onChange={(e) => setNewProductForm({ ...newProductForm, league: e.target.value })}
                      placeholder="e.g. MPL Myanmar / M-Series"
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">Game / Sport Category</label>
                    <select
                      value={newProductForm.sport}
                      onChange={(e) => setNewProductForm({ ...newProductForm, sport: e.target.value as any })}
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    >
                      <option value="MLBB">MLBB Esports</option>
                      <option value="Football">Football / Soccer</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">Jersey Style</label>
                    <select
                      value={newProductForm.style}
                      onChange={(e) => setNewProductForm({ ...newProductForm, style: e.target.value as any })}
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    >
                      <option value="Home">Home</option>
                      <option value="Away">Away</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Selling Price in MMK */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-400 uppercase">Selling Price (ရောင်းစျေး - MMK ကျပ်) *</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        value={newProductForm.priceMMK}
                        onChange={(e) => setNewProductForm({ ...newProductForm, priceMMK: e.target.value })}
                        placeholder="ဥပမာ 35000"
                        className="w-full bg-zinc-900 border border-amber-500/60 text-amber-300 text-xs font-mono font-bold pl-3.5 pr-14 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-amber-400 font-bold pointer-events-none">
                        MMK
                      </span>
                    </div>
                  </div>

                  {/* Production Cost in MMK */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">Production Cost (ကုန်ကျစရိတ် - MMK ကျပ်)</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={newProductForm.baseCostMMK}
                        onChange={(e) => setNewProductForm({ ...newProductForm, baseCostMMK: e.target.value })}
                        placeholder="ဥပမာ 18000"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs font-mono pl-3.5 pr-14 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-bold pointer-events-none">
                        MMK
                      </span>
                    </div>
                  </div>

                  {/* Original Price in MMK */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">Original Price (မူရင်းစျေး - MMK ကျပ် - လျှော့စျေးပြရန်)</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={newProductForm.originalPriceMMK}
                        onChange={(e) => setNewProductForm({ ...newProductForm, originalPriceMMK: e.target.value })}
                        placeholder="ဥပမာ 55000"
                        className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs font-mono pl-3.5 pr-14 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-bold pointer-events-none">
                        MMK
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-3">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={newProductForm.description}
                      onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs p-3 rounded-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-3">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase">Product Image (Front)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const reader = new FileReader();
                        reader.onload = (loadEvent) => {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 800;
                            const MAX_HEIGHT = 800;
                            let width = img.width;
                            let height = img.height;

                            if (width > height) {
                              if (width > MAX_WIDTH) {
                                height = Math.round((height * MAX_WIDTH) / width);
                                width = MAX_WIDTH;
                              }
                            } else {
                              if (height > MAX_HEIGHT) {
                                width = Math.round((width * MAX_HEIGHT) / height);
                                height = MAX_HEIGHT;
                              }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                              ctx.drawImage(img, 0, 0, width, height);
                              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                              setNewProductForm({ ...newProductForm, imageFront: compressedBase64 });
                            }
                          };
                          img.src = loadEvent.target?.result as string;
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-400 file:text-zinc-950 hover:file:bg-amber-300"
                    />
                    {newProductForm.imageFront && !newProductForm.imageFront.includes('unsplash.com') && (
                      <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-zinc-700">
                        <img src={newProductForm.imageFront} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs py-3.5 rounded-xl transition-colors shadow-lg"
                    >
                      Publish Jersey to Live Store Catalogue
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 4: Myanmar Nationwide Delivery Fee & Wepozt Rates Management */}
            {activeTab === 'delivery' && (
              <div className="p-6 space-y-6">
                {/* Header Banner with Global Rate Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-5 rounded-3xl border border-zinc-800 shadow-xl">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-amber-400 text-zinc-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                        WEPOZT COURIER API
                      </span>
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        15 States & Divisions Configurable
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                      <Truck className="w-5 h-5 text-amber-400" />
                      <span>Delivery Fees Management (ပို့ဆောင်ခနှုန်းထားများ စီမံခန့်ခွဲမှု)</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      မြန်မာတစ်နိုင်ငံလုံးရှိ မြို့နယ်ပေါင်းစုံအတွက် ပို့ဆောင်ခ၊ ပို့ဆောင်ကြာချိန် နှင့် အလေးချိန်တို့ကို တိုက်ရိုက်ပြင်ဆင်သတ်မှတ်နိုင်ပါသည်။
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setResetConfirmOpen(true)}
                      className="bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-800 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Reset all rates across all 15 states to factory Wepozt defaults"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset All to Defaults</span>
                    </button>
                    <div className="bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800 text-center">
                      <span className="text-[10px] text-zinc-400 block uppercase font-sans">Coverage</span>
                      <strong className="text-amber-400 font-bold">{deliveryRegions.reduce((sum, r) => sum + (r.townships?.length || 0), 0)} Townships</strong>
                    </div>
                  </div>
                </div>

                {/* Reset Confirmation Modal */}
                {resetConfirmOpen && (
                  <div className="bg-rose-950/40 border border-rose-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">Reset All Delivery Rates to Default Wepozt Standard?</div>
                        <div className="text-[11px] text-zinc-400">တိုင်းနှင့်ပြည်နယ် (၁၅) ခုလုံးရှိ ပို့ဆောင်ခနှင့် ကြာချိန်များကို မူလစံနှုန်းအတိုင်း ပြန်လည်ပြောင်းလဲပါမည်။</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          resetDeliveryRates();
                          setResetConfirmOpen(false);
                          setDeliveryToast('All delivery fees reset to standard defaults!');
                          setTimeout(() => setDeliveryToast(null), 3000);
                        }}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        Confirm Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setResetConfirmOpen(false)}
                        className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Toast message if active */}
                {deliveryToast && (
                  <div className="bg-emerald-950 border border-emerald-700 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{deliveryToast}</span>
                  </div>
                )}

                {/* Interactive Live Wepozt Rate Calculator with Editable Weight */}
                <div className="bg-zinc-900/90 border border-amber-500/30 rounded-3xl p-5 space-y-4 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      <span>Live Delivery Fee Calculator (စျေးနှုန်း နှင့် အလေးချိန် တိုက်ရိုက်တွက်ချက်ရန်)</span>
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono">Custom Weight & Live Rate Formula</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                    {/* Select State / Region */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 uppercase flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>တိုင်း / ပြည်နယ် (Region/State)</span>
                      </label>
                      <select
                        value={calcRegionId}
                        onChange={(e) => {
                          const newReg = e.target.value;
                          setCalcRegionId(newReg);
                          const regObj = deliveryRegions.find(r => r.id === newReg);
                          if (regObj && regObj.townships?.length > 0) {
                            setCalcTownshipId(regObj.townships[0].id);
                          }
                        }}
                        className="w-full bg-zinc-950 border border-zinc-700 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 font-sans"
                      >
                        {deliveryRegions.map(reg => (
                          <option key={reg.id} value={reg.id}>
                            {reg.nameMm} ({reg.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Select Township / City */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 uppercase flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-amber-400" />
                        <span>မြို့နယ် (Township / City)</span>
                      </label>
                      <select
                        value={calcTownshipId}
                        onChange={(e) => setCalcTownshipId(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 font-sans"
                      >
                        {deliveryRegions.find(r => r.id === calcRegionId)?.townships?.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.nameMm} ({t.nameEn}) • Ks {t.wepoztFeeMMK.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Editable Package Weight (ကိုယ်တိုင်ပြင်ဆင်နိုင်သော အလေးချိန်) */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-zinc-300 uppercase flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-amber-400" />
                          <span>အလေးချိန် (Weight in kg)</span>
                        </label>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">{calcWeightKg} kg</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="50"
                            value={calcWeightKg}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setCalcWeightKg(isNaN(val) || val <= 0 ? 0.5 : parseFloat(val.toFixed(2)));
                            }}
                            className="w-full bg-zinc-950 border border-zinc-700 text-white text-xs pl-3 pr-8 py-2 rounded-xl focus:outline-none focus:border-amber-400 font-mono font-bold"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-mono">
                            KG
                          </span>
                        </div>

                        {/* Quick +/- buttons */}
                        <button
                          type="button"
                          onClick={() => setCalcWeightKg(prev => Math.max(0.1, parseFloat((prev - 0.5).toFixed(2))))}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-2 py-2 rounded-lg font-mono font-bold cursor-pointer transition-colors"
                          title="Decrease 0.5kg"
                        >
                          -0.5
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalcWeightKg(prev => parseFloat((prev + 0.5).toFixed(2)))}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-2 py-2 rounded-lg font-mono font-bold cursor-pointer transition-colors"
                          title="Increase 0.5kg"
                        >
                          +0.5
                        </button>
                      </div>

                      {/* Weight preset chips */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {[
                          { label: '0.3 kg (1 Jersey)', val: 0.3 },
                          { label: '0.5 kg (2 Jerseys)', val: 0.5 },
                          { label: '1.0 kg (Squad)', val: 1.0 },
                          { label: '2.5 kg (Team)', val: 2.5 },
                          { label: '5.0 kg (Bulk)', val: 5.0 },
                        ].map(chip => (
                          <button
                            key={chip.val}
                            type="button"
                            onClick={() => setCalcWeightKg(chip.val)}
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono cursor-pointer transition-colors ${
                              calcWeightKg === chip.val
                                ? 'bg-amber-400 text-zinc-950 font-bold'
                                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                            }`}
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Service Tier & Express Toggle */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300 uppercase flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Service Tier (ဝန်ဆောင်မှု)</span>
                      </label>
                      <div className="pt-1">
                        <label className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 px-3 py-2.5 rounded-xl cursor-pointer hover:border-amber-400 w-full transition-colors">
                          <input
                            type="checkbox"
                            checked={calcIsExpress}
                            onChange={(e) => setCalcIsExpress(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-400 focus:ring-0 bg-zinc-900 border-zinc-700 accent-amber-400 cursor-pointer"
                          />
                          <span className="text-[11px] font-bold text-zinc-200">Next-Day Express (+Ks 1,500)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Delivery Quote Output strictly in MMK (NO USD) */}
                  {(() => {
                    const result = calculateWepoztDeliveryFee(calcRegionId, calcTownshipId, calcWeightKg, calcIsExpress, deliveryRegions);
                    return (
                      <div className="mt-3 pt-3 border-t border-zinc-800/80 bg-zinc-950/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
                        <div className="space-y-1">
                          <div className="text-[11px] text-zinc-400 font-sans">
                            Destination: <strong className="text-white text-sm">{result.townshipName}</strong>, {result.regionName}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-mono">
                              Branch: {result.branchCode}
                            </span>
                            <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-400" />
                              ကြာချိန်: {result.estimatedDays}
                            </span>
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                              {result.codAvailable ? '✓ Cash on Delivery (COD) Available' : '⚠ Branch Pickup Only'}
                            </span>
                            <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-mono">
                              Weight: {calcWeightKg} kg
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 block font-sans uppercase font-bold">Total Delivery Fee (ပို့ဆောင်ခ စုစုပေါင်း)</span>
                          <div className="text-2xl font-black text-amber-400 tracking-tight">
                            Ks {result.feeMMK.toLocaleString()} <span className="text-xs text-zinc-400 font-normal">MMK</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* State / Region Tab Selector Pills & Quick Batch Adjustments */}
                <div className="space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-zinc-900/90 border border-zinc-800 p-3.5 rounded-2xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-amber-400" />
                        <span>Select Region & Batch Actions (တိုင်းနှင့်ပြည်နယ် တစ်ခုလုံး တစ်ပြိုင်နက်ပြင်ဆင်ရန်)</span>
                      </span>
                      <p className="text-[11px] text-zinc-400">
                        Active: <strong className="text-amber-400">{deliveryRegions.find(r => r.id === selectedRegionId)?.nameMm}</strong> ({deliveryRegions.find(r => r.id === selectedRegionId)?.nameEn}) — {deliveryRegions.find(r => r.id === selectedRegionId)?.townships?.length || 0} Townships
                      </p>
                    </div>

                    {/* Batch adjust tools for active region: Delivery Fee & Duration */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Price batch steppers */}
                      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                        <span className="text-[10px] text-zinc-400 font-bold px-1.5 uppercase">Fee:</span>
                        <button
                          type="button"
                          onClick={() => {
                            adjustRegionDeliveryRates(selectedRegionId, 500);
                            setDeliveryToast(`+Ks 500 applied to all townships in ${deliveryRegions.find(r => r.id === selectedRegionId)?.nameMm}`);
                            setTimeout(() => setDeliveryToast(null), 2500);
                          }}
                          className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          title="Increase all delivery fees in this region by Ks 500"
                        >
                          +500
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            adjustRegionDeliveryRates(selectedRegionId, -500);
                            setDeliveryToast(`-Ks 500 applied to all townships in ${deliveryRegions.find(r => r.id === selectedRegionId)?.nameMm}`);
                            setTimeout(() => setDeliveryToast(null), 2500);
                          }}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          title="Decrease all delivery fees in this region by Ks 500"
                        >
                          -500
                        </button>
                      </div>

                      {/* Region Batch Delivery Duration (ကြာချိန် တစ်တိုင်းလုံး သတ်မှတ်ရန်) */}
                      <div className="flex flex-wrap items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                        <span className="text-[10px] text-amber-400 font-bold px-1.5 uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Duration:</span>
                        </span>
                        
                        {['Same Day', '1 Day', '1-2 Days', '2-3 Days', '3-4 Days', '4-5 Days'].map(dur => (
                          <button
                            key={dur}
                            type="button"
                            onClick={() => {
                              setRegionEstimatedDuration(selectedRegionId, dur);
                              setDeliveryToast(`All townships in ${deliveryRegions.find(r => r.id === selectedRegionId)?.nameMm} set to "${dur}"`);
                              setTimeout(() => setDeliveryToast(null), 2500);
                            }}
                            className="bg-zinc-900 hover:bg-amber-400 hover:text-zinc-950 text-zinc-300 border border-zinc-800 hover:border-amber-400 text-[10px] font-mono font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            title={`Set all townships in this region to ${dur}`}
                          >
                            {dur}
                          </button>
                        ))}

                        {/* Custom text duration input for batch apply */}
                        <div className="flex items-center gap-1 pl-1">
                          <input
                            type="text"
                            value={customBatchDuration}
                            onChange={(e) => setCustomBatchDuration(e.target.value)}
                            placeholder="Custom..."
                            className="w-20 bg-zinc-900 border border-zinc-700 text-white text-[10px] px-2 py-1 rounded-lg focus:outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customBatchDuration.trim()) {
                                setRegionEstimatedDuration(selectedRegionId, customBatchDuration.trim());
                                setDeliveryToast(`All townships in ${deliveryRegions.find(r => r.id === selectedRegionId)?.nameMm} set to "${customBatchDuration.trim()}"`);
                                setTimeout(() => setDeliveryToast(null), 2500);
                                setCustomBatchDuration('');
                              }
                            }}
                            disabled={!customBatchDuration.trim()}
                            className="bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-zinc-950 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      {/* Reset region button */}
                      <button
                        type="button"
                        onClick={() => {
                          resetRegionDeliveryRates(selectedRegionId);
                          setDeliveryToast(`Reset ${deliveryRegions.find(r => r.id === selectedRegionId)?.nameMm} to standard defaults`);
                          setTimeout(() => setDeliveryToast(null), 2500);
                        }}
                        className="bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-[10px] px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer font-bold"
                        title="Reset this region only to standard rates"
                      >
                        Reset Region
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 bg-zinc-900/60 p-2 rounded-2xl border border-zinc-800">
                    {deliveryRegions.map(region => (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => {
                          setSelectedRegionId(region.id);
                          setCalcRegionId(region.id);
                          if (region.townships?.length > 0) {
                            setCalcTownshipId(region.townships[0].id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          selectedRegionId === region.id
                            ? 'bg-amber-400 text-zinc-950 font-black shadow-md'
                            : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                        }`}
                      >
                        <span>{region.nameMm}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          selectedRegionId === region.id ? 'bg-zinc-950/30 text-zinc-950 font-black' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {region.townships?.length || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter and Search Bar for Selected Region */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={townshipSearch}
                      onChange={(e) => setTownshipSearch(e.target.value)}
                      placeholder="မြို့နယ် ရှာရန် (e.g. ကမာရွတ်, မန္တလေး, တောင်ကြီး)..."
                      className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs pl-9 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 placeholder:text-zinc-500 font-sans"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-3.5 h-3.5 text-zinc-400" />
                    <select
                      value={zoneFilter}
                      onChange={(e) => setZoneFilter(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 font-sans"
                    >
                      <option value="all">All Delivery Zones (ဇုန်အားလုံး)</option>
                      <option value="Yangon Downtown">Yangon Downtown (ကျပ် ၂,၅၀၀)</option>
                      <option value="Yangon Metro">Yangon Metro (ကျပ် ၃,၀၀၀)</option>
                      <option value="Yangon Suburban">Yangon Suburban (ကျပ် ၃,၅၀၀ - ၄,၅၀၀)</option>
                      <option value="Mandalay Metro">Mandalay Metro (ကျပ် ၃,၅၀၀)</option>
                      <option value="Upper Myanmar">Upper Myanmar (ကျပ် ၄,၅၀၀ - ၅,၀၀၀)</option>
                      <option value="Lower Myanmar">Lower Myanmar (ကျပ် ၄,၀၀၀ - ၅,၀၀၀)</option>
                      <option value="Hills & Remote">Hills & Remote (ကျပ် ၆,၀၀၀ - ၇,၀၀၀)</option>
                    </select>
                  </div>
                </div>

                {/* Township Delivery Fee & Duration Matrix Table (Editable) */}
                {(() => {
                  const currentRegion = deliveryRegions.find(r => r.id === selectedRegionId) || deliveryRegions[0];
                  const filteredTownships = currentRegion?.townships?.filter(t => {
                    const matchesSearch = 
                      t.nameMm?.toLowerCase().includes(townshipSearch.toLowerCase()) ||
                      t.nameEn?.toLowerCase().includes(townshipSearch.toLowerCase()) ||
                      (t.wepoztBranchCode && t.wepoztBranchCode.toLowerCase().includes(townshipSearch.toLowerCase()));
                    const matchesZone = zoneFilter === 'all' || t.zone === zoneFilter;
                    return matchesSearch && matchesZone;
                  }) || [];

                  return (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-md">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                            <tr>
                              <th className="p-3">မြို့နယ် / Township</th>
                              <th className="p-3 min-w-[220px]">Delivery Fee (ပို့ဆောင်ခ - ကျပ်)</th>
                              <th className="p-3 min-w-[200px]">Delivery Duration (ကြာချိန်)</th>
                              <th className="p-3">Zone & Logistics Tier</th>
                              <th className="p-3">Service Type</th>
                              <th className="p-3">COD Payment</th>
                              <th className="p-3 text-right">Wepozt Branch Code</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/60 font-sans">
                            {filteredTownships.map(t => {
                              const isCopied = copiedBranchCode === t.wepoztBranchCode;
                              const isSaved = savedRateTownshipId === t.id;

                              return (
                                <tr key={t.id} className="hover:bg-zinc-800/40 transition-colors">
                                  {/* Township Identification */}
                                  <td className="p-3">
                                    <div className="font-bold text-white text-sm">{t.nameMm}</div>
                                    <div className="text-[11px] text-zinc-400 font-mono">{t.nameEn} • {currentRegion.nameEn}</div>
                                  </td>

                                  {/* Editable Delivery Fee (MMK) */}
                                  <td className="p-3">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5">
                                        <div className="relative flex-1">
                                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-[11px] font-bold">
                                            Ks
                                          </span>
                                          <input
                                            type="number"
                                            step="100"
                                            min="0"
                                            value={t.wepoztFeeMMK}
                                            onChange={(e) => {
                                              const newFee = Math.max(0, parseInt(e.target.value, 10) || 0);
                                              updateTownshipDeliveryRate(selectedRegionId, t.id, { wepoztFeeMMK: newFee });
                                              setSavedRateTownshipId(t.id);
                                              setTimeout(() => setSavedRateTownshipId(null), 1500);
                                            }}
                                            className="w-full bg-zinc-950 border border-zinc-700 text-amber-400 font-mono font-bold text-xs pl-8 pr-2.5 py-1.5 rounded-lg focus:outline-none focus:border-amber-400"
                                          />
                                        </div>

                                        {/* Steppers */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newFee = Math.max(500, t.wepoztFeeMMK - 500);
                                            updateTownshipDeliveryRate(selectedRegionId, t.id, { wepoztFeeMMK: newFee });
                                            setSavedRateTownshipId(t.id);
                                            setTimeout(() => setSavedRateTownshipId(null), 1500);
                                          }}
                                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono px-1.5 py-1.5 rounded-md font-bold cursor-pointer transition-colors"
                                          title="Minus Ks 500"
                                        >
                                          -500
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newFee = t.wepoztFeeMMK + 500;
                                            updateTownshipDeliveryRate(selectedRegionId, t.id, { wepoztFeeMMK: newFee });
                                            setSavedRateTownshipId(t.id);
                                            setTimeout(() => setSavedRateTownshipId(null), 1500);
                                          }}
                                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono px-1.5 py-1.5 rounded-md font-bold cursor-pointer transition-colors"
                                          title="Plus Ks 500"
                                        >
                                          +500
                                        </button>
                                      </div>

                                      {isSaved && (
                                        <div className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                                          <Check className="w-3 h-3" /> Saved!
                                        </div>
                                      )}
                                    </div>
                                  </td>

                                  {/* Editable Delivery Duration (ကြာချိန်) */}
                                  <td className="p-3">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <input
                                          type="text"
                                          value={t.estimatedDays}
                                          onChange={(e) => {
                                            updateTownshipDeliveryRate(selectedRegionId, t.id, { estimatedDays: e.target.value });
                                            setSavedRateTownshipId(t.id);
                                            setTimeout(() => setSavedRateTownshipId(null), 1500);
                                          }}
                                          placeholder="e.g. 1 - 2 Days"
                                          className="w-full bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-amber-400 font-medium"
                                        />
                                      </div>

                                      {/* Quick duration presets */}
                                      <div className="flex flex-wrap gap-1">
                                        {['Same Day', '1 Day', '1-2 Days', '2-3 Days', '3-4 Days'].map(d => (
                                          <button
                                            key={d}
                                            type="button"
                                            onClick={() => {
                                              updateTownshipDeliveryRate(selectedRegionId, t.id, { estimatedDays: d });
                                              setSavedRateTownshipId(t.id);
                                              setTimeout(() => setSavedRateTownshipId(null), 1500);
                                            }}
                                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono cursor-pointer transition-colors ${
                                              t.estimatedDays === d
                                                ? 'bg-amber-400/20 text-amber-300 border border-amber-500/40 font-bold'
                                                : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                                            }`}
                                          >
                                            {d}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Zone & Logistics Tier */}
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                      t.zone?.includes('Downtown') || t.zone?.includes('Metro')
                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                        : t.zone?.includes('Hills')
                                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                        : 'bg-zinc-800 text-zinc-300'
                                    }`}>
                                      {t.zone || 'Standard Zone'}
                                    </span>
                                  </td>

                                  {/* Service Type */}
                                  <td className="p-3">
                                    <span className="text-[11px] text-zinc-300 font-medium">
                                      {t.serviceType}
                                    </span>
                                  </td>

                                  {/* COD Available */}
                                  <td className="p-3">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateTownshipDeliveryRate(selectedRegionId, t.id, { codAvailable: !t.codAvailable });
                                        setSavedRateTownshipId(t.id);
                                        setTimeout(() => setSavedRateTownshipId(null), 1500);
                                      }}
                                      className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                        t.codAvailable ? 'text-emerald-400 hover:text-emerald-300' : 'text-zinc-500 hover:text-zinc-400'
                                      }`}
                                      title="Click to toggle Cash on Delivery"
                                    >
                                      {t.codAvailable ? (
                                        <>
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          COD Enabled
                                        </>
                                      ) : (
                                        <>
                                          <X className="w-3.5 h-3.5" />
                                          Prepaid Only
                                        </>
                                      )}
                                    </button>
                                  </td>

                                  {/* Wepozt Branch Code with Copy */}
                                  <td className="p-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (t.wepoztBranchCode) {
                                          navigator.clipboard.writeText(t.wepoztBranchCode);
                                          setCopiedBranchCode(t.wepoztBranchCode);
                                          setTimeout(() => setCopiedBranchCode(null), 1500);
                                        }
                                      }}
                                      className="font-mono text-[11px] bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 px-2 py-1 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                                      title="Copy Wepozt Branch Code"
                                    >
                                      {isCopied ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-400" />
                                          <span className="text-emerald-400">Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3 text-zinc-400" />
                                          <span>{t.wepoztBranchCode}</span>
                                        </>
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}

                {/* Live Customer Orders & Dispatch tracker section */}
                <div className="pt-4 border-t border-zinc-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Package className="w-4 h-4 text-amber-400" />
                        <span>Live Orders & Delivery Dispatch ({orders.length} Active Orders)</span>
                      </h4>
                      <p className="text-xs text-zinc-400">Customer destination address, payment slips verification, and Wepozt status tracker.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                          <div>
                            <span className="font-mono font-black text-amber-400 text-sm">{order.trackingNumber}</span>
                            <span className="text-zinc-300 text-xs ml-2">
                              ({order.customer.fullName} • {order.customer.phone} • {order.customer.city})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-400 font-mono text-sm">{formatPrice(order.total)}</span>
                            <span className="bg-zinc-800 px-2.5 py-0.5 rounded text-[11px] font-bold text-zinc-300">{order.status}</span>
                          </div>
                        </div>

                        {/* Payment Details & Receipt Slip */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-zinc-500 text-[11px]">Payment:</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                order.paymentMethod === 'KBZPay' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                                order.paymentMethod === 'WavePay' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                                order.paymentMethod === 'Cash on Delivery' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                                'bg-zinc-800 text-zinc-200'
                              }`}>
                                {order.paymentMethod}
                              </span>
                            </div>

                            {order.transactionId && (
                              <div className="flex items-center gap-1">
                                <span className="text-zinc-500 text-[11px]">TxID/Sender:</span>
                                <span className="font-mono text-amber-400 font-bold text-[11px] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                                  {order.transactionId}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Uploaded Receipt Photo if available */}
                          {order.paymentReceiptUrl ? (
                            <button
                              type="button"
                              onClick={() => setViewingReceiptOrder(order)}
                              className="bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-amber-500/40 hover:border-amber-400 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            >
                              <img
                                src={order.paymentReceiptUrl}
                                alt="Slip thumbnail"
                                className="w-5 h-5 object-cover rounded border border-zinc-700"
                              />
                              <span>View Payment Slip (ငွေလွှဲပြေစာ စစ်ဆေးရန်)</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-zinc-500 italic">
                              {order.paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery (No receipt needed)' : 'No receipt attached'}
                            </span>
                          )}
                        </div>

                        {/* Order items */}
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800 text-[11px] text-zinc-300">
                              {item.name} <strong className="text-amber-400 font-mono">[{item.size}] x{item.quantity}</strong>
                              {item.customDetails && ` (${item.customDetails.name} #${item.customDetails.number})`}
                            </div>
                          ))}
                        </div>

                        {/* Status changer toolbar */}
                        <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] text-zinc-400 font-bold">Update Wepozt Dispatch Status:</span>
                          {(['Pending Payment Verification', 'Order Placed', 'Customization & Printing', 'Quality Check', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'] as OrderStatus[]).map(st => (
                            <button
                              key={st === 'Pending Payment Verification' ? 'Pending' : st === 'Order Placed' ? 'Confirm Payment' : st}
                              onClick={() => {
                                updateOrderStatus(order.id, st, `Wepozt Hub (${order.customer.city || 'Yangon'})`);
                              }}
                              className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer ${
                                order.status === st
                                  ? (st === 'Cancelled' ? 'bg-red-500 text-white font-black' : 'bg-amber-400 text-zinc-950 font-black')
                                  : (st === 'Cancelled' ? 'bg-red-950 text-red-400 hover:bg-red-900 hover:text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700')
                              }`}
                            >
                              {st === 'Pending Payment Verification' ? 'Pending' : st === 'Order Placed' ? 'Confirm Payment' : st}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal to view payment receipt photo */}
                {viewingReceiptOrder && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full space-y-4 text-white shadow-2xl">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                            <span>Payment Slip Verification</span>
                            <span className="text-amber-400 font-mono">({viewingReceiptOrder.paymentMethod})</span>
                          </h3>
                          <p className="text-[11px] text-zinc-400">
                            Order: <strong className="text-white font-mono">{viewingReceiptOrder.trackingNumber}</strong> • {viewingReceiptOrder.customer.fullName}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewingReceiptOrder(null)}
                          className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center p-2 min-h-64 max-h-[60vh]">
                        {viewingReceiptOrder.paymentReceiptUrl ? (
                          <img
                            src={viewingReceiptOrder.paymentReceiptUrl}
                            alt="Payment Transfer Slip"
                            className="max-h-[55vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                          />
                        ) : (
                          <div className="text-zinc-500 text-xs">No receipt photo attached</div>
                        )}
                      </div>

                      <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs">
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase">Order Amount</span>
                          <strong className="text-emerald-400 font-mono text-sm">{formatPrice(viewingReceiptOrder.total)}</strong>
                        </div>
                        {viewingReceiptOrder.transactionId && (
                          <div>
                            <span className="text-zinc-400 block text-[10px] uppercase">TxID / Phone</span>
                            <strong className="text-amber-400 font-mono">{viewingReceiptOrder.transactionId}</strong>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setViewingReceiptOrder(null)}
                          className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                        >
                          Close Verification
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Payment Methods Configuration */}
            {activeTab === 'payment' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-amber-400" />
                    <span>Payment Accounts Configuration</span>
                  </h3>
                  <p className="text-xs text-zinc-400">Manage KPay, WavePay, Banking App numbers and QR codes shown to customers during checkout.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentAccounts.map((account) => (
                    <div key={account.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: account.color || '#fbbf24' }} 
                          />
                          <h4 className="text-sm font-bold text-white uppercase">{account.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-400 font-bold">Enabled:</span>
                          <button
                            type="button"
                            onClick={() => updatePaymentAccount(account.id, { isEnabled: account.isEnabled === false ? true : false })}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                              account.isEnabled !== false ? 'bg-amber-400' : 'bg-zinc-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                account.isEnabled !== false ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Account Name</label>
                          <input
                            type="text"
                            value={account.accountName}
                            onChange={(e) => updatePaymentAccount(account.id, { accountName: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs px-3 py-2 rounded-lg font-mono focus:border-amber-400 focus:outline-none transition-colors"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Account / Phone Number</label>
                          <input
                            type="text"
                            value={account.accountNumber}
                            onChange={(e) => updatePaymentAccount(account.id, { accountNumber: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 text-amber-400 font-bold text-sm px-3 py-2 rounded-lg font-mono focus:border-amber-400 focus:outline-none transition-colors"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">QR Code Image URL (Optional)</label>
                          <input
                            type="text"
                            value={account.qrCodeUrl || ''}
                            onChange={(e) => updatePaymentAccount(account.id, { qrCodeUrl: e.target.value })}
                            placeholder="https://example.com/qr.png"
                            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs px-3 py-2 rounded-lg font-mono focus:border-amber-400 focus:outline-none transition-colors"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Payment Instruction (Optional)</label>
                          <input
                            type="text"
                            value={account.instruction || ''}
                            onChange={(e) => updatePaymentAccount(account.id, { instruction: e.target.value })}
                            placeholder="e.g. Please include Order ID in notes"
                            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs px-3 py-2 rounded-lg font-sans focus:border-amber-400 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: Analytics KPIs */}
            {activeTab === 'analytics' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Store Performance & Revenue Intelligence</h3>
                  <p className="text-xs text-zinc-400">Live aggregated metrics calculated across orders and active catalog.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Total Gross Revenue</span>
                    <div className="text-2xl font-black text-white font-mono">{formatPrice(totalRevenueUSD)}</div>
                    <span className="text-[10px] text-emerald-400 mt-1 block">↑ 24.8% vs last month</span>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Total Units Dispatched</span>
                    <div className="text-2xl font-black text-amber-400 font-mono">{totalUnitsSold}</div>
                    <span className="text-[10px] text-zinc-400 mt-1 block">Across all sports kits</span>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Average Profit Margin</span>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{avgMarginPercent}%</div>
                    <span className="text-[10px] text-zinc-400 mt-1 block">Selling Price Formula Active</span>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Warehouse Stock Health</span>
                    <div className="text-2xl font-black text-white font-mono">{totalStockInWarehouse} units</div>
                    <span className="text-[10px] text-emerald-400 mt-1 block">94% in-stock availability</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
