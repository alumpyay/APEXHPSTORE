import React, { useMemo } from 'react';
import { 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  Check, 
  Flame, 
  Sparkles,
  ChevronDown,
  Edit3,
  Clock,
  Box
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { JerseyStyle } from '../types';

export const CatalogSection: React.FC = () => {
  const { 
    products, 
    filters, 
    setFilters, 
    resetFilters, 
    formatPrice, 
    convertPrice, 
    currentCurrency, 
    currencies,
    siteContent,
    setIsSiteContentModalOpen,
    isAdminLoggedIn
  } = useStore();

  // Extract unique teams for filters
  const uniqueTeams = useMemo(() => {
    const teams = new Set<string>();
    products.forEach((p) => teams.add(p.team));
    return Array.from(teams).sort();
  }, [products]);

  const styles: ('All' | JerseyStyle)[] = ['All', 'Home', 'Away', 'Other'];

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search text
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchTitle = p.name.toLowerCase().includes(query);
        const matchTeam = p.team.toLowerCase().includes(query);
        const matchPlayer = p.player ? p.player.toLowerCase().includes(query) : false;
        const matchLeague = p.league.toLowerCase().includes(query);
        const matchTags = p.tags.some(t => t.toLowerCase().includes(query));
        if (!matchTitle && !matchTeam && !matchPlayer && !matchLeague && !matchTags) {
          return false;
        }
      }

      // Sport filter
      if (filters.sport !== 'All' && p.sport !== filters.sport) {
        return false;
      }

      // Team filter
      if (filters.team !== 'All' && p.team !== filters.team) {
        return false;
      }

      // Player filter
      if (filters.player !== 'All' && p.player !== filters.player) {
        return false;
      }

      // Style filter
      if (filters.style !== 'All') {
        if (filters.style === 'Other') {
          if (p.style === 'Home' || p.style === 'Away') {
            return false;
          }
        } else if (p.style !== filters.style) {
          return false;
        }
      }

      // Price filter (converted)
      if (p.price > filters.maxPrice) {
        return false;
      }

      // In-stock & Pre-Order filter
      if (filters.stockFilter === 'in-stock') {
        if (p.stockStatus === 'pre-order') return false;
        const totalInventory: number = (Object.values(p.inventory) as number[]).reduce((a, b) => a + (b || 0), 0);
        if (totalInventory <= 0) return false;
      } else if (filters.stockFilter === 'pre-order') {
        if (p.stockStatus !== 'pre-order') return false;
      } else if (filters.onlyInStock) {
        const totalInventory: number = (Object.values(p.inventory) as number[]).reduce((a, b) => a + (b || 0), 0);
        if (totalInventory <= 0 && p.stockStatus !== 'pre-order') return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      if (filters.sortBy === 'newest') return (b.isNewDrop ? 1 : 0) - (a.isNewDrop ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, filters]);

  const hasActiveFilters = 
    filters.sport !== 'All' || 
    filters.team !== 'All' || 
    filters.style !== 'All' || 
    filters.search !== '' || 
    filters.onlyInStock || 
    filters.maxPrice < 200;

  return (
    <section id="catalogue-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" /> MLBB & Football Collections
            {isAdminLoggedIn && (
            <button
              onClick={() => setIsSiteContentModalOpen(true)}
              className="ml-2 p-1 hover:bg-amber-400/20 text-amber-300 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
              title="Edit Section Headings (ခေါင်းစဉ်ပြင်ရန်)"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Title</span>
            </button>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {siteContent?.catalogHeading || 'AUTHENTIC JERSEY CATALOGUE'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {siteContent?.catalogSubtitle || 'Filtered by authentic player editions, club teams, and match day kits'} ({filteredProducts.length} items available)
          </p>
        </div>

        {/* Sort & Quick Stock Switch */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Stock Filter Segmented Toggle (All / In Stock / Pre-Order) */}
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => setFilters(prev => ({ ...prev, stockFilter: 'all', onlyInStock: false }))}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                (!filters.stockFilter || filters.stockFilter === 'all') && !filters.onlyInStock
                  ? 'bg-zinc-800 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, stockFilter: 'in-stock', onlyInStock: true }))}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                filters.stockFilter === 'in-stock' || filters.onlyInStock
                  ? 'bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-800/80 shadow-sm'
                  : 'text-zinc-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              <span>In Stock</span>
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, stockFilter: 'pre-order', onlyInStock: false }))}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                filters.stockFilter === 'pre-order'
                  ? 'bg-cyan-950/80 text-cyan-400 font-bold border border-cyan-800/80 shadow-sm'
                  : 'text-zinc-400 hover:text-cyan-300'
              }`}
            >
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Pre-Order</span>
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs text-zinc-300">
            <span className="text-zinc-500 font-medium">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-zinc-900">Featured & Trending</option>
              <option value="newest" className="bg-zinc-900">Newest 24/25 Drops</option>
              <option value="price-low" className="bg-zinc-900">Price: Low to High</option>
              <option value="price-high" className="bg-zinc-900">Price: High to Low</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar / Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Team filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Team / Club</label>
          <select
            value={filters.team}
            onChange={(e) => setFilters(prev => ({ ...prev, team: e.target.value }))}
            className="w-full bg-zinc-900 text-white text-xs font-medium px-3 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Teams ({uniqueTeams.length})</option>
            {uniqueTeams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        {/* Jersey Style Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Jersey Style</label>
          <select
            value={filters.style}
            onChange={(e) => setFilters(prev => ({ ...prev, style: e.target.value }))}
            className="w-full bg-zinc-900 text-white text-xs font-medium px-3 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-amber-400"
          >
            {styles.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Styles (Home/Away/Other)' : s}</option>
            ))}
          </select>
        </div>

        {/* Sport category Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Game / Sport</label>
          <select
            value={filters.sport}
            onChange={(e) => setFilters(prev => ({ ...prev, sport: e.target.value }))}
            className="w-full bg-zinc-900 text-white text-xs font-medium px-3 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Categories</option>
            <option value="MLBB">MLBB Esports</option>
            <option value="Football">Football / Soccer</option>
          </select>
        </div>

        {/* Max Price Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <span>Max Price</span>
            <span className="text-amber-400 font-mono">{formatPrice(filters.maxPrice)}</span>
          </div>
          <input
            type="range"
            min="30"
            max="200"
            step="5"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-zinc-500 font-medium">Applied:</span>
          {filters.sport !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-1 rounded-full font-semibold">
              Sport: {filters.sport}
              <button onClick={() => setFilters(prev => ({ ...prev, sport: 'All' }))} className="hover:text-white">✕</button>
            </span>
          )}
          {filters.team !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-1 rounded-full font-semibold">
              Team: {filters.team}
              <button onClick={() => setFilters(prev => ({ ...prev, team: 'All' }))} className="hover:text-white">✕</button>
            </span>
          )}
          {filters.style !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-1 rounded-full font-semibold">
              Style: {filters.style}
              <button onClick={() => setFilters(prev => ({ ...prev, style: 'All' }))} className="hover:text-white">✕</button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-1 rounded-full font-semibold">
              "{filters.search}"
              <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))} className="hover:text-white">✕</button>
            </span>
          )}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
            🔍
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No jerseys match your filters</h3>
            <p className="text-xs text-zinc-400 mt-1">Try relaxing your search terms or clearing specific filters.</p>
          </div>
          <button
            onClick={resetFilters}
            className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
