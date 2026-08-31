import { CelestialBody } from '../types/solar';

export const CELESTIAL_BODIES: CelestialBody[] = [
  {
    id: 'sun',
    name: 'The Sun',
    latinName: 'Sol',
    symbol: '☉',
    tagline: 'The incandescent star anchoring our entire solar system',
    type: 'Yellow Dwarf Star',
    orderFromSun: 0,
    colorHex: '#FFB703',
    secondaryColorHex: '#FB8500',
    glowColorHex: '#FFD166',
    
    radiusKm: 696340,
    radiusEarthRatio: 109.2,
    visualScale: 9.5, // Scaled for orrery/viewing
    
    distanceFromSunAU: 0,
    distanceFromSunKmDisplay: '0 km (Center)',
    visualOrbitDistance: 0,
    
    orbitalPeriodDays: 0,
    orbitalPeriodDisplay: 'Galactic orbit: ~230 million years',
    orbitalSpeedKmh: 792000,
    orbitalInclinationDeg: 0,
    orbitalEccentricity: 0,
    
    rotationPeriodHours: 600, // ~25 days at equator
    rotationPeriodDisplay: '25-35 Earth days (differential rotation)',
    axialTiltDeg: 7.25,
    
    surfaceGravityMs2: 274,
    gravityEarthRatio: 27.9,
    massKg: '1.989 × 10³⁰ kg',
    massEarthRatio: 333000,
    densityGcm3: 1.41,
    escapeVelocityKms: 617.7,
    
    meanTempC: 5505,
    minTempC: 5500,
    maxTempC: 15000000, // Core
    temperatureDisplay: 'Surface: 5,500°C | Core: 15,000,000°C',
    
    moonsCount: 0,
    moonsList: [],
    
    hasRings: false,
    hasAtmosphere: true,
    atmosphereGases: [
      { name: 'Hydrogen (H₂)', percentage: 73.46, color: '#FFB703' },
      { name: 'Helium (He)', percentage: 24.85, color: '#FB8500' },
      { name: 'Oxygen & Carbon', percentage: 1.69, color: '#E63946' }
    ],
    atmosphereDescription: 'Solar atmosphere consists of the Photosphere, Chromosphere, and superheated Corona emitting the solar wind.',
    
    overview: 'The Sun contains 99.86% of the mass of the entire solar system. Powered by nuclear fusion converting 600 million tons of hydrogen into helium every second, its radiant light and heat sustain life on Earth and dictate the orbits of all planets.',
    funFacts: [
      'Over 1.3 million Earths could fit inside the Sun.',
      'Photons created in the Sun’s core take over 100,000 years to reach the surface, but only 8 minutes and 20 seconds to reach Earth.',
      'The solar wind extends far past Pluto to create the protective bubble known as the Heliosphere.'
    ],
    geologicalFeatures: [
      { name: 'Photosphere Granulation', type: 'Convection Cells', description: 'Boiling plasma cells roughly the size of Texas across the surface.', significance: 'Transfers thermal energy from the convection zone.' },
      { name: 'Sunspots', type: 'Magnetic Vortices', description: 'Cooler regions (~3,800°C) with intense localized magnetic fields.', significance: 'Triggers solar flares and coronal mass ejections.' },
      { name: 'Solar Corona', type: 'Plasma Halo', description: 'The outermost atmospheric layer reaching over 1-3 million degrees Celsius.', significance: 'Drives solar wind and auroras across the planets.' }
    ],
    explorationMissions: [
      { name: 'Parker Solar Probe', agency: 'NASA', year: '2018-Present', description: 'First spacecraft to "touch the Sun", diving into the corona.', highlight: 'Fastest human-made object at over 690,000 km/h.' },
      { name: 'Solar Orbiter', agency: 'ESA/NASA', year: '2020-Present', description: 'Captures the closest images of the Sun’s polar regions.', highlight: 'Discovered miniature solar flares called "campfires".' },
      { name: 'SOHO', agency: 'ESA/NASA', year: '1995-Present', description: 'Over 25 years of continuous solar surveillance and CME forecasting.', highlight: 'Discovered over 4,000 comets.' }
    ],
    internalLayers: [
      { name: 'Thermonuclear Core', depth: '0 - 175,000 km', composition: 'High-density plasma undergoing proton-proton fusion', description: '15 Million °C core where hydrogen fuses into helium, releasing 3.8 × 10²⁶ Watts.', color: '#FFF3B0', radiusPercent: 0.25 },
      { name: 'Radiative Zone', depth: '175,000 - 490,000 km', composition: 'Dense ionized gas transmitting photons via radiative diffusion', description: 'Photons take millennia bouncing through this dense optical maze.', color: '#FFB703', radiusPercent: 0.7 },
      { name: 'Convective Zone', depth: '490,000 - 696,340 km', composition: 'Boiling thermal plasma rising and sinking in huge convection currents', description: 'Plasma cells carry heat to the visible photosphere.', color: '#E85D04', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 55,
      modFreq: 1.2,
      timbre: 'sine',
      filterFreq: 220,
      description: 'Deep solar acoustic oscillation (p-mode acoustic waves)'
    }
  },
  {
    id: 'mercury',
    name: 'Mercury',
    latinName: 'Mercurius',
    symbol: '☿',
    tagline: 'The swift, sun-scorched, and heavily cratered inner messenger',
    type: 'Terrestrial Planet',
    orderFromSun: 1,
    colorHex: '#9E9E9E',
    secondaryColorHex: '#616161',
    glowColorHex: '#D5D5D5',
    
    radiusKm: 2439.7,
    radiusEarthRatio: 0.383,
    visualScale: 1.6,
    
    distanceFromSunAU: 0.387,
    distanceFromSunKmDisplay: '57.9 million km (0.39 AU)',
    visualOrbitDistance: 16,
    
    orbitalPeriodDays: 87.97,
    orbitalPeriodDisplay: '88 Earth days',
    orbitalSpeedKmh: 170505,
    orbitalInclinationDeg: 7.0,
    orbitalEccentricity: 0.2056,
    
    rotationPeriodHours: 1407.6,
    rotationPeriodDisplay: '58.6 Earth days (3:2 spin-orbit resonance)',
    axialTiltDeg: 0.034,
    
    surfaceGravityMs2: 3.7,
    gravityEarthRatio: 0.38,
    massKg: '3.301 × 10²³ kg',
    massEarthRatio: 0.055,
    densityGcm3: 5.43,
    escapeVelocityKms: 4.25,
    
    meanTempC: 167,
    minTempC: -180,
    maxTempC: 430,
    temperatureDisplay: '-180°C (Night) to +430°C (Day)',
    
    moonsCount: 0,
    moonsList: [],
    
    hasRings: false,
    hasAtmosphere: false, // Exosphere only
    atmosphereGases: [
      { name: 'Oxygen (O₂)', percentage: 42, color: '#64B5F6' },
      { name: 'Sodium (Na)', percentage: 29, color: '#FFD54F' },
      { name: 'Hydrogen (H₂)', percentage: 22, color: '#E0E0E0' },
      { name: 'Helium & Potassium', percentage: 7, color: '#B0BEC5' }
    ],
    atmosphereDescription: 'Ultra-tenuous exosphere created by solar wind sputtering and micrometeorite impacts.',
    
    overview: 'Mercury is the smallest planet in our solar system and the closest to the Sun. It experiences the most extreme temperature swings in the planetary family: baking hot by day and sub-freezing by night due to having virtually no atmosphere to trap heat.',
    funFacts: [
      'A year on Mercury is only 88 days, but a single solar day (noon to noon) lasts 176 Earth days!',
      'Despite daytime temperatures reaching 430°C, radar observations confirmed water ice inside permanently shadowed polar craters.',
      'Mercury has a massive metallic iron core that makes up roughly 85% of its total planetary radius.'
    ],
    geologicalFeatures: [
      { name: 'Caloris Basin', type: 'Impact Crater', description: 'One of the largest impact basins in the solar system (1,550 km across).', significance: 'Formed by an asteroid strike that sent shockwaves rippling through the entire planet.' },
      { name: 'Lobate Scarps (Rupes)', type: 'Tectonic Cliffs', description: 'Thrust faults reaching up to 3 km high and hundreds of kilometers long.', significance: 'Evidence that Mercury shrank as its giant core cooled.' }
    ],
    explorationMissions: [
      { name: 'MESSENGER', agency: 'NASA', year: '2004-2015', description: 'First probe to orbit Mercury, mapping 100% of its surface in high resolution.', highlight: 'Discovered organic molecules and water ice at the poles.' },
      { name: 'BepiColombo', agency: 'ESA/JAXA', year: '2018-Present', description: 'Dual orbiter on its way to investigate Mercury’s magnetic field and exosphere.', highlight: 'Arrival in orbit scheduled for 2026.' },
      { name: 'Mariner 10', agency: 'NASA', year: '1973', description: 'First spacecraft to visit Mercury via gravity assists at Venus.', highlight: 'Discovered Mercury’s surprising magnetic field.' }
    ],
    internalLayers: [
      { name: 'Solid & Molten Iron Core', depth: '0 - 2,000 km', composition: 'High-density metallic iron-nickel core', description: 'Takes up 85% of planetary radius and generates a global magnetic field.', color: '#CFD8DC', radiusPercent: 0.82 },
      { name: 'Silicate Mantle', depth: '2,000 - 2,400 km', composition: 'Solid magnesium-iron silicates', description: 'A thin mantle compressed between core and crust.', color: '#8D6E63', radiusPercent: 0.95 },
      { name: 'Basaltic Crust', depth: '2,400 - 2,440 km', composition: 'Silicate rock battered by impact craters', description: 'Heavily cratered volcanic crust resembling Earth’s Moon.', color: '#9E9E9E', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 147,
      modFreq: 4.1,
      timbre: 'triangle',
      filterFreq: 450,
      description: 'High-frequency resonance reflecting swift orbital transit'
    }
  },
  {
    id: 'venus',
    name: 'Venus',
    latinName: 'Venus',
    symbol: '♀',
    tagline: 'The runaway greenhouse inferno hidden beneath sulfuric acid clouds',
    type: 'Terrestrial Planet',
    orderFromSun: 2,
    colorHex: '#E29578',
    secondaryColorHex: '#DDA15E',
    glowColorHex: '#F6BD60',
    
    radiusKm: 6051.8,
    radiusEarthRatio: 0.949,
    visualScale: 2.2,
    
    distanceFromSunAU: 0.723,
    distanceFromSunKmDisplay: '108.2 million km (0.72 AU)',
    visualOrbitDistance: 24,
    
    orbitalPeriodDays: 224.7,
    orbitalPeriodDisplay: '225 Earth days',
    orbitalSpeedKmh: 126074,
    orbitalInclinationDeg: 3.39,
    orbitalEccentricity: 0.0067,
    
    rotationPeriodHours: -5832.5, // Retrograde
    rotationPeriodDisplay: '243 Earth days (Retrograde / Clockwise)',
    axialTiltDeg: 177.36,
    retrogradeRotation: true,
    
    surfaceGravityMs2: 8.87,
    gravityEarthRatio: 0.904,
    massKg: '4.867 × 10²⁴ kg',
    massEarthRatio: 0.815,
    densityGcm3: 5.24,
    escapeVelocityKms: 10.36,
    
    meanTempC: 464,
    minTempC: 438,
    maxTempC: 482,
    temperatureDisplay: 'Uniform 464°C (Hot enough to melt lead)',
    
    moonsCount: 0,
    moonsList: [],
    
    hasRings: false,
    hasAtmosphere: true,
    atmosphereGases: [
      { name: 'Carbon Dioxide (CO₂)', percentage: 96.5, color: '#E29578' },
      { name: 'Nitrogen (N₂)', percentage: 3.5, color: '#83C5BE' },
      { name: 'Sulfur Dioxide & Argon', percentage: 0.02, color: '#FFD166' }
    ],
    atmosphereDescription: 'Crushing atmosphere with 92 bars of surface pressure (equivalent to 900m under Earth’s ocean) and opaque clouds of sulfuric acid.',
    
    overview: 'Often called Earth’s "evil twin" due to similar size and mass, Venus underwent an irreversible runaway greenhouse effect. Its super-dense CO₂ blanket traps solar radiation, making Venus the hottest planet in the entire solar system—even hotter than Mercury.',
    funFacts: [
      'Venus spins in the opposite direction (retrograde) compared to most planets; on Venus, the Sun rises in the west and sets in the east.',
      'A Venusian day (243 Earth days) is actually longer than its year (225 Earth days)!',
      'The Soviet Venera 13 probe landed on the surface in 1982 and survived for 127 minutes under crushing heat and pressure.'
    ],
    geologicalFeatures: [
      { name: 'Maat Mons', type: 'Shield Volcano', description: 'Massive 8-km-high volcano with active recent lava flows.', significance: 'Recent radar evidence reveals active volcanism still shaping the surface.' },
      { name: 'Ishtar Terra', type: 'Highland Plateau', description: 'Australia-sized highland continent hosting Maxwell Montes (11 km high).', significance: 'The coldest, highest terrain on Venus.' },
      { name: 'Coronae', type: 'Volcanic Calderas', description: 'Circular crown-like volcanic collapse features up to 2,000 km across.', significance: 'Unique to Venus, formed by mantle plumes.' }
    ],
    explorationMissions: [
      { name: 'Venera Program', agency: 'Soviet Union', year: '1961-1984', description: 'Only missions to successfully land and transmit photos from Venusian surface.', highlight: 'Returned first color panoramic photos of Venusian soil.' },
      { name: 'Magellan', agency: 'NASA', year: '1989-1994', description: 'Synthetic aperture radar orbiter mapped 98% of the surface in 100m detail.', highlight: 'Revealed volcanoes, lava channels, and craters.' },
      { name: 'VERITAS & DAVINCI', agency: 'NASA', year: 'Planned (2030s)', description: 'Next-generation probes to map surface mineralogy and sample atmospheric descent.', highlight: 'Searching for evidence of ancient oceans.' }
    ],
    internalLayers: [
      { name: 'Iron-Nickel Core', depth: '0 - 3,200 km', composition: 'Partially liquid metallic iron core', description: 'Similar in size to Earth’s core, but lacking strong convective dynamo.', color: '#D4A373', radiusPercent: 0.53 },
      { name: 'Rocky Silicate Mantle', depth: '3,200 - 5,980 km', composition: 'Dense silicate rock churning with mantle plumes', description: 'Drives surface volcanism without plate tectonics.', color: '#BC6C25', radiusPercent: 0.98 },
      { name: 'Basaltic Crust', depth: '5,980 - 6,052 km', composition: 'Dense volcanic basalt and granite-like highlands', description: 'Constantly renewed by extensive basaltic lava outpourings.', color: '#E29578', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 221,
      modFreq: 2.4,
      timbre: 'sawtooth',
      filterFreq: 320,
      description: 'Dense, warm atmospheric hum modulated by sulfuric winds'
    }
  },
  {
    id: 'earth',
    name: 'Earth',
    latinName: 'Terra',
    symbol: '♁',
    tagline: 'The radiant blue oasis of life, liquid oceans, and plate tectonics',
    type: 'Terrestrial Planet',
    orderFromSun: 3,
    colorHex: '#2A9D8F',
    secondaryColorHex: '#264653',
    glowColorHex: '#48CAE4',
    
    radiusKm: 6371.0,
    radiusEarthRatio: 1.0,
    visualScale: 2.3,
    
    distanceFromSunAU: 1.0,
    distanceFromSunKmDisplay: '149.6 million km (1.00 AU)',
    visualOrbitDistance: 33,
    
    orbitalPeriodDays: 365.25,
    orbitalPeriodDisplay: '365.25 days (1.00 year)',
    orbitalSpeedKmh: 107218,
    orbitalInclinationDeg: 0.0,
    orbitalEccentricity: 0.0167,
    
    rotationPeriodHours: 23.934,
    rotationPeriodDisplay: '23 hours 56 minutes 4 seconds',
    axialTiltDeg: 23.44,
    
    surfaceGravityMs2: 9.807,
    gravityEarthRatio: 1.0,
    massKg: '5.972 × 10²⁴ kg',
    massEarthRatio: 1.0,
    densityGcm3: 5.51,
    escapeVelocityKms: 11.186,
    
    meanTempC: 15,
    minTempC: -89.2,
    maxTempC: 56.7,
    temperatureDisplay: '-89°C to +57°C (Global mean: 15°C)',
    
    moonsCount: 1,
    moonsList: [
      {
        name: 'The Moon (Luna)',
        radiusKm: 1737.4,
        distanceKm: 384400,
        orbitalPeriodDays: 27.32,
        description: 'Earth’s only natural satellite and the fifth largest moon in the Solar System. Tidally locked, it stabilizes Earth’s 23.4° axial tilt, preventing chaotic climate swings and driving oceanic tides.',
        color: '#D6D6D6',
        surfaceType: 'Anorthosite Highlands & Basaltic Lunar Maria',
        discoveryYear: 'Prehistoric / Antiquity',
        discoverer: 'Galileo Galilei (First telescopic map in 1609)',
        highlights: '12 Apollo astronauts walked on its surface between 1969 and 1972, returning 382 kg of lunar samples.',
        composition: 'Silicate rock, plagioclase feldspar, basaltic titanium-rich lava flows',
        densityGcm3: 3.34,
        gravityMs2: 1.62
      }
    ],
    
    hasRings: false,
    hasAtmosphere: true,
    atmosphereGases: [
      { name: 'Nitrogen (N₂)', percentage: 78.08, color: '#0077B6' },
      { name: 'Oxygen (O₂)', percentage: 20.95, color: '#00B4D8' },
      { name: 'Argon (Ar)', percentage: 0.93, color: '#90E0EF' },
      { name: 'Carbon Dioxide & Vapor', percentage: 0.04, color: '#CAF0F8' }
    ],
    atmosphereDescription: 'Protective multi-layer shield (Troposphere, Stratosphere with Ozone, Mesosphere, Thermosphere, Exosphere) maintaining liquid water and blocking cosmic radiation.',
    
    overview: 'Earth is the third planet from the Sun and the only known astronomical body harboring life. 71% of its surface is covered by liquid water oceans, accompanied by active plate tectonics, an oxygen-rich atmosphere, and a dynamic geomagnetic dynamo.',
    funFacts: [
      'Earth is the densest major body in the solar system (5.51 g/cm³).',
      'The Moon is tidally locked to Earth, meaning the exact same hemisphere always faces us.',
      'Earth’s magnetic field is generated by liquid iron convection in the outer core, producing stunning Auroras.'
    ],
    geologicalFeatures: [
      { name: 'Mariana Trench (Challenger Deep)', type: 'Oceanic Subduction Trench', description: 'Deepest point on Earth (10,994m below sea level).', significance: 'Deep-sea hydrothermal vents hosting chemosynthetic ecosystems.' },
      { name: 'Mount Everest (Chomolungma)', type: 'Tectonic Mountain', description: 'Highest mountain above sea level (8,848.86m).', significance: 'Created by the collision between the Indian and Eurasian tectonic plates.' },
      { name: 'Mid-Atlantic Ridge', type: 'Divergent Plate Boundary', description: 'Undersea mountain range over 65,000 km long spanning global oceans.', significance: 'Continuously creates new oceanic crust via seafloor spreading.' }
    ],
    explorationMissions: [
      { name: 'Apollo Program', agency: 'NASA', year: '1968-1972', description: '12 humans walked on the Moon, returning 382 kg of lunar rocks.', highlight: 'Apollo 11 landed first humans on July 20, 1969.' },
      { name: 'International Space Station (ISS)', agency: 'NASA/ESA/JAXA/CSA/Roscosmos', year: '1998-Present', description: 'Continuously crewed orbital microgravity laboratory for 25+ years.', highlight: 'Over 3,000 scientific investigations conducted in orbit.' },
      { name: 'Earth Observing System (Terra, Aqua, Landsat)', agency: 'NASA/USGS', year: '1972-Present', description: 'Global satellite fleet monitoring climate, ice sheets, and biodiversity.', highlight: 'Decades of planetary health observation.' }
    ],
    internalLayers: [
      { name: 'Solid Inner Core', depth: '0 - 1,220 km', composition: 'Solid iron-nickel alloy at ~5,400°C', description: 'Kept solid despite immense heat by 3.6 million atmospheres of pressure.', color: '#FFF8E7', radiusPercent: 0.2 },
      { name: 'Liquid Outer Core', depth: '1,220 - 3,480 km', composition: 'Liquid iron, nickel, and lighter elements (S, O, Si)', description: 'Vigorous convection drives the geodynamo that produces Earth’s protective magnetic field.', color: '#F77F00', radiusPercent: 0.55 },
      { name: 'Lower & Upper Mantle', depth: '3,480 - 6,340 km', composition: 'Viscous silicate rock (Bridgmanite & Perovskite)', description: 'Slow convection currents drive continental drift and volcanic activity.', color: '#D62828', radiusPercent: 0.98 },
      { name: 'Lithospheric Crust', depth: '6,340 - 6,371 km', composition: 'Granitic continental (30-70km) & Basaltic oceanic (5-10km) crust', description: 'Dynamic tectonic plates supporting all terrestrial ecosystems.', color: '#2A9D8F', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 136.1, // Earth's OM frequency in Hertz
      modFreq: 1.0,
      timbre: 'sine',
      filterFreq: 432,
      description: 'Resonant fundamental frequency representing Earth’s solar orbit'
    }
  },
  {
    id: 'mars',
    name: 'Mars',
    latinName: 'Mars',
    symbol: '♂',
    tagline: 'The red frontier of towering volcanoes, ancient river valleys, and robotic explorers',
    type: 'Terrestrial Planet',
    orderFromSun: 4,
    colorHex: '#E76F51',
    secondaryColorHex: '#C85A32',
    glowColorHex: '#F4A261',
    
    radiusKm: 3389.5,
    radiusEarthRatio: 0.532,
    visualScale: 1.8,
    
    distanceFromSunAU: 1.524,
    distanceFromSunKmDisplay: '227.9 million km (1.52 AU)',
    visualOrbitDistance: 43,
    
    orbitalPeriodDays: 686.98,
    orbitalPeriodDisplay: '687 Earth days (1.88 years)',
    orbitalSpeedKmh: 86677,
    orbitalInclinationDeg: 1.85,
    orbitalEccentricity: 0.0934,
    
    rotationPeriodHours: 24.623,
    rotationPeriodDisplay: '24 hours 37 minutes 22 seconds (1 Sol)',
    axialTiltDeg: 25.19,
    
    surfaceGravityMs2: 3.72,
    gravityEarthRatio: 0.379,
    massKg: '6.417 × 10²³ kg',
    massEarthRatio: 0.107,
    densityGcm3: 3.93,
    escapeVelocityKms: 5.027,
    
    meanTempC: -63,
    minTempC: -140,
    maxTempC: 20,
    temperatureDisplay: '-140°C (Winter poles) to +20°C (Summer noon)',
    
    moonsCount: 2,
    moonsList: [
      {
        name: 'Phobos',
        radiusKm: 11.26,
        distanceKm: 9376,
        orbitalPeriodDays: 0.319,
        description: 'Innermost potato-shaped moon orbiting just 6,000 km above the Martian surface. It orbits faster than Mars rotates, completing an orbit in 7 hours 39 minutes.',
        color: '#8D6E63',
        surfaceType: 'Carbonaceous Chondrite Regolith & Grooved Impact Fractures',
        discoveryYear: '1877',
        discoverer: 'Asaph Hall (US Naval Observatory)',
        highlights: 'Dominated by the 9-km Stickney Crater. Gravitational tidal forces are pulling it 1.8 m closer every century; in 50 million years it will disintegrate into a ring.',
        composition: 'Type I/II carbonaceous chondrite material, phyllosilicates, water-ice rich interior',
        densityGcm3: 1.87,
        gravityMs2: 0.0057
      },
      {
        name: 'Deimos',
        radiusKm: 6.2,
        distanceKm: 23463,
        orbitalPeriodDays: 1.263,
        description: 'Smooth crater-filled outer moon covered by a thick blanket of regolith that fills in impact craters. Takes 30.3 hours to orbit Mars.',
        color: '#A1887F',
        surfaceType: 'Regolith-Smoothed Carbonaceous Asteroidal Crust',
        discoveryYear: '1877',
        discoverer: 'Asaph Hall (US Naval Observatory)',
        highlights: 'Has an escape velocity of only 20 km/h (running sprint speed). Appears as a brilliant star-like beacon in the Martian night sky.',
        composition: 'Carbonaceous-rich rock, water-ice core, fine dust mantle',
        densityGcm3: 1.47,
        gravityMs2: 0.003
      }
    ],
    
    hasRings: false,
    hasAtmosphere: true,
    atmosphereGases: [
      { name: 'Carbon Dioxide (CO₂)', percentage: 95.32, color: '#E76F51' },
      { name: 'Nitrogen (N₂)', percentage: 2.6, color: '#457B9D' },
      { name: 'Argon (Ar)', percentage: 1.9, color: '#A8DADC' },
      { name: 'Oxygen & Water vapor', percentage: 0.18, color: '#F1FAEE' }
    ],
    atmosphereDescription: 'Thin atmosphere (~0.6% of Earth’s pressure) generating global dust storms and supporting dry ice polar clouds.',
    
    overview: 'Mars gets its trademark rust-red appearance from iron oxide (rust) covering its surface. Despite being half the size of Earth, it hosts the solar system’s largest volcano, deepest canyon system, and conclusive geologic proof of vast ancient rivers, lakes, and oceans.',
    funFacts: [
      'Sunsets on Mars appear distinctly blue due to fine atmospheric dust scattering red light.',
      'Olympus Mons on Mars is three times taller than Mount Everest and roughly the size of France!',
      'You can jump nearly three times higher on Mars than on Earth due to lower gravity (0.38g).'
    ],
    geologicalFeatures: [
      { name: 'Olympus Mons', type: 'Shield Volcano', description: 'Largest volcano in the solar system: 22 km high and 600 km wide.', significance: 'Formed over billions of years over a stationary mantle hotspot.' },
      { name: 'Valles Marineris', type: 'Grand Canyon System', description: 'Vast canyon spanning 4,000 km long, 200 km wide, and up to 7 km deep.', significance: 'Tectonic rift valley that could stretch across the entire United States.' },
      { name: 'Jezero Crater', type: 'Ancient River Delta', description: '45-km-wide impact basin fed by ancient river channels rich in clays.', significance: 'Active landing site for NASA’s Perseverance rover collecting biosignature samples.' }
    ],
    explorationMissions: [
      { name: 'Perseverance & Ingenuity', agency: 'NASA', year: '2020-Present', description: 'Rover caching Martian rock cores, joined by the first helicopter to fly on another planet.', highlight: 'Ingenuity completed 72 powered flights in thin Martian air.' },
      { name: 'Curiosity Rover', agency: 'NASA', year: '2011-Present', description: 'Nuclear-powered rover exploring Gale Crater for past habitability.', highlight: 'Discovered ancient freshwater lake conditions and organic molecules.' },
      { name: 'Viking 1 & 2', agency: 'NASA', year: '1975', description: 'First successful long-duration landers on Mars.', highlight: 'Transmitted first color photographs from the Martian surface.' }
    ],
    internalLayers: [
      { name: 'Dense Iron-Nickel Core', depth: '0 - 1,800 km', composition: 'Partially liquid iron-nickel-sulfur core', description: 'Recent InSight seismic data confirmed core is liquid and ~1,830 km in radius.', color: '#E07A5F', radiusPercent: 0.54 },
      { name: 'Silicate Mantle', depth: '1,800 - 3,340 km', composition: 'Olivine and pyroxene rich silicate rock', description: 'Rigid mantle lacking active plate tectonics.', color: '#9B2226', radiusPercent: 0.97 },
      { name: 'Iron-Rich Crust', depth: '3,340 - 3,390 km', composition: 'Basaltic rock covered in fine iron-oxide dust', description: 'Global crust varying from 20 km in north to 80 km in south (crustal dichotomy).', color: '#E76F51', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 144.7,
      modFreq: 1.88,
      timbre: 'triangle',
      filterFreq: 380,
      description: 'Wind whistle echoing through Valles Marineris canyon'
    }
  },
  {
    id: 'ceres',
    name: 'Ceres (Asteroid Belt)',
    latinName: 'Ceres',
    symbol: '⚳',
    tagline: 'The ocean dwarf planet reigning over millions of rocky asteroids',
    type: 'Dwarf Planet',
    orderFromSun: 5,
    colorHex: '#8E9AAF',
    secondaryColorHex: '#6C757D',
    glowColorHex: '#CBC0D3',
    
    radiusKm: 473.0,
    radiusEarthRatio: 0.074,
    visualScale: 1.2,
    
    distanceFromSunAU: 2.767,
    distanceFromSunKmDisplay: '414 million km (2.77 AU)',
    visualOrbitDistance: 53,
    
    orbitalPeriodDays: 1681.6,
    orbitalPeriodDisplay: '4.6 Earth years',
    orbitalSpeedKmh: 64404,
    orbitalInclinationDeg: 10.59,
    orbitalEccentricity: 0.0758,
    
    rotationPeriodHours: 9.074,
    rotationPeriodDisplay: '9 hours 4 minutes',
    axialTiltDeg: 4.0,
    
    surfaceGravityMs2: 0.28,
    gravityEarthRatio: 0.029,
    massKg: '9.393 × 10²⁰ kg',
    massEarthRatio: 0.00015,
    densityGcm3: 2.16,
    escapeVelocityKms: 0.51,
    
    meanTempC: -105,
    minTempC: -143,
    maxTempC: -38,
    temperatureDisplay: '-143°C to -38°C',
    
    moonsCount: 0,
    moonsList: [],
    
    hasRings: false,
    hasAtmosphere: false,
    atmosphereGases: [
      { name: 'Water Vapor (Exosphere)', percentage: 100, color: '#A0C4FF' }
    ],
    atmosphereDescription: 'Transient water vapor exosphere produced when ice sublimates on the sunlit surface.',
    
    overview: 'Ceres is the largest object in the Asteroid Belt between Mars and Jupiter, accounting for 1/3 of the entire belt’s mass. Classified as a dwarf planet, Ceres possesses an ice-rich mantle, cryovolcanoes, and mysterious glowing sodium-carbonate salt deposits inside Occator Crater.',
    funFacts: [
      'Ceres may contain more fresh water in its ice mantle than all of Earth’s rivers and lakes combined!',
      'It was the very first asteroid discovered (by Giuseppe Piazzi on New Year’s Day 1801) and was considered a planet for 50 years.',
      'NASA’s Dawn spacecraft orbited both the giant asteroid Vesta and dwarf planet Ceres.'
    ],
    geologicalFeatures: [
      { name: 'Occator Crater & Cerealia Facula', type: 'Salt Dome Complex', description: '92-km impact crater with ultra-bright salt deposits in its center.', significance: 'Formed by subsurface briny hydrothermal eruptions (cryovolcanism).' },
      { name: 'Ahuna Mons', type: 'Cryovolcano', description: 'Steep 4-km-high volcanic dome composed of icy mud and salts.', significance: 'Youngest ice volcano discovered in the asteroid belt.' }
    ],
    explorationMissions: [
      { name: 'Dawn Mission', agency: 'NASA', year: '2007-2018', description: 'First probe to orbit two extraterrestrial destinations (Vesta & Ceres).', highlight: 'Mapped Ceres in sub-meter resolution and detected subsurface brines.' }
    ],
    internalLayers: [
      { name: 'Rocky Silicate Core', depth: '0 - 380 km', composition: 'Hydrated silicates and carbonates', description: 'Dense core containing much of Ceres’ mass.', color: '#4A4E69', radiusPercent: 0.75 },
      { name: 'Water-Ice & Mud Mantle', depth: '380 - 460 km', composition: 'Water ice, salts, and hydrated minerals', description: 'Subsurface reservoir that harbored an ancient global brine ocean.', color: '#9A8C98', radiusPercent: 0.95 },
      { name: 'Salt-Dust Crust', depth: '460 - 473 km', composition: 'Clay, iron-rich phyllosilicates, sodium carbonate', description: 'Dark, carbon-rich crust peppered with bright salt deposits.', color: '#8E9AAF', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 110,
      modFreq: 0.6,
      timbre: 'triangle',
      filterFreq: 280,
      description: 'Low icy harmonic resonance in the Asteroid Belt'
    }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    latinName: 'Iuppiter',
    symbol: '♃',
    tagline: 'The colossal king of planets with roaring storm bands and 95 orbiting worlds',
    type: 'Gas Giant',
    orderFromSun: 6,
    colorHex: '#C97A3E',
    secondaryColorHex: '#E0A96D',
    glowColorHex: '#F3C98B',
    
    radiusKm: 69911,
    radiusEarthRatio: 10.97,
    visualScale: 5.8,
    
    distanceFromSunAU: 5.204,
    distanceFromSunKmDisplay: '778.5 million km (5.20 AU)',
    visualOrbitDistance: 66,
    
    orbitalPeriodDays: 4332.59,
    orbitalPeriodDisplay: '11.86 Earth years',
    orbitalSpeedKmh: 47051,
    orbitalInclinationDeg: 1.304,
    orbitalEccentricity: 0.0485,
    
    rotationPeriodHours: 9.925,
    rotationPeriodDisplay: '9 hours 55 minutes (Fastest spin in solar system)',
    axialTiltDeg: 3.13,
    
    surfaceGravityMs2: 24.79,
    gravityEarthRatio: 2.528,
    massKg: '1.898 × 10²⁷ kg',
    massEarthRatio: 317.8,
    densityGcm3: 1.33,
    escapeVelocityKms: 59.5,
    
    meanTempC: -110,
    minTempC: -145,
    maxTempC: 24000, // Core
    temperatureDisplay: 'Cloud tops: -110°C | Core: ~24,000°C',
    
    moonsCount: 95,
    moonsList: [
      {
        name: 'Io',
        radiusKm: 1821.6,
        distanceKm: 421700,
        orbitalPeriodDays: 1.769,
        description: 'Most volcanically active body in the Solar System with over 400 active volcanoes. Tidal gravitational friction from Jupiter, Europa, and Ganymede relentlessly stretches Io by up to 100 meters, driving continuous sulfur and silicate eruptions.',
        color: '#F4D03F',
        surfaceType: 'Sulfur Lakes, Volcanic Calderas & Silicate Lava Flows',
        discoveryYear: '1610',
        discoverer: 'Galileo Galilei',
        highlights: 'Ejects over 1 ton of volcanic gas and sulfur dioxide per second into Jupiter’s magnetosphere, creating a massive glowing plasma torus.',
        composition: 'Silicate rock, iron/iron-sulfide core, sulfur and sulfur dioxide frost',
        densityGcm3: 3.53,
        gravityMs2: 1.796
      },
      {
        name: 'Europa',
        radiusKm: 1560.8,
        distanceKm: 670900,
        orbitalPeriodDays: 3.551,
        description: 'Smooth, brilliant ice-crusted world harboring a global subsurface saltwater ocean containing twice the volume of all Earth’s oceans combined. Considered the most promising candidate for extraterrestrial life.',
        color: '#E5E7E9',
        surfaceType: 'Water-Ice Crust with Reddish Lineae & Chaos Terrain',
        discoveryYear: '1610',
        discoverer: 'Galileo Galilei',
        highlights: 'Heated by tidal flexing; active cryovolcanic plumes blast water vapor hundreds of kilometers into space. Target of NASA’s Europa Clipper mission.',
        composition: 'Water-ice shell (15-25 km), deep global ocean (60-150 km), silicate mantle, metallic core',
        densityGcm3: 3.01,
        gravityMs2: 1.315
      },
      {
        name: 'Ganymede',
        radiusKm: 2634.1,
        distanceKm: 1070400,
        orbitalPeriodDays: 7.155,
        description: 'Largest moon in the Solar System—larger than planet Mercury and dwarf planet Pluto. It is the only known moon with its own intrinsic convecting liquid-iron magnetic field, generating permanent auroral belts.',
        color: '#A6ACAF',
        surfaceType: 'Grooved Tectonic Terrain & Ancient Cratered Ice-Rock',
        discoveryYear: '1610',
        discoverer: 'Galileo Galilei',
        highlights: 'Features a massive subterranean saltwater ocean sandwiched between deep high-pressure ice layers. Target of ESA’s JUICE probe.',
        composition: 'Equal parts water ice and silicate rock with a molten iron-nickel core',
        densityGcm3: 1.94,
        gravityMs2: 1.428
      },
      {
        name: 'Callisto',
        radiusKm: 2410.3,
        distanceKm: 1882700,
        orbitalPeriodDays: 16.689,
        description: 'The most heavily cratered object in the Solar System. Its surface is an ancient, geologically inactive time capsule unchanged for 4 billion years, dominated by the colossal multi-ring Valhalla impact basin.',
        color: '#7F8C8D',
        surfaceType: 'Ancient Saturated Impact Basins & Eroded Ice Pinacles',
        discoveryYear: '1610',
        discoverer: 'Galileo Galilei',
        highlights: 'Lowest radiation exposure of any Galilean moon, making it the premier prospective staging base for future human exploration of the Jovian system.',
        composition: 'Incompletely differentiated mixture of 40% ice and 60% rocky silicates',
        densityGcm3: 1.83,
        gravityMs2: 1.235
      },
      {
        name: 'Amalthea',
        radiusKm: 83.5,
        distanceKm: 181400,
        orbitalPeriodDays: 0.498,
        description: 'Reddish, highly irregular inner moon orbiting deep within Jupiter’s intense radiation belts. It sheds fine dust that maintains Jupiter’s Gossamer Ring.',
        color: '#C0392B',
        surfaceType: 'Porous Water Ice Stained by Volcanic Sulfur from Io',
        discoveryYear: '1892',
        discoverer: 'Edward Emerson Barnard (Lick Observatory)',
        highlights: 'One of the reddest objects in the solar system; radiates more heat than it receives from the Sun due to intense Jovian electromagnetic induction.',
        composition: 'Porous water ice rubble pile with tholins and sulfur compounds',
        densityGcm3: 0.86,
        gravityMs2: 0.02
      },
      {
        name: 'Himalia',
        radiusKm: 85.0,
        distanceKm: 11460000,
        orbitalPeriodDays: 250.56,
        description: 'Largest irregular satellite of Jupiter, leading a family of prograde outer moons likely originating from a captured C-type asteroid.',
        color: '#95A5A6',
        surfaceType: 'Carbonaceous Asteroidal Regolith',
        discoveryYear: '1904',
        discoverer: 'Charles Dillon Perrine (Lick Observatory)',
        highlights: 'Imaged by Cassini during its Jupiter flyby in 2000, revealing an elongated rough asteroid-like silhouette.',
        composition: 'Carbonaceous rock and water ice',
        densityGcm3: 2.6,
        gravityMs2: 0.062
      }
    ],
    
    hasRings: true,
    ringDetails: {
      innerRadius: 1.3,
      outerRadius: 1.8,
      colors: ['#C97A3E'],
      tiltDeg: 3.1
    },
    hasAtmosphere: true,
    atmosphereGases: [
      { name: 'Hydrogen (H₂)', percentage: 89.8, color: '#C97A3E' },
      { name: 'Helium (He)', percentage: 10.2, color: '#E0A96D' },
      { name: 'Methane, Ammonia, Water', percentage: 0.1, color: '#FFF3B0' }
    ],
    atmosphereDescription: 'Violent atmospheric jet streams exceeding 500 km/h creating alternating light zones and dark belts with storms lasting centuries.',
    
    overview: 'Jupiter is more than twice as massive as all other solar system planets combined. Its immense gravitational sphere acts as a planetary shield, deflecting or capturing comets. Deep within its churning gaseous atmosphere lies a sea of liquid metallic hydrogen conducting enormous electrical currents.',
    funFacts: [
      'The Great Red Spot is a high-pressure anticyclonic storm wider than Earth that has raged for over 350 years.',
      'Jupiter has the shortest day of any planet: one full rotation takes less than 10 hours.',
      'Jupiter’s magnetic field is 20,000 times stronger than Earth’s, creating intense radiation belts.'
    ],
    geologicalFeatures: [
      { name: 'The Great Red Spot', type: 'Anticyclonic Storm', description: '16,000 km wide oval storm rotating counter-clockwise at 430 km/h.', significance: 'Deep roots extend over 300 km into the atmosphere.' },
      { name: 'Equatorial Jet Bands', type: 'Atmospheric Zonal Flow', description: 'Counter-flowing planetary jet streams separated by high-shear vortices.', significance: 'Driven by internal planetary heat radiating from the core.' },
      { name: 'Polar Auroral Rings', type: 'Electromagnetic Footprints', description: 'Continuous mega-auroras powered by ions ejected from volcanic moon Io.', significance: 'Hundreds of times more energetic than Earth’s auroras.' }
    ],
    explorationMissions: [
      { name: 'Juno', agency: 'NASA', year: '2016-Present', description: 'Polar-orbiting solar-powered spacecraft probing Jupiter’s deep interior and core.', highlight: 'Revealed a diffuse, fuzzy "dilute core" and geometric polar cyclones.' },
      { name: 'Galileo Orbiter & Probe', agency: 'NASA', year: '1989-2003', description: 'First craft to orbit Jupiter and drop an atmospheric entry probe.', highlight: 'Discovered evidence of Europa’s subsurface ocean.' },
      { name: 'Europa Clipper & JUICE', agency: 'NASA/ESA', year: '2023-Present', description: 'Flagship missions on their way to investigate the habitability of icy ocean moons.', highlight: 'Will perform dozens of low-altitude flybys of Europa and Ganymede.' }
    ],
    internalLayers: [
      { name: 'Diffuse Heavy Element Core', depth: '0 - 15,000 km', composition: 'Dense rock, ice, and dissolved metallic hydrogen', description: 'Fuzzy dissolved core ~10-20 times Earth’s mass.', color: '#4A3B32', radiusPercent: 0.22 },
      { name: 'Liquid Metallic Hydrogen', depth: '15,000 - 55,000 km', composition: 'Super-pressurized hydrogen acting as an electrical conductor', description: 'Generates the strongest magnetic field in the planetary system.', color: '#E07A5F', radiusPercent: 0.78 },
      { name: 'Liquid Molecular Hydrogen & Helium', depth: '55,000 - 68,000 km', composition: 'Supercritical hydrogen-helium fluid', description: 'Gradually transitions from liquid to gas with no solid boundary.', color: '#DDA15E', radiusPercent: 0.95 },
      { name: 'Ammonia & Water Cloud Layer', depth: '68,000 - 69,911 km', composition: 'Ammonia ice, ammonium hydrosulfide, water clouds', description: 'Visible dynamic colorful storm bands and vortex belts.', color: '#C97A3E', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 183.58,
      modFreq: 0.3,
      timbre: 'sawtooth',
      filterFreq: 500,
      description: 'Booming electromagnetic plasma roar recorded by Juno spacecraft'
    }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    latinName: 'Saturnus',
    symbol: '♄',
    tagline: 'The jewel of the solar system crowned with magnificent ice ring systems',
    type: 'Gas Giant',
    orderFromSun: 7,
    colorHex: '#E6BA75',
    secondaryColorHex: '#D4A373',
    glowColorHex: '#F4E0A5',
    
    radiusKm: 58232,
    radiusEarthRatio: 9.13,
    visualScale: 5.0,
    
    distanceFromSunAU: 9.537,
    distanceFromSunKmDisplay: '1.43 billion km (9.54 AU)',
    visualOrbitDistance: 82,
    
    orbitalPeriodDays: 10759.22,
    orbitalPeriodDisplay: '29.45 Earth years',
    orbitalSpeedKmh: 34821,
    orbitalInclinationDeg: 2.485,
    orbitalEccentricity: 0.0541,
    
    rotationPeriodHours: 10.656,
    rotationPeriodDisplay: '10 hours 39 minutes',
    axialTiltDeg: 26.73,
    
    surfaceGravityMs2: 10.44,
    gravityEarthRatio: 1.065,
    massKg: '5.683 × 10²⁶ kg',
    massEarthRatio: 95.16,
    densityGcm3: 0.687, // Less dense than water!
    escapeVelocityKms: 35.5,
    
    meanTempC: -140,
    minTempC: -178,
    maxTempC: 11700, // Core
    temperatureDisplay: 'Cloud tops: -140°C | Core: ~11,700°C',
    
    moonsCount: 146,
    moonsList: [
      {
        name: 'Titan',
        radiusKm: 2574.7,
        distanceKm: 1221870,
        orbitalPeriodDays: 15.945,
        description: 'Second largest moon in the Solar System; the only moon with a dense nitrogen atmosphere (1.5x Earth sea level pressure) and an active hydrological cycle of liquid methane/ethane clouds, rain, river channels, and giant polar seas like Kraken Mare.',
        color: '#E0A96D',
        surfaceType: 'Liquid Methane/Ethane Seas, Organic Sand Dunes & Water-Ice Bedrock',
        discoveryYear: '1655',
        discoverer: 'Christiaan Huygens',
        highlights: 'ESA’s Huygens probe landed on Titan in 2005, transmitting historic audio and panoramas of river cobblestones. NASA’s Dragonfly rotorcraft is slated to arrive in 2034.',
        composition: 'Water-ice mantle, deep subterranean ocean, rocky silicate core, organic tholin haze',
        densityGcm3: 1.88,
        gravityMs2: 1.352
      },
      {
        name: 'Enceladus',
        radiusKm: 252.1,
        distanceKm: 238040,
        orbitalPeriodDays: 1.370,
        description: 'Dazzling, ultra-reflective pure white ice world harboring a global subsurface hydrothermal saltwater ocean. Cryovolcanic geysers at the south pole continuously erupt ice crystals, water vapor, and complex organic macromolecules into space.',
        color: '#FFFFFF',
        surfaceType: 'Pure Reflective Water Ice with Thermal "Tiger Stripe" Fractures',
        discoveryYear: '1789',
        discoverer: 'William Herschel',
        highlights: 'Cryovolcanic plumes supply the ice crystals that construct Saturn’s entire outer E-Ring; contains hydrothermal vents with molecular hydrogen—a prime energy source for microbial life.',
        composition: 'Pristine water-ice crust (20-25 km), global ocean (30-40 km), porous silicate core',
        densityGcm3: 1.61,
        gravityMs2: 0.113
      },
      {
        name: 'Mimas',
        radiusKm: 198.2,
        distanceKm: 185540,
        orbitalPeriodDays: 0.942,
        description: 'Famous as the "Death Star" moon due to the colossal 130-km Herschel Crater, spanning nearly a third of the moon’s diameter with central peaks 6 km high.',
        color: '#BDC3C7',
        surfaceType: 'Heavily Impacted Water-Ice Crust with Giant Impact Chasm',
        discoveryYear: '1789',
        discoverer: 'William Herschel',
        highlights: 'Gravitational orbital resonance with particles cleared the famous 4,800-km Cassini Division in Saturn’s rings. Recent orbital libration measurements revealed a young stealth ocean under its ice.',
        composition: 'Nearly pure water ice with a small rocky core',
        densityGcm3: 1.15,
        gravityMs2: 0.064
      },
      {
        name: 'Iapetus',
        radiusKm: 734.5,
        distanceKm: 3560820,
        orbitalPeriodDays: 79.321,
        description: 'The dramatic yin-yang two-tone moon of Saturn: its leading hemisphere (Cassini Regio) is dark as coal, while its trailing hemisphere (Roncevaux Terra) is brilliant snow white.',
        color: '#7F8C8D',
        surfaceType: 'Two-Tone Albedo Contrast & Equatorial Mountain Ridge',
        discoveryYear: '1671',
        discoverer: 'Giovanni Domenico Cassini',
        highlights: 'Features a colossal 20-km-high equatorial mountain wall that wraps three-quarters of the equator, giving Iapetus the distinct appearance of a cosmic walnut.',
        composition: 'Low density mixture of 80% water ice and 20% rocky silicates and swept-up outer dark dust',
        densityGcm3: 1.088,
        gravityMs2: 0.223
      },
      {
        name: 'Rhea',
        radiusKm: 763.8,
        distanceKm: 527100,
        orbitalPeriodDays: 4.518,
        description: 'Second largest moon of Saturn and ninth largest in the solar system. A heavily cratered ice world with bright, wispy fracture lineae and a tenuous exosphere containing oxygen and carbon dioxide.',
        color: '#D5DBDB',
        surfaceType: 'Ancient Cratered Ice Shell & Wispy Tectonic Scarps',
        discoveryYear: '1672',
        discoverer: 'Giovanni Domenico Cassini',
        highlights: 'Cassini spacecraft detected a faint oxygen exosphere maintained by magnetospheric ion radiolysis splitting water ice molecules on the surface.',
        composition: '75% water ice and 25% rocky core material',
        densityGcm3: 1.236,
        gravityMs2: 0.264
      },
      {
        name: 'Dione',
        radiusKm: 561.4,
        distanceKm: 377400,
        orbitalPeriodDays: 2.737,
        description: 'Densely cratered icy world marked by spectacular bright ice cliffs hundreds of meters high (wispy terrain created by tectonic fault scarps).',
        color: '#EAEDED',
        surfaceType: 'Braided Ice Cliffs (Chasmata) & Smooth Plains',
        discoveryYear: '1684',
        discoverer: 'Giovanni Domenico Cassini',
        highlights: 'Shares its orbit with two Trojan co-orbital moons: Helene (leading by 60°) and Polydeuces (trailing by 60°); gravitational field data indicates a subsurface liquid ocean.',
        composition: 'Dense rocky core surrounded by a rigid water-ice mantle and shell',
        densityGcm3: 1.478,
        gravityMs2: 0.232
      },
      {
        name: 'Tethys',
        radiusKm: 531.1,
        distanceKm: 294660,
        orbitalPeriodDays: 1.888,
        description: 'High-albedo water-ice world dominated by Odysseus Crater (400 km wide) and Ithaca Chasma—a titanic canyon system 2,000 km long and up to 5 km deep.',
        color: '#EBEDEF',
        surfaceType: 'Pristine Porous Water Ice & Titanic Grabens',
        discoveryYear: '1684',
        discoverer: 'Giovanni Domenico Cassini',
        highlights: 'Has a density of only 0.98 g/cm³, meaning it is composed of virtually 100% pure porous water ice. Flanked by Trojan moonlets Telesto and Calypso.',
        composition: 'Pure water ice with minimal rocky contamination',
        densityGcm3: 0.984,
        gravityMs2: 0.145
      },
      {
        name: 'Hyperion',
        radiusKm: 135.0,
        distanceKm: 1481100,
        orbitalPeriodDays: 21.277,
        description: 'Bizarre, irregular sponge-like moon with deeply recessed black-floored impact craters. It tumbles chaotically along its orbit in 4:3 gravitational resonance with Titan.',
        color: '#D4AC0D',
        surfaceType: 'Deeply Pitted Sponge-like Ice with Carbonaceous Hydrocarbons',
        discoveryYear: '1848',
        discoverer: 'William Cranch Bond, George Phillips Bond, & William Lassell',
        highlights: 'Has a void porosity exceeding 40%; its rotational period and axis are mathematically chaotic and unpredictable over time.',
        composition: 'Porous water ice rubble with complex dark organic tholins',
        densityGcm3: 0.544,
        gravityMs2: 0.02
      }
    ],
    
    hasRings: true,
    ringDetails: {
      innerRadius: 1.25,
      outerRadius: 2.35,
      colors: ['#E6BA75', '#D4A373', '#C29B64', '#FAF0CA'],
      tiltDeg: 26.73
    },
    hasAtmosphere: true,
    atmosphereGases: [
      { name: 'Hydrogen (H₂)', percentage: 96.3, color: '#E6BA75' },
      { name: 'Helium (He)', percentage: 3.25, color: '#D4A373' },
      { name: 'Methane & Ammonia', percentage: 0.45, color: '#F4E0A5' }
    ],
    atmosphereDescription: 'Golden butterscotch cloud decks with equatorial jet streams reaching 1,800 km/h and a persistent hexagonal polar storm.',
    
    overview: 'Saturn is world-renowned for its dazzling, extensive ring system composed of billions of water-ice particles ranging from dust grains to mountain-sized chunks. It is the only planet in our solar system whose average density is less than liquid water (0.69 g/cm³)—it would literally float in a giant cosmic bathtub!',
    funFacts: [
      'Saturn’s rings are over 280,000 km wide but on average only 10 to 30 meters thick!',
      'Saturn’s north pole is crowned by an enigmatic geometric six-sided jet stream storm (The Hexagon) wider than two Earths.',
      'The moon Enceladus supplies the water-ice crystals that build Saturn’s outer E-ring.'
    ],
    geologicalFeatures: [
      { name: 'The Planetary Rings & Cassini Division', type: 'Ring System', description: 'Thousands of individual ringlets with the 4,800-km-wide Cassini Gap cleared by moon Mimas.', significance: 'Most spectacular ice structure in the solar system.' },
      { name: 'North Polar Hexagon', type: 'Atmospheric Jet Stream', description: 'Geometric six-sided atmospheric vortex spinning at Saturn’s north pole.', significance: 'Unique hydrodynamic wave phenomenon spanning 30,000 km across.' },
      { name: 'Great White Spots', type: 'Periodic Superstorms', description: 'Massive convective storm outbreaks that wrap around the planet roughly every 30 years.', significance: 'Deep dredge-up of water and ammonia from the lower atmosphere.' }
    ],
    explorationMissions: [
      { name: 'Cassini-Huygens', agency: 'NASA/ESA/ASI', year: '1997-2017', description: 'Groundbreaking 13-year orbital mission concluding with the historic "Grand Finale" ring dives.', highlight: 'Landed Huygens probe on Titan and discovered Enceladus ocean geysers.' },
      { name: 'Voyager 1 & 2', agency: 'NASA', year: '1980-1981', description: 'Flyby reconnaissance discovering intricate ring structure and new moons.', highlight: 'Confirmed Titan’s dense atmosphere and dynamic ring spokes.' },
      { name: 'Dragonfly', agency: 'NASA', year: 'Planned (2028)', description: 'Rotorcraft lander to fly across the dunes and methane seas of Titan.', highlight: 'Searching for prebiotic chemical building blocks.' }
    ],
    internalLayers: [
      { name: 'Rock & Heavy Ice Core', depth: '0 - 12,000 km', composition: 'Dense silicates, iron, and high-pressure ice', description: 'Core roughly 9-22 times the mass of Earth.', color: '#3A2E2B', radiusPercent: 0.2 },
      { name: 'Liquid Metallic Hydrogen', depth: '12,000 - 32,000 km', composition: 'Metallic hydrogen with "helium rain" droplets', description: 'Precipitation of helium releases gravitational heat energy.', color: '#C08552', radiusPercent: 0.55 },
      { name: 'Liquid Molecular Hydrogen', depth: '32,000 - 56,000 km', composition: 'Liquid hydrogen transitioning to dense gas', description: 'Viscous envelope conducting internal thermal currents.', color: '#D4A373', radiusPercent: 0.95 },
      { name: 'Golden Cloud Haze', depth: '56,000 - 58,232 km', composition: 'Ammonia ice, water, and ammonium hydrosulfide clouds', description: 'Muted golden color caused by upper hydrocarbon smog.', color: '#E6BA75', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 147.85,
      modFreq: 0.4,
      timbre: 'sine',
      filterFreq: 340,
      description: 'Eerie, resonant Saturn Kilometric Radiation (SKR) radio waves'
    }
  },
  {
    id: 'uranus',
    name: 'Uranus',
    latinName: 'Uranus',
    symbol: '♅',
    tagline: 'The mysterious sideways-spinning ice giant wrapped in cyan methane haze',
    type: 'Ice Giant',
    orderFromSun: 8,
    colorHex: '#48CAE4',
    secondaryColorHex: '#0096C7',
    glowColorHex: '#ADE8F4',
    
    radiusKm: 25362,
    radiusEarthRatio: 3.98,
    visualScale: 3.4,
    
    distanceFromSunAU: 19.191,
    distanceFromSunKmDisplay: '2.87 billion km (19.19 AU)',
    visualOrbitDistance: 98,
    
    orbitalPeriodDays: 30685.4,
    orbitalPeriodDisplay: '84.0 Earth years',
    orbitalSpeedKmh: 24477,
    orbitalInclinationDeg: 0.773,
    orbitalEccentricity: 0.0463,
    
    rotationPeriodHours: -17.24, // Retrograde
    rotationPeriodDisplay: '17 hours 14 minutes (Retrograde)',
    axialTiltDeg: 97.77, // Rotates on its side!
    retrogradeRotation: true,
    
    surfaceGravityMs2: 8.69,
    gravityEarthRatio: 0.886,
    massKg: '8.681 × 10²⁵ kg',
    massEarthRatio: 14.54,
    densityGcm3: 1.27,
    escapeVelocityKms: 21.3,
    
    meanTempC: -195,
    minTempC: -224, // Coldest recorded planetary atmosphere
    maxTempC: 4700, // Core
    temperatureDisplay: 'Coldest planet: -224°C in tropopause',
    
    moonsCount: 28,
    moonsList: [
      {
        name: 'Miranda',
        radiusKm: 235.8,
        distanceKm: 129390,
        orbitalPeriodDays: 1.413,
        description: 'Bizarre "Frankenstein" jigsaw puzzle moon with three giant layered coronae and Verona Rupes—the tallest sheer cliff face in the known Solar System (20 km vertical drop).',
        color: '#E0E0E0',
        surfaceType: 'Jigsaw Tectonic Coronae, Fault Scarps & Giant Cliffs',
        discoveryYear: '1948',
        discoverer: 'Gerard Kuiper (McDonald Observatory)',
        highlights: 'An object dropped from the crest of Verona Rupes would take over 12 minutes to reach the bottom due to low gravity (0.008g)!',
        composition: 'Equal parts water ice and silicate rocky core',
        densityGcm3: 1.20,
        gravityMs2: 0.079
      },
      {
        name: 'Ariel',
        radiusKm: 578.9,
        distanceKm: 191020,
        orbitalPeriodDays: 2.520,
        description: 'The brightest and most geologically young of all Uranus’s major moons, crisscrossed by extensive network of graben valleys and smooth cryovolcanic flood plains.',
        color: '#ECEFF1',
        surfaceType: 'Interconnected Rift Grabens & Cryolava Flow Plains',
        discoveryYear: '1851',
        discoverer: 'William Lassell',
        highlights: 'Valleys reach up to 20 km wide and 2 km deep; cryovolcanic flows smoothed out ancient impact craters.',
        composition: 'Dense mixture of 50% water ice, 30% silicate rock, and 20% carbonaceous tholins',
        densityGcm3: 1.66,
        gravityMs2: 0.269
      },
      {
        name: 'Umbriel',
        radiusKm: 584.7,
        distanceKm: 266000,
        orbitalPeriodDays: 4.144,
        description: 'The darkest and most ancient Uranian moon, heavily cratered and reflecting only 16% of incident sunlight. Features the mysterious bright ring structure Wunda inside an equatorial crater.',
        color: '#78909C',
        surfaceType: 'Uniformly Dark Impact Cratered Water-Ice Crust',
        discoveryYear: '1851',
        discoverer: 'William Lassell',
        highlights: 'The 131-km Wunda crater floor is coated in an unexplained halo of brilliant reflective ice (likely carbon dioxide or pure water-ice frost).',
        composition: '40% water ice and 60% dense rocky core and dark carbonaceous hydrocarbons',
        densityGcm3: 1.39,
        gravityMs2: 0.20
      },
      {
        name: 'Titania',
        radiusKm: 788.4,
        distanceKm: 435910,
        orbitalPeriodDays: 8.706,
        description: 'The largest moon of Uranus and eighth largest in the Solar System. Its surface is scarred by massive tectonic fault scarps including Messina Chasma—a 1,500-km-long rift canyon.',
        color: '#B0BEC5',
        surfaceType: 'Colossal Tectonic Fault Scarps & Subdued Impact Basins',
        discoveryYear: '1787',
        discoverer: 'William Herschel',
        highlights: 'Thermal models indicate Titania may retain a liquid subterranean water-ammonia ocean layer at the boundary between its rocky core and ice mantle.',
        composition: '50% water ice, 35% silicate rock, 15% methane-related organic compounds',
        densityGcm3: 1.71,
        gravityMs2: 0.378
      },
      {
        name: 'Oberon',
        radiusKm: 761.4,
        distanceKm: 583520,
        orbitalPeriodDays: 13.463,
        description: 'Outermost major moon of Uranus, heavily peppered with ancient impact craters. Several crater floors (such as Hamlet and Macbeth) are covered with mysterious dark carbonaceous material.',
        color: '#90A4AE',
        surfaceType: 'Ancient Heavily Cratered Ice Crust with Dark Crater Floor Deposits',
        discoveryYear: '1787',
        discoverer: 'William Herschel',
        highlights: 'Voyager 2 imaged an 11-km-high mountain peak projecting over Oberon’s limb—possibly the central peak of an enormous impact basin.',
        composition: '50% water ice, 40% rocky core, 10% dark organics',
        densityGcm3: 1.63,
        gravityMs2: 0.346
      },
      {
        name: 'Puck',
        radiusKm: 81.0,
        distanceKm: 86000,
        orbitalPeriodDays: 0.762,
        description: 'Largest inner shepherd moon orbiting just outside Uranus’s rings. Spherical in shape and very dark, named after the mischievous sprite in Shakespeare’s A Midsummer Night’s Dream.',
        color: '#546E7A',
        surfaceType: 'Dark Carbonaceous Asteroidal Ice Regolith',
        discoveryYear: '1985',
        discoverer: 'Voyager 2 Imaging Team (Stephen P. Synnott)',
        highlights: 'Discovered during the Voyager 2 encounter; orbits within Uranus’s bright epsilon and mu ring system.',
        composition: 'Water ice contaminated by dark carbonaceous material',
        densityGcm3: 1.3,
        gravityMs2: 0.028
      }
    ],
    
    hasRings: true,
    ringDetails: {
      innerRadius: 1.4,
      outerRadius: 2.1,
      colors: ['#48CAE4', '#0096C7'],
      tiltDeg: 97.77
    },
    hasAtmosphere: true,
    atmosphereGases: [
      { name: 'Hydrogen (H₂)', percentage: 82.5, color: '#48CAE4' },
      { name: 'Helium (He)', percentage: 15.2, color: '#0096C7' },
      { name: 'Methane (CH₄)', percentage: 2.3, color: '#90E0EF' }
    ],
    atmosphereDescription: 'Cyan color caused by atmospheric methane absorbing red light; experiences extreme 42-year-long polar winters and summers.',
    
    overview: 'Uranus is unique because its axial tilt is an astounding 97.8°—it essentially rolls along its orbital path on its side! This extreme tilt is believed to be caused by a cataclysmic collision with an Earth-sized protoplanet billions of years ago. It also radiates very little internal heat, making it the coldest atmosphere in the solar system.',
    funFacts: [
      'Because Uranus rotates on its side, each pole gets 42 years of continuous sunlight followed by 42 years of total darkness!',
      'All 28 moons of Uranus are named after characters from William Shakespeare and Alexander Pope.',
      'Uranus has 13 narrow dark rings made of carbonaceous boulder-sized material.'
    ],
    geologicalFeatures: [
      { name: 'Verona Rupes (on Miranda)', type: 'Tectonic Fault Cliff', description: '20-km sheer cliff face: an object dropped from the top would take 12 minutes to fall to the bottom!', significance: 'Toughest extreme topography in the solar system.' },
      { name: 'Tilted Off-Center Magnetic Field', type: 'Complex Magnetosphere', description: 'Magnetic axis tilted 59° from rotational axis and offset by 1/3 planet radius.', significance: 'Generated by convection in an electrical water-ammonia ionic ocean mantle.' }
    ],
    explorationMissions: [
      { name: 'Voyager 2', agency: 'NASA', year: '1986', description: 'Only spacecraft to ever fly past Uranus, discovering 10 new moons and 2 new rings.', highlight: 'Discovered the bizarre off-center magnetic field and imaged Miranda.' },
      { name: 'Uranus Orbiter & Probe (UOP)', agency: 'NASA (Prioritized)', year: 'Concept (2030s)', description: 'Top recommended NASA flagship mission to deploy an atmospheric probe and study the system in depth.', highlight: 'Decadal survey #1 priority.' }
    ],
    internalLayers: [
      { name: 'Rocky Silicate/Iron Core', depth: '0 - 5,000 km', composition: 'Iron, nickel, and silicate rock', description: 'Modest core with mass ~0.55 Earth masses.', color: '#2B2D42', radiusPercent: 0.2 },
      { name: 'Supercritical Water-Ammonia Mantle', depth: '5,000 - 20,000 km', composition: 'Dense "icy" slush of water, ammonia, and methane under high pressure', description: 'High electrical conductivity generates chaotic magnetic fields (the "diamond rain" layer).', color: '#0077B6', radiusPercent: 0.8 },
      { name: 'Methane-Hydrogen Atmosphere', depth: '20,000 - 25,362 km', composition: 'Hydrogen, helium, and methane cloud decks', description: 'Calm exterior with methane ice clouds and rare storm outbursts.', color: '#48CAE4', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 207.36,
      modFreq: 0.15,
      timbre: 'triangle',
      filterFreq: 600,
      description: 'Chilly, shimmering high-latitude whistler wave tones'
    }
  },
  {
    id: 'neptune',
    name: 'Neptune',
    latinName: 'Neptunus',
    symbol: '♆',
    tagline: 'The dynamic, vivid azure ice giant scourged by supersonic storm winds',
    type: 'Ice Giant',
    orderFromSun: 9,
    colorHex: '#0077B6',
    secondaryColorHex: '#023E8A',
    glowColorHex: '#00B4D8',
    
    radiusKm: 24622,
    radiusEarthRatio: 3.86,
    visualScale: 3.3,
    
    distanceFromSunAU: 30.07,
    distanceFromSunKmDisplay: '4.50 billion km (30.07 AU)',
    visualOrbitDistance: 114,
    
    orbitalPeriodDays: 60189.0,
    orbitalPeriodDisplay: '164.8 Earth years',
    orbitalSpeedKmh: 19566,
    orbitalInclinationDeg: 1.77,
    orbitalEccentricity: 0.0086,
    
    rotationPeriodHours: 16.11,
    rotationPeriodDisplay: '16 hours 6 minutes',
    axialTiltDeg: 28.32,
    
    surfaceGravityMs2: 11.15,
    gravityEarthRatio: 1.137,
    massKg: '1.024 × 10²⁶ kg',
    massEarthRatio: 17.15,
    densityGcm3: 1.64,
    escapeVelocityKms: 23.5,
    
    meanTempC: -201,
    minTempC: -218,
    maxTempC: 7000, // Core
    temperatureDisplay: 'Cloud tops: -201°C | Core: ~7,000°C',
    
    moonsCount: 16,
    moonsList: [
      {
        name: 'Triton',
        radiusKm: 1353.4,
        distanceKm: 354760,
        orbitalPeriodDays: -5.877, // Retrograde
        description: 'Captured Kuiper Belt dwarf planet orbiting backward (retrograde). One of the coldest bodies in the solar system (-235°C), featuring active cryovolcanic geysers that blast plumes of liquid nitrogen and dark organic dust 8 km high into a tenuous nitrogen atmosphere.',
        color: '#E0F7FA',
        surfaceType: 'Frozen Nitrogen/Methane Ices, "Cantaloupe Terrain" & Cryogeysers',
        discoveryYear: '1846',
        discoverer: 'William Lassell (17 days after Neptune was discovered)',
        highlights: 'Triton’s retrograde orbit causes tidal deceleration; in 3.6 billion years it will cross Neptune’s Roche limit and shatter into a spectacular ring system wider than Saturn’s.',
        composition: 'Metallic/silicate core (2/3 mass), water-ice mantle, surface crust of nitrogen, methane, and CO₂ ices',
        densityGcm3: 2.061,
        gravityMs2: 0.779
      },
      {
        name: 'Proteus',
        radiusKm: 210.0,
        distanceKm: 117647,
        orbitalPeriodDays: 1.122,
        description: 'Heavily cratered, irregular boxy moon and the second largest in Neptune’s family. Dominated by the giant 230-km Pharos Crater.',
        color: '#90A4AE',
        surfaceType: 'Battered Dark Carbonaceous Water-Ice Regolith',
        discoveryYear: '1989',
        discoverer: 'Voyager 2 Science Team (Stephen P. Synnott)',
        highlights: 'Pushed to the absolute physical limit of how large an irregular body can become without being pulled into a sphere by its own gravity.',
        composition: 'Porous water ice mixed with dark carbonaceous silicates',
        densityGcm3: 1.3,
        gravityMs2: 0.07
      },
      {
        name: 'Nereid',
        radiusKm: 170.0,
        distanceKm: 5513818,
        orbitalPeriodDays: 360.13,
        description: 'Possesses one of the most eccentric orbits of any moon in the Solar System (e = 0.75), causing its distance from Neptune to swing dramatically between 1.4 million km and 9.6 million km.',
        color: '#B0BEC5',
        surfaceType: 'Water-Ice Crust with High Albedo Variations',
        discoveryYear: '1949',
        discoverer: 'Gerard Kuiper (McDonald Observatory)',
        highlights: 'Likely an ancient regular moon whose orbit was violently perturbed into a wild ellipse when giant Triton was gravitationally captured by Neptune.',
        composition: 'Water ice and silicate rock mixture',
        densityGcm3: 1.5,
        gravityMs2: 0.071
      },
      {
        name: 'Larissa',
        radiusKm: 97.0,
        distanceKm: 73548,
        orbitalPeriodDays: 0.555,
        description: 'Irregular, heavily cratered inner moon orbiting within Neptune’s faint ring system. Slowly spiraling inward toward Neptune due to tidal deceleration.',
        color: '#78909C',
        surfaceType: 'Dark Carbonaceous Asteroidal Rubble Regolith',
        discoveryYear: '1981 / 1989',
        discoverer: 'Harold J. Reitsema, William B. Hubbard, & Voyager 2',
        highlights: 'First detected during a ground-based stellar occultation in 1981 and confirmed by Voyager 2 flyby images in 1989.',
        composition: 'Water ice rubble pile coated in dark carbon compounds',
        densityGcm3: 1.2,
        gravityMs2: 0.035
      },
      {
        name: 'Despina',
        radiusKm: 75.0,
        distanceKm: 52526,
        orbitalPeriodDays: 0.335,
        description: 'Inner shepherd moon orbiting inside the Le Verrier ring, gravitationally confining and sculpting Neptune’s clumpy ring arcs.',
        color: '#607D8B',
        surfaceType: 'Dark Carbon-Rich Asteroidal Ice Crust',
        discoveryYear: '1989',
        discoverer: 'Voyager 2 Science Team (Stephen P. Synnott)',
        highlights: 'Orbits below Neptune’s synchronous orbit radius, completing a full orbit in just 8 hours.',
        composition: 'Water ice and dark organic tholins',
        densityGcm3: 1.2,
        gravityMs2: 0.027
      }
    ],
    
    hasRings: true,
    ringDetails: {
      innerRadius: 1.3,
      outerRadius: 1.9,
      colors: ['#0077B6', '#023E8A'],
      tiltDeg: 28.32
    },
    hasAtmosphere: true,
    atmosphereGases: [
      { name: 'Hydrogen (H₂)', percentage: 80.0, color: '#0077B6' },
      { name: 'Helium (He)', percentage: 19.0, color: '#023E8A' },
      { name: 'Methane (CH₄)', percentage: 1.5, color: '#00B4D8' }
    ],
    atmosphereDescription: 'Electric deep-blue atmosphere driven by powerful internal heat, generating the fastest wind speeds recorded anywhere in the solar system (2,100 km/h).',
    
    overview: 'Neptune is the eighth and farthest major planet from the Sun. It was the first planet located via mathematical prediction rather than empirical observation (by Urbain Le Verrier). Unlike Uranus, Neptune radiates 2.6 times more energy than it absorbs from the Sun, fueling fierce supersonic storms and bright white methane cirrus clouds.',
    funFacts: [
      'Neptune has the fastest planetary winds in the solar system, clocking speeds over 2,100 km/h (1,300 mph)!',
      'It takes Neptune 165 Earth years to complete one single orbit around the Sun; it completed its first post-discovery orbit in 2011.',
      'Neptune’s largest moon Triton is in a backward retrograde orbit and will eventually be torn apart by tidal forces to create a giant ring.'
    ],
    geologicalFeatures: [
      { name: 'The Great Dark Spot', type: 'Anticyclonic Storm', description: 'Earth-sized storm vortex first imaged by Voyager 2, surrounded by white cirrus clouds.', significance: 'Shows rapid storm birth and dissipation over few-year cycles.' },
      { name: 'Triton Nitrogen Cryogeysers', type: 'Active Cryovolcanism', description: 'Geysers blasting plumes of liquid nitrogen and dark dust 8 km up into Triton’s thin atmosphere.', significance: 'One of only a few geologically active worlds known.' },
      { name: 'Ring Arcs (Galle, Le Verrier, Adams)', type: 'Clumpy Ring Arcs', description: 'Rings containing bright clumps named Liberté, Égalité, and Fraternité.', significance: 'Gravitationally herded and stabilized by moon Galatea.' }
    ],
    explorationMissions: [
      { name: 'Voyager 2', agency: 'NASA', year: '1989', description: 'Only probe ever to explore Neptune, skimming 4,950 km above its north pole.', highlight: 'Discovered 6 new moons, confirmed rings, and photographed Triton geysers.' },
      { name: 'Hubble & James Webb Space Telescope', agency: 'NASA/ESA/CSA', year: '1990-Present', description: 'Long-term monitoring of Neptune’s cloud dynamics and rings in infrared wavelengths.', highlight: 'JWST captured the clearest view of Neptune’s rings in 30+ years.' }
    ],
    internalLayers: [
      { name: 'Iron-Nickel & Rock Core', depth: '0 - 5,500 km', composition: 'Iron, nickel, and silicate minerals (~1.2 Earth masses)', description: 'Extreme pressure center reaching 7,000°C.', color: '#1B263B', radiusPercent: 0.22 },
      { name: 'Hot High-Pressure Icy Fluid Mantle', depth: '5,500 - 20,000 km', composition: 'Dense, hot supercritical ionic fluid of water, ammonia, and methane', description: 'High electrical conductivity; extreme pressures may crystallize methane into falling diamonds!', color: '#00509D', radiusPercent: 0.82 },
      { name: 'Active Atmospheric Cloud Envelope', depth: '20,000 - 24,622 km', composition: 'Hydrogen, helium, and methane clouds with white cirrus streaks', description: 'Vivid azure blue layer with supersonic jet stream dynamics.', color: '#0077B6', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 211.44,
      modFreq: 0.2,
      timbre: 'sine',
      filterFreq: 480,
      description: 'Deep oceanic sonic vortex modulated by supersonic atmospheric winds'
    }
  },
  {
    id: 'pluto',
    name: 'Pluto (Kuiper Belt)',
    latinName: 'Pluto',
    symbol: '♇',
    tagline: 'The beloved ice dwarf with a giant beating heart of frozen nitrogen',
    type: 'Dwarf Planet',
    orderFromSun: 10,
    colorHex: '#DDA15E',
    secondaryColorHex: '#BC6C25',
    glowColorHex: '#F3C98B',
    
    radiusKm: 1188.3,
    radiusEarthRatio: 0.186,
    visualScale: 1.4,
    
    distanceFromSunAU: 39.482,
    distanceFromSunKmDisplay: '5.91 billion km (39.48 AU)',
    visualOrbitDistance: 130,
    
    orbitalPeriodDays: 90560,
    orbitalPeriodDisplay: '248.0 Earth years',
    orbitalSpeedKmh: 17064,
    orbitalInclinationDeg: 17.16, // High inclination!
    orbitalEccentricity: 0.2488,
    
    rotationPeriodHours: -153.29, // Retrograde
    rotationPeriodDisplay: '6.39 Earth days (Tidally locked to Charon)',
    axialTiltDeg: 122.53,
    retrogradeRotation: true,
    
    surfaceGravityMs2: 0.62,
    gravityEarthRatio: 0.063,
    massKg: '1.303 × 10²² kg',
    massEarthRatio: 0.0022,
    densityGcm3: 1.85,
    escapeVelocityKms: 1.21,
    
    meanTempC: -229,
    minTempC: -240,
    maxTempC: -218,
    temperatureDisplay: '-240°C to -218°C',
    
    moonsCount: 5,
    moonsList: [
      {
        name: 'Charon',
        radiusKm: 606.0,
        distanceKm: 19591,
        orbitalPeriodDays: 6.387,
        description: 'Half the diameter and 12% the mass of Pluto, forming a true double dwarf planet system where their center of gravity (barycenter) lies outside Pluto. Tidally mutually locked—the same faces of Pluto and Charon perpetually stare at each other.',
        color: '#B0BEC5',
        surfaceType: 'Water-Ice Crust with Reddish Mordor Macula Polar Cap & Serenity Chasma',
        discoveryYear: '1978',
        discoverer: 'James Christy (US Naval Observatory)',
        highlights: 'Features a colossal canyon system 4 times deeper than the Grand Canyon and a dark reddish-brown north pole (Mordor Macula) coated with processed tholins captured from Pluto’s atmosphere.',
        composition: 'Uniform water ice, ammonia hydrates, and silicate rocky core',
        densityGcm3: 1.702,
        gravityMs2: 0.288
      },
      {
        name: 'Styx',
        radiusKm: 8.0,
        distanceKm: 42656,
        orbitalPeriodDays: 20.16,
        description: 'Tiny elongated moon orbiting between Charon and Nix. Locked in an orbital resonance resonance web with Nix and Hydra.',
        color: '#CFD8DC',
        surfaceType: 'High-Albedo Water-Ice Regolith',
        discoveryYear: '2012',
        discoverer: 'Mark Showalter (Hubble Space Telescope Team)',
        highlights: 'Discovered during Hubble search campaigns to ensure the New Horizons spacecraft would safely traverse the Pluto system without colliding with debris.',
        composition: 'Water ice and minor volatile frosts',
        densityGcm3: 1.0,
        gravityMs2: 0.002
      },
      {
        name: 'Nix',
        radiusKm: 24.9,
        distanceKm: 48694,
        orbitalPeriodDays: 24.85,
        description: 'Chili-pepper shaped moon tumbling chaotically due to the fluctuating gravitational tug-of-war of the Pluto-Charon binary pair.',
        color: '#ECEFF1',
        surfaceType: 'Pristine Reflective Water-Ice Surface with Reddish Crater Patch',
        discoveryYear: '2005',
        discoverer: 'Hubble Pluto Companion Search Team',
        highlights: 'New Horizons images revealed a prominent reddish impact crater contrasting sharply with its otherwise brilliant white water-ice surface.',
        composition: 'Nearly pure crystalline water ice',
        densityGcm3: 1.37,
        gravityMs2: 0.016
      },
      {
        name: 'Kerberos',
        radiusKm: 9.5,
        distanceKm: 57783,
        orbitalPeriodDays: 32.17,
        description: 'Double-lobed peanut-shaped moon created by the gentle low-speed merger of two separate icy Kuiper Belt objects.',
        color: '#ECEFF1',
        surfaceType: 'Clean Bright Water-Ice Coating',
        discoveryYear: '2011',
        discoverer: 'Mark Showalter (Hubble Space Telescope Team)',
        highlights: 'Possesses a remarkably high albedo (reflecting ~50% of light), dispelling early theories that it was a dark carbon-rich body.',
        composition: 'Water ice rubble contact binary',
        densityGcm3: 1.0,
        gravityMs2: 0.003
      },
      {
        name: 'Hydra',
        radiusKm: 27.5,
        distanceKm: 64738,
        orbitalPeriodDays: 38.20,
        description: 'Outermost known moon of the Pluto system, spinning at a dizzying speed of once every 10 hours while tumbling chaotically.',
        color: '#F5F5F5',
        surfaceType: 'Ultra-Pure Crystalline Water-Ice Crust',
        discoveryYear: '2005',
        discoverer: 'Hubble Pluto Companion Search Team',
        highlights: 'Has the highest surface reflectivity in the Pluto system (reflecting over 83% of incident sunlight, comparable to freshly fallen snow).',
        composition: 'Coarse-grained crystalline water ice',
        densityGcm3: 1.2,
        gravityMs2: 0.02
      }
    ],
    
    hasRings: false,
    hasAtmosphere: true,
    atmosphereGases: [
      { name: 'Nitrogen (N₂)', percentage: 99.0, color: '#DDA15E' },
      { name: 'Methane (CH₄)', percentage: 0.5, color: '#BC6C25' },
      { name: 'Carbon Monoxide (CO)', percentage: 0.5, color: '#F3C98B' }
    ],
    atmosphereDescription: 'Tenuous blue-hazed nitrogen atmosphere with distinct layered hazes that expand when closest to the Sun and freeze out when farthest.',
    
    overview: 'Discovered in 1930 by Clyde Tombaugh, Pluto was classified as the ninth planet until 2006 when the IAU defined dwarf planets. In 2015, NASA’s New Horizons mission revealed a startlingly active world with a glacier of solid nitrogen shaped like a heart (Sputnik Planitia), towering 3-km-high water-ice mountains, blue skies, and possible cryovolcanism.',
    funFacts: [
      'Pluto’s orbit is so eccentric that between 1979 and 1999, it was actually closer to the Sun than Neptune!',
      'Pluto and its moon Charon are mutually tidally locked: the same faces perpetually point toward each other.',
      'Water ice on Pluto is so cold that it behaves like rigid granite rock, supporting massive mountain ranges.'
    ],
    geologicalFeatures: [
      { name: 'Sputnik Planitia', type: 'Nitrogen Glacier', description: '1,000-km-wide heart-shaped expanse of churning nitrogen, carbon monoxide, and methane ice.', significance: 'Undergoes thermal convection like a cosmic lava lamp.' },
      { name: 'Tenzing Montes & Hillary Montes', type: 'Water Ice Mountains', description: 'Jagged water-ice mountain peaks soaring 3 to 4 km high above surrounding plains.', significance: 'Proof that cold water-ice can form mountains in deep space.' },
      { name: 'Wright Mons & Piccard Mons', type: 'Giant Cryovolcanoes', description: 'Vast volcanic mounds with deep central depressions formed by icy slush eruptions.', significance: 'Evidence of heat in Pluto’s interior.' }
    ],
    explorationMissions: [
      { name: 'New Horizons', agency: 'NASA', year: '2006-Present (Pluto flyby 2015)', description: 'Fastest spacecraft launched from Earth, completing historic first flyby of Pluto and Arrokoth.', highlight: 'Transmitted high-resolution color mosaics of Pluto’s heart and blue atmosphere.' }
    ],
    internalLayers: [
      { name: 'Dense Silicate Core', depth: '0 - 850 km', composition: 'Dense rock and hydrated minerals', description: 'Accounts for roughly 70% of Pluto’s total mass.', color: '#582F0E', radiusPercent: 0.7 },
      { name: 'Subsurface Ocean / Slush Layer', depth: '850 - 1,050 km', composition: 'Subsurface liquid water-ammonia ocean', description: 'Insulated by nitrogen ice crust; prevents Sputnik Planitia from reorienting.', color: '#7F4F24', radiusPercent: 0.88 },
      { name: 'Rigid Water-Ice Crust', depth: '1,050 - 1,188 km', composition: 'Water ice coated in frozen nitrogen, methane, and tholin organics', description: 'Supports mountains and reddish-brown tholin polar stains.', color: '#DDA15E', radiusPercent: 1.0 }
    ],
    sonification: {
      baseFreq: 140.25,
      modFreq: 0.1,
      timbre: 'sine',
      filterFreq: 300,
      description: 'Ethereal, distant cryogenic resonance in the Kuiper Belt'
    }
  }
];
