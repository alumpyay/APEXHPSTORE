import React from 'react';
import { 
  Trophy, 
  Activity, 
  Star, 
  Award, 
  Target, 
  Zap, 
  ChevronRight, 
  X,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PlayerStatsSheet: React.FC = () => {
  const { 
    selectedPlayerStats, 
    setSelectedPlayerStats, 
    addToCart
  } = useStore();

  if (!selectedPlayerStats || !selectedPlayerStats.stats) return null;

  const { stats } = selectedPlayerStats;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="player-stats-modal"
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col text-left"
      >
        {/* Header with Player Backdrop */}
        <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/40 p-6 border-b border-zinc-800">
          <button
            onClick={() => setSelectedPlayerStats(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            {/* Number Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 font-black flex items-center justify-center text-3xl font-mono shadow-lg shadow-amber-500/20 shrink-0">
              #{stats.number}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {stats.season} Verified Stats
                </span>
                <span className="text-xs text-zinc-400 font-mono">• {stats.team}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{stats.playerName}</h2>
              <p className="text-xs text-zinc-300 font-medium">{stats.position}</p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Key Stat Blocks Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Match Rating</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">{stats.rating.toFixed(1)}</div>
              <span className="text-[10px] text-zinc-400">out of 10.0</span>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                <Target className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {selectedPlayerStats.sport === 'MLBB' ? 'Kills / MVPs' : 'Goals / TDs'}
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">{stats.goalsOrPoints}</div>
              <span className="text-[10px] text-zinc-400">In {stats.appearances} {selectedPlayerStats.sport === 'MLBB' ? 'Matches' : 'Games'}</span>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {selectedPlayerStats.sport === 'MLBB' ? 'Assists (KDA)' : 'Assists'}
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">{stats.assists}</div>
              <span className="text-[10px] text-zinc-400">Team Support</span>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{stats.keyMetricName}</span>
              </div>
              <div className="text-lg font-black text-white font-mono mt-0.5">{stats.keyMetricValue}</div>
              <span className="text-[10px] text-zinc-400">Elite Tier</span>
            </div>
          </div>

          {/* Performance Radar & Attributes Breakdown */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" /> Season Performance Attributes
            </h3>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-400">Attacking Efficiency & Clutch Index</span>
                  <span className="text-amber-400 font-mono font-bold">96%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full w-[96%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-400">Key Play Creation / Vision</span>
                  <span className="text-blue-400 font-mono font-bold">92%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-400">Physical Stamina & Press Intensity</span>
                  <span className="text-emerald-400 font-mono font-bold">94%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[94%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Trophies & Honors */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-500" /> Honors & Titles
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.trophies.map((trophy, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs px-3 py-1.5 rounded-xl font-medium"
                >
                  <Award className="w-3.5 h-3.5 text-yellow-500" />
                  {trophy}
                </span>
              ))}
            </div>
          </div>

          {/* Bio Commentary */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 p-4 rounded-2xl">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Pro Scout Analysis</h4>
            <p className="text-xs text-zinc-300 leading-relaxed italic">
              "{stats.bioHighlight}"
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between gap-3">
          <div className="text-left hidden sm:block">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Match Player Kit</span>
            <div className="text-xs font-bold text-white truncate max-w-xs">{selectedPlayerStats.name}</div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                addToCart({
                  productId: selectedPlayerStats.id,
                  name: selectedPlayerStats.name,
                  team: selectedPlayerStats.team,
                  style: selectedPlayerStats.style,
                  size: 'M',
                  price: selectedPlayerStats.price,
                  quantity: 1,
                  image: selectedPlayerStats.imageFront,
                  isCustom: false,
                });
                setSelectedPlayerStats(null);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-5 py-2.5 rounded-xl text-xs font-black transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Size M to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
