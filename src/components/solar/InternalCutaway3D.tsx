import React, { useState } from 'react';
import { CelestialBody, InternalLayer } from '../../types/solar';
import { Layers, Sparkles } from 'lucide-react';

interface InternalCutaway3DProps {
  planet: CelestialBody;
}

export const InternalCutaway3D: React.FC<InternalCutaway3DProps> = ({ planet }) => {
  const [selectedLayer, setSelectedLayer] = useState<InternalLayer>(
    planet.internalLayers[planet.internalLayers.length - 1] || planet.internalLayers[0]
  );
  const [explosionOffset, setExplosionOffset] = useState<number>(20);

  return (
    <div id="internal-cutaway-container" className="flex flex-col gap-4 text-gray-100 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold tracking-wider uppercase text-cyan-300 font-display">
            Internal Structure Stratigraphy
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
          <span>Explosion Offset:</span>
          <input
            id="cutaway-explosion-slider"
            type="range"
            min="0"
            max="45"
            value={explosionOffset}
            onChange={(e) => setExplosionOffset(Number(e.target.value))}
            className="w-24 accent-cyan-400 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
          />
        </div>
      </div>

      {/* Visual Exploded Concentric Cutaway SVG/3D Simulation */}
      <div className="relative w-full h-60 bg-[#04060A]/80 rounded-2xl border border-cyan-500/30 flex items-center justify-center overflow-hidden p-4 shadow-[0_0_30px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(6,182,212,0.06)]">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0,transparent_70%)] pointer-events-none" />

        <svg viewBox="-150 -150 300 300" className="w-full h-full max-w-[280px]">
          <defs>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render concentric layer shells from outside to inside */}
          {planet.internalLayers.map((layer, idx) => {
            const isSelected = selectedLayer.name === layer.name;
            const r = 120 * layer.radiusPercent;
            const shiftX = (planet.internalLayers.length - 1 - idx) * (explosionOffset * 0.8);

            return (
              <g
                key={layer.name}
                transform={`translate(${shiftX}, 0)`}
                onClick={() => setSelectedLayer(layer)}
                className="cursor-pointer transition-all duration-300 hover:opacity-100"
                style={{ opacity: isSelected ? 1 : 0.75 }}
              >
                {/* Full outer ring for context */}
                <circle
                  cx="0"
                  cy="0"
                  r={r}
                  fill={layer.color}
                  stroke={isSelected ? '#06B6D4' : '#05070A'}
                  strokeWidth={isSelected ? '3' : '1.5'}
                  fillOpacity="0.9"
                  filter={isSelected ? 'url(#glow-filter)' : undefined}
                />

                {/* Shading gradient for 3D sphere look */}
                <path
                  d={`M 0 -${r} A ${r} ${r} 0 0 1 0 ${r} Z`}
                  fill="rgba(0, 0, 0, 0.28)"
                />

                {/* Inner radius boundary indicator */}
                <circle
                  cx="0"
                  cy="0"
                  r={r}
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeDasharray="3 3"
                />
              </g>
            );
          })}

          {/* Center core highlight */}
          <circle cx="0" cy="0" r="4" fill="#FFFFFF" filter="url(#glow-filter)" />
        </svg>

        {/* Selected Layer Badge */}
        <div className="absolute top-3 left-3 bg-[#070B14]/90 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-cyan-500/30 text-[10px] font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <span className="text-gray-400">Stratum: </span>
          <span className="text-cyan-300 font-bold">{selectedLayer.name}</span>
        </div>
      </div>

      {/* Layer selector tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {planet.internalLayers.map((layer) => {
          const isSelected = selectedLayer.name === layer.name;
          return (
            <button
              key={layer.name}
              id={`layer-btn-${layer.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedLayer(layer)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-white/5 border-white/10 hover:border-cyan-500/40 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-black/40 shadow-sm"
                  style={{ backgroundColor: layer.color }}
                />
                <span className="text-xs font-bold truncate font-display">{layer.name}</span>
              </div>
              <p className="text-[10px] font-mono text-gray-400">{layer.depth}</p>
            </button>
          );
        })}
      </div>

      {/* Layer Detail Box */}
      <div className="p-4 bg-white/5 rounded-2xl border border-cyan-500/20 space-y-2.5">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase font-display tracking-wide">{selectedLayer.name}</h4>
            <p className="text-[10px] font-mono text-cyan-400">Depth: {selectedLayer.depth}</p>
          </div>
          <span className="text-[10px] font-mono bg-cyan-500/15 text-cyan-300 px-2.5 py-0.5 rounded-lg border border-cyan-500/30 font-bold">
            {Math.round(selectedLayer.radiusPercent * 100)}% Radius
          </span>
        </div>

        <div className="pt-2 border-t border-gray-800 text-xs text-gray-300 space-y-1.5">
          <p>
            <strong className="text-cyan-200 font-medium">Composition:</strong> {selectedLayer.composition}
          </p>
          <p className="text-gray-300 leading-relaxed text-[11px] font-sans">{selectedLayer.description}</p>
        </div>
      </div>
    </div>
  );
};


