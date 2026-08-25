import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Zap, 
  Check, 
  AlertCircle,
  Eye,
  Edit3,
  Clock
} from 'lucide-react';
import { Product, JerseySize } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProduct, 
    setEditingProduct,
    isAdminLoggedIn
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<JerseySize>('M');
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Stock status checks
  const isPreOrder = product.stockStatus === 'pre-order';

  // Calculate total inventory
  const totalStock: number = (Object.values(product.inventory) as number[]).reduce((acc, cur) => acc + (cur || 0), 0);
  const currentSizeStock: number = product.inventory[selectedSize] || 0;

  // Pop-up banner texts (User custom text or smart default)
  const dropBadge = product.dropBadgeText !== undefined 
    ? product.dropBadgeText 
    : (product.isNewDrop ? '24/25 DROP' : (product.season ? `${product.season} DROP` : '24/25 DROP'));
  const showDrop = product.showDropBadge !== false && (product.dropBadgeText !== undefined ? product.dropBadgeText.trim().length > 0 : product.isNewDrop);

  const autoDiscountPct = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  const discountBadge = product.discountBadgeText !== undefined 
    ? product.discountBadgeText 
    : (autoDiscountPct > 0 ? `SAVE ${autoDiscountPct}%` : '');
  const showDiscount = product.showDiscountBadge !== false && (product.discountBadgeText !== undefined ? product.discountBadgeText.trim().length > 0 : autoDiscountPct > 0);

  const editionBadge = product.editionBadgeText !== undefined 
    ? product.editionBadgeText 
    : (product.style ? (product.style === 'Other' ? 'World Champion Edition' : `${product.style} Edition`) : 'World Champion Edition');
  const showEdition = product.showEditionBadge !== false && (product.editionBadgeText !== undefined ? product.editionBadgeText.trim().length > 0 : Boolean(product.style));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPreOrder && currentSizeStock <= 0) return;

    setIsQuickAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      team: product.team,
      style: product.style,
      size: selectedSize,
      price: product.price,
      quantity: 1,
      image: product.imageFront,
      isCustom: false,
    });

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setIsQuickAdding(false);
    }, 1200);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-zinc-900 rounded-2xl border border-zinc-800/80 hover:border-amber-400/50 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer text-left"
    >
      {/* Top badges & Wishlist */}
      <div className="relative aspect-4/3 bg-zinc-950/70 overflow-hidden flex items-center justify-center p-4">
        {/* Product Image */}
        <img
          src={product.imageFront}
          alt={product.name}
          className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none items-start">
          {/* 1. Drop Banner (Yellow) */}
          {showDrop && dropBadge && (
            <span className="bg-amber-400 text-zinc-950 font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-md tracking-wider">
              {dropBadge}
            </span>
          )}

          {/* 2. Discount Banner (Pink/Red) */}
          {showDiscount && discountBadge && (
            <span className="bg-rose-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-md">
              {discountBadge}
            </span>
          )}

          {/* 3. Edition Banner (Dark) */}
          {showEdition && editionBadge && (
            <span className="bg-zinc-900/90 text-zinc-300 font-mono text-[10px] px-2 py-0.5 rounded border border-zinc-700/60 backdrop-blur-sm shadow-sm">
              {editionBadge}
            </span>
          )}

          {/* 4. Extra Custom Badge (Optional) */}
          {product.customBadgeText && (
            <span className="bg-purple-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-md">
              {product.customBadgeText}
            </span>
          )}
        </div>

        {/* Top Right Action Buttons (Edit + Wishlist) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Quick Edit Button */}
          {isAdminLoggedIn && (
            <button
              id={`card-edit-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setEditingProduct(product);
              }}
              title="Edit Photo & Details (ပုံနှင့် စာပြင်ရန်)"
              className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-amber-400 hover:text-zinc-950 backdrop-blur-md border border-zinc-700/80 flex items-center justify-center text-amber-400 hover:scale-110 transition-all shadow-md"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Wishlist Button */}
          <button
            id={`wishlist-toggle-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="w-8 h-8 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-white hover:scale-110 transition-all"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Live Inventory Pill overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          {isPreOrder ? (
            <span className="inline-flex items-center gap-1 bg-cyan-950/90 text-cyan-300 border border-cyan-500/70 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-sm">
              <Clock className="w-3 h-3 text-cyan-400" /> Pre-Order {product.preOrderLeadTime ? `(${product.preOrderLeadTime})` : ''}
            </span>
          ) : totalStock === 0 ? (
            <span className="inline-flex items-center gap-1 bg-red-950/90 text-red-400 border border-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" /> Out of Stock
            </span>
          ) : totalStock <= 5 ? (
            <span className="inline-flex items-center gap-1 bg-amber-950/90 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              <Zap className="w-3 h-3 text-amber-400" /> Only {totalStock} Left!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[10px] font-medium px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> In Stock ({totalStock})
            </span>
          )}
        </div>

        {/* Quick View trigger */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 bg-zinc-900/80 text-zinc-300 text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm group-hover:bg-amber-400 group-hover:text-zinc-950 transition-colors">
            <Eye className="w-3 h-3" /> View
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Team and League */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="font-semibold text-amber-400/90 uppercase tracking-wider">{product.team}</span>
            <span className="text-[11px] text-zinc-500">{product.league}</span>
          </div>

          {/* Jersey Title */}
          <h3 className="font-bold text-white text-sm leading-snug group-hover:text-amber-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Size Selection Bar */}
        <div className="space-y-1.5 pt-1 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Size: <strong className="text-white">{selectedSize}</strong></span>
            <span className="text-[10px] text-zinc-500">
              {isPreOrder 
                ? (product.preOrderLeadTime ? `Pre-Order (${product.preOrderLeadTime})` : 'Pre-Order Available') 
                : currentSizeStock > 0 ? `${currentSizeStock} available` : 'Sold out'}
            </span>
          </div>
          <div className="flex gap-1">
            {(['S', 'M', 'L', 'XL', '2XL', '3XL'] as JerseySize[]).map((size) => {
              const stock = product.inventory[size] || 0;
              const isSelected = selectedSize === size;
              const isOutOfStock = !isPreOrder && stock === 0;

              return (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isOutOfStock) setSelectedSize(size);
                  }}
                  disabled={isOutOfStock}
                  className={`flex-1 py-1 rounded text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? isPreOrder 
                        ? 'bg-cyan-400 text-zinc-950 shadow-sm'
                        : 'bg-amber-400 text-zinc-950 shadow-sm'
                      : isOutOfStock
                      ? 'bg-zinc-950 text-zinc-600 line-through cursor-not-allowed opacity-50'
                      : 'bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing & Action Buttons */}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-white font-mono">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-zinc-500 line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="block text-[10px] text-zinc-400">Tax included</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Add to Cart / Pre-Order button */}
            <button
              id={`card-add-btn-${product.id}`}
              onClick={handleQuickAdd}
              disabled={(!isPreOrder && currentSizeStock <= 0) || isQuickAdding}
              className={`flex items-center gap-1.5 font-bold text-xs px-3 py-2 rounded-lg transition-all ${
                justAdded
                  ? 'bg-emerald-500 text-white'
                  : (!isPreOrder && currentSizeStock <= 0)
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : isPreOrder
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-sm active:scale-95'
                  : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-sm active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : isPreOrder ? (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pre-Order</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
