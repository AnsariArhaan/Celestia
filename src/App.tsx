/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CELESTIAL_BODIES } from './data/planetsData';
import { PlanetId, ViewMode, SolarSystemSettings } from './types/solar';
import { SolarSystem3D } from './components/solar/SolarSystem3D';
import { PlanetDetailsPanel } from './components/solar/PlanetDetailsPanel';
import { NavigationHUD } from './components/solar/NavigationHUD';
import { cosmicAudio } from './utils/audioSynthesizer';

export default function App() {
  const [activePlanetId, setActivePlanetId] = useState<PlanetId>('earth');
  const [viewMode, setViewMode] = useState<ViewMode>('journey');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [showMoons, setShowMoons] = useState(true);

  const [settings, setSettings] = useState<SolarSystemSettings>({
    orbitSpeedMultiplier: 1,
    isPaused: false,
    showOrbits: true,
    showLabels: true,
    showAsteroidBelt: true,
    realisticDistanceScale: false,
    realisticSizeScale: false,
    soundEnabled: false,
    soundVolume: 0.35,
    cinematicCamera: true,
    ultraHD4K: true,
    graphicsQuality: 'ultra',
    bloomEnabled: true,
    motionBlurEnabled: true,
    showAtmosphereGlow: true,
    showNightLights: true,
    showShadows: true,
    cameraFov: 45
  });

  // Active planet object
  const activePlanet = CELESTIAL_BODIES.find(p => p.id === activePlanetId) || CELESTIAL_BODIES[3];
  const activeIndex = CELESTIAL_BODIES.findIndex(p => p.id === activePlanetId);

  // Switch planet with optional chime and sonification
  const handleSelectPlanet = useCallback((id: PlanetId) => {
    setActivePlanetId(id);
    cosmicAudio.playTransitionChime();
    if (settings.soundEnabled) {
      cosmicAudio.playPlanetSonification(id);
    }
  }, [settings.soundEnabled]);

  // Keyboard navigation & Shortcuts (No wheel hijacking!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ']' || e.key.toLowerCase() === 'n') {
        if (activeIndex < CELESTIAL_BODIES.length - 1) {
          e.preventDefault();
          handleSelectPlanet(CELESTIAL_BODIES[activeIndex + 1].id);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === '[' || e.key.toLowerCase() === 'p') {
        if (activeIndex > 0) {
          e.preventDefault();
          handleSelectPlanet(CELESTIAL_BODIES[activeIndex - 1].id);
        }
      } else if (e.key.toLowerCase() === 't' || e.key.toLowerCase() === 'h') {
        // Toggle Telemetry Panel visibility
        e.preventDefault();
        setIsPanelCollapsed(c => !c);
      } else if (e.key === ' ') {
        e.preventDefault();
        setSettings(s => ({ ...s, isPaused: !s.isPaused }));
      } else if (e.key.toLowerCase() === 'm') {
        setSettings(s => {
          const nextSound = !s.soundEnabled;
          cosmicAudio.setMuted(!nextSound);
          return { ...s, soundEnabled: nextSound };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handleSelectPlanet]);

  // Sync audio mute state when setting toggles
  const handleUpdateSettings = (newSettings: Partial<SolarSystemSettings>) => {
    if (newSettings.soundEnabled !== undefined) {
      cosmicAudio.setMuted(!newSettings.soundEnabled);
      if (newSettings.soundEnabled) {
        cosmicAudio.playPlanetSonification(activePlanetId);
      }
    }
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div id="solar-system-app-root" className="relative w-screen h-screen bg-[#000000] text-gray-100 overflow-hidden font-sans select-none">
      {/* 1. Full-Screen Interactive Three.js 3D Canvas */}
      <div className="absolute inset-0 z-0 bg-[#000000]">
        <SolarSystem3D
          planets={CELESTIAL_BODIES}
          activePlanetId={activePlanetId}
          viewMode={viewMode}
          settings={settings}
          onSelectPlanet={handleSelectPlanet}
          showAtmosphere={showAtmosphere}
          showMoons={showMoons}
        />
      </div>

      {/* 2. Top and Bottom Heads-Up Display (HUD) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
        <NavigationHUD
          planets={CELESTIAL_BODIES}
          activePlanetId={activePlanetId}
          viewMode={viewMode}
          settings={settings}
          isPanelCollapsed={isPanelCollapsed}
          onTogglePanel={() => setIsPanelCollapsed(c => !c)}
          onSelectPlanet={handleSelectPlanet}
          onChangeViewMode={setViewMode}
          onUpdateSettings={handleUpdateSettings}
          showAtmosphere={showAtmosphere}
          onToggleAtmosphere={() => setShowAtmosphere(a => !a)}
          showMoons={showMoons}
          onToggleMoons={() => setShowMoons(m => !m)}
        />
      </div>

      {/* 3. Floating Planetary Details Panel (Shifted comfortably lower to avoid header overlap) */}
      <div className={`absolute right-2 md:right-4 z-20 pointer-events-none flex justify-end ${
        isPanelCollapsed 
          ? 'top-20 md:top-24' 
          : 'top-20 md:top-24 bottom-14 md:bottom-16 items-stretch md:items-center'
      }`}>
        <PlanetDetailsPanel
          key={activePlanet.id}
          planet={activePlanet}
          isCollapsed={isPanelCollapsed}
          onToggleCollapse={() => setIsPanelCollapsed(c => !c)}
        />
      </div>
    </div>
  );
}
