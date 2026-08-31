import React, { useState, useEffect } from 'react';
import { CelestialBody, PlanetId, ViewMode, SolarSystemSettings, GraphicsQuality } from '../../types/solar';
import {
  Compass,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Radio,
  Sparkles,
  Sliders,
  Layers,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface NavigationHUDProps {
  planets: CelestialBody[];
  activePlanetId: PlanetId;
  viewMode: ViewMode;
  settings: SolarSystemSettings;
  isPanelCollapsed: boolean;
  onTogglePanel: () => void;
  onSelectPlanet: (id: PlanetId) => void;
  onChangeViewMode: (mode: ViewMode) => void;
  onUpdateSettings: (newSettings: Partial<SolarSystemSettings>) => void;
  showAtmosphere: boolean;
  onToggleAtmosphere: () => void;
  showMoons: boolean;
  onToggleMoons: () => void;
}

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  planets,
  activePlanetId,
  viewMode,
  settings,
  isPanelCollapsed,
  onTogglePanel,
  onSelectPlanet,
  onChangeViewMode,
  onUpdateSettings,
  showAtmosphere,
  onToggleAtmosphere,
  showMoons,
  onToggleMoons
}) => {
  const currentIdx = planets.findIndex(p => p.id === activePlanetId);
  const activePlanet = planets[currentIdx] || planets[0];
  const [utcTime, setUtcTime] = useState<string>('');
  const [isGraphicsMenuOpen, setIsGraphicsMenuOpen] = useState(false);
  const [isLayersMenuOpen, setIsLayersMenuOpen] = useState(false);
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(false);
  const [isTopCollapsed, setIsTopCollapsed] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const iso = d.toISOString();
      // Format: HH:MM:SS.s UTC
      const timeStr = iso.substring(11, 19);
      setUtcTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevPlanet = () => {
    if (currentIdx > 0) {
      onSelectPlanet(planets[currentIdx - 1].id);
    }
  };

  const handleNextPlanet = () => {
    if (currentIdx < planets.length - 1) {
      onSelectPlanet(planets[currentIdx + 1].id);
    }
  };

  const handleQualityChange = (preset: GraphicsQuality) => {
    if (preset === 'ultra') {
      onUpdateSettings({
        graphicsQuality: 'ultra',
        ultraHD4K: true,
        showShadows: true,
        showAtmosphereGlow: true,
        showNightLights: true,
        bloomEnabled: true,
        motionBlurEnabled: true
      });
    } else if (preset === 'balanced') {
      onUpdateSettings({
        graphicsQuality: 'balanced',
        ultraHD4K: false,
        showShadows: true,
        showAtmosphereGlow: true,
        showNightLights: true,
        bloomEnabled: false,
        motionBlurEnabled: false
      });
    } else {
      onUpdateSettings({
        graphicsQuality: 'performance',
        ultraHD4K: false,
        showShadows: false,
        showAtmosphereGlow: false,
        showNightLights: false,
        bloomEnabled: false,
        motionBlurEnabled: false
      });
    }
  };

  return (
    <div id="navigation-hud-root" className="pointer-events-none w-full h-full flex flex-col justify-between p-2 md:p-3.5 pb-2">
      {/* Top Header Bar with Integrated Speed Controls, Layer Toggles, and Fold/Expand capability */}
      {isTopCollapsed ? (
        /* Folded Top Bar: Compact Sleek Pill retaining the Website Name & Quick Controls */
        <header
          id="top-header-collapsed"
          className="pointer-events-auto flex items-center justify-between gap-3 bg-[#070B14]/90 hover:bg-[#070B14]/95 backdrop-blur-xl border border-white/15 hover:border-cyan-500/40 px-3.5 py-1.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] z-50 transition-all duration-300 w-auto self-center max-w-full"
        >
          {/* Brand & Mission title always visible */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setIsTopCollapsed(false)}
            title="Click to expand full navigation header"
          >
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-400/40">
              <Radio className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs md:text-sm font-extrabold tracking-tight text-white flex items-center gap-1 font-display">
                CELESTIA <span className="text-cyan-400 font-light tracking-widest text-[10px]">LABS</span>
              </h1>
              <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                200% UHD
              </span>
            </div>
          </div>

          <div className="h-3.5 w-px bg-white/15 mx-1" />

          {/* View mode indicator */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-gray-300">
            <span className="text-gray-500 uppercase text-[9px]">Mode:</span>
            <span className="text-cyan-400 font-bold uppercase">{viewMode}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle */}
            <button
              id="collapsed-audio-btn"
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'
              }`}
              title={settings.soundEnabled ? 'Mute Sonification' : 'Enable Space Sonification'}
            >
              {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Play / Pause Toggle */}
            <button
              id="collapsed-pause-btn"
              onClick={() => onUpdateSettings({ isPaused: !settings.isPaused })}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all duration-200 cursor-pointer"
              title={settings.isPaused ? 'Resume Orbit Simulation' : 'Pause Orbit Simulation'}
            >
              {settings.isPaused ? <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" /> : <Pause className="w-3.5 h-3.5 text-cyan-400" />}
            </button>

            {/* Expand Header Button */}
            <button
              id="expand-top-header-btn"
              onClick={() => setIsTopCollapsed(false)}
              className="flex items-center gap-1 text-[10px] uppercase font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-1 rounded-lg border border-cyan-500/30 cursor-pointer transition-colors ml-1"
              title="Expand top navigation bar"
            >
              <ChevronDown className="w-3 h-3 text-cyan-300" />
              <span>Expand</span>
            </button>
          </div>
        </header>
      ) : (
        /* Full Expanded Top Header Bar */
        <header
          id="top-header-expanded"
          className="pointer-events-auto flex items-center justify-between gap-2 md:gap-3 bg-[#070B14]/85 hover:bg-[#070B14]/95 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 px-3 md:px-5 py-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] z-50 transition-all duration-300 opacity-95 hover:opacity-100"
        >
          {/* Brand & Mission title */}
          <div className="flex items-center gap-2.5 md:gap-3 shrink-0">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Radio className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 font-display">
                  CELESTIA <span className="text-cyan-400 font-light tracking-widest text-[11px] md:text-xs">LABS</span>
                </h1>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hidden sm:inline-block font-bold">
                  200% UHD
                </span>
              </div>
              <p className="text-[9px] md:text-[10px] font-mono text-gray-400 uppercase tracking-widest hidden sm:block">
                Solar System Telemetry & Astrophysics
              </p>
            </div>
          </div>

          {/* View Mode Navigation Tabs & Integrated Speed Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <nav className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold font-display">
              <button
                id="mode-btn-journey"
                onClick={() => onChangeViewMode('journey')}
                className={`relative px-2.5 md:px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer uppercase tracking-wider flex items-center gap-1.5 ${
                  viewMode === 'journey'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                    : 'text-gray-300 hover:text-white border border-transparent hover:bg-white/5'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Journey</span>
              </button>

              <button
                id="mode-btn-orrery"
                onClick={() => onChangeViewMode('orrery')}
                className={`relative px-2.5 md:px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer uppercase tracking-wider flex items-center gap-1.5 ${
                  viewMode === 'orrery'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                    : 'text-gray-300 hover:text-white border border-transparent hover:bg-white/5'
                }`}
              >
                <CircleDot className="w-3.5 h-3.5 text-cyan-400" />
                <span>Orrery</span>
              </button>
            </nav>

            {/* Integrated Orbit Speed Controls */}
            <div className="hidden sm:flex items-center bg-black/50 px-2 py-1 rounded-xl border border-white/10 text-xs font-mono gap-1">
              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mr-0.5">Speed:</span>
              {[1, 5, 20, 100].map((s) => (
                <button
                  key={s}
                  id={`header-speed-${s}x-btn`}
                  onClick={() => onUpdateSettings({ orbitSpeedMultiplier: s, isPaused: false })}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                    settings.orbitSpeedMultiplier === s && !settings.isPaused
                      ? 'bg-cyan-500 text-black font-bold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={`Simulate at ${s}x orbital speed`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Quick Layer Toggles Dropdown in Header */}
            <div className="relative hidden md:block">
              <button
                id="toggle-layers-dropdown-btn"
                onClick={() => setIsLayersMenuOpen(!isLayersMenuOpen)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isLayersMenuOpen
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                }`}
                title="Toggle Orbital Lines, Moons, Atmosphere & Asteroids"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-[11px] hidden xl:inline">Layers</span>
              </button>

              {isLayersMenuOpen && (
                <div
                  id="layers-dropdown-menu"
                  className="absolute left-0 top-full mt-2 w-48 bg-[#070B14]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-[0_16px_40px_rgba(0,0,0,0.9)] z-50 flex flex-col gap-2 text-xs font-mono"
                >
                  <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider pb-1 border-b border-white/10">
                    Visible Layers
                  </div>

                  <label className="flex items-center justify-between cursor-pointer hover:text-white text-gray-300 py-0.5">
                    <span>Orbits</span>
                    <input
                      type="checkbox"
                      checked={settings.showOrbits}
                      onChange={(e) => onUpdateSettings({ showOrbits: e.target.checked })}
                      className="accent-cyan-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer hover:text-white text-gray-300 py-0.5">
                    <span>Moons</span>
                    <input
                      type="checkbox"
                      checked={showMoons}
                      onChange={onToggleMoons}
                      className="accent-cyan-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer hover:text-white text-gray-300 py-0.5">
                    <span>Atmosphere</span>
                    <input
                      type="checkbox"
                      checked={showAtmosphere}
                      onChange={onToggleAtmosphere}
                      className="accent-cyan-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer hover:text-white text-gray-300 py-0.5">
                    <span>Asteroids</span>
                    <input
                      type="checkbox"
                      checked={settings.showAsteroidBelt}
                      onChange={(e) => onUpdateSettings({ showAsteroidBelt: e.target.checked })}
                      className="accent-cyan-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Right Status Badge & Controls */}
          <div className="flex items-center gap-1.5 md:gap-2 relative shrink-0">
            {/* Shift / Collapse Telemetry Tab Button */}
            <button
              id="hud-toggle-telemetry-btn"
              onClick={onTogglePanel}
              className={`px-2.5 md:px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                !isPanelCollapsed
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
              title={isPanelCollapsed ? 'Show Telemetry Panel (Press T)' : 'Hide Telemetry Panel (Press T)'}
            >
              {isPanelCollapsed ? <PanelRightOpen className="w-3.5 h-3.5 text-cyan-400" /> : <PanelRightClose className="w-3.5 h-3.5 text-cyan-400" />}
              <span className="font-bold hidden lg:inline">{isPanelCollapsed ? 'Show Info' : 'Hide Info'}</span>
            </button>

            {/* 4K UHD Quality Settings Dropdown Trigger */}
            <div className="relative">
              <button
                id="toggle-4k-settings-btn"
                onClick={() => setIsGraphicsMenuOpen(!isGraphicsMenuOpen)}
                className="px-2.5 md:px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-300 text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/25"
                title="Configure 4K Graphics & Physical Shaders"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold hidden sm:inline">200% UHD</span>
                <Sliders className="w-3 h-3 text-amber-300" />
              </button>

              {/* Graphics Popover Menu */}
              {isGraphicsMenuOpen && (
                <div
                  id="graphics-settings-popover"
                  className="absolute right-0 top-full mt-2 w-72 bg-[#070B14]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.9)] z-50 flex flex-col gap-3 text-xs font-mono"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Graphics Engine (200%)
                    </span>
                    <span className="text-[10px] text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                      WebGL2 PBR
                    </span>
                  </div>

                  {/* Quality Presets Selector */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Quality Preset</span>
                    <div className="grid grid-cols-3 gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                      {(['performance', 'balanced', 'ultra'] as GraphicsQuality[]).map((q) => (
                        <button
                          key={q}
                          id={`quality-preset-btn-${q}`}
                          onClick={() => handleQualityChange(q)}
                          className={`py-1 rounded-lg text-[10px] uppercase font-bold transition-all duration-200 cursor-pointer ${
                            settings.graphicsQuality === q
                              ? 'bg-cyan-500 text-black font-bold shadow-sm'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {q === 'performance' ? 'Perf' : q === 'balanced' ? 'Balanced' : 'Ultra 4K'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-white/10">
                    <label className="flex items-center justify-between cursor-pointer hover:text-white text-gray-300">
                      <span>4K Procedural Textures</span>
                      <input
                        type="checkbox"
                        checked={settings.ultraHD4K}
                        onChange={(e) => onUpdateSettings({ ultraHD4K: e.target.checked })}
                        className="accent-cyan-500 rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer hover:text-white text-gray-300">
                      <span>Real Dynamic Shadows</span>
                      <input
                        type="checkbox"
                        checked={settings.showShadows}
                        onChange={(e) => onUpdateSettings({ showShadows: e.target.checked })}
                        className="accent-cyan-500 rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer hover:text-white text-gray-300">
                      <span>Atmospheric Fresnel Glow</span>
                      <input
                        type="checkbox"
                        checked={settings.showAtmosphereGlow}
                        onChange={(e) => onUpdateSettings({ showAtmosphereGlow: e.target.checked })}
                        className="accent-cyan-500 rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer hover:text-white text-gray-300">
                      <span>Earth Night City Lights</span>
                      <input
                        type="checkbox"
                        checked={settings.showNightLights}
                        onChange={(e) => onUpdateSettings({ showNightLights: e.target.checked })}
                        className="accent-cyan-500 rounded cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Live Telemetry UTC Pill with 1s Pulse */}
            <div className="hidden 2xl:flex items-center gap-2 text-xs font-mono bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 text-gray-300">
              <span className="text-cyan-400 flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                LIVE
              </span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-300 font-medium">UTC {utcTime || '00:00:00'}</span>
            </div>

            {/* Audio toggle */}
            <button
              id="toggle-audio-btn"
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`p-1.5 md:p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'
              }`}
              title={settings.soundEnabled ? 'Mute Sonification' : 'Enable Space Sonification'}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>

            {/* Pause / Play */}
            <button
              id="toggle-pause-btn"
              onClick={() => onUpdateSettings({ isPaused: !settings.isPaused })}
              className="p-1.5 md:p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all duration-200 cursor-pointer"
              title={settings.isPaused ? 'Resume Orbit Simulation' : 'Pause Orbit Simulation'}
            >
              {settings.isPaused ? <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" /> : <Pause className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Top Bar Fold / Collapse Button */}
            <button
              id="fold-top-header-btn"
              onClick={() => setIsTopCollapsed(true)}
              className="p-1.5 md:p-2 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-300 transition-all duration-200 cursor-pointer"
              title="Fold top bar (website title remains visible)"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Bottom Inside-Out Collapsible Planetary Info & Navigation Bar */}
      <div className="pointer-events-auto self-center max-w-full z-40 transition-all duration-300">
        {isBottomCollapsed ? (
          /* Sleek Collapsed Inside-Out Pill */
          <div
            id="bottom-bar-collapsed-pill"
            className="flex items-center gap-2 bg-[#070B14]/90 hover:bg-[#070B14]/95 backdrop-blur-xl border border-white/15 hover:border-cyan-500/40 px-3 py-1.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] text-xs font-mono text-gray-200"
          >
            <button
              id="collapsed-prev-planet-btn"
              onClick={handlePrevPlanet}
              disabled={currentIdx === 0}
              className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Previous Planet"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 px-1 cursor-pointer" onClick={() => setIsBottomCollapsed(false)}>
              <span
                className="w-3 h-3 rounded-full border-2 border-white/40 shadow-sm shrink-0"
                style={{
                  backgroundColor: activePlanet.colorHex,
                  boxShadow: `0 0 14px ${activePlanet.glowColorHex}, inset 0 0 4px rgba(255,255,255,0.6)`
                }}
              />
              <span className="font-bold text-cyan-300 uppercase tracking-wider font-display drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                {activePlanet.name}
              </span>
              <span className="text-[10px] text-gray-300 font-mono">
                ({currentIdx + 1}/{planets.length})
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                {activePlanet.distanceFromSunAU === 0 ? 'Star' : `${activePlanet.distanceFromSunAU} AU`}
              </span>
            </div>

            <button
              id="collapsed-next-planet-btn"
              onClick={handleNextPlanet}
              disabled={currentIdx === planets.length - 1}
              className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Next Planet"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="h-3 w-px bg-white/15 mx-0.5" />

            <button
              id="expand-bottom-bar-btn"
              onClick={() => setIsBottomCollapsed(false)}
              className="flex items-center gap-1 text-[10px] uppercase font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-1 rounded-lg border border-cyan-500/30 cursor-pointer transition-colors"
            >
              <span>▴ Expand Bar</span>
            </button>
          </div>
        ) : (
          /* Full Expanded Planetary Slide / Timeline Navigator */
          <footer
            id="bottom-bar-expanded"
            className="flex flex-col gap-1.5 bg-[#070B14]/90 hover:bg-[#070B14]/95 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 p-2 md:px-4 md:py-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-all duration-300 w-full max-w-5xl"
          >
            <div className="flex items-center justify-between gap-2 md:gap-3">
              {/* Previous Planet Button */}
              <button
                id="prev-planet-btn"
                onClick={handlePrevPlanet}
                disabled={currentIdx === 0}
                className={`p-1.5 md:p-2 rounded-xl border transition-all duration-200 flex items-center gap-1 text-xs font-mono uppercase tracking-wider cursor-pointer shrink-0 ${
                  currentIdx > 0
                    ? 'bg-white/5 hover:bg-cyan-500/10 border-white/10 hover:border-cyan-500/30 text-gray-200 active:scale-95'
                    : 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Planetary Carousel Thumbnails */}
              <div className="flex-1 flex items-center gap-1 md:gap-1.5 overflow-x-auto scrollbar-none py-0.5 px-1 justify-start md:justify-center">
                {planets.map((planet) => {
                  const isActive = planet.id === activePlanetId;
                  return (
                    <button
                      key={planet.id}
                      id={`timeline-planet-${planet.id}`}
                      onClick={() => onSelectPlanet(planet.id)}
                      className={`group relative flex items-center gap-1.5 px-2 md:px-2.5 py-1 md:py-1.5 rounded-xl border transition-all duration-200 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/25 border-cyan-300 text-white shadow-[0_0_20px_rgba(6,182,212,0.45)]'
                          : 'bg-white/5 border-white/15 hover:border-cyan-400/50 hover:bg-white/10 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/50 shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{
                          backgroundColor: planet.colorHex,
                          boxShadow: isActive ? `0 0 12px ${planet.glowColorHex}, inset 0 0 4px rgba(255,255,255,0.7)` : `0 0 6px ${planet.glowColorHex}`
                        }}
                      />
                      <span className={`text-xs font-semibold uppercase tracking-wider font-display ${isActive ? 'text-cyan-200 font-bold drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]' : 'text-gray-200'}`}>
                        {planet.name}
                      </span>
                      <span className="text-[9px] font-mono text-cyan-400/90 font-semibold hidden xl:inline">
                        {planet.distanceFromSunAU === 0 ? 'Star' : `${planet.distanceFromSunAU} AU`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Next Planet Button */}
              <button
                id="next-planet-btn"
                onClick={handleNextPlanet}
                disabled={currentIdx === planets.length - 1}
                className={`p-1.5 md:p-2 rounded-xl border transition-all duration-200 flex items-center gap-1 text-xs font-mono uppercase tracking-wider cursor-pointer shrink-0 ${
                  currentIdx < planets.length - 1
                    ? 'bg-white/5 hover:bg-cyan-500/10 border-white/10 hover:border-cyan-500/30 text-gray-200 active:scale-95'
                    : 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed opacity-40'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Inside-Out Minimize / Collapse Button */}
              <button
                id="collapse-bottom-bar-btn"
                onClick={() => setIsBottomCollapsed(true)}
                className="p-1.5 md:p-2 rounded-xl border border-white/10 hover:border-cyan-500/40 bg-white/5 hover:bg-cyan-500/15 text-gray-400 hover:text-cyan-300 text-xs font-mono transition-all duration-200 cursor-pointer shrink-0"
                title="Collapse bottom bar into compact inside-out HUD pill"
              >
                <span className="hidden sm:inline text-[10px] font-bold uppercase mr-1">▾ Fold</span>
                <Maximize2 className="w-3.5 h-3.5 inline rotate-45" />
              </button>
            </div>

            {/* Keyboard and navigation tracker */}
            <div className="flex items-center justify-between text-[9px] md:text-[10px] font-mono text-gray-400 pt-1 border-t border-white/10">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Shortcuts: <kbd className="px-1.5 py-0.2 bg-black/60 rounded border border-white/10 text-cyan-300">←</kbd><kbd className="px-1.5 py-0.2 bg-black/60 rounded border border-white/10 text-cyan-300">→</kbd> Body <span className="text-gray-600">|</span> <kbd className="px-1.5 py-0.2 bg-black/60 rounded border border-white/10 text-cyan-300">↑</kbd><kbd className="px-1.5 py-0.2 bg-black/60 rounded border border-white/10 text-cyan-300">↓</kbd> / <kbd className="px-1.5 py-0.2 bg-black/60 rounded border border-white/10 text-cyan-300">W</kbd><kbd className="px-1.5 py-0.2 bg-black/60 rounded border border-white/10 text-cyan-300">S</kbd> Zoom <span className="text-gray-600">|</span> <kbd className="px-1.5 py-0.2 bg-black/60 rounded border border-white/10 text-cyan-300">T</kbd> Info
              </span>
              <span className="text-cyan-400 font-bold tracking-wider uppercase">
                TARGET {currentIdx + 1} OF {planets.length} // {activePlanet.name}
              </span>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

