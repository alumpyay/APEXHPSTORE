import React from 'react';
import { 
  ShoppingBag,
  Package, 
  Heart, 
  Search, 
  ShieldCheck, 
  Sparkles,
  Sun,
  Moon,
  Edit3
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const { 
    cartCount, 
    setIsCartOpen,
    setIsOrderTrackerOpen, 
    wishlist, 
    setIsAdminPortalOpen,
    isAdminLoggedIn,
    theme,
    toggleTheme,
    filters,
    setFilters,
    siteContent,
    setIsSiteContentModalOpen
  } = useStore();

  const sports = ['All', 'MLBB', 'Football'];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-bold text-xs py-1.5 px-4 text-center tracking-wider flex items-center justify-center gap-2 group relative">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-zinc-950" />
        <span>{siteContent?.topBannerText || 'MLBB ESPORTS & FOOTBALL KITS • 4K SUBLIMATION JERSEY STUDIO'}</span>
        {siteContent?.topBannerCode && (
          <span className="hidden md:inline-block bg-zinc-950 text-amber-400 px-2 py-0.5 rounded text-[10px] uppercase ml-2 font-black">
            {siteContent.topBannerCode}
          </span>
        )}
        {isAdminLoggedIn && (
          <button
            onClick={() => setIsSiteContentModalOpen(true)}
            className="ml-2 p-0.5 hover:bg-zinc-950/20 rounded text-zinc-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
            title="Edit Site Text & Banner (စာပြင်ရန်)"
          >
            <Edit3 className="w-3 h-3" />
            <span className="hidden sm:inline">Edit Text</span>
          </button>
        )}
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button 
              id="brand-logo-btn"
              onClick={() => {
                setFilters(prev => ({ ...prev, sport: 'All', team: 'All', search: '' }));
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer hover:opacity-95 transition-opacity"
            >
              <BrandLogo size="md" />
            </button>

            {/* Sport Categories for Desktop */}
            <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-full border border-zinc-800">
              {sports.map((sport) => (
                <button
                  key={sport}
                  id={`nav-sport-btn-${sport.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setFilters(prev => ({ ...prev, sport }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    filters.sport === sport
                      ? 'bg-amber-400 text-zinc-950 shadow-sm font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {sport === 'MLBB' 
                    ? '🎮 MLBB Esports' 
                    : sport === 'Football'
                    ? '⚽ Football'
                    : '🏆 All Collections'}
                </button>
              ))}
            </nav>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                id="search-input-nav"
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search MLBB, RubyDd, Kairi, Skylar, Real Madrid, Bellingham..."
                className="w-full bg-zinc-900/90 text-white placeholder-zinc-500 text-xs rounded-full pl-10 pr-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-colors"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {filters.search && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Indicator (MMK Exclusive) */}
            <div 
              id="nav-currency-toggle"
              className="flex items-center gap-1.5 bg-zinc-900 text-zinc-200 text-xs font-bold px-2.5 py-2 rounded-lg border border-zinc-800 select-none"
              title="Prices in Myanmar Kyat (MMK)"
            >
              <span className="text-amber-400 font-mono">Ks</span>
              <span>MMK</span>
            </div>

            {/* Theme Toggle (Dark / Light Mode) */}
            <button
              id="nav-theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 p-2 rounded-lg border border-zinc-800 text-xs font-semibold transition-all cursor-pointer group"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                  <span className="hidden xl:inline text-[11px] text-zinc-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-amber-400 group-hover:-rotate-12 transition-transform duration-300" />
                  <span className="hidden xl:inline text-[11px] text-zinc-300">Dark</span>
                </>
              )}
            </button>

            {/* Track Order Button */}
            <button
              id="nav-track-order-btn"
              onClick={() => setIsOrderTrackerOpen(true)}
              title="Track Your Order (အော်ဒါစစ်ရန်)"
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 p-2 rounded-lg border border-zinc-800 text-xs font-semibold transition-colors group cursor-pointer"
            >
              <Package className="w-4 h-4 group-hover:animate-bounce" />
              <span className="hidden xl:inline text-[11px]">Track</span>
            </button>

            {/* Wishlist Pill */}
            <button
              id="nav-wishlist-btn"
              onClick={() => {
                setFilters(prev => ({ ...prev, search: '' }));
              }}
              title="Saved Jerseys"
              className="relative bg-zinc-900 hover:bg-zinc-800 p-2 rounded-lg border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-xs hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-zinc-950 font-black text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Edit Site Text & Content Button (Admin Only) */}
            {isAdminLoggedIn && (
              <button
                id="nav-edit-site-btn"
                onClick={() => setIsSiteContentModalOpen(true)}
                title="Edit Website Texts & Images (ဆိုဒ်စာသားများ ပြင်ရန်)"
                className="flex items-center gap-1.5 bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-zinc-950 px-2.5 py-2 rounded-lg border border-amber-400/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Edit Site (ပြင်ရန်)</span>
              </button>
            )}

            {/* Admin Portal Gateway (Admin Only) */}
            {isAdminLoggedIn && (
              <button
                id="nav-admin-portal-btn"
                onClick={() => setIsAdminPortalOpen(true)}
                title="Backend Store Management"
                className="flex items-center gap-1 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 p-2 rounded-lg border border-zinc-800/80 text-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden md:inline font-bold">Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar & Category pills */}
      <div className="md:hidden px-4 pb-3 pt-1 border-t border-zinc-900">
        <div className="relative mb-2">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search MLBB, RubyDd, Kairi, Real Madrid..."
            className="w-full bg-zinc-900 text-white text-xs rounded-full pl-9 pr-4 py-2 border border-zinc-800"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setFilters(prev => ({ ...prev, sport }))}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                filters.sport === sport ? 'bg-amber-400 text-zinc-950 font-bold' : 'bg-zinc-900 text-zinc-400'
              }`}
            >
              {sport === 'MLBB' 
                ? '🎮 MLBB' 
                : sport === 'Football'
                ? '⚽ Football'
                : '🏆 All'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
