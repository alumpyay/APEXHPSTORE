import React, { useState, useMemo } from 'react';
import { 
  Ruler, 
  Sparkles, 
  ChevronRight, 
  Check, 
  ArrowRight, 
  Info, 
  RotateCcw,
  Sliders,
  Scale,
  Shirt
} from 'lucide-react';
import { JerseySize } from '../types';

interface FindYourFitProps {
  currentSelectedSize: JerseySize;
  onSelectSize: (size: JerseySize) => void;
  availableStock?: Record<JerseySize, number>;
}

export const FindYourFit: React.FC<FindYourFitProps> = ({
  currentSelectedSize,
  onSelectSize,
  availableStock
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  
  // Metric defaults: 175 cm, 70 kg
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);

  // Imperial inputs (defaults: 5 Ft 9 in, 154 Lb)
  const [totalInches, setTotalInches] = useState(69); // 5 ft 9 in
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [weightLbs, setWeightLbs] = useState(154);

  // Fit Preference
  const [fitPreference, setFitPreference] = useState<'slim' | 'regular' | 'oversized'>('regular');
  const [applied, setApplied] = useState(false);

  // Handlers for imperial & metric updates
  const handleImperialHeightSlider = (inches: number) => {
    setTotalInches(inches);
    const ft = Math.floor(inches / 12);
    const inch = inches % 12;
    setHeightFt(ft);
    setHeightIn(inch);
    setHeightCm(Math.round(inches * 2.54));
  };

  const handleImperialHeightSelect = (ft: number, inch: number) => {
    setHeightFt(ft);
    setHeightIn(inch);
    const totInches = (ft * 12) + inch;
    setTotalInches(totInches);
    setHeightCm(Math.round(totInches * 2.54));
  };

  const handleImperialWeightChange = (lbs: number) => {
    setWeightLbs(lbs);
    setWeightKg(Math.round(lbs / 2.20462));
  };

  const handleCmChange = (cm: number) => {
    setHeightCm(cm);
    const inches = Math.round(cm / 2.54);
    setTotalInches(inches);
    setHeightFt(Math.floor(inches / 12));
    setHeightIn(inches % 12);
  };

  const handleKgChange = (kg: number) => {
    setWeightKg(kg);
    setWeightLbs(Math.round(kg * 2.20462));
  };

  // Size calculation algorithm
  const recommendation = useMemo(() => {
    let rawScore = (heightCm * 0.45) + (weightKg * 0.55);

    // Adjust for fit preference
    if (fitPreference === 'slim') {
      rawScore -= 3.5;
    } else if (fitPreference === 'oversized') {
      rawScore += 4.5;
    }

    let size: JerseySize = 'M';
    let matchConfidence = 96;
    let chestEstimate = '38 - 40 in (98 - 102 cm)';
    let lengthEstimate = '28.3 in (72 cm)';
    let fitDescription = 'Optimal pro-match balance between comfort and aerodynamics';

    if (rawScore < 112) {
      size = 'S';
      matchConfidence = 94;
      chestEstimate = '36 - 38 in (92 - 96 cm)';
      lengthEstimate = '27.2 in (69 cm)';
      fitDescription = 'Fitted chest & tapered sleeves designed for smaller frames';
    } else if (rawScore < 120) {
      size = 'M';
      matchConfidence = 96;
      chestEstimate = '38 - 40 in (98 - 102 cm)';
      lengthEstimate = '28.3 in (72 cm)';
      fitDescription = 'Optimal pro-match balance between comfort and aerodynamics';
    } else if (rawScore < 128) {
      size = 'L';
      matchConfidence = 95;
      chestEstimate = '41 - 42.5 in (104 - 108 cm)';
      lengthEstimate = '29.5 in (75 cm)';
      fitDescription = 'Roomy chest and shoulder cut, ideal for all-day streaming/gaming';
    } else if (rawScore < 136) {
      size = 'XL';
      matchConfidence = 93;
      chestEstimate = '43.5 - 45.5 in (110 - 116 cm)';
      lengthEstimate = '30.7 in (78 cm)';
      fitDescription = 'Relaxed athletic silhouette with extended torso length';
    } else if (rawScore < 144) {
      size = '2XL';
      matchConfidence = 92;
      chestEstimate = '46.5 - 49.5 in (118 - 126 cm)';
      lengthEstimate = '31.8 in (81 cm)';
      fitDescription = 'Maximum comfort and generous chest width for heavier/taller builds';
    } else {
      size = '3XL';
      matchConfidence = 90;
      chestEstimate = '50 - 53 in (127 - 135 cm)';
      lengthEstimate = '33.0 in (84 cm)';
      fitDescription = 'Roomy extra-large cut engineered for maximum comfort and freedom of movement';
    }

    const stock = availableStock ? availableStock[size] : undefined;
    const isOutOfStock = stock !== undefined && stock <= 0;

    return {
      size,
      matchConfidence,
      chestEstimate,
      lengthEstimate,
      fitDescription,
      isOutOfStock,
      stock
    };
  }, [heightCm, weightKg, fitPreference, availableStock]);

  const handleApplySize = () => {
    onSelectSize(recommendation.size);
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      setIsOpen(false);
    }, 600);
  };

  return (
    <div className="w-full">
      {/* Trigger Button */}
      {!isOpen ? (
        <button
          type="button"
          id="open-find-your-fit-btn"
          onClick={() => setIsOpen(true)}
          className="w-full group flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-amber-400/30 hover:border-amber-400/60 text-xs text-amber-300 font-semibold transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <Ruler className="w-3.5 h-3.5" />
            </div>
            <span>Not sure about sizing? <strong>Find Your Fit</strong></span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
            <span>Calculate</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      ) : (
        /* Expandable Calculator Card */
        <div 
          id="find-your-fit-card"
          className="bg-zinc-900 border border-amber-400/40 rounded-2xl p-4 text-white shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-zinc-950 flex items-center justify-center font-bold">
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-1.5 font-mono">
                  SMART SIZE RECOMMENDER
                  <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-sans uppercase">Pro Fit AI</span>
                </h4>
                <p className="text-[10px] text-zinc-400">Enter height & weight for tailored jersey fit</p>
              </div>
            </div>

            {/* Unit Toggle & Close */}
            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`px-2 py-1 rounded transition-colors ${
                    unitSystem === 'metric' ? 'bg-amber-400 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  CM / KG
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-2 py-1 rounded transition-colors ${
                    unitSystem === 'imperial' ? 'bg-amber-400 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  FT / LBS
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold px-1.5 py-1 rounded hover:bg-zinc-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          {/* User Inputs (Height & Weight) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Height Slider / Input */}
            <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-amber-400" />
                  Your Height
                </span>
                <div className="text-right">
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {unitSystem === 'imperial' ? `${heightFt} Ft ${heightIn} in` : `${heightCm} cm`}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono ml-1.5">
                    ({unitSystem === 'imperial' ? `${heightCm} cm` : `${heightFt} Ft ${heightIn} in`})
                  </span>
                </div>
              </div>

              {unitSystem === 'imperial' ? (
                <div className="space-y-2">
                  <input
                    type="range"
                    min="57"
                    max="81"
                    value={totalInches}
                    onChange={(e) => handleImperialHeightSlider(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>4 Ft 9 in</span>
                    <span>5 Ft 9 in</span>
                    <span>6 Ft 9 in</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1">
                      <label className="text-[9px] text-zinc-400 font-medium block">Feet (Ft)</label>
                      <select
                        value={heightFt}
                        onChange={(e) => handleImperialHeightSelect(Number(e.target.value), heightIn)}
                        className="w-full bg-zinc-900 border border-zinc-700 text-white font-mono text-xs p-1.5 rounded-lg focus:outline-none focus:border-amber-400"
                      >
                        {[4, 5, 6, 7].map(f => (
                          <option key={f} value={f}>{f} Ft</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] text-zinc-400 font-medium block">Inches (in)</label>
                      <select
                        value={heightIn}
                        onChange={(e) => handleImperialHeightSelect(heightFt, Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-700 text-white font-mono text-xs p-1.5 rounded-lg focus:outline-none focus:border-amber-400"
                      >
                        {Array.from({ length: 12 }, (_, i) => i).map(inch => (
                          <option key={inch} value={inch}>{inch} in</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="range"
                    min="145"
                    max="210"
                    value={heightCm}
                    onChange={(e) => handleCmChange(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>145 cm</span>
                    <span>175 cm</span>
                    <span>210 cm</span>
                  </div>
                </div>
              )}
            </div>

            {/* Weight Slider / Input */}
            <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  Your Weight
                </span>
                <div className="text-right">
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {unitSystem === 'imperial' ? `${weightLbs} Lb` : `${weightKg} kg`}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono ml-1.5">
                    ({unitSystem === 'imperial' ? `${weightKg} kg` : `${weightLbs} Lb`})
                  </span>
                </div>
              </div>

              {unitSystem === 'imperial' ? (
                <div>
                  <input
                    type="range"
                    min="85"
                    max="280"
                    value={weightLbs}
                    onChange={(e) => handleImperialWeightChange(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>85 Lb</span>
                    <span>155 Lb</span>
                    <span>280 Lb</span>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="range"
                    min="40"
                    max="130"
                    value={weightKg}
                    onChange={(e) => handleKgChange(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                    <span>40 kg</span>
                    <span>70 kg</span>
                    <span>130 kg</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fit Preference Buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold">
              <span>Preferred Wearing Style:</span>
              <span className="text-zinc-300 capitalize">{fitPreference} Fit</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'slim', label: 'Slim / Fitted', desc: 'Pro tight match feel' },
                { id: 'regular', label: 'Regular', desc: 'Standard true to size' },
                { id: 'oversized', label: 'Relaxed / Street', desc: 'Loose & breezy' },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFitPreference(f.id as any)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    fitPreference === f.id
                      ? 'bg-zinc-800 border-amber-400 text-white shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{f.label}</div>
                  <div className="text-[9px] text-zinc-500">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sizing Result Banner */}
          <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/30 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-zinc-950 flex flex-col items-center justify-center font-mono font-black shadow-lg shadow-amber-500/30 shrink-0">
                <span className="text-[10px] uppercase font-bold tracking-tighter">Size</span>
                <span className="text-2xl leading-none">{recommendation.size}</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">Recommended Size: {recommendation.size}</span>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {recommendation.matchConfidence}% Match
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  {recommendation.fitDescription}
                </p>
                <div className="text-[10px] text-zinc-400 font-mono">
                  Chest: <span className="text-white font-bold">{recommendation.chestEstimate}</span> • Length: <span className="text-white font-bold">{recommendation.lengthEstimate}</span>
                </div>
              </div>
            </div>

            {/* Apply Recommended Size Button */}
            <button
              type="button"
              id="apply-recommended-size-btn"
              onClick={handleApplySize}
              disabled={recommendation.isOutOfStock}
              className={`w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                applied
                  ? 'bg-emerald-500 text-white'
                  : recommendation.isOutOfStock
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-md shadow-amber-500/20'
              }`}
            >
              {applied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Applied Size {recommendation.size}!</span>
                </>
              ) : recommendation.isOutOfStock ? (
                <span>Size {recommendation.size} Sold Out</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Size {recommendation.size}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Size Chart Table Accordion */}
          <div className="border-t border-zinc-800 pt-2.5">
            <details className="text-[11px] text-zinc-400 group">
              <summary className="cursor-pointer font-bold text-zinc-300 hover:text-amber-400 flex items-center justify-between">
                <span>View Full Size Chart Matrix (Ft & in, Lb Specs)</span>
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="overflow-x-auto mt-2 bg-zinc-950 rounded-xl p-2 border border-zinc-800">
                <table className="w-full text-left font-mono text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-800 text-amber-400">
                      <th className="py-1.5 px-2">Size</th>
                      <th className="py-1.5 px-2">Chest (in / cm)</th>
                      <th className="py-1.5 px-2">Length (in / cm)</th>
                      <th className="py-1.5 px-2">Height Range (Ft & in)</th>
                      <th className="py-1.5 px-2">Weight Range (Lb)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                    <tr className={recommendation.size === 'S' ? 'bg-amber-400/10 font-bold text-amber-300' : ''}>
                      <td className="py-1.5 px-2 font-black">S</td>
                      <td className="py-1.5 px-2">36 - 38" <span className="text-zinc-500 text-[9px]">(92 - 96 cm)</span></td>
                      <td className="py-1.5 px-2">27.2" <span className="text-zinc-500 text-[9px]">(69 cm)</span></td>
                      <td className="py-1.5 px-2">5 Ft 3 in - 5 Ft 7 in</td>
                      <td className="py-1.5 px-2">110 - 136 Lb <span className="text-zinc-500 text-[9px]">(50 - 62 kg)</span></td>
                    </tr>
                    <tr className={recommendation.size === 'M' ? 'bg-amber-400/10 font-bold text-amber-300' : ''}>
                      <td className="py-1.5 px-2 font-black">M</td>
                      <td className="py-1.5 px-2">38 - 40" <span className="text-zinc-500 text-[9px]">(98 - 102 cm)</span></td>
                      <td className="py-1.5 px-2">28.3" <span className="text-zinc-500 text-[9px]">(72 cm)</span></td>
                      <td className="py-1.5 px-2">5 Ft 6 in - 5 Ft 10 in</td>
                      <td className="py-1.5 px-2">132 - 163 Lb <span className="text-zinc-500 text-[9px]">(60 - 74 kg)</span></td>
                    </tr>
                    <tr className={recommendation.size === 'L' ? 'bg-amber-400/10 font-bold text-amber-300' : ''}>
                      <td className="py-1.5 px-2 font-black">L</td>
                      <td className="py-1.5 px-2">41 - 42.5" <span className="text-zinc-500 text-[9px]">(104 - 108 cm)</span></td>
                      <td className="py-1.5 px-2">29.5" <span className="text-zinc-500 text-[9px]">(75 cm)</span></td>
                      <td className="py-1.5 px-2">5 Ft 9 in - 6 Ft 0 in</td>
                      <td className="py-1.5 px-2">158 - 187 Lb <span className="text-zinc-500 text-[9px]">(72 - 85 kg)</span></td>
                    </tr>
                    <tr className={recommendation.size === 'XL' ? 'bg-amber-400/10 font-bold text-amber-300' : ''}>
                      <td className="py-1.5 px-2 font-black">XL</td>
                      <td className="py-1.5 px-2">43.5 - 45.5" <span className="text-zinc-500 text-[9px]">(110 - 116 cm)</span></td>
                      <td className="py-1.5 px-2">30.7" <span className="text-zinc-500 text-[9px]">(78 cm)</span></td>
                      <td className="py-1.5 px-2">6 Ft 0 in - 6 Ft 3 in</td>
                      <td className="py-1.5 px-2">183 - 216 Lb <span className="text-zinc-500 text-[9px]">(83 - 98 kg)</span></td>
                    </tr>
                    <tr className={recommendation.size === '2XL' ? 'bg-amber-400/10 font-bold text-amber-300' : ''}>
                      <td className="py-1.5 px-2 font-black">2XL</td>
                      <td className="py-1.5 px-2">46.5 - 49.5" <span className="text-zinc-500 text-[9px]">(118 - 126 cm)</span></td>
                      <td className="py-1.5 px-2">31.8" <span className="text-zinc-500 text-[9px]">(81 cm)</span></td>
                      <td className="py-1.5 px-2">6 Ft 2 in - 6 Ft 4 in</td>
                      <td className="py-1.5 px-2">210 - 235 Lb <span className="text-zinc-500 text-[9px]">(95 - 106 kg)</span></td>
                    </tr>
                    <tr className={recommendation.size === '3XL' ? 'bg-amber-400/10 font-bold text-amber-300' : ''}>
                      <td className="py-1.5 px-2 font-black">3XL</td>
                      <td className="py-1.5 px-2">50 - 53" <span className="text-zinc-500 text-[9px]">(127 - 135 cm)</span></td>
                      <td className="py-1.5 px-2">33.0" <span className="text-zinc-500 text-[9px]">(84 cm)</span></td>
                      <td className="py-1.5 px-2">6 Ft 4 in +</td>
                      <td className="py-1.5 px-2">235+ Lb <span className="text-zinc-500 text-[9px]">(106+ kg)</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};
