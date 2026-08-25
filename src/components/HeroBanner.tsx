import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag,
  ChevronRight, 
  ChevronLeft, 
  RotateCw, 
  Pause, 
  Play,
  ShieldCheck,
  Flame,
  ArrowRight,
  Sparkles,
  Edit3,
  Newspaper,
  Trophy,
  Radio
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const HeroBanner: React.FC = () => {
  const { 
    setSelectedProduct,
    products, 
    setFilters,
    formatPrice,
    siteContent,
    setIsSiteContentModalOpen,
    setEditingProduct,
    isAdminLoggedIn
  } = useStore();

  // Curate showcase kits across MLBB & Football
  const showcaseProducts: Product[] = React.useMemo(() => {
    const featured = products.filter(p => p.featured);
    if (featured.length >= 4) return featured.slice(0, 6);
    return products.slice(0, 6);
  }, [products]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const activeKit = showcaseProducts[currentIndex] || products[0];

  // Auto rotation loop every 4.5 seconds
  useEffect(() => {
    if (!isAutoPlaying || showcaseProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % showcaseProducts.length);
      setViewSide('front'); // reset to front view on item change
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, showcaseProducts.length]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % showcaseProducts.length);
    setViewSide('front');
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + showcaseProducts.length) % showcaseProducts.length);
    setViewSide('front');
  };

  const toggle3DRotation = () => {
    setIsRotating(true);
    setViewSide(prev => (prev === 'front' ? 'back' : 'front'));
    setTimeout(() => setIsRotating(false), 600);
  };

  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white border-b border-zinc-800">
      {/* Dynamic ambient background glows */}
      <div 
        className="absolute top-10 left-1/3 w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none transition-colors duration-1000 opacity-25"
        style={{ backgroundColor: activeKit?.primaryColor || '#F59E0B' }}
      />
      <div 
        className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 opacity-20"
        style={{ backgroundColor: activeKit?.secondaryColor || '#EF4444' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 relative z-10">
        
        {/* Top Header Section (Centered Title & Description) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-amber-400 backdrop-blur-sm shadow-md">
            <Flame className="w-3.5 h-3.5 fill-amber-400 animate-bounce" />
            <span>{siteContent?.heroFlameBadge || 'MLBB Esports & Football Pro Match Drops'}</span>
            {isAdminLoggedIn && (
            <button
              onClick={() => setIsSiteContentModalOpen(true)}
              className="ml-2 p-1 hover:bg-amber-400/20 rounded-md text-amber-300 transition-colors"
              title="Edit texts (စာသားပြင်ရန်)"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-sans">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-200">
              {siteContent?.heroTitle || 'PRO ESPORTS & FOOTBALL JERSEYS'}
            </span>
          </h1>
        </div>

        {/* Full-Page Width 360° Jersey Showcase (Placed directly underneath the title) */}
        <div className="mt-8 sm:mt-10 max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black rounded-3xl border border-zinc-800/90 p-5 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-md">
            
            {/* Top Showcase Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-5 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-black tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> {siteContent?.showcaseBadge || '360° PRO SHOWCASE'}
                </span>
                <span className="text-xs text-zinc-400 font-mono bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-800">
                  {currentIndex + 1} of {showcaseProducts.length}
                </span>
              </div>

              {/* Auto Play toggle & 3D Flip Action */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  title={isAutoPlaying ? 'Pause Auto Rotation' : 'Resume Auto Rotation'}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isAutoPlaying 
                      ? 'bg-zinc-800/80 border-zinc-700 text-amber-400 hover:bg-zinc-800' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span className="text-xs">{isAutoPlaying ? 'Auto Rotating' : 'Paused'}</span>
                </button>

                <button
                  onClick={toggle3DRotation}
                  title="Rotate Jersey Front / Back"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                  <span className="text-xs font-black uppercase">{viewSide === 'front' ? 'Flip to Back' : 'Flip to Front'}</span>
                </button>
              </div>
            </div>

            {/* Central Interactive Rotating Jersey Stage */}
            <div className="relative h-[320px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-950 to-zinc-900/90 border border-zinc-800 flex items-center justify-center p-4 sm:p-6">
              
              {/* Perspective Ring & Glow */}
              <div 
                className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${activeKit?.primaryColor || '#F59E0B'} 0%, transparent 70%)`
                }}
              />
              <div className="absolute inset-x-12 bottom-4 h-12 bg-black/70 blur-2xl rounded-full pointer-events-none" />

              {/* Left / Right Quick Slide Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 flex items-center justify-center backdrop-blur-md shadow-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Previous Jersey"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 flex items-center justify-center backdrop-blur-md shadow-xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Next Jersey"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* 3D Rotatable Jersey Photo Card */}
              <div 
                className="relative w-full h-full flex items-center justify-center"
                style={{ perspective: '1400px' }}
              >
                <div
                  onClick={toggle3DRotation}
                  className="relative w-full h-full max-w-[420px] max-h-[380px] flex items-center justify-center cursor-pointer group/card select-none"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: viewSide === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* FRONT SIDE: High-Definition Jersey Photo */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/60 bg-zinc-950/80 backdrop-blur-xs"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <img
                      src={activeKit?.imageFront}
                      alt={activeKit?.name}
                      className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 pointer-events-none" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <span className="bg-zinc-900/90 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-zinc-700/80 backdrop-blur-md">
                        {activeKit?.sport === 'MLBB' ? '🎮 MLBB PRO' : '⚽ MATCH KIT'}
                      </span>
                      <span className="bg-amber-400 text-zinc-950 font-mono text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                        {activeKit?.season}
                      </span>
                    </div>

                    {/* Hint overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] pointer-events-none">
                      <div className="bg-zinc-950/90 border border-amber-400/50 text-amber-300 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Click to Rotate 360°</span>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE: Player Name & Number Showcase */}
                  <div 
                    className="absolute inset-0 flex flex-col items-center justify-between p-6 sm:p-8 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    {/* Sublimation Mesh Pattern */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:12px_12px]" />
                    
                    {/* Back Collar Tag */}
                    <div className="relative z-10 w-full flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                        {activeKit?.team}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        SIZE: {Object.keys(activeKit?.inventory || {})[0] || 'L'}
                      </span>
                    </div>

                    {/* Back Player Name & Number Plate */}
                    <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                      <div 
                        className="text-xl sm:text-2xl font-black uppercase tracking-[0.25em] text-white font-sans text-center drop-shadow-md"
                        style={{ color: activeKit?.accentColor || '#FFFFFF' }}
                      >
                        {activeKit?.player || 'PRO SQUAD'}
                      </div>
                      <div 
                        className="text-7xl sm:text-8xl font-black font-mono tracking-tighter leading-none my-2"
                        style={{
                          color: activeKit?.secondaryColor || '#F59E0B',
                          textShadow: `0 0 25px ${activeKit?.secondaryColor || '#F59E0B'}40`
                        }}
                      >
                        {activeKit?.playerNumber || '10'}
                      </div>
                      <div className="text-xs uppercase font-bold tracking-widest text-zinc-400">
                        Pro Match Kit
                      </div>
                    </div>

                    {/* Bottom Sublimation Seal */}
                    <div className="relative z-10 w-full flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <ShieldCheck className="w-4 h-4" /> Pro Sublimation
                      </span>
                      <span className="text-amber-400 font-mono font-bold">
                        4K ULTRA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Carousel Bar */}
            <div className="mt-5 flex items-center justify-between gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {showcaseProducts.map((product, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={product.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setViewSide('front');
                    }}
                    className={`flex-1 min-w-[100px] relative rounded-xl p-2 border transition-all text-left flex items-center gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-zinc-800/90 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-zinc-950">
                      <img 
                        src={product.imageFront} 
                        alt={product.player || product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className={`text-xs font-bold truncate leading-tight ${isActive ? 'text-amber-400' : 'text-zinc-200'}`}>
                        {product.player || product.team}
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {product.sport}
                      </div>
                    </div>
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-zinc-950" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Kit Details & Customizer Action */}
            <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {activeKit?.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                  <span className="text-amber-400 font-bold font-mono text-sm">{formatPrice(activeKit?.price || 0)}</span>
                  <span>•</span>
                  <span>{activeKit?.league}</span>
                  <span>•</span>
                  <span className="text-emerald-400">In Stock</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    if (activeKit) {
                      setEditingProduct(activeKit);
                    }
                  }}
                  className="bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Edit this jersey image and details (ပုံ/စာ ပြင်မည်)"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Kit (ပြင်မည်)</span>
                </button>
                )}

                <button
                  id="hero-order-now-cta"
                  onClick={() => {
                    if (activeKit) {
                      setSelectedProduct(activeKit);
                    }
                  }}
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Now</span>
                </button>

                <button
                  id="hero-browse-sport-cta"
                  onClick={() => {
                    setFilters(prev => ({ ...prev, sport: activeKit?.sport || 'MLBB' }));
                    const element = document.getElementById('catalogue-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs sm:text-sm px-4 py-2.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Browse {activeKit?.sport}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Real-Time Live NEWS Horizontal Rotating Ticker */}
      <div 
        id="hero-news-ticker"
        className="bg-zinc-950/90 border-t border-zinc-800/90 py-2.5 overflow-hidden relative group"
        title="NEWS: Premier League, Laliga, Series A, Ligue One, MPL Malaysia, MPL Indonesia, MPL Philippines, MPL Myanmar, Upcoming Tournaments"
      >
        <div className="animate-horizontal-rotate flex items-center gap-6 whitespace-nowrap text-xs text-zinc-300 select-none">
          {/* Loop Track Set 1 */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-zinc-950 font-black text-[11px] tracking-wider uppercase shadow-sm">
              <Radio className="w-3 h-3 text-zinc-950 animate-pulse" />
              <span>NEWS:</span>
            </span>
            <span className="font-semibold text-white hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>⚽ Premier League</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-white hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>⚽ Laliga</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-white hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>⚽ Series A</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-white hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>⚽ Ligue One</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-amber-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>🎮 MPL Malaysia</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-amber-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>🎮 MPL Indonesia</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-amber-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>🎮 MPL Philippines</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-amber-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>🎮 MPL Myanmar</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 bg-zinc-900 px-2.5 py-0.5 rounded-lg border border-zinc-800">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Upcoming Tournaments</span>
            </span>
          </div>

          <span className="text-zinc-700 font-bold px-2">★</span>

          {/* Loop Track Set 2 (Duplicate for Seamless Infinite Horizontal Loop) */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-zinc-950 font-black text-[11px] tracking-wider uppercase shadow-sm">
              <Radio className="w-3 h-3 text-zinc-950 animate-pulse" />
              <span>NEWS:</span>
            </span>
            <span className="font-semibold text-white hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>⚽ Premier League</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-white hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>⚽ Laliga</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-white hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>⚽ Series A</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-white hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>⚽ Ligue One</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-amber-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>🎮 MPL Malaysia</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-amber-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>🎮 MPL Indonesia</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-amber-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>🎮 MPL Philippines</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-semibold text-amber-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>🎮 MPL Myanmar</span>
            </span>
            <span className="text-zinc-600 font-bold">•</span>
            <span className="font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 bg-zinc-900 px-2.5 py-0.5 rounded-lg border border-zinc-800">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Upcoming Tournaments</span>
            </span>
          </div>

          <span className="text-zinc-700 font-bold px-2">★</span>
        </div>
      </div>
    </section>
  );
};
