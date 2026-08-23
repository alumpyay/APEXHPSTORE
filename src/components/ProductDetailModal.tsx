import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Check, 
  AlertTriangle,
  Zap,
  Sparkles,
  Edit3,
  Clock
} from 'lucide-react';
import { Product, JerseySize } from '../types';
import { useStore } from '../context/StoreContext';
import { FindYourFit } from './FindYourFit';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCartOpen,
    setEditingProduct
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<JerseySize>('M');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProduct) return null;

  // Stock status
  const isPreOrder = selectedProduct.stockStatus === 'pre-order';

  // Collect all photos: Front, Back (if exists), and Gallery photos
  const allImages = [
    selectedProduct.imageFront,
    selectedProduct.imageBack,
    ...(selectedProduct.galleryImages || [])
  ].filter(Boolean) as string[];

  const currentDisplayImage = allImages[activeImageIndex] || selectedProduct.imageFront;

  const isFavorited = isInWishlist(selectedProduct.id);
  const currentStock = selectedProduct.inventory[selectedSize] || 0;
  const totalStock: number = (Object.values(selectedProduct.inventory) as number[]).reduce((a, b) => a + (b || 0), 0);

  // Pop-up banner texts (User custom text or smart default)
  const dropBadge = selectedProduct.dropBadgeText !== undefined 
    ? selectedProduct.dropBadgeText 
    : (selectedProduct.isNewDrop ? '24/25 DROP' : (selectedProduct.season ? `${selectedProduct.season} DROP` : '24/25 DROP'));
  const showDrop = selectedProduct.showDropBadge !== false && (selectedProduct.dropBadgeText !== undefined ? selectedProduct.dropBadgeText.trim().length > 0 : selectedProduct.isNewDrop);

  const autoDiscountPct = selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price 
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100) 
    : 0;
  const discountBadge = selectedProduct.discountBadgeText !== undefined 
    ? selectedProduct.discountBadgeText 
    : (autoDiscountPct > 0 ? `SAVE ${autoDiscountPct}%` : '');
  const showDiscount = selectedProduct.showDiscountBadge !== false && (selectedProduct.discountBadgeText !== undefined ? selectedProduct.discountBadgeText.trim().length > 0 : autoDiscountPct > 0);

  const editionBadge = selectedProduct.editionBadgeText !== undefined 
    ? selectedProduct.editionBadgeText 
    : (selectedProduct.style ? (selectedProduct.style === 'Other' ? 'World Champion Edition' : `${selectedProduct.style} Edition`) : 'World Champion Edition');
  const showEdition = selectedProduct.showEditionBadge !== false && (selectedProduct.editionBadgeText !== undefined ? selectedProduct.editionBadgeText.trim().length > 0 : Boolean(selectedProduct.style));

  const handleAddToCart = () => {
    if (!isPreOrder && currentStock <= 0) return;

    addToCart({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      team: selectedProduct.team,
      style: selectedProduct.style,
      size: selectedSize,
      price: selectedProduct.price,
      quantity,
      image: selectedProduct.imageFront,
      isCustom: false,
    });

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setSelectedProduct(null);
    }, 800);
  };

  const handleBuyNow = () => {
    if (!isPreOrder && currentStock <= 0) return;

    addToCart({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      team: selectedProduct.team,
      style: selectedProduct.style,
      size: selectedSize,
      price: selectedProduct.price,
      quantity,
      image: selectedProduct.imageFront,
      isCustom: false,
    });

    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[92vh] flex flex-col text-left"
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left Column: Big Product Image, Gallery Thumbnails & Visual Features */}
          <div className="md:col-span-6 bg-zinc-900/60 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800 space-y-4">
            <div className="space-y-3">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-inner flex items-center justify-center group">
                <img
                  src={currentDisplayImage}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent pointer-events-none" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none items-start">
                  {showDrop && dropBadge && (
                    <span className="bg-amber-400 text-zinc-950 font-black text-[10px] uppercase px-2.5 py-1 rounded shadow-md tracking-wider">
                      {dropBadge}
                    </span>
                  )}
                  {showDiscount && discountBadge && (
                    <span className="bg-rose-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded shadow-md">
                      {discountBadge}
                    </span>
                  )}
                  {showEdition && editionBadge && (
                    <span className="bg-zinc-900/90 text-zinc-300 font-mono text-[10px] px-2.5 py-1 rounded border border-zinc-700/60 backdrop-blur-sm shadow-sm">
                      {editionBadge}
                    </span>
                  )}
                  {selectedProduct.customBadgeText && (
                    <span className="bg-purple-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded shadow-md">
                      {selectedProduct.customBadgeText}
                    </span>
                  )}
                </div>

                {/* Image Counter Badge if multiple images */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-700/80 text-[10px] font-mono text-zinc-300 font-bold">
                    Photo {activeImageIndex + 1} / {allImages.length}
                  </div>
                )}

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white transition-all"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Gallery Thumbnails Carousel */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105'
                          : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-600'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold bg-zinc-950/80 text-zinc-300 px-1 rounded">
                        {idx === 0 ? 'Front' : idx === 1 && selectedProduct.imageBack ? 'Back' : `+${idx + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fabric & Specs Under Photo */}
            <div className="bg-zinc-950/70 p-3.5 rounded-2xl border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wider">Fabric & Specs</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const prodToEdit = selectedProduct;
                    setSelectedProduct(null);
                    setEditingProduct(prodToEdit);
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-800 transition-colors"
                  title="Fabric & Specs ပြင်ဆင်ရန်"
                >
                  <Edit3 className="w-3 h-3 text-amber-400" />
                  <span>Edit (ပြင်မည်)</span>
                </button>
              </div>
              {selectedProduct.fabricDetails && selectedProduct.fabricDetails.length > 0 ? (
                <ul className="text-xs text-zinc-300 space-y-1.5 pl-4 list-disc marker:text-amber-400">
                  {selectedProduct.fabricDetails.map((detail, idx) => (
                    <li key={idx} className="leading-relaxed">{detail}</li>
                  ))}
                </ul>
              ) : (
                <ul className="text-xs text-zinc-300 space-y-1.5 pl-4 list-disc marker:text-amber-400">
                  <li className="leading-relaxed">100% Breathable Micro-Polyester</li>
                  <li className="leading-relaxed">Sublimation Printing</li>
                </ul>
              )}
            </div>
          </div>

          {/* Right Column: Information, Live Stock Matrix & Purchasing */}
          <div className="md:col-span-6 p-6 space-y-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                  <span>{selectedProduct.team} • {selectedProduct.league}</span>
                  <span className="text-zinc-400 font-mono">{selectedProduct.season}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {selectedProduct.name}
                  </h1>
                  <button
                    onClick={() => {
                      const prodToEdit = selectedProduct;
                      setSelectedProduct(null);
                      setEditingProduct(prodToEdit);
                    }}
                    className="shrink-0 flex items-center gap-1 bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-zinc-950 px-2.5 py-1.5 rounded-lg border border-amber-400/30 text-xs font-bold transition-all cursor-pointer"
                    title="Edit photos, title, price, and stock"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit (ပြင်မည်)</span>
                  </button>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-white font-mono">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-sm text-zinc-500 line-through font-mono">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Live Inventory Status per Size / Pre-Order Mode */}
              <div className={`space-y-2.5 p-3.5 rounded-2xl border transition-all ${
                isPreOrder 
                  ? 'bg-cyan-950/30 border-cyan-700/60 shadow-lg' 
                  : 'bg-zinc-900/70 border-zinc-800'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  {isPreOrder ? (
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <Clock className="w-4 h-4 text-cyan-400" /> Pre-Order Production (ကြိုတင်မှာယူရန်)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Real-Time Warehouse Stock
                    </span>
                  )}

                  {isPreOrder ? (
                    <span className="font-mono text-xs text-cyan-300 bg-cyan-900/80 px-2.5 py-0.5 rounded-lg border border-cyan-600/80 font-bold">
                      Lead Time: {selectedProduct.preOrderLeadTime || '5-7 Days'}
                    </span>
                  ) : (
                    <span className="font-mono text-zinc-400">Total: {totalStock} units</span>
                  )}
                </div>

                {isPreOrder && (
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    ✨ ဤဂျာစီသည် <strong className="text-cyan-300">Pre-Order စနစ်</strong>ဖြစ်ပြီး အထူးမှာယူထုတ်လုပ်ပေးမည်ဖြစ်သောကြောင့် ဆိုဒ်အားလုံး လွတ်လပ်စွာ ရွေးချယ်မှာယူနိုင်ပါသည်။
                  </p>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
                  {(['S', 'M', 'L', 'XL', '2XL', '3XL'] as JerseySize[]).map((size) => {
                    const stock = selectedProduct.inventory[size] || 0;
                    const isSelected = selectedSize === size;
                    const isOut = !isPreOrder && stock === 0;

                    return (
                      <button
                        key={size}
                        id={`modal-size-btn-${size.toLowerCase()}`}
                        onClick={() => {
                          if (!isOut) setSelectedSize(size);
                        }}
                        disabled={isOut}
                        className={`p-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                          isSelected
                            ? isPreOrder
                              ? 'bg-cyan-400 border-cyan-400 text-zinc-950 shadow-md font-black ring-2 ring-cyan-400/40'
                              : 'bg-amber-400 border-amber-400 text-zinc-950 shadow-md font-black ring-2 ring-amber-400/40'
                            : isOut
                            ? 'bg-zinc-950 border-zinc-800/80 text-zinc-600 line-through cursor-not-allowed opacity-50'
                            : 'bg-zinc-900 border-zinc-700/80 text-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        <span className="text-xs font-mono font-bold">{size}</span>
                        <span className={`text-[9px] mt-0.5 ${
                          isSelected 
                            ? 'text-zinc-900 font-bold' 
                            : isPreOrder
                            ? 'text-cyan-400 font-medium'
                            : isOut 
                            ? 'text-zinc-600' 
                            : stock <= 3 
                            ? 'text-amber-400 font-bold' 
                            : 'text-zinc-400'
                        }`}>
                          {isPreOrder ? 'Pre-Order' : isOut ? 'Sold out' : `${stock} left`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Find Your Fit Helper Component */}
                <div className="pt-2 border-t border-zinc-800/60">
                  <FindYourFit
                    currentSelectedSize={selectedSize}
                    onSelectSize={(size) => setSelectedSize(size)}
                    availableStock={selectedProduct.inventory}
                  />
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span className="font-bold">Quantity</span>
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-zinc-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 font-mono font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(isPreOrder ? Math.min(10, quantity + 1) : Math.min(currentStock, quantity + 1))}
                    disabled={!isPreOrder && quantity >= currentStock}
                    className="px-3 py-1 text-zinc-400 hover:text-white disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                id="modal-buy-now-cta"
                onClick={handleBuyNow}
                disabled={!isPreOrder && currentStock <= 0}
                className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 font-black text-xs py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPreOrder 
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-zinc-950 shadow-cyan-500/20' 
                    : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 shadow-amber-500/20'
                }`}
              >
                {isPreOrder ? (
                  <>
                    <Clock className="w-4 h-4 text-zinc-950" />
                    <span>Pre-Order Now • Instant Checkout</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-zinc-950" />
                    <span>Buy Now • Instant Checkout</span>
                  </>
                )}
              </button>

              <button
                id="modal-add-to-bag"
                onClick={handleAddToCart}
                disabled={!isPreOrder && currentStock <= 0}
                className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 font-black text-xs py-3 rounded-xl transition-all ${
                  addedAnimation
                    ? 'bg-emerald-500 text-white'
                    : (!isPreOrder && currentStock <= 0)
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : isPreOrder
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-cyan-500/50 active:scale-95'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 active:scale-95'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Bag!</span>
                  </>
                ) : isPreOrder ? (
                  <>
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Add to Bag • Pre-Order ({formatPrice(selectedProduct.price * quantity)})</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>Add to Bag • {formatPrice(selectedProduct.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
