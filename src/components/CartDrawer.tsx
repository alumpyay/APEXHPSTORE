import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  Truck,
  Plus,
  Minus
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotalUSD, 
    formatPrice, 
    convertPrice,
    setIsCheckoutOpen,
    currentCurrency
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; fixedOff?: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  // Free delivery threshold: 100,000 MMK (~$23.80 USD)
  const freeShippingThreshold = 23.8; 
  const progressPercent = Math.min(100, Math.round((cartSubtotalUSD / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotalUSD);

  // Discount calculation
  let discountUSD = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountUSD = cartSubtotalUSD * appliedPromo.discountPercent;
    } else if (appliedPromo.fixedOff) {
      discountUSD = appliedPromo.fixedOff;
    }
  }

  // Myanmar domestic base standard shipping fee (Ks 2,500 ~ $0.60 USD)
  const shippingFeeUSD = cartSubtotalUSD >= freeShippingThreshold || cartSubtotalUSD === 0 ? 0 : (2500 / 4200);
  const totalUSD = Math.max(0, cartSubtotalUSD - discountUSD + shippingFeeUSD);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const clean = promoCode.trim().toUpperCase();

    if (clean === 'APEX20') {
      setAppliedPromo({ code: 'APEX20', discountPercent: 0.20 });
      setPromoCode('');
    } else if (clean === 'CHAMPION10') {
      setAppliedPromo({ code: 'CHAMPION10', discountPercent: 0, fixedOff: 10 });
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try APEX20 or CHAMPION10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-black tracking-tight text-white font-mono uppercase">
                Your Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-zinc-900/90 p-3.5 border-b border-zinc-800/80 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-semibold">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-4 h-4 text-amber-400" />
                {remainingForFreeShipping === 0 ? (
                  <strong className="text-emerald-400">You unlocked FREE Priority Shipping!</strong>
                ) : (
                  <span>Add <strong className="text-amber-400 font-mono">{formatPrice(remainingForFreeShipping)}</strong> for Free Shipping</span>
                )}
              </span>
              <span className="font-mono text-zinc-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-zinc-800/60">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-8 h-8 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your bag is empty</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                    Explore our 24/25 esports and football match kits catalogue.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 text-left">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.isCustom && (
                      <span className="absolute bottom-1 right-1 bg-amber-400 text-zinc-950 font-mono text-[9px] font-black px-1 rounded">
                        CUSTOM
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customization Details if custom */}
                      {item.isCustom && item.customDetails && (
                        <div className="mt-1 bg-zinc-900/80 p-1.5 rounded-md border border-zinc-800 text-[10px] space-y-0.5 text-zinc-300">
                          <div className="flex justify-between">
                            <span>Print Name & #:</span>
                            <strong className="text-amber-400 font-mono">{item.customDetails.name} #{item.customDetails.number}</strong>
                          </div>
                          {item.customDetails.badges.length > 0 && (
                            <div className="flex justify-between text-zinc-400">
                              <span>Badges:</span>
                              <span className="truncate max-w-[120px]">{item.customDetails.badges.join(', ')}</span>
                            </div>
                          )}
                          {item.customDetails.customPhotoUrl && (
                            <div className="flex items-center justify-between pt-0.5 text-amber-300">
                              <span className="flex items-center gap-1">
                                <img
                                  src={item.customDetails.customPhotoUrl}
                                  alt="Custom Logo"
                                  className="w-3.5 h-3.5 rounded object-cover border border-amber-400/50"
                                />
                                Custom Photo / Crest
                              </span>
                              <span className="text-[9px] uppercase font-mono text-zinc-400">
                                {item.customDetails.customPhotoPlacement || 'Attached'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                        <span>Size: <strong className="text-white font-mono">{item.size}</strong></span>
                        <span>•</span>
                        <span className="text-amber-400 font-bold font-mono">{formatPrice(item.price)} each</span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="p-1 hover:text-amber-400 text-zinc-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="p-1 hover:text-amber-400 text-zinc-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black font-mono text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-zinc-900 border-t border-zinc-800 space-y-3 text-left">
              {/* Promo Code Box */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (APEX20)"
                      className="w-full bg-zinc-950 border border-zinc-700 text-white text-xs pl-8 pr-2 py-2 rounded-lg focus:outline-none focus:border-amber-400 uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold px-1">
                    <span>Active code: {appliedPromo.code}</span>
                    <button onClick={() => setAppliedPromo(null)} className="text-zinc-500 hover:text-zinc-300">Remove</button>
                  </div>
                )}
                {promoError && (
                  <div className="text-[10px] text-rose-400 px-1">{promoError}</div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatPrice(cartSubtotalUSD)}</span>
                </div>
                {discountUSD > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(discountUSD)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tracked Shipping</span>
                  <span className="font-mono text-white">
                    {shippingFeeUSD === 0 ? <strong className="text-emerald-400 font-bold">FREE</strong> : formatPrice(shippingFeeUSD)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-1.5 border-t border-zinc-800">
                  <span>Estimated Total</span>
                  <span className="font-mono text-amber-400">{formatPrice(totalUSD)}</span>
                </div>
              </div>

              {/* Checkout Launch */}
              <button
                id="cart-checkout-cta"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-black text-sm py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Encrypted • Real-time GPS Tracker Generated</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
