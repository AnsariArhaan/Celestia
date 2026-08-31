import React, { useState } from 'react';
import { CelestialBody, PlanetId, MoonInfo } from '../../types/solar';
import { InternalCutaway3D } from './InternalCutaway3D';
import { GravitySimulator } from './GravitySimulator';
import { cosmicAudio } from '../../utils/audioSynthesizer';
import {
  Globe2,
  Layers,
  Activity,
  Rocket,
  Volume2,
  Sparkles,
  Thermometer,
  Compass,
  CircleDot,
  Info,
  ChevronRight,
  ChevronLeft,
  Minimize2,
  Maximize2,
  PanelRightClose,
  PanelRightOpen,
  Radar,
  Radio,
  Zap,
  Gauge,
  Orbit,
  Calendar,
  User,
  Scale,
  Atom
} from 'lucide-react';

interface PlanetDetailsPanelProps {
  planet: CelestialBody;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

type DetailTab = 'overview' | 'layers' | 'moons' | 'gravity' | 'missions';

export const PlanetDetailsPanel: React.FC<PlanetDetailsPanelProps> = ({
  planet,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [selectedMoonIndex, setSelectedMoonIndex] = useState<number>(0);

  // Reset selected moon index when planet changes
  React.useEffect(() => {
    setSelectedMoonIndex(0);
  }, [planet.id]);

  const handlePlaySonification = () => {
    cosmicAudio.setMuted(false);
    cosmicAudio.playPlanetSonification(planet.id);
  };

  // If collapsed, show a sleek minimized restore pill
  if (isCollapsed) {
    return (
      <div className="pointer-events-auto flex items-center gap-2 animate-fadeIn">
        <button
          id="expand-telemetry-panel-btn"
          onClick={onToggleCollapse}
          className="group flex items-center gap-2.5 px-3 py-1.5 md:py-2 rounded-xl bg-[#070B14]/90 hover:bg-[#0A1020] backdrop-blur-2xl border border-cyan-500/40 hover:border-cyan-400 text-white shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_15px_rgba(6,182,212,0.2)] transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Open Planetary Telemetry Panel (Press T)"
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-5 h-5 rounded-full border border-cyan-400/50 animate-ping opacity-75" />
            <div
              className="w-3 h-3 rounded-full shrink-0 shadow-md"
              style={{ backgroundColor: planet.colorHex, boxShadow: `0 0 10px ${planet.glowColorHex}` }}
            />
          </div>
          <div className="text-left font-mono">
            <div className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider font-display leading-tight">
              {planet.name}
            </div>
            <div className="text-[8px] text-gray-400 flex items-center gap-1">
              <span>HUD (T)</span>
            </div>
          </div>
          <PanelRightOpen className="w-3.5 h-3.5 text-cyan-400 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div
      id="planet-details-panel"
      className="w-full lg:w-[420px] max-h-[82vh] lg:max-h-[85vh] bg-[#070B14]/90 hover:bg-[#070B14]/98 backdrop-blur-2xl border border-white/10 hover:border-cyan-500/30 rounded-2xl p-4 md:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col gap-3 text-gray-100 overflow-hidden transition-all duration-300 pointer-events-auto opacity-95 hover:opacity-100 animate-fadeIn"
    >
      {/* Target Identification Header */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                TELEMETRY TARGET
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                {planet.type}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white uppercase font-display">
                {planet.name}
              </h2>
              <span className="text-xs font-mono text-gray-400">
                // {planet.latinName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sonification Sound */}
            <button
              id="listen-sonification-btn"
              onClick={handlePlaySonification}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
              title="Listen to synthesized radio frequencies"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Audio</span>
            </button>

            {/* Shift / Collapse Panel to View Full Solar System */}
            {onToggleCollapse && (
              <button
                id="collapse-telemetry-panel-btn"
                onClick={onToggleCollapse}
                className="p-1.5 md:p-2 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-300 transition-all duration-200 cursor-pointer shrink-0"
                title="Collapse telemetry HUD (Press T)"
              >
                <PanelRightClose className="w-4 h-4 text-cyan-400" />
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed font-sans mt-2 line-clamp-2">
          {planet.tagline}
        </p>
      </div>

      {/* Tabs Navigation with Standardized Cyan Accents */}
      <div className="flex border-b border-white/10 pb-1.5 gap-1.5 text-xs font-semibold uppercase tracking-wider overflow-x-auto scrollbar-none font-display">
        <button
          id="tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`px-2.5 py-1 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-gray-200 border border-transparent hover:bg-white/5'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Telemetry</span>
        </button>

        <button
          id="tab-moons"
          onClick={() => setActiveTab('moons')}
          className={`px-2.5 py-1 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'moons'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-gray-200 border border-transparent hover:bg-white/5'
          }`}
        >
          <Orbit className="w-3.5 h-3.5 text-cyan-400" />
          <span>Moons ({planet.moonsCount})</span>
        </button>

        <button
          id="tab-layers"
          onClick={() => setActiveTab('layers')}
          className={`px-2.5 py-1 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'layers'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-gray-200 border border-transparent hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Layers</span>
        </button>

        <button
          id="tab-gravity"
          onClick={() => setActiveTab('gravity')}
          className={`px-2.5 py-1 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'gravity'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-gray-200 border border-transparent hover:bg-white/5'
          }`}
        >
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span>Gravity</span>
        </button>

        <button
          id="tab-missions"
          onClick={() => setActiveTab('missions')}
          className={`px-2.5 py-1 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'missions'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-gray-200 border border-transparent hover:bg-white/5'
          }`}
        >
          <Rocket className="w-3.5 h-3.5 text-cyan-400" />
          <span>Missions</span>
        </button>
      </div>

      {/* Tab Content Box with smooth native scroll */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 text-xs scrollbar-thin">
        {/* 1. OVERVIEW & TELEMETRY - Grouped into 3 Semantic Sections */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {/* Section 1: Physical Dimensions */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider font-mono flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Physical Dimensions</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Radius / Diameter</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {planet.radiusKm.toLocaleString()} km ({planet.radiusEarthRatio}x)
                  </span>
                </div>

                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Surface Gravity</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {planet.surfaceGravityMs2} m/s² ({planet.gravityEarthRatio}g)
                  </span>
                </div>

                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Mass / Density</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {planet.densityGcm3 ? `${planet.densityGcm3} g/cm³` : `${planet.massKg}`}
                  </span>
                </div>

                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Escape Velocity</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {planet.escapeVelocityKmS ? `${planet.escapeVelocityKmS} km/s` : 'Orbital Lock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Orbital Mechanics */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider font-mono flex items-center gap-1.5">
                <Orbit className="w-3.5 h-3.5 text-cyan-400" />
                <span>Orbital Mechanics</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Distance from Sun</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {planet.distanceFromSunAU === 0 ? 'Solar Center' : `${planet.distanceFromSunAU} AU (${planet.distanceFromSunKm}M km)`}
                  </span>
                </div>

                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Orbital Period (Year)</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {planet.orbitalPeriodDisplay}
                  </span>
                </div>

                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Day Length (Spin)</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {planet.rotationPeriodDisplay}
                  </span>
                </div>

                <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[9px] text-gray-400 uppercase font-mono block">Axial Tilt & Incline</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    {planet.axialTiltDeg}° tilt // {planet.orbitalInclinationDeg}° inc
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Atmosphere & Climate */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider font-mono flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Atmosphere & Climate</span>
                </div>
                <span className="text-[10px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  {planet.temperatureDisplay}
                </span>
              </div>

              {/* Gas Composition bar */}
              {planet.atmosphereGases.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden flex">
                    {planet.atmosphereGases.map((gas, idx) => (
                      <div
                        key={idx}
                        className="h-full transition-all"
                        style={{ width: `${gas.percentage}%`, backgroundColor: gas.color }}
                        title={`${gas.name}: ${gas.percentage}%`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 pt-0.5">
                    {planet.atmosphereGases.map((gas, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-[9px] font-mono text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gas.color }} />
                        <span>{gas.name} {gas.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-[10px] font-mono text-gray-400 italic">
                  Vacuum / Exosphere (Minimal trace volatiles)
                </div>
              )}

              <p className="text-[11px] text-gray-300 leading-relaxed pt-0.5">
                {planet.atmosphereDescription}
              </p>
            </div>

            {/* Astrophysical Analysis Note */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <h3 className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5 font-mono">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Astrophysical Summary</span>
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {planet.overview}
              </p>
            </div>

            {/* Key Geological Landmarks */}
            {planet.geologicalFeatures.length > 0 && (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-cyan-400 tracking-wider font-mono">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Geological Landmarks</span>
                </div>
                <div className="space-y-1.5">
                  {planet.geologicalFeatures.map((geo, idx) => (
                    <div key={idx} className="p-2 bg-black/40 rounded-lg border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-200 text-xs">{geo.name}</span>
                        <span className="text-[8px] font-mono text-cyan-300 uppercase bg-cyan-950/80 border border-cyan-500/30 px-1 py-0.5 rounded">
                          {geo.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{geo.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* 2. MOONS & SATELLITES EXPLORER */}
        {activeTab === 'moons' && (
          <div className="space-y-3.5">
            {planet.moonsList && planet.moonsList.length > 0 ? (
              <div className="space-y-3">
                {/* Header info badge */}
                <div className="p-3 bg-cyan-950/40 border border-cyan-500/25 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Orbit className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '14s' }} />
                    <span className="text-xs font-bold text-cyan-200 uppercase font-mono tracking-wider">
                      {planet.name} Satellite System
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                    {planet.moonsCount} Total Moons
                  </span>
                </div>

                {/* Moon Selection Pills / Carousel */}
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
                  {planet.moonsList.map((m, idx) => {
                    const isSelected = idx === selectedMoonIndex;
                    return (
                      <button
                        key={idx}
                        id={`moon-select-btn-${idx}`}
                        onClick={() => setSelectedMoonIndex(idx)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/70 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                            : 'bg-black/40 text-gray-400 hover:text-gray-200 border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: m.color || '#A0AEC0' }}
                        />
                        <span>{m.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Moon Deep Telemetry Card */}
                {(() => {
                  const moon = planet.moonsList[selectedMoonIndex] || planet.moonsList[0];
                  if (!moon) return null;
                  return (
                    <div className="p-4 bg-black/50 border border-cyan-500/30 rounded-2xl space-y-3.5 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
                      {/* Moon Title & Discovery */}
                      <div className="flex items-start justify-between border-b border-gray-800/90 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-5 h-5 rounded-full shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.4)] border border-white/30"
                            style={{ backgroundColor: moon.color || '#A0AEC0' }}
                          />
                          <div>
                            <h4 className="text-base font-extrabold text-white uppercase tracking-tight font-display">
                              {moon.name}
                            </h4>
                            <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-2">
                              <span>Orbital Satellite #{selectedMoonIndex + 1}</span>
                              {moon.discoveryYear && <span>// Discovered {moon.discoveryYear}</span>}
                            </div>
                          </div>
                        </div>

                        {moon.discoverer && (
                          <div className="text-right">
                            <span className="text-[9px] text-gray-400 block uppercase font-mono">Discoverer</span>
                            <span className="text-[10px] font-mono text-gray-200 font-semibold">{moon.discoverer}</span>
                          </div>
                        )}
                      </div>

                      {/* Primary Physical & Orbital Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-gray-400 uppercase font-mono block">Mean Radius</span>
                          <span className="text-xs font-mono font-bold text-white">
                            {moon.radiusKm.toLocaleString()} km
                          </span>
                        </div>

                        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-gray-400 uppercase font-mono block">Orbital Period</span>
                          <span className="text-xs font-mono font-bold text-cyan-300">
                            {moon.orbitalPeriodDays > 0
                              ? `${moon.orbitalPeriodDays} days`
                              : `${Math.abs(moon.orbitalPeriodDays)} days (Retrograde)`}
                          </span>
                        </div>

                        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-gray-400 uppercase font-mono block">Distance</span>
                          <span className="text-xs font-mono font-bold text-white">
                            {moon.distanceKm.toLocaleString()} km
                          </span>
                        </div>

                        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-gray-400 uppercase font-mono block">Surface Gravity</span>
                          <span className="text-xs font-mono font-bold text-cyan-300">
                            {moon.gravityMs2 !== undefined ? `${moon.gravityMs2} m/s²` : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Geological & Surface Classification */}
                      {moon.surfaceType && (
                        <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/20 rounded-xl space-y-1">
                          <div className="text-[10px] uppercase font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                            <Layers className="w-3 h-3 text-cyan-400" />
                            <span>Surface Morphology & Classification</span>
                          </div>
                          <p className="text-[11px] text-gray-200 font-sans leading-relaxed">
                            {moon.surfaceType}
                          </p>
                        </div>
                      )}

                      {/* Chemical & Core Composition */}
                      {moon.composition && (
                        <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                          <div className="text-[10px] uppercase font-bold text-gray-300 font-mono flex items-center gap-1.5">
                            <Atom className="w-3 h-3 text-cyan-400" />
                            <span>Composition & Density ({moon.densityGcm3 ? `${moon.densityGcm3} g/cm³` : 'Icy/Rocky'})</span>
                          </div>
                          <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                            {moon.composition}
                          </p>
                        </div>
                      )}

                      {/* Key Scientific Highlight */}
                      {moon.highlights && (
                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
                          <div className="text-[10px] uppercase font-bold text-amber-300 font-mono flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Astrophysical Highlight</span>
                          </div>
                          <p className="text-[11px] text-amber-100/90 font-sans leading-relaxed">
                            {moon.highlights}
                          </p>
                        </div>
                      )}

                      {/* Narrative Overview */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                          Mission Intelligence Brief
                        </span>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                          {moon.description}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* No Moons Explanatory Card (e.g. Mercury, Venus, Sun) */
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3 text-center">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                  <Orbit className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-display tracking-wider">
                    No Natural Satellites Detected
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    {planet.id === 'mercury'
                      ? 'Mercury is too close to the Sun (0.39 AU); any moon in orbit would experience severe gravitational perturbation from solar tidal forces and be destabilized or stripped away.'
                      : planet.id === 'venus'
                      ? 'Venus has no natural moons. Its slow retrograde rotation and proximity to the Sun caused ancient prospective satellites to either crash into the planet or escape into heliocentric orbit.'
                      : planet.id === 'sun'
                      ? 'The Sun is the gravitational anchor of the entire Solar System; it is orbited directly by planets, asteroids, and comets rather than planetary moons.'
                      : `${planet.name} has no known natural satellites in orbit.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. CORE LAYERS */}
        {activeTab === 'layers' && <InternalCutaway3D planet={planet} />}

        {/* 4. GRAVITY LAB */}
        {activeTab === 'gravity' && <GravitySimulator planet={planet} />}

        {/* 5. EXPLORATION MISSIONS & MOONS */}
        {activeTab === 'missions' && (
          <div className="space-y-3.5">
            {/* Moons Summary */}
            {planet.moonsList.length > 0 && (
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">Natural Satellites</span>
                  <button
                    onClick={() => setActiveTab('moons')}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{planet.moonsCount} TOTAL</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {planet.moonsList.map((moon, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedMoonIndex(idx);
                        setActiveTab('moons');
                      }}
                      className="w-full text-left flex items-start justify-between gap-3 text-xs bg-black/40 hover:bg-cyan-950/40 p-2.5 rounded-lg border border-gray-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: moon.color || '#06B6D4' }}
                        />
                        <span className="font-bold text-gray-200 group-hover:text-cyan-300 transition-colors">{moon.name}</span>
                      </div>
                      <span className="text-gray-400 font-mono text-[10px] flex items-center gap-1">
                        <span>R: {moon.radiusKm} KM // {moon.orbitalPeriodDays > 0 ? `${moon.orbitalPeriodDays}d` : `${Math.abs(moon.orbitalPeriodDays)}d retro`}</span>
                        <ChevronRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Historic Missions Timeline */}
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-300 flex items-center gap-1.5 font-mono">
                <Rocket className="w-3.5 h-3.5 text-cyan-400" />
                <span>Exploration Spacecraft Telemetry</span>
              </h4>
              <div className="space-y-2">
                {planet.explorationMissions.map((mission, idx) => (
                  <div key={idx} className="p-2.5 bg-black/40 rounded-lg border border-gray-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-100">{mission.name}</span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                        {mission.agency} ({mission.year})
                      </span>
                    </div>
                    <p className="text-gray-400 text-[11px]">{mission.description}</p>
                    <p className="text-cyan-400/90 text-[10px] font-mono pt-0.5">
                      ★ Highlight: {mission.highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

