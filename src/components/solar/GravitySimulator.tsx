import React, { useState, useEffect, useRef } from 'react';
import { CelestialBody } from '../../types/solar';
import { Play, RotateCcw, Activity, ArrowDown, Gauge } from 'lucide-react';

interface GravitySimulatorProps {
  planet: CelestialBody;
}

interface TestObject {
  id: string;
  name: string;
  emoji: string;
  massKg: number;
}

const TEST_OBJECTS: TestObject[] = [
  { id: 'apple', name: 'Newton’s Apple', emoji: '🍎', massKg: 0.15 },
  { id: 'rover', name: 'Curiosity Rover', emoji: '🤖', massKg: 899 },
  { id: 'astronaut', name: 'Astronaut in Spacesuit', emoji: '👨‍🚀', massKg: 130 },
  { id: 'rock', name: 'Meteorite Fragment', emoji: '🪨', massKg: 12 },
  { id: 'feather', name: 'Titanium Feather', emoji: '🪶', massKg: 0.005 }
];

export const GravitySimulator: React.FC<GravitySimulatorProps> = ({ planet }) => {
  const [selectedObject, setSelectedObject] = useState<TestObject>(TEST_OBJECTS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dropHeightMeters, setDropHeightMeters] = useState<number>(100);

  // Simulation physics state (height from 0 to dropHeightMeters)
  const [planetY, setPlanetY] = useState<number>(100);
  const [earthY, setEarthY] = useState<number>(100);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [planetLanded, setPlanetLanded] = useState(false);
  const [earthLanded, setEarthLanded] = useState(false);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Falling physics: h(t) = H - 0.5 * g * t^2
  const gPlanet = planet.surfaceGravityMs2;
  const gEarth = 9.807;

  // Theoretical fall times
  const tFallPlanet = Math.sqrt((2 * dropHeightMeters) / gPlanet);
  const tFallEarth = Math.sqrt((2 * dropHeightMeters) / gEarth);

  const resetSim = () => {
    setIsPlaying(false);
    setPlanetY(dropHeightMeters);
    setEarthY(dropHeightMeters);
    setElapsedSec(0);
    setPlanetLanded(false);
    setEarthLanded(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const startSim = () => {
    resetSim();
    setIsPlaying(true);
    startTimeRef.current = performance.now();
  };

  useEffect(() => {
    if (!isPlaying) return;

    const tick = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const t = (now - startTimeRef.current) / 1000;
      setElapsedSec(t);

      // Planet drop
      const newPlanetY = Math.max(0, dropHeightMeters - 0.5 * gPlanet * t * t);
      setPlanetY(newPlanetY);
      if (newPlanetY <= 0) setPlanetLanded(true);

      // Earth drop
      const newEarthY = Math.max(0, dropHeightMeters - 0.5 * gEarth * t * t);
      setEarthY(newEarthY);
      if (newEarthY <= 0) setEarthLanded(true);

      if (newPlanetY > 0 || newEarthY > 0) {
        requestRef.current = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
      }
    };

    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, dropHeightMeters, gPlanet]);

  // Visual percentages for drop chamber
  const planetPercent = (planetY / dropHeightMeters) * 100;
  const earthPercent = (earthY / dropHeightMeters) * 100;

  // Real-time impact velocity: v = g * t
  const currentPlanetV = Math.min(gPlanet * elapsedSec, Math.sqrt(2 * gPlanet * dropHeightMeters));
  const currentEarthV = Math.min(gEarth * elapsedSec, Math.sqrt(2 * gEarth * dropHeightMeters));

  return (
    <div id="gravity-simulator-box" className="flex flex-col gap-4 text-gray-100 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold tracking-wider uppercase text-cyan-300 font-display">
            Gravitational Acceleration Drop Chamber
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="start-gravity-drop-btn"
            onClick={startSim}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all active:scale-95 cursor-pointer font-display"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Drop Payload</span>
          </button>
          <button
            id="reset-gravity-drop-btn"
            onClick={resetSim}
            className="p-2 bg-white/5 hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-300 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Test Object & Height Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-black/50 p-3.5 rounded-2xl border border-cyan-500/20">
        <div>
          <label className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1.5">
            Test Payload:
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {TEST_OBJECTS.map((obj) => (
              <button
                key={obj.id}
                onClick={() => {
                  setSelectedObject(obj);
                  resetSim();
                }}
                className={`px-2.5 py-1 text-xs rounded-xl border transition-all cursor-pointer ${
                  selectedObject.id === obj.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-gray-700'
                }`}
              >
                {obj.emoji} {obj.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5 text-[10px] font-mono text-gray-400 uppercase">
            <span>Drop Altitude:</span>
            <span className="text-cyan-300 font-bold">{dropHeightMeters}m</span>
          </div>
          <input
            id="drop-altitude-slider"
            type="range"
            min="20"
            max="250"
            step="10"
            value={dropHeightMeters}
            onChange={(e) => {
              setDropHeightMeters(Number(e.target.value));
              resetSim();
            }}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
          />
        </div>
      </div>

      {/* Side-by-Side Drop Towers Simulation */}
      <div className="grid grid-cols-2 gap-3">
        {/* Planet Chamber */}
        <div className="flex flex-col bg-[#05070A] rounded-2xl border border-cyan-500/40 p-3.5 relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-800">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-display">{planet.name}</span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
              g = {gPlanet.toFixed(2)} m/s²
            </span>
          </div>

          <div className="relative h-44 bg-black/70 rounded-xl border border-gray-800 flex justify-center overflow-hidden">
            {/* Height meter ticks */}
            <div className="absolute right-2 inset-y-2 flex flex-col justify-between text-[9px] font-mono text-gray-500">
              <span>{dropHeightMeters}m</span>
              <span>{Math.round(dropHeightMeters / 2)}m</span>
              <span>0m</span>
            </div>

            {/* Falling Object */}
            <div
              className="absolute transition-transform duration-75"
              style={{
                top: `${100 - planetPercent}%`,
                transform: 'translateY(-100%)',
                fontSize: '28px'
              }}
            >
              {selectedObject.emoji}
            </div>

            {/* Ground */}
            <div className="absolute bottom-0 inset-x-0 h-2 bg-cyan-500/40 border-t border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          </div>

          {/* Real-time stats */}
          <div className="mt-2.5 grid grid-cols-2 gap-1 text-[10px] font-mono text-gray-400">
            <div>
              <span>Fall Time: </span>
              <span className="text-cyan-300 font-bold">
                {planetLanded ? `${tFallPlanet.toFixed(2)}s` : `${elapsedSec.toFixed(2)}s`}
              </span>
            </div>
            <div>
              <span>Velocity: </span>
              <span className="text-cyan-300 font-bold">
                {(currentPlanetV * 3.6).toFixed(1)} km/h
              </span>
            </div>
          </div>
        </div>

        {/* Earth Reference Chamber */}
        <div className="flex flex-col bg-[#05070A] rounded-2xl border border-gray-800 p-3.5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-800">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider font-display">Earth (Standard)</span>
            <span className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
              g = 9.81 m/s²
            </span>
          </div>

          <div className="relative h-44 bg-black/70 rounded-xl border border-gray-800 flex justify-center overflow-hidden">
            {/* Height meter ticks */}
            <div className="absolute right-2 inset-y-2 flex flex-col justify-between text-[9px] font-mono text-gray-500">
              <span>{dropHeightMeters}m</span>
              <span>{Math.round(dropHeightMeters / 2)}m</span>
              <span>0m</span>
            </div>

            {/* Falling Object */}
            <div
              className="absolute transition-transform duration-75"
              style={{
                top: `${100 - earthPercent}%`,
                transform: 'translateY(-100%)',
                fontSize: '28px'
              }}
            >
              {selectedObject.emoji}
            </div>

            {/* Ground */}
            <div className="absolute bottom-0 inset-x-0 h-2 bg-gray-600 border-t border-gray-400" />
          </div>

          {/* Real-time stats */}
          <div className="mt-2.5 grid grid-cols-2 gap-1 text-[10px] font-mono text-gray-400">
            <div>
              <span>Fall Time: </span>
              <span className="text-white font-bold">
                {earthLanded ? `${tFallEarth.toFixed(2)}s` : `${elapsedSec.toFixed(2)}s`}
              </span>
            </div>
            <div>
              <span>Velocity: </span>
              <span className="text-white font-bold">
                {(currentEarthV * 3.6).toFixed(1)} km/h
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Physics Takeaway */}
      <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-xs text-gray-300 flex items-center gap-2">
        <ArrowDown className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="text-[11px]">
          A 70kg human would weigh approximately{' '}
          <strong className="text-cyan-300">
            {Math.round(70 * planet.gravityEarthRatio)} kg ({Math.round(70 * planet.surfaceGravityMs2)} N)
          </strong>{' '}
          on {planet.name}, which is {planet.gravityEarthRatio > 1 ? `${planet.gravityEarthRatio.toFixed(2)}x heavier` : `${(1 / (planet.gravityEarthRatio || 0.001)).toFixed(1)}x lighter`} than on Earth.
        </span>
      </div>
    </div>
  );
};


