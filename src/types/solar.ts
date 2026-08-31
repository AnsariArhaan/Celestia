export type PlanetId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'ceres'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export type CelestialType =
  | 'Yellow Dwarf Star'
  | 'Terrestrial Planet'
  | 'Gas Giant'
  | 'Ice Giant'
  | 'Dwarf Planet';

export interface InternalLayer {
  name: string;
  depth: string;
  composition: string;
  description: string;
  color: string;
  radiusPercent: number; // 0 to 1
}

export interface SpaceMission {
  name: string;
  agency: string;
  year: string;
  description: string;
  highlight: string;
}

export interface GeologicalFeature {
  name: string;
  type: string;
  description: string;
  significance: string;
}

export interface MoonInfo {
  name: string;
  radiusKm: number;
  distanceKm: number;
  orbitalPeriodDays: number;
  description: string;
  color: string;
  surfaceType?: string;
  discoveryYear?: string;
  discoverer?: string;
  highlights?: string;
  composition?: string;
  densityGcm3?: number;
  gravityMs2?: number;
}

export interface AtmosphericGas {
  name: string;
  percentage: number;
  color: string;
}

export interface CelestialBody {
  id: PlanetId;
  name: string;
  latinName: string;
  symbol: string;
  tagline: string;
  type: CelestialType;
  orderFromSun: number;
  colorHex: string;
  secondaryColorHex: string;
  glowColorHex: string;
  
  // Astronomical & Physical telemetry
  radiusKm: number;
  radiusEarthRatio: number;
  visualScale: number; // Scaled for 3D viewing
  
  distanceFromSunAU: number;
  distanceFromSunKmDisplay: string;
  visualOrbitDistance: number; // Distance in 3D scene
  
  orbitalPeriodDays: number;
  orbitalPeriodDisplay: string;
  orbitalSpeedKmh: number;
  orbitalInclinationDeg: number;
  orbitalEccentricity: number;
  
  rotationPeriodHours: number;
  rotationPeriodDisplay: string;
  axialTiltDeg: number;
  retrogradeRotation?: boolean;
  
  surfaceGravityMs2: number;
  gravityEarthRatio: number;
  massKg: string;
  massEarthRatio: number;
  densityGcm3: number;
  escapeVelocityKms: number;
  
  meanTempC: number;
  minTempC?: number;
  maxTempC?: number;
  temperatureDisplay: string;
  
  moonsCount: number;
  moonsList: MoonInfo[];
  
  hasRings: boolean;
  ringDetails?: {
    innerRadius: number;
    outerRadius: number;
    colors: string[];
    tiltDeg: number;
  };
  
  hasAtmosphere: boolean;
  atmosphereGases: AtmosphericGas[];
  atmosphereDescription: string;
  
  overview: string;
  funFacts: string[];
  geologicalFeatures: GeologicalFeature[];
  explorationMissions: SpaceMission[];
  internalLayers: InternalLayer[];
  
  sonification: {
    baseFreq: number;
    modFreq: number;
    timbre: 'sine' | 'triangle' | 'sawtooth';
    filterFreq: number;
    description: string;
  };
}

export type ViewMode = 'journey' | 'orrery' | 'lab' | 'compare' | 'quiz';

export type GraphicsQuality = 'performance' | 'balanced' | 'ultra';

export interface SolarSystemSettings {
  orbitSpeedMultiplier: number;
  isPaused: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  showAsteroidBelt: boolean;
  realisticDistanceScale: boolean;
  realisticSizeScale: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  cinematicCamera: boolean;
  ultraHD4K: boolean;
  graphicsQuality: GraphicsQuality;
  showAtmosphereGlow: boolean;
  showNightLights: boolean;
  showShadows: boolean;
  bloomEnabled: boolean;
  motionBlurEnabled: boolean;
  cameraFov: number;
}
