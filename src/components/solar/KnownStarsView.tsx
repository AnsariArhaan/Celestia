import React, { useState, useRef, useEffect } from 'react';
import { KNOWN_STARS, KnownStar } from '../../data/starsData';
import {
  Sparkles,
  X,
  Compass,
  Thermometer,
  Zap,
  Layers,
  ArrowRightLeft,
  Search,
  Filter,
  Eye,
  Radio,
  Sliders,
  Scale
} from 'lucide-react';

interface KnownStarsViewProps {
  onClose: () => void;
}

type SortField = 'distance' | 'radius' | 'luminosity' | 'temperature';

export const KnownStarsView: React.FC<KnownStarsViewProps> = ({ onClose }) => {
  const [selectedStarId, setSelectedStarId] = useState<string>('betelgeuse');
  const [comparisonStarId, setComparisonStarId] = useState<string>('sun');
  const [sortBy, setSortBy] = useState<SortField>('distance');
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [viewTab, setViewTab] = useState<'visual-scale' | 'stellar-radar' | 'hertzsprung-russell'>('visual-scale');
  const [scaleZoom, setScaleZoom] = useState<number>(1);

  const selectedStar = KNOWN_STARS.find(s => s.id === selectedStarId) || KNOWN_STARS[0];
  const comparisonStar = KNOWN_STARS.find(s => s.id === comparisonStarId) || KNOWN_STARS[0];

  // Filter & Sort stars
  const filteredStars = KNOWN_STARS.filter(star => {
    if (filterClass === 'ALL') return true;
    return star.spectralClass === filterClass;
  }).sort((a, b) => {
    if (sortBy === 'distance') return a.distanceLightYears - b.distanceLightYears;
    if (sortBy === 'radius') return b.radiusSunRatio - a.radiusSunRatio;
    if (sortBy === 'luminosity') return b.luminositySunRatio - a.luminositySunRatio;
    if (sortBy === 'temperature') return b.temperatureKelvin - a.temperatureKelvin;
    return 0;
  });

  return (
    <div
      id="known-stars-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn"
    >
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#070B14]/95 border border-purple-500/30 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(168,85,247,0.08)] overflow-hidden flex flex-col text-gray-100 font-sans">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#0C0F1D]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-purple-500/40 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.35)] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-purple-400 tracking-[0.25em] uppercase">
                  Interstellar Stellar Cartography
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  REAL LIGHT-YEARS DATA
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center gap-2 font-display">
                NEARBY KNOWN STARS & HYPERGIANTS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Tabs */}
            <div className="hidden sm:flex bg-black/60 border border-purple-500/30 rounded-xl p-1 text-xs font-semibold font-display">
              <button
                id="tab-star-scale"
                onClick={() => setViewTab('visual-scale')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewTab === 'visual-scale'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Visual Scale Lineup
              </button>
              <button
                id="tab-star-radar"
                onClick={() => setViewTab('stellar-radar')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewTab === 'stellar-radar'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Distance Radar (LY)
              </button>
            </div>

            <button
              id="close-stars-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/10 text-gray-400 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
              title="Close Known Stars View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Stellar List & Filters (4 Columns) */}
          <div className="lg:col-span-4 border-r border-gray-800 bg-[#05070A]/90 flex flex-col max-h-[45vh] lg:max-h-[calc(92vh-80px)]">
            {/* Controls Bar */}
            <div className="p-3.5 border-b border-gray-800 space-y-2.5 bg-black/40">
              {/* Sort selector */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider">
                  Sort Stellar Bodies:
                </span>
                <div className="flex gap-1">
                  {(['distance', 'radius', 'luminosity', 'temperature'] as SortField[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-all cursor-pointer ${
                        sortBy === s
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/60 font-bold'
                          : 'bg-white/5 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {s.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spectral Class Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
                <span className="text-[10px] font-mono text-gray-400 uppercase mr-1">Class:</span>
                {['ALL', 'O', 'B', 'A', 'F', 'G', 'K', 'M', 'BH'].map(sc => (
                  <button
                    key={sc}
                    onClick={() => setFilterClass(sc)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all shrink-0 cursor-pointer ${
                      filterClass === sc
                        ? 'bg-purple-500 text-white font-bold'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {sc === 'BH' ? 'BH (Black Holes)' : sc}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Star List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
              {filteredStars.map(star => {
                const isSelected = star.id === selectedStarId;
                return (
                  <button
                    key={star.id}
                    id={`star-card-${star.id}`}
                    onClick={() => setSelectedStarId(star.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                        : 'bg-white/5 border-white/5 hover:border-gray-700 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Glowing Star Icon */}
                      <div
                        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center shadow-md"
                        style={{
                          backgroundColor: star.colorHex,
                          boxShadow: `0 0 14px ${star.glowColorHex}`
                        }}
                      >
                        <span className="text-[9px] font-bold text-black font-mono">
                          {star.spectralClass}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <h4 className={`text-xs font-bold font-display ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                            {star.name}
                          </h4>
                          <span className="text-[10px] font-mono text-gray-400">
                            {star.constellation}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-gray-400">
                          {star.spectralSubtype}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <div className="text-xs font-semibold text-gray-200">
                        {star.distanceLightYears === 0.0000158
                          ? '0 LY (Sun)'
                          : `${star.distanceLightYears.toLocaleString()} LY`}
                      </div>
                      <div className="text-[10px] text-amber-400 font-medium">
                        {star.radiusSunRatio.toLocaleString()}x R☉
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Stage & Comparison (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col bg-[#070B14] p-4 md:p-6 overflow-y-auto space-y-5 scrollbar-thin">
            {/* 1. Interactive Star Comparison Visualizer */}
            {viewTab === 'visual-scale' && (
              <div className="p-5 bg-black/60 rounded-2xl border border-purple-500/20 relative overflow-hidden flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-widest block">
                      Direct True Physical Scale Benchmark
                    </span>
                    <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center gap-2 font-display">
                      <span>{selectedStar.name}</span>
                      <span className="text-gray-500 font-light">vs</span>
                      <span>{comparisonStar.name}</span>
                    </h3>
                  </div>

                  {/* Comparison Star Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Compare With:</span>
                    <select
                      id="select-compare-star"
                      value={comparisonStarId}
                      onChange={(e) => setComparisonStarId(e.target.value)}
                      className="bg-[#05070A] border border-purple-500/30 text-xs rounded-xl px-3 py-1.5 text-gray-200 focus:border-purple-400 outline-none font-mono cursor-pointer"
                    >
                      {KNOWN_STARS.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.radiusSunRatio}x R☉)</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Visual Scale Canvas Lineup */}
                <div className="min-h-[220px] max-h-[300px] w-full bg-[#05070A]/90 rounded-2xl border border-purple-500/20 p-4 flex items-center justify-around relative overflow-hidden">
                  {/* Star A (Selected) */}
                  <div className="flex flex-col items-center justify-center gap-2 z-10">
                    <div
                      className="rounded-full flex items-center justify-center transition-all duration-700 relative"
                      style={{
                        width: `${Math.max(20, Math.min(180, Math.log10(selectedStar.radiusSunRatio + 1) * 65 + 24))}px`,
                        height: `${Math.max(20, Math.min(180, Math.log10(selectedStar.radiusSunRatio + 1) * 65 + 24))}px`,
                        backgroundColor: selectedStar.spectralClass === 'BH' ? '#000000' : selectedStar.colorHex,
                        border: selectedStar.spectralClass === 'BH' ? '3px solid #ffb703' : 'none',
                        boxShadow: selectedStar.spectralClass === 'BH'
                          ? '0 0 25px #fb8500, 0 0 60px #ffb70380, inset 0 0 15px #000'
                          : `0 0 35px ${selectedStar.glowColorHex}, 0 0 80px ${selectedStar.glowColorHex}60`
                      }}
                    >
                      <span className="text-[10px] font-mono font-bold text-black bg-white/80 px-1.5 py-0.5 rounded">
                        {selectedStar.spectralClass}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-white font-display">{selectedStar.name}</div>
                      <div className="text-[10px] font-mono text-amber-400 font-bold">
                        {selectedStar.radiusSunRatio.toLocaleString()}x Solar Radius
                      </div>
                      <div className="text-[9px] font-mono text-gray-400">
                        R = {(selectedStar.radiusKm).toLocaleString()} km
                      </div>
                    </div>
                  </div>

                  {/* Ratio Divider */}
                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className="w-9 h-9 rounded-2xl bg-white/5 border border-purple-500/30 flex items-center justify-center text-purple-300">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-purple-300 font-bold">
                      {(selectedStar.radiusSunRatio / (comparisonStar.radiusSunRatio || 1)).toFixed(2)}x
                    </span>
                    <span className="text-[9px] font-mono text-gray-400 uppercase">Radius Ratio</span>
                  </div>

                  {/* Star B (Comparison) */}
                  <div className="flex flex-col items-center justify-center gap-2 z-10">
                    <div
                      className="rounded-full flex items-center justify-center transition-all duration-700 relative"
                      style={{
                        width: `${Math.max(20, Math.min(180, Math.log10(comparisonStar.radiusSunRatio + 1) * 65 + 24))}px`,
                        height: `${Math.max(20, Math.min(180, Math.log10(comparisonStar.radiusSunRatio + 1) * 65 + 24))}px`,
                        backgroundColor: comparisonStar.spectralClass === 'BH' ? '#000000' : comparisonStar.colorHex,
                        border: comparisonStar.spectralClass === 'BH' ? '3px solid #ffb703' : 'none',
                        boxShadow: comparisonStar.spectralClass === 'BH'
                          ? '0 0 25px #fb8500, 0 0 60px #ffb70380, inset 0 0 15px #000'
                          : `0 0 35px ${comparisonStar.glowColorHex}, 0 0 80px ${comparisonStar.glowColorHex}60`
                      }}
                    >
                      <span className="text-[10px] font-mono font-bold text-black bg-white/80 px-1.5 py-0.5 rounded">
                        {comparisonStar.spectralClass}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-white font-display">{comparisonStar.name}</div>
                      <div className="text-[10px] font-mono text-amber-400 font-bold">
                        {comparisonStar.radiusSunRatio.toLocaleString()}x Solar Radius
                      </div>
                      <div className="text-[9px] font-mono text-gray-400">
                        R = {(comparisonStar.radiusKm).toLocaleString()} km
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-gray-400 text-center">
                  * Note: Radii are scaled logarithmically for multi-magnitude readability across red dwarfs (0.15 R☉) to hypergiants (1,708 R☉).
                </div>
              </div>
            )}

            {/* 2. Light-Year Distance Radar */}
            {viewTab === 'stellar-radar' && (
              <div className="p-5 bg-black/60 rounded-2xl border border-purple-500/20 relative space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-widest block">
                      Solar Proximity Radar
                    </span>
                    <h3 className="text-base font-bold text-white uppercase tracking-tight font-display">
                      Distance from Earth & The Sun in Light-Years
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {filteredStars.map((star) => {
                    const maxDist = 1000;
                    const percent = Math.min(100, Math.max(2, (Math.log10(star.distanceLightYears + 1) / Math.log10(maxDist)) * 100));
                    return (
                      <div
                        key={star.id}
                        onClick={() => setSelectedStarId(star.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          star.id === selectedStarId
                            ? 'bg-purple-500/20 border-purple-500'
                            : 'bg-white/5 border-gray-800 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: star.colorHex }} />
                            <span className="font-bold text-white font-display">{star.name}</span>
                            <span className="text-gray-400">({star.constellation})</span>
                          </div>
                          <span className="text-purple-300 font-bold">
                            {star.distanceLightYears === 0.0000158
                              ? '0.0 LY (Anchor)'
                              : `${star.distanceLightYears.toLocaleString()} LY`}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-gray-800">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: star.colorHex
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Detailed Selected Star Telemetry Cards */}
            <div className="space-y-4">
              <div className="border-b border-gray-800 pb-3 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-widest block">
                    Astrophysical Profile
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight uppercase font-display">
                    {selectedStar.name}
                  </h3>
                  <p className="text-xs font-mono text-gray-400">
                    Scientific: {selectedStar.scientificName} // Constellation: {selectedStar.constellation}
                  </p>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-white px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-500/30 inline-block">
                    {selectedStar.spectralSubtype}
                  </span>
                </div>
              </div>

              {/* 4-Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Distance</div>
                  <div className="text-base font-mono font-bold text-white mt-1">
                    {selectedStar.distanceLightYears === 0.0000158 ? '0 LY' : `${selectedStar.distanceLightYears.toLocaleString()} LY`}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">From Sol</div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Luminosity</div>
                  <div className="text-base font-mono font-bold text-amber-400 mt-1">
                    {selectedStar.luminositySunRatio.toLocaleString()}x
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">Solar Luminosity (L☉)</div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Surface Temp</div>
                  <div className="text-base font-mono font-bold text-white mt-1">
                    {selectedStar.temperatureKelvin.toLocaleString()} K
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    ({(selectedStar.temperatureKelvin - 273.15).toFixed(0)}°C)
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Estimated Mass</div>
                  <div className="text-base font-mono font-bold text-white mt-1">
                    {selectedStar.massSunRatio.toLocaleString()}x
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">Solar Mass (M☉)</div>
                </div>
              </div>

              {/* Description & Historical Significance */}
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <div>
                  <h4 className="text-xs font-bold uppercase text-purple-300 tracking-wider mb-1 flex items-center gap-1.5 font-display">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>Astrophysical Analysis</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {selectedStar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-800">
                  <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-1 flex items-center gap-1.5 font-display">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>Historical & Observational Significance</span>
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    {selectedStar.historicalSignificance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

