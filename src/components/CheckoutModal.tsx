import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Copy,
  Check,
  MapPin,
  Building,
  Clock,
  Zap,
  Upload,
  Image as ImageIcon,
  QrCode,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { 
  MYANMAR_DELIVERY_REGIONS, 
  calculateWepoztDeliveryFee, 
  getTownshipRate 
} from '../data/myanmarDeliveryRates';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotalUSD, 
    formatPrice, 
    createOrder, 
    currentCurrency,
    currencies,
    deliveryRegions,
    paymentAccounts,
    setIsOrderTrackerOpen,
    setTrackingSearchQuery
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedAccountField, setCopiedAccountField] = useState<string | null>(null);
  const [enlargedQrUrl, setEnlargedQrUrl] = useState<string | null>(null);

  // Active payment accounts
  const activeAccounts = useMemo(() => {
    const list = paymentAccounts.filter(a => a.isEnabled !== false);
    return list.length > 0 ? list : paymentAccounts;
  }, [paymentAccounts]);

  // Payment Slip Upload state
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Region and Township selection
  const [selectedRegionId, setSelectedRegionId] = useState('yangon-region');
  const [selectedTownshipId, setSelectedTownshipId] = useState('yangon-region-kamayut');
  const [isExpressDelivery, setIsExpressDelivery] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: 'Ko Aung Myo',
    email: 'aungmyo.esports@gmail.com',
    phone: '09 798 123456',
    address: 'No. 124, Pyay Road',
    city: 'Kamayut, Yangon',
    country: 'Myanmar',
    postalCode: '11041',
    paymentMethod: 'KBZPay' as string,
    transactionId: '',
  });

  // Selected payment account info
  const selectedAccount = useMemo(() => {
    return activeAccounts.find(a => a.id === formData.paymentMethod) || activeAccounts[0];
  }, [activeAccounts, formData.paymentMethod]);

  // Ensure formData has a valid active payment method
  useEffect(() => {
    if (activeAccounts.length > 0 && !activeAccounts.some(a => a.id === formData.paymentMethod)) {
      setFormData(prev => ({ ...prev, paymentMethod: activeAccounts[0].id }));
    }
  }, [activeAccounts, formData.paymentMethod]);

  // Calculate package weight based on items
  const cartTotalWeight = useMemo(() => {
    const totalJerseys = cart.reduce((sum, item) => sum + item.quantity, 0);
    return Math.max(0.5, totalJerseys * 0.25);
  }, [cart]);

  // Real-time Wepozt Delivery Quote using custom rates from store
  const wepoztQuote = useMemo(() => {
    return calculateWepoztDeliveryFee(selectedRegionId, selectedTownshipId, cartTotalWeight, isExpressDelivery, deliveryRegions);
  }, [selectedRegionId, selectedTownshipId, cartTotalWeight, isExpressDelivery, deliveryRegions]);

  if (!isCheckoutOpen) return null;

  const mmkRate = currencies['MMK']?.rate || 3500;
  const shippingFeeUSD = (wepoztQuote.feeMMK || 0) / mmkRate;
  const discountUSD = 0;
  const totalUSD = cartSubtotalUSD + shippingFeeUSD - discountUSD;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regionObj = deliveryRegions.find(r => r.id === selectedRegionId);
    const townshipObj = regionObj?.townships?.find(t => t.id === selectedTownshipId);
    
    setFormData(prev => ({
      ...prev,
      city: `${townshipObj?.nameMm || selectedTownshipId} (${townshipObj?.nameEn || ''}), ${regionObj?.nameMm || selectedRegionId}`,
      postalCode: townshipObj?.wepoztBranchCode || prev.postalCode
    }));
    setStep(2);
  };

    const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentMethod !== 'COD') {
      if (!receiptImage) {
        alert("Please upload your transfer receipt screenshot. (ငွေလွှဲပြေစာ ပုံတင်ပေးပါရန်)");
        return;
      }
      if (!formData.transactionId) {
        alert("Please enter your Phone Number or Transaction ID. (ငွေလွှဲသူဖုန်းနံပါတ် သို့မဟုတ် TxID ဖြည့်ပေးပါရန်)");
        return;
      }
    }
    setIsProcessing(true);

    setTimeout(() => {
      const order = createOrder({
        items: [...cart],
        subtotal: cartSubtotalUSD,
        discount: discountUSD,
        shippingFee: shippingFeeUSD,
        total: totalUSD,
        currency: currentCurrency,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: `${wepoztQuote.townshipName}, ${wepoztQuote.regionName}`,
          country: formData.country,
          postalCode: wepoztQuote.branchCode || formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
        paymentReceiptUrl: receiptImage || undefined,
        transactionId: formData.transactionId || undefined,
        estimatedDelivery: new Date(Date.now() + (isExpressDelivery ? 1 : 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      setCreatedOrder(order);
      setIsProcessing(false);
      setStep(3);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.error('Confetti error', err);
      }
    }, 1500);
  };

  const handleFileUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('ကျေးဇူးပြု၍ ဓာတ်ပုံဖိုင် (.png, .jpg, .jpeg, .webp) သာ တင်ပေးပါရန်။');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setReceiptImage(e.target.result as string);
        setReceiptFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const copyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccountField(fieldId);
    setTimeout(() => setCopiedAccountField(null), 2000);
  };

  const copyTracking = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const openOrderTracker = () => {
    if (createdOrder) {
      setTrackingSearchQuery(createdOrder.trackingNumber);
      setIsCheckoutOpen(false);
      setIsOrderTrackerOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="checkout-modal-container"
        className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[92vh] flex flex-col text-left"
      >
        {/* Header */}
        <div className="bg-zinc-900/90 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white font-mono">
                APEX SECURE CHECKOUT
              </h2>
              <span className="text-[11px] text-zinc-400">256-Bit SSL Encrypted Protocol</span>
            </div>
          </div>

          {/* Stepper Progress */}
          {step < 3 && (
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className={`px-2 py-0.5 rounded-full ${step === 1 ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                1. Shipping
              </span>
              <span className="text-zinc-600">→</span>
              <span className={`px-2 py-0.5 rounded-full ${step === 2 ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                2. Payment
              </span>
            </div>
          )}

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: Shipping Details */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" /> Delivery Address & Contact
                </h3>
                <span className="text-xs text-zinc-400">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase">Full Name (အမည်)</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase">Phone Number (ဖုန်းနံပါတ်)</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="09..."
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase">Email (for Order & Tracking)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Country Selector */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase">Country (နိုင်ငံ)</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  >
                    <option value="Myanmar">Myanmar (မြန်မာတစ်နိုင်ငံလုံး Wepozt ပို့ဆောင်ခစနစ်)</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>

                {/* Myanmar State / Region Dropdown */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>တိုင်း / ပြည်နယ် (Region/State)</span>
                  </label>
                  <select
                    value={selectedRegionId}
                    onChange={(e) => {
                      const newReg = e.target.value;
                      setSelectedRegionId(newReg);
                      const regObj = deliveryRegions.find(r => r.id === newReg);
                      if (regObj && regObj.townships?.length > 0) {
                        setSelectedTownshipId(regObj.townships[0].id);
                      }
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 font-sans"
                  >
                    {deliveryRegions.map(reg => (
                      <option key={reg.id} value={reg.id}>
                        {reg.nameMm} ({reg.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Myanmar Township Dropdown */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    <span>မြို့နယ် (Township / City)</span>
                  </label>
                  <select
                    value={selectedTownshipId}
                    onChange={(e) => setSelectedTownshipId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 font-sans"
                  >
                    {deliveryRegions.find(r => r.id === selectedRegionId)?.townships?.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.nameMm} ({t.nameEn}) • Ks {t.wepoztFeeMMK.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase">Street Address / Landmark (လမ်းအမည်၊ အိမ်အမှတ်)</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. No. 45, Pyay Road, Ward 3"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Real-time Wepozt Delivery Quote Card */}
              <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded font-mono">
                      WEPOZT EXPRESS
                    </span>
                    <span className="text-xs font-bold text-white">
                      {wepoztQuote.townshipName}, {wepoztQuote.regionName}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-black text-amber-400">
                      Ks {wepoztQuote.feeMMK.toLocaleString()} MMK
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800 text-[11px] text-zinc-300">
                  <span className="flex items-center gap-1 bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-300 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    ကြာချိန်: {wepoztQuote.estimatedDays}
                  </span>
                  <span className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-400 font-mono">
                    Branch: {wepoztQuote.branchCode}
                  </span>
                  <span className="text-emerald-400 text-[10px] font-bold">
                    ✓ {wepoztQuote.serviceType}
                  </span>
                </div>

                {/* Optional Express surcharge toggle */}
                <div className="pt-2 border-t border-zinc-800/80">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isExpressDelivery}
                      onChange={(e) => setIsExpressDelivery(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-400 focus:ring-0 bg-zinc-900 border-zinc-700 accent-amber-400"
                    />
                    <span className="text-xs text-zinc-300 font-medium">
                      Priority Next-Day Air Express (+Ks 1,500 MMK)
                    </span>
                  </label>
                </div>
              </div>

              {/* Order Summary Preview */}
              <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800 space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-mono text-white">{formatPrice(cartSubtotalUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wepozt Delivery Fee ({wepoztQuote.townshipName})</span>
                  <span className="font-mono text-amber-400 font-bold">{formatPrice(shippingFeeUSD)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-zinc-800">
                  <span>Total Payable</span>
                  <span className="text-amber-400 font-mono">{formatPrice(totalUSD)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Continue to Payment (ငွေပေးချေရန် ဆက်သွားမည်)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipping
                </button>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" /> Payment & Authorization
                </h3>
              </div>

              {/* Payment Method Selector (KBZPay, WavePay, AYA Pay, CB Pay from Store) */}
              <div className={`grid gap-2 ${activeAccounts.length <= 2 ? 'grid-cols-2' : activeAccounts.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                {activeAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: acc.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.paymentMethod === acc.id
                        ? 'bg-zinc-800 border-amber-400 text-amber-400 font-bold shadow-md ring-1 ring-amber-400/30'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black" style={{ color: acc.color || '#fbbf24' }}>
                        {acc.name}
                      </span>
                      {acc.qrCodeUrl && (
                        <QrCode className="w-3 h-3 text-zinc-500" />
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-300 font-mono mt-0.5 truncate">{acc.accountNumber}</div>
                    <div className="text-[9px] text-zinc-500 truncate">{acc.badge || 'Direct Transfer'}</div>
                  </button>
                ))}
              </div>

              {/* Myanmar Mobile Wallets Transfer Details (KBZPay, WavePay, AYA Pay, CB Pay) */}
              {selectedAccount && (
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="font-bold text-white uppercase flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: selectedAccount.color || '#fbbf24' }}
                      />
                      {selectedAccount.name} Official Account Details (ငွေလွှဲရန် အကောင့်အချက်အလက်)
                    </span>
                    <span className="text-emerald-400 font-mono font-bold text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Verified Merchant
                    </span>
                  </div>

                  {/* Account Information with Copy Buttons and QR Code */}
                  <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80 space-y-3 text-zinc-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Account details */}
                      <div className="space-y-2 flex-1">
                        {/* Account Name */}
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 text-[11px]">Account Name (အမည်):</span>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-white font-mono text-xs">
                              {selectedAccount.accountName}
                            </strong>
                            <button
                              type="button"
                              onClick={() => copyText(selectedAccount.accountName, 'accName')}
                              className="text-zinc-400 hover:text-amber-400 p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Copy Account Name"
                            >
                              {copiedAccountField === 'accName' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Account / Phone Number */}
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 text-[11px]">
                            {selectedAccount.id === 'AYA Pay' || selectedAccount.id === 'CB Pay' ? 'Account No:' : 'Wallet Phone / No:'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-amber-400 font-mono text-sm font-black">
                              {selectedAccount.accountNumber}
                            </strong>
                            <button
                              type="button"
                              onClick={() => copyText(selectedAccount.accountNumber.replace(/\s+/g, ''), 'accNum')}
                              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                              title="Copy Account Number"
                            >
                              {copiedAccountField === 'accNum' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-amber-400" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Payable Amount */}
                        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
                          <span className="text-zinc-400 text-[11px]">Payable Total Amount (ပေးချေရမည့် ငွေပမာဏ):</span>
                          <strong className="text-amber-400 font-mono text-base font-black">
                            {formatPrice(totalUSD)}
                          </strong>
                        </div>
                      </div>

                      {/* Right: Scan to Pay QR Code */}
                      {selectedAccount.qrCodeUrl && (
                        <div className="flex sm:flex-col items-center justify-center gap-2 p-2 bg-zinc-900 rounded-xl border border-zinc-800 shrink-0">
                          <img
                            src={selectedAccount.qrCodeUrl}
                            alt={`${selectedAccount.name} QR`}
                            className="w-20 h-20 object-contain bg-white rounded-lg p-1 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setEnlargedQrUrl(selectedAccount.qrCodeUrl || null)}
                            title="Click to Enlarge QR Code"
                          />
                          <button
                            type="button"
                            onClick={() => setEnlargedQrUrl(selectedAccount.qrCodeUrl || null)}
                            className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <QrCode className="w-3 h-3" />
                            <span>Scan QR (ပုံကြီး)</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Instruction notice */}
                    {selectedAccount.instruction && (
                      <div className="bg-zinc-900/80 px-3 py-2 rounded-lg text-[11px] text-zinc-300 border border-zinc-800/60">
                        {selectedAccount.instruction}
                      </div>
                    )}
                  </div>

                  {/* Upload Payment Receipt Slip (ငွေလွှဲပြေစာ Screenshot တင်ရန်) */}
                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] font-bold text-zinc-200 uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <ImageIcon className="w-4 h-4" />
                        <span>Upload Transfer Receipt (ငွေလွှဲပြေစာ Screenshot / Photo တင်ရန်)</span>
                      </span>
                      {receiptImage && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Photo Attached
                        </span>
                      )}
                    </label>

                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {/* Drag and drop / upload box */}
                    {!receiptImage ? (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={handleDropFile}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                          isDraggingFile 
                            ? 'border-amber-400 bg-amber-400/10' 
                            : 'border-zinc-700 hover:border-amber-400/60 bg-zinc-950/60 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Click or Drag & Drop ငွေလွှဲပြေစာ Screenshot
                            </p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              PNG, JPG, WEBP formats supported (အများဆုံး 10MB)
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Preview Box with Remove button */
                      <div className="relative bg-zinc-950 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={receiptImage}
                            alt="Payment Slip"
                            className="w-12 h-12 object-cover rounded-xl border border-zinc-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              {receiptFileName || 'Payment_Slip_Screenshot.jpg'}
                            </div>
                            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                              <Check className="w-3 h-3" /> Ready for verification
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReceiptImage(null);
                              setReceiptFileName(null);
                            }}
                            className="text-[10px] bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    </div>

                  {/* Customer Phone or TxID input */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase block">
                      ငွေလွှဲသူ ဖုန်းနံပါတ် သို့မဟုတ် TxID နောက်ဆုံး ၅ လုံး (Transaction ID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 09798123456 သို့မဟုတ် TxID 84129"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 text-white text-xs px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* Submit Payment button (Pay Now) */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-sm py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    ငွေပေးချေမှု အတည်ပြုပြီး Tracking Code ထုတ်ပေးနေပါသည်...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Pay Now - {formatPrice(totalUSD)} (ငွေလွှဲပြေစာတင်ပြီး အော်ဒါအတည်ပြုမည်)
                    </span>
                  </span>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: Order Confirmation & Live Tracking Link */}
          {step === 3 && createdOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white">ORDER RECEIVED - PENDING VERIFICATION!</h3>
                <p className="text-xs text-zinc-400">
                  Thank you, <strong className="text-white">{createdOrder.customer.fullName}</strong>. A receipt and tracking portal link has been sent to {createdOrder.customer.email}.
                </p>
              </div>

              {/* Tracking Code Highlight Box */}
              <div className="bg-zinc-900 border border-zinc-700/80 p-4 rounded-2xl max-w-md mx-auto space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Live Tracking Number
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl font-mono font-black text-amber-400 tracking-wider">
                    {createdOrder.trackingNumber}
                  </span>
                  <button
                    onClick={copyTracking}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedTracking ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Status: <strong className="text-emerald-400">Order Placed & Live Production Queued</strong>
                </p>
              </div>

              {/* Next Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  id="checkout-track-order-btn"
                  onClick={openOrderTracker}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Open Live Shipping Radar</span>
                </button>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-5 py-3.5 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Continue Browsing Store
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Enlarged QR Code Modal */}
      {enlargedQrUrl && (
        <div 
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEnlargedQrUrl(null)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-700 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>{selectedAccount?.name} Scan to Pay QR</span>
              </span>
              <button
                onClick={() => setEnlargedQrUrl(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl flex items-center justify-center shadow-inner">
              <img
                src={enlargedQrUrl}
                alt="Enlarged QR Code"
                className="w-64 h-64 object-contain"
              />
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-white font-mono">{selectedAccount?.accountName}</div>
              <div className="text-xs text-amber-400 font-mono font-bold">{selectedAccount?.accountNumber}</div>
              <div className="text-[11px] text-zinc-400 pt-1">
                KBZPay / WavePay / Banking App ဖြင့် Scan ဖတ်ပြီး ငွေလွှဲပေးချေပါ
              </div>
            </div>

            <button
              onClick={() => setEnlargedQrUrl(null)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
            >
              Close (ပိတ်မည်)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
