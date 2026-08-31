import React, { useState } from 'react';
import { CelestialBody, PlanetId } from '../../types/solar';
import { CELESTIAL_BODIES } from '../../data/planetsData';
import {
  Scale,
  X,
  ArrowRightLeft,
  Columns,
  Layers,
  Thermometer,
  Compass,
  CircleDot,
  Orbit,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

interface PlanetComparisonProps {
  initialPlanetA: PlanetId;
  onClose: () => void;
}

type ComparisonMode = 'head-to-head' | 'all-planets-lineup';

export const PlanetComparison: React.FC<PlanetComparisonProps> = ({ initialPlanetA, onClose }) => {
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('head-to-head');
  const [planetAId, setPlanetAId] = useState<PlanetId>(initialPlanetA);
  const [planetBId, setPlanetBId] = useState<PlanetId>(
    initialPlanetA === 'earth' ? 'mars' : 'earth'
  );
  const [lineupScaleType, setLineupScaleType] = useState<'balanced' | 'true-relative'>('balanced');

  const planetA = CELESTIAL_BODIES.find(p => p.id === planetAId) || CELESTIAL_BODIES[3];
  const planetB = CELESTIAL_BODIES.find(p => p.id === planetBId) || CELESTIAL_BODIES[4];

  // Benchmark maximums for normalized comparison gauges
  const maxGravity = 28;
  const maxSpeed = 180000;
  const maxTemp = 480;

  // Major solar system planets for the lineup (excluding Sun for better planet-to-planet contrast or including toggle)
  const lineupPlanets = CELESTIAL_BODIES.filter(p => p.id !== 'sun');

  return (
    <div
      id="planet-comparison-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#070B14]/95 border border-cyan-500/30 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(6,182,212,0.08)] overflow-hidden flex flex-col text-gray-100 font-sans">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-[#0A1020]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.35)]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 tracking-[0.25em] uppercase block font-mono">
                Comparative Astrometry Lab
              </span>
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-white uppercase font-display">
                Planetary Scale & Telemetry Diagnostics
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <div className="hidden sm:flex bg-black/60 border border-cyan-500/30 rounded-xl p-1 text-xs font-semibold font-display">
              <button
                id="mode-head-to-head-btn"
                onClick={() => setComparisonMode('head-to-head')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  comparisonMode === 'head-to-head'
                    ? 'bg-cyan-500 text-black font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                2-Body Head-to-Head
              </button>
              <button
                id="mode-lineup-btn"
                onClick={() => setComparisonMode('all-planets-lineup')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  comparisonMode === 'all-planets-lineup'
                    ? 'bg-cyan-500 text-black font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Full System Lineup
              </button>
            </div>

            <button
              id="close-comparison-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
              title="Close Comparison Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 scrollbar-thin">
          {/* TAB 1: HEAD-TO-HEAD COMPARISON */}
          {comparisonMode === 'head-to-head' && (
            <div className="space-y-5">
              {/* Planet Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Picker A */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Primary Celestial Target (A)
                  </label>
                  <select
                    id="select-planet-a"
                    value={planetAId}
                    onChange={(e) => setPlanetAId(e.target.value as PlanetId)}
                    className="bg-[#05070A] border border-cyan-500/30 text-gray-100 text-xs md:text-sm rounded-xl px-3 py-2.5 outline-none focus:border-cyan-400 cursor-pointer font-mono"
                  >
                    {CELESTIAL_BODIES.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.symbol} {p.name} — {p.type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Picker B */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Secondary Celestial Target (B)
                  </label>
                  <select
                    id="select-planet-b"
                    value={planetBId}
                    onChange={(e) => setPlanetBId(e.target.value as PlanetId)}
                    className="bg-[#05070A] border border-cyan-500/30 text-gray-100 text-xs md:text-sm rounded-xl px-3 py-2.5 outline-none focus:border-cyan-400 cursor-pointer font-mono"
                  >
                    {CELESTIAL_BODIES.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.symbol} {p.name} — {p.type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visual Scale Comparison Circles */}
              <div className="p-6 bg-black/60 rounded-2xl border border-cyan-500/20 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="absolute top-3 left-4 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  Relative Volumetric Cross-Section (Earth = 1.0)
                </span>

                <div className="flex items-center justify-around w-full mt-6 mb-2">
                  {/* Planet A Sphere */}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="rounded-full flex items-center justify-center shadow-lg transition-all duration-500"
                      style={{
                        width: `${Math.max(28, Math.min(150, (planetA.id === 'sun' ? 160 : planetA.radiusEarthRatio * 32)))}px`,
                        height: `${Math.max(28, Math.min(150, (planetA.id === 'sun' ? 160 : planetA.radiusEarthRatio * 32)))}px`,
                        backgroundColor: planetA.colorHex,
                        boxShadow: `0 0 35px ${planetA.glowColorHex}60`
                      }}
                    />
                    <span className="font-extrabold text-sm text-white uppercase tracking-wider font-display">{planetA.name}</span>
                    <span className="text-xs font-mono text-cyan-300">R = {planetA.radiusKm.toLocaleString()} km</span>
                  </div>

                  <div className="flex flex-col items-center text-gray-400">
                    <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-mono text-cyan-300 font-bold mt-1">
                      {(planetA.radiusEarthRatio / (planetB.radiusEarthRatio || 0.001)).toFixed(2)}x
                    </span>
                    <span className="text-[9px] font-mono text-gray-400 uppercase">Radius Ratio</span>
                  </div>

                  {/* Planet B Sphere */}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="rounded-full flex items-center justify-center shadow-lg transition-all duration-500"
                      style={{
                        width: `${Math.max(28, Math.min(150, (planetB.id === 'sun' ? 160 : planetB.radiusEarthRatio * 32)))}px`,
                        height: `${Math.max(28, Math.min(150, (planetB.id === 'sun' ? 160 : planetB.radiusEarthRatio * 32)))}px`,
                        backgroundColor: planetB.colorHex,
                        boxShadow: `0 0 35px ${planetB.glowColorHex}60`
                      }}
                    />
                    <span className="font-extrabold text-sm text-white uppercase tracking-wider font-display">{planetB.name}</span>
                    <span className="text-xs font-mono text-cyan-300">R = {planetB.radiusKm.toLocaleString()} km</span>
                  </div>
                </div>
              </div>

              {/* Comprehensive Metric Comparison Table */}
              <div className="space-y-3 font-mono text-xs">
                {/* 1. Surface Gravity */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center text-xs text-gray-300 mb-2">
                    <span className="text-cyan-300 font-bold">{planetA.surfaceGravityMs2} m/s² ({planetA.gravityEarthRatio}g)</span>
                    <span className="uppercase text-gray-400 font-bold tracking-wider text-[10px] font-display">Surface Gravity</span>
                    <span className="text-cyan-300 font-bold">{planetB.surfaceGravityMs2} m/s² ({planetB.gravityEarthRatio}g)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-gray-800">
                    <div className="flex justify-end">
                      <div
                        className="h-full bg-gradient-to-l from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (planetA.surfaceGravityMs2 / maxGravity) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-start">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (planetB.surfaceGravityMs2 / maxGravity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Mean Temperature */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center text-xs text-gray-300 mb-2">
                    <span className="text-amber-300 font-bold">{planetA.temperatureDisplay}</span>
                    <span className="uppercase text-gray-400 font-bold tracking-wider text-[10px] font-display">Mean Temperature</span>
                    <span className="text-amber-300 font-bold">{planetB.temperatureDisplay}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-gray-800">
                    <div className="flex justify-end">
                      <div
                        className="h-full bg-gradient-to-l from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, ((planetA.meanTempC + 273) / (maxTemp + 273)) * 100))}%` }}
                      />
                    </div>
                    <div className="flex justify-start">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, ((planetB.meanTempC + 273) / (maxTemp + 273)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Distance From Sun */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center text-xs text-gray-300">
                    <span className="text-cyan-300 font-bold">{planetA.distanceFromSunAU} AU ({planetA.distanceFromSunKmDisplay})</span>
                    <span className="uppercase text-gray-400 font-bold tracking-wider text-[10px] font-display">Distance From Sun</span>
                    <span className="text-cyan-300 font-bold">{planetB.distanceFromSunAU} AU ({planetB.distanceFromSunKmDisplay})</span>
                  </div>
                </div>

                {/* 4. Day Length & Orbital Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-[10px] text-gray-400 uppercase font-bold text-center mb-1 font-display">
                      Day Length (Axial Rotation)
                    </div>
                    <div className="flex justify-between items-center text-xs text-white">
                      <span>{planetA.name}: <strong className="text-cyan-300">{planetA.rotationPeriodDisplay}</strong></span>
                      <span>{planetB.name}: <strong className="text-cyan-300">{planetB.rotationPeriodDisplay}</strong></span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-[10px] text-gray-400 uppercase font-bold text-center mb-1 font-display">
                      Orbital Period (Year Length)
                    </div>
                    <div className="flex justify-between items-center text-xs text-white">
                      <span>{planetA.name}: <strong className="text-cyan-300">{planetA.orbitalPeriodDisplay}</strong></span>
                      <span>{planetB.name}: <strong className="text-cyan-300">{planetB.orbitalPeriodDisplay}</strong></span>
                    </div>
                  </div>
                </div>

                {/* 5. Natural Moons & Satellites */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{planetA.name}:</span>
                    <span className="text-cyan-300 font-bold">{planetA.moonsCount} Moons</span>
                    <span className="text-[10px] text-gray-400">
                      ({planetA.moonsList.map(m => m.name).slice(0, 3).join(', ')}{planetA.moonsList.length > 3 ? '...' : ''})
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 font-display">Natural Satellites</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{planetB.name}:</span>
                    <span className="text-cyan-300 font-bold">{planetB.moonsCount} Moons</span>
                    <span className="text-[10px] text-gray-400">
                      ({planetB.moonsList.map(m => m.name).slice(0, 3).join(', ')}{planetB.moonsList.length > 3 ? '...' : ''})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL PLANETS LINEUP VISUAL COMPARISON */}
          {comparisonMode === 'all-planets-lineup' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-display">
                    All 8 Planets System Lineup
                  </h3>
                  <p className="text-xs text-gray-300">
                    Arranged in order of increasing distance from the Sun with relative physical scaling.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-display">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Scale:</span>
                  <button
                    onClick={() => setLineupScaleType('balanced')}
                    className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer font-bold ${
                      lineupScaleType === 'balanced'
                        ? 'bg-cyan-500 text-black shadow-sm'
                        : 'bg-black/40 text-gray-400 hover:text-white'
                    }`}
                  >
                    Balanced
                  </button>
                  <button
                    onClick={() => setLineupScaleType('true-relative')}
                    className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer font-bold ${
                      lineupScaleType === 'true-relative'
                        ? 'bg-cyan-500 text-black shadow-sm'
                        : 'bg-black/40 text-gray-400 hover:text-white'
                    }`}
                  >
                    True Astronomical
                  </button>
                </div>
              </div>

              {/* Horizontal Lineup Visual Display */}
              <div className="p-6 bg-black/70 rounded-2xl border border-cyan-500/20 overflow-x-auto scrollbar-thin">
                <div className="flex items-end justify-between min-w-[750px] gap-4 py-8 px-4 border-b border-gray-800">
                  {lineupPlanets.map((planet) => {
                    // Radius scaling factor
                    const sizePx = lineupScaleType === 'balanced'
                      ? Math.max(18, planet.visualScale * 14)
                      : Math.max(12, Math.min(130, planet.radiusEarthRatio * 11));

                    return (
                      <div key={planet.id} className="flex flex-col items-center gap-2 shrink-0">
                        {/* Planet Sphere */}
                        <div
                          className="rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                          style={{
                            width: `${sizePx}px`,
                            height: `${sizePx}px`,
                            backgroundColor: planet.colorHex,
                            boxShadow: `0 0 20px ${planet.glowColorHex}60`
                          }}
                          title={`${planet.name} (R: ${planet.radiusKm.toLocaleString()} km)`}
                        />

                        <div className="text-center font-mono">
                          <span className="text-xs font-bold text-white block font-display">{planet.name}</span>
                          <span className="text-[10px] text-cyan-300 block">
                            {planet.radiusEarthRatio}x R⊕
                          </span>
                          <span className="text-[9px] text-gray-400 block">
                            {planet.distanceFromSunAU} AU
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lineup Detailed Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                {lineupPlanets.map(planet => (
                  <div key={planet.id} className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5 font-display">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: planet.colorHex }} />
                        {planet.name}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-bold">{planet.symbol}</span>
                    </div>
                    <div className="text-[10px] text-gray-400">Radius: {planet.radiusKm.toLocaleString()} km</div>
                    <div className="text-[10px] text-gray-400">Gravity: {planet.surfaceGravityMs2} m/s² ({planet.gravityEarthRatio}g)</div>
                    <div className="text-[10px] text-gray-400">Moons: {planet.moonsCount}</div>
                    <div className="text-[10px] text-amber-300">Temp: {planet.meanTempC}°C</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

