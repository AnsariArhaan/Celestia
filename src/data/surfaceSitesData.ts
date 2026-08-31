import { PlanetId } from '../types/solar';

export interface SampleTarget {
  id: string;
  name: string;
  type: string;
  position: [number, number, number]; // 3D coordinates in surface scene
  composition: string;
  discoveryNote: string;
  spectroscopy: {
    primaryElement: string;
    siliconPercent?: number;
    ironPercent?: number;
    carbonPercent?: number;
    icePercent?: number;
  };
}

export interface SurfaceLandingSite {
  id: string;
  name: string;
  subtitle: string;
  planetId: PlanetId;
  planetName: string;
  roverOrLander: string;
  missionAgency: string;
  landingYear: string;
  coordinates: string;
  
  // Physical environment
  surfaceTempC: number;
  surfaceTempF: number;
  pressureAtm: number;
  pressureDisplay: string;
  gravityMs2: number;
  gravityG: number;
  solarIrradianceWm2: number;
  radiationLevelMsvYear: number;
  atmosphericComposition: string;
  
  // Visual Aesthetics
  skyColorHex: string;
  horizonColorHex: string;
  groundColorHex: string;
  rockColorHex: string;
  fogColorHex: string;
  fogDensity: number;
  sunSize: number; // relative to Earth
  sunIntensity: number;
  
  // Dynamic Sky Entities
  skyCelestialBody?: {
    name: string;
    textureType: 'earth' | 'jupiter' | 'saturn' | 'phobos' | 'charon' | 'sun';
    size: number;
    altitudeDeg: number;
    azimuthDeg: number;
    hasRings?: boolean;
  };
  
  particlesType: 'dust' | 'snow' | 'methane-rain' | 'steam' | 'heat-haze' | 'none';
  ambientSoundType: 'martian-wind' | 'vacuum-radio' | 'heavy-air' | 'methane-drizzle' | 'steam-hiss' | 'solar-plasma';
  
  overview: string;
  geologicalContext: string;
  sampleTargets: SampleTarget[];
}

export const SURFACE_LANDING_SITES: SurfaceLandingSite[] = [
  {
    id: 'mars-jezero',
    name: 'Jezero Crater',
    subtitle: 'Ancient River Delta & Lakebed',
    planetId: 'mars',
    planetName: 'Mars',
    roverOrLander: 'Perseverance Rover & Ingenuity',
    missionAgency: 'NASA / JPL',
    landingYear: '2021',
    coordinates: '18.38° N, 77.58° E',
    surfaceTempC: -62,
    surfaceTempF: -80,
    pressureAtm: 0.006,
    pressureDisplay: '610 Pa (0.006 atm)',
    gravityMs2: 3.72,
    gravityG: 0.38,
    solarIrradianceWm2: 590,
    radiationLevelMsvYear: 240,
    atmosphericComposition: '95.3% CO₂, 2.6% N₂, 1.9% Ar',
    skyColorHex: '#d48d6b',
    horizonColorHex: '#f1a87e',
    groundColorHex: '#9c3e23',
    rockColorHex: '#6d2a17',
    fogColorHex: '#d89474',
    fogDensity: 0.008,
    sunSize: 0.65,
    sunIntensity: 1.8,
    skyCelestialBody: {
      name: 'Phobos',
      textureType: 'phobos',
      size: 2.8,
      altitudeDeg: 48,
      azimuthDeg: 135
    },
    particlesType: 'dust',
    ambientSoundType: 'martian-wind',
    overview: 'An ancient 45-km-wide impact crater hosting a fan-shaped river delta deposited 3.5 billion years ago when Mars harbored persistent liquid surface water.',
    geologicalContext: 'Clay minerals, olivine carbonates, and deltaic siltstones optimized for preserving biosignatures and microbial microfossils.',
    sampleTargets: [
      {
        id: 'jezero-rock-1',
        name: 'Delta Clay Mudstone (Kodiak)',
        type: 'Sedimentary Siltstone',
        position: [6, 0.4, -12],
        composition: 'Smectite clays, Iron-rich carbonates, Silicates',
        discoveryNote: 'Formed at low energy water inflow, highest priority biosignature candidate.',
        spectroscopy: { primaryElement: 'Silicon & Iron', siliconPercent: 44, ironPercent: 28, carbonPercent: 8 }
      },
      {
        id: 'jezero-rock-2',
        name: 'Olivine Basalt Pavement',
        type: 'Igneous Volcanic Floor',
        position: [-10, 0.3, -8],
        composition: 'Crystalline Olivine, Pyroxene, Plagioclase',
        discoveryNote: 'Ancient crater floor magma lake cooling layer, key for radiometric age dating.',
        spectroscopy: { primaryElement: 'Magnesium-Iron Silicate', siliconPercent: 38, ironPercent: 35, carbonPercent: 2 }
      },
      {
        id: 'jezero-rock-3',
        name: 'Hematite Blueberry Concretion',
        type: 'Aqueous Precipitate',
        position: [2, 0.1, -5],
        composition: 'Crystalline Ferric Oxide (Fe₂O₃)',
        discoveryNote: 'Mineral spherules precipitated from groundwater percolating through porous sand.',
        spectroscopy: { primaryElement: 'Ferric Iron (Fe)', siliconPercent: 12, ironPercent: 78, carbonPercent: 1 }
      }
    ]
  },
  {
    id: 'moon-tranquility',
    name: 'Statio Tranquillitatis',
    subtitle: 'Apollo 11 Landing Site (Mare Tranquillitatis)',
    planetId: 'earth', // Moon linked
    planetName: 'The Moon',
    roverOrLander: 'Apollo 11 Eagle Lunar Module',
    missionAgency: 'NASA',
    landingYear: '1969',
    coordinates: '0.67° N, 23.47° E',
    surfaceTempC: 106,
    surfaceTempF: 223,
    pressureAtm: 0.000000000001,
    pressureDisplay: '3×10⁻¹⁵ atm (Hard Vacuum)',
    gravityMs2: 1.62,
    gravityG: 0.166,
    solarIrradianceWm2: 1361,
    radiationLevelMsvYear: 380,
    atmosphericComposition: 'Hard Vacuum (Trace He, Ne, H)',
    skyColorHex: '#000000',
    horizonColorHex: '#040711',
    groundColorHex: '#6b7280',
    rockColorHex: '#374151',
    fogColorHex: '#000000',
    fogDensity: 0.0005,
    sunSize: 1.0,
    sunIntensity: 3.5,
    skyCelestialBody: {
      name: 'Earth',
      textureType: 'earth',
      size: 14.5,
      altitudeDeg: 62,
      azimuthDeg: 210
    },
    particlesType: 'none',
    ambientSoundType: 'vacuum-radio',
    overview: 'The historic first human landing site on another celestial body on July 20, 1969. The blue marble of Earth permanently hangs high above the basalt lunar plains.',
    geologicalContext: 'Titanium-rich mare basalt lava flows covered by a 3 to 6-meter pulverized regolith blanket from billions of years of meteorite bombardment.',
    sampleTargets: [
      {
        id: 'moon-rock-1',
        name: 'High-Titanium Mare Basalt',
        type: 'Extrusive Volcanic',
        position: [-7, 0.4, -9],
        composition: 'Ilmenite (FeTiO₃), Pyroxene, Anorthite',
        discoveryNote: 'Ancient lunar volcanism sample with remarkably high titanium dioxide (11 wt%).',
        spectroscopy: { primaryElement: 'Titanium & Iron', siliconPercent: 36, ironPercent: 22 }
      },
      {
        id: 'moon-rock-2',
        name: 'Impact Melt Breccia',
        type: 'Shock-metamorphosed Clast',
        position: [8, 0.2, -6],
        composition: 'Fused agglutinate glass, Nickel-Iron meteoritic beads',
        discoveryNote: 'Formed under gigapascal kinetic impact pressures during early bombardment.',
        spectroscopy: { primaryElement: 'Silicon Oxide Glass', siliconPercent: 52, ironPercent: 16 }
      },
      {
        id: 'moon-rock-3',
        name: 'Anorthositic Highland Crust Fragment',
        type: 'Primordial Magma Ocean Float',
        position: [0, 0.15, -4],
        composition: 'Calcium-rich Plagioclase Feldspar',
        discoveryNote: 'Pristine piece of the primordial 4.4-billion-year-old lunar flotation crust.',
        spectroscopy: { primaryElement: 'Aluminum & Calcium', siliconPercent: 48, ironPercent: 4 }
      }
    ]
  },
  {
    id: 'titan-shangrila',
    name: 'Shangri-La Dunes & Kraken Mare Coast',
    subtitle: 'Hydrocarbon Dunes & Methane Weather System',
    planetId: 'saturn',
    planetName: 'Titan (Saturn)',
    roverOrLander: 'Huygens Probe & Dragonfly (Upcoming)',
    missionAgency: 'ESA / NASA / ASI',
    landingYear: '2005',
    coordinates: '10.2° S, 192.4° W',
    surfaceTempC: -179,
    surfaceTempF: -290,
    pressureAtm: 1.45,
    pressureDisplay: '147 kPa (1.45 atm)',
    gravityMs2: 1.35,
    gravityG: 0.138,
    solarIrradianceWm2: 15,
    radiationLevelMsvYear: 0.5,
    atmosphericComposition: '95% N₂, 4.9% CH₄ (Methane), 0.1% H₂',
    skyColorHex: '#d97706',
    horizonColorHex: '#f59e0b',
    groundColorHex: '#78350f',
    rockColorHex: '#451a03',
    fogColorHex: '#b45309',
    fogDensity: 0.022,
    sunSize: 0.32,
    sunIntensity: 0.8,
    skyCelestialBody: {
      name: 'Saturn & Ring System',
      textureType: 'saturn',
      size: 28.0,
      altitudeDeg: 35,
      azimuthDeg: 80,
      hasRings: true
    },
    particlesType: 'methane-rain',
    ambientSoundType: 'methane-drizzle',
    overview: 'The only moon with a dense atmosphere and liquid lakes. Hydrocarbon rain carves river channels across pebble-strewn water-ice bedrock in an eerie orange twilight.',
    geologicalContext: 'Solid water ice acts as rock-hard bedrock at -179°C, covered with complex organic tholin aerosols resembling fine coffee grounds.',
    sampleTargets: [
      {
        id: 'titan-target-1',
        name: 'Liquid Ethane-Methane Sludge',
        type: 'Cryogenic Liquid Hydrocarbon',
        position: [4, -0.2, -10],
        composition: '75% Liquid Methane, 20% Ethane, 5% Dissolved Nitrogen',
        discoveryNote: 'Cryogenic liquid cycle analog to Earth water cycle with clouds and precipitation.',
        spectroscopy: { primaryElement: 'Carbon & Hydrogen', carbonPercent: 82, siliconPercent: 0 }
      },
      {
        id: 'titan-target-2',
        name: 'Tholin Polymer Sand Dune',
        type: 'Organic Aerosol Deposition',
        position: [-8, 0.6, -14],
        composition: 'Complex C-H-N polymers, Polycyclic Aromatic Hydrocarbons',
        discoveryNote: 'Formed in upper atmosphere by solar UV ionization of methane and nitrogen.',
        spectroscopy: { primaryElement: 'Complex Organic Tholins', carbonPercent: 68, siliconPercent: 2 }
      },
      {
        id: 'titan-target-3',
        name: 'Rounded Water-Ice Cobble',
        type: 'Cryo-geological Bedrock Cobble',
        position: [-1, 0.1, -4.5],
        composition: 'Polycrystalline H₂O Ice, Cryo-hardened to Granite hardness',
        discoveryNote: 'Fluvially eroded by ancient flash-floods of liquid methane.',
        spectroscopy: { primaryElement: 'Oxygen & Hydrogen (H₂O)', icePercent: 94, siliconPercent: 1 }
      }
    ]
  },
  {
    id: 'venus-venera13',
    name: 'Phoebe Regio Volcanic Plain',
    subtitle: 'Supercritical Atmosphere & Basalt Slag',
    planetId: 'venus',
    planetName: 'Venus',
    roverOrLander: 'Venera 13 Lander',
    missionAgency: 'Soviet Space Program',
    landingYear: '1982',
    coordinates: '7.5° S, 303° E',
    surfaceTempC: 465,
    surfaceTempF: 869,
    pressureAtm: 92.0,
    pressureDisplay: '9.3 MPa (92 atm - Deep Ocean Pressure)',
    gravityMs2: 8.87,
    gravityG: 0.904,
    solarIrradianceWm2: 120,
    radiationLevelMsvYear: 1.2,
    atmosphericComposition: '96.5% CO₂, 3.5% N₂, Sulfuric Acid Clouds',
    skyColorHex: '#d97706',
    horizonColorHex: '#b45309',
    groundColorHex: '#713f12',
    rockColorHex: '#451a03',
    fogColorHex: '#92400e',
    fogDensity: 0.025,
    sunSize: 0.5,
    sunIntensity: 0.9,
    particlesType: 'heat-haze',
    ambientSoundType: 'heavy-air',
    overview: 'A crushing hellscape where surface pressure equals 900 meters underwater on Earth and temperatures melt lead, bathed in a diffuse amber-yellow haze.',
    geologicalContext: 'Porous alkaline basalt lava sheets fractured by intense thermal stresses under supercritical carbon dioxide fluid dynamics.',
    sampleTargets: [
      {
        id: 'venus-target-1',
        name: 'Alkaline High-Potassium Basalt',
        type: 'Effusive Volcanic Sheet',
        position: [5, 0.2, -8],
        composition: 'Potassium-rich Basalt, Plagioclase, Titanomagnetite',
        discoveryNote: 'Similar to terrestrial oceanic island basalts (OIB), confirming active volcanic history.',
        spectroscopy: { primaryElement: 'Silicon, Potassium & Iron', siliconPercent: 45, ironPercent: 20 }
      },
      {
        id: 'venus-target-2',
        name: 'Thermal-Fractured Lava Crust',
        type: 'Columnar Thermal Pavement',
        position: [-6, 0.3, -11],
        composition: 'Superheated Pyroxene, Iron sulfide (Pyrite coating)',
        discoveryNote: 'Shows chemical weathering reactions with sulfur vapor in the lower atmosphere.',
        spectroscopy: { primaryElement: 'Iron & Sulfur', siliconPercent: 32, ironPercent: 38 }
      }
    ]
  },
  {
    id: 'europa-chaos',
    name: 'Conamara Chaos Fractures',
    subtitle: 'Subsurface Ocean Ice Crust & Cryo-Geysers',
    planetId: 'jupiter',
    planetName: 'Europa (Jupiter)',
    roverOrLander: 'Europa Clipper & Lander Concept',
    missionAgency: 'NASA / ESA',
    landingYear: '2030 (Planned)',
    coordinates: '9.7° N, 272.7° W',
    surfaceTempC: -170,
    surfaceTempF: -274,
    pressureAtm: 0.0000000000001,
    pressureDisplay: '10⁻¹² Pa (Exosphere)',
    gravityMs2: 1.315,
    gravityG: 0.134,
    solarIrradianceWm2: 50,
    radiationLevelMsvYear: 54000, // Extremely lethal Jovian trapped radiation
    atmosphericComposition: 'Trace Molecular Oxygen (O₂ exosphere)',
    skyColorHex: '#000000',
    horizonColorHex: '#080e1a',
    groundColorHex: '#e2e8f0',
    rockColorHex: '#94a3b8',
    fogColorHex: '#0f172a',
    fogDensity: 0.002,
    sunSize: 0.44,
    sunIntensity: 2.2,
    skyCelestialBody: {
      name: 'Jupiter & Great Red Spot',
      textureType: 'jupiter',
      size: 36.0,
      altitudeDeg: 42,
      azimuthDeg: 190
    },
    particlesType: 'steam',
    ambientSoundType: 'steam-hiss',
    overview: 'A dazzling expanse of fractured ice blocks floating above a global liquid saltwater ocean containing 2x more water than all of Earth’s oceans combined.',
    geologicalContext: 'Chaotic disrupted ice matrix tinted with reddish-brown hydrated magnesium sulfate salts deposited from hydrothermal vents below.',
    sampleTargets: [
      {
        id: 'europa-target-1',
        name: 'Cryo-Brine Ridge Salt Deposit',
        type: 'Hydrothermal Ocean Effluent',
        position: [4, 0.4, -9],
        composition: 'Hydrated Magnesium Sulfate (Epsomite), NaCl, Sulfuric acid hydrate',
        discoveryNote: 'Ocean water erupted through ice crevasses and flash-frozen in vacuum.',
        spectroscopy: { primaryElement: 'Magnesium & Sodium Salts', icePercent: 65, siliconPercent: 2 }
      },
      {
        id: 'europa-target-2',
        name: 'Glacial Sintered Ice Spire',
        type: 'Penitente Cryogenic Needle',
        position: [-7, 1.2, -12],
        composition: '99.4% Amorphous & Crystalline H₂O Ice',
        discoveryNote: 'Sculpted by solar sublimation and intense Jovian magnetospheric electron bombardment.',
        spectroscopy: { primaryElement: 'Water Ice (H₂O)', icePercent: 99 }
      }
    ]
  },
  {
    id: 'mercury-caloris',
    name: 'Caloris Basin Interior',
    subtitle: 'Extreme Thermal Range & Giant Impact Basin',
    planetId: 'mercury',
    planetName: 'Mercury',
    roverOrLander: 'BepiColombo & MESSENGER',
    missionAgency: 'ESA / JAXA / NASA',
    landingYear: '2026',
    coordinates: '30.5° N, 189.8° W',
    surfaceTempC: 430,
    surfaceTempF: 800,
    pressureAtm: 0.0000000000001,
    pressureDisplay: '10⁻¹⁴ atm (Hard Vacuum)',
    gravityMs2: 3.7,
    gravityG: 0.378,
    solarIrradianceWm2: 9120, // 6.7x Earth solar power
    radiationLevelMsvYear: 1800,
    atmosphericComposition: 'Trace Exosphere (42% O, 29% Na, 22% H)',
    skyColorHex: '#000000',
    horizonColorHex: '#0a0a0f',
    groundColorHex: '#52525b',
    rockColorHex: '#27272a',
    fogColorHex: '#000000',
    fogDensity: 0.0006,
    sunSize: 2.8, // Sun appears 3x larger in Mercury sky!
    sunIntensity: 5.5,
    particlesType: 'none',
    ambientSoundType: 'vacuum-radio',
    overview: 'A 1,550-km-wide impact basin scorched by a blazing, oversized Sun. Mercury experiences extreme thermal swings from +430°C in daylight to -180°C at night.',
    geologicalContext: 'Low-iron, volatile-rich volcanic smooth plains with volcanic pyroclastic vents and hollows caused by sublimating unknown volatiles.',
    sampleTargets: [
      {
        id: 'mercury-target-1',
        name: 'Graphite-Enriched Low-Reflectance Material',
        type: 'Primordial Carbon Flotation Crust',
        position: [6, 0.3, -10],
        composition: 'Elemental Carbon (Graphite), Magnesium-rich pyroxene',
        discoveryNote: 'Dark mantle material excavated by the Caloris impactor.',
        spectroscopy: { primaryElement: 'Elemental Carbon (C)', carbonPercent: 35, siliconPercent: 38 }
      },
      {
        id: 'mercury-target-2',
        name: 'Pyroclastic Volcanic Vent Rim',
        type: 'Explosive Volcanic Deposit',
        position: [-8, 0.5, -13],
        composition: 'Sodium sulfides, Sulfur-rich glass beads',
        discoveryNote: 'Evidence of explosive volatile degassing from Mercury interior.',
        spectroscopy: { primaryElement: 'Sulfur & Magnesium', siliconPercent: 40, ironPercent: 4 }
      }
    ]
  },
  {
    id: 'pluto-sputnik',
    name: 'Sputnik Planitia Heart Glacier',
    subtitle: 'Convective Nitrogen Ice Plains & Cryo-Volcanoes',
    planetId: 'pluto',
    planetName: 'Pluto',
    roverOrLander: 'New Horizons Reconnaissance',
    missionAgency: 'NASA',
    landingYear: '2015 Flyby',
    coordinates: '19.5° N, 175.8° E',
    surfaceTempC: -230,
    surfaceTempF: -382,
    pressureAtm: 0.00001,
    pressureDisplay: '1 Pa (0.00001 atm)',
    gravityMs2: 0.62,
    gravityG: 0.063,
    solarIrradianceWm2: 0.9, // Dim solar noon
    radiationLevelMsvYear: 18,
    atmosphericComposition: '99% N₂, 0.5% CH₄, 0.5% CO (Blue Haze Layers)',
    skyColorHex: '#030712',
    horizonColorHex: '#1e3a8a',
    groundColorHex: '#cbd5e1',
    rockColorHex: '#7f1d1d', // Red tholin water-ice mountains
    fogColorHex: '#172554',
    fogDensity: 0.004,
    sunSize: 0.15,
    sunIntensity: 0.6,
    skyCelestialBody: {
      name: 'Charon',
      textureType: 'charon',
      size: 18.0,
      altitudeDeg: 55,
      azimuthDeg: 240
    },
    particlesType: 'snow',
    ambientSoundType: 'vacuum-radio',
    overview: 'A 1,000-km expanse of slowly churning nitrogen and carbon monoxide ice polygons bordered by towering 4-km-high water-ice mountains tinted blood red by tholins.',
    geologicalContext: 'Thermal convection cells overturning every 500,000 years driven by Pluto’s internal radioactive decay heating.',
    sampleTargets: [
      {
        id: 'pluto-target-1',
        name: 'Cellular Nitrogen Ice Slab',
        type: 'Convective Volatile Glacier',
        position: [5, 0.1, -7],
        composition: '98.5% Solid Nitrogen (N₂), Carbon Monoxide, Trace Methane',
        discoveryNote: 'Plastic flowing glacier ice behaving dynamically at -230°C.',
        spectroscopy: { primaryElement: 'Molecular Nitrogen (N₂)', icePercent: 98 }
      },
      {
        id: 'pluto-target-2',
        name: 'Hillary Montes Red Ice Peak',
        type: 'Water-Ice Bedrock Mountain',
        position: [-10, 2.5, -18],
        composition: 'Ultra-hard H₂O Ice, Tholin photochemical organic mantle',
        discoveryNote: 'Towering 3.5-km mountains floating on denser nitrogen glacier ice.',
        spectroscopy: { primaryElement: 'Water Ice & Tholins', icePercent: 88, carbonPercent: 10 }
      }
    ]
  },
  {
    id: 'ceres-occator',
    name: 'Occator Crater Salt Faculae',
    subtitle: 'Cerealia Facula Sodium Carbonate Deposits',
    planetId: 'ceres',
    planetName: 'Ceres (Asteroid Belt)',
    roverOrLander: 'Dawn Spacecraft',
    missionAgency: 'NASA / JPL',
    landingYear: '2015',
    coordinates: '19.8° N, 239.3° E',
    surfaceTempC: -105,
    surfaceTempF: -157,
    pressureAtm: 0.0000000000001,
    pressureDisplay: 'Trace Exosphere',
    gravityMs2: 0.28,
    gravityG: 0.029,
    solarIrradianceWm2: 185,
    radiationLevelMsvYear: 320,
    atmosphericComposition: 'Transient Water Vapor Exosphere',
    skyColorHex: '#000000',
    horizonColorHex: '#05070d',
    groundColorHex: '#4b5563',
    rockColorHex: '#1f2937',
    fogColorHex: '#000000',
    fogDensity: 0.0008,
    sunSize: 0.38,
    sunIntensity: 2.0,
    particlesType: 'steam',
    ambientSoundType: 'steam-hiss',
    overview: 'A dramatic 92-km impact crater featuring Cerealia Facula, a glowing central dome of sodium carbonate salts deposited by subterranean cryo-magma brine springs.',
    geologicalContext: 'Impact-induced hydrothermal circulation drawing brine from a relict deep mantle mud ocean.',
    sampleTargets: [
      {
        id: 'ceres-target-1',
        name: 'Hydrothermal Salt Dome Crust',
        type: 'Hydrohalite & Sodium Carbonate',
        position: [3, 0.3, -6],
        composition: 'Sodium Carbonate (Na₂CO₃), Hydrohalite, Ammonium chloride',
        discoveryNote: 'Highest concentration of carbonate minerals outside of Earth.',
        spectroscopy: { primaryElement: 'Sodium & Carbonates', carbonPercent: 24, siliconPercent: 12 }
      }
    ]
  }
];
