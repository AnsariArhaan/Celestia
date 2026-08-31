export interface KnownStar {
  id: string;
  name: string;
  scientificName: string;
  constellation: string;
  distanceLightYears: number;
  radiusSunRatio: number; // 1.0 = Sun
  radiusKm: number;
  massSunRatio: number;
  luminositySunRatio: number; // 1.0 = Sun
  temperatureKelvin: number;
  spectralClass: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M' | 'BH';
  spectralSubtype: string;
  colorHex: string;
  glowColorHex: string;
  apparentMagnitude: number;
  absoluteMagnitude: number;
  description: string;
  historicalSignificance: string;
  isVariableStar?: boolean;
}

export const KNOWN_STARS: KnownStar[] = [
  {
    id: 'sun',
    name: 'Sun (Sol)',
    scientificName: 'Sol / Baseline Anchor',
    constellation: 'Solar System',
    distanceLightYears: 0.0000158, // 1 AU = 8.3 light minutes
    radiusSunRatio: 1.0,
    radiusKm: 696340,
    massSunRatio: 1.0,
    luminositySunRatio: 1.0,
    temperatureKelvin: 5778,
    spectralClass: 'G',
    spectralSubtype: 'G2V (Yellow Dwarf)',
    colorHex: '#FFB703',
    glowColorHex: '#FB8500',
    apparentMagnitude: -26.74,
    absoluteMagnitude: 4.83,
    description: 'Our home yellow dwarf star at the center of the Solar System, generating energy via proton-proton chain nuclear fusion.',
    historicalSignificance: 'The gravitational anchor and sole source of life-supporting light and heat for all planetary bodies in our system.'
  },
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri',
    scientificName: 'Alpha Centauri C / V645 Cen',
    constellation: 'Centaurus',
    distanceLightYears: 4.246,
    radiusSunRatio: 0.154,
    radiusKm: 107280,
    massSunRatio: 0.122,
    luminositySunRatio: 0.0017,
    temperatureKelvin: 3042,
    spectralClass: 'M',
    spectralSubtype: 'M5.5Ve (Red Flare Dwarf)',
    colorHex: '#E63946',
    glowColorHex: '#D62828',
    apparentMagnitude: 11.05,
    absoluteMagnitude: 15.60,
    isVariableStar: true,
    description: 'The closest known star to the Sun, hosting at least two confirmed exoplanets including Proxima b in its habitable zone.',
    historicalSignificance: 'Discovered in 1915 by Robert Innes; designated as the prime candidate for humanity’s first interstellar flyby missions (Breakthrough Starshot).'
  },
  {
    id: 'alpha-centauri-a',
    name: 'Alpha Centauri A (Rigil Kentaurus)',
    scientificName: 'Alpha Centauri A / HD 128620',
    constellation: 'Centaurus',
    distanceLightYears: 4.37,
    radiusSunRatio: 1.224,
    radiusKm: 852320,
    massSunRatio: 1.10,
    luminositySunRatio: 1.519,
    temperatureKelvin: 5790,
    spectralClass: 'G',
    spectralSubtype: 'G2V (Yellow Dwarf Twin)',
    colorHex: '#FFD166',
    glowColorHex: '#F4A261',
    apparentMagnitude: -0.01,
    absoluteMagnitude: 4.38,
    description: 'The primary star of the closest stellar triple-system to Earth, nearly identical in color, temperature, and mass to our Sun.',
    historicalSignificance: 'Known since antiquity as one of the southern sky celestial navigation pointers to the Southern Cross.'
  },
  {
    id: 'sirius-a',
    name: 'Sirius A (The Dog Star)',
    scientificName: 'Alpha Canis Majoris / HD 48915',
    constellation: 'Canis Major',
    distanceLightYears: 8.60,
    radiusSunRatio: 1.711,
    radiusKm: 1191437,
    massSunRatio: 2.063,
    luminositySunRatio: 25.4,
    temperatureKelvin: 9940,
    spectralClass: 'A',
    spectralSubtype: 'A1V (Blue-White Main Sequence)',
    colorHex: '#A0C4FF',
    glowColorHex: '#70A1FF',
    apparentMagnitude: -1.46,
    absoluteMagnitude: 1.42,
    description: 'The brightest star in Earth’s night sky, shining twice as bright as Canopus. It is orbited by Sirius B, the first discovered white dwarf star.',
    historicalSignificance: 'Crucial to Ancient Egyptian calendars; its heliacal rising heralded the annual life-giving flooding of the Nile River.'
  },
  {
    id: 'vega',
    name: 'Vega',
    scientificName: 'Alpha Lyrae / HD 172167',
    constellation: 'Lyra',
    distanceLightYears: 25.04,
    radiusSunRatio: 2.362,
    radiusKm: 1644755,
    massSunRatio: 2.135,
    luminositySunRatio: 40.12,
    temperatureKelvin: 9602,
    spectralClass: 'A',
    spectralSubtype: 'A0Va (Rapidly Rotating Star)',
    colorHex: '#BDE0FE',
    glowColorHex: '#90E0EF',
    apparentMagnitude: 0.03,
    absoluteMagnitude: 0.58,
    description: 'A blue-white star spinning so rapidly (12.5 hour rotation) that its equator bulges outwards by 19% compared to its poles.',
    historicalSignificance: 'The baseline zero-point star historically used to calibrate astronomical photometric magnitude systems and Northern Pole Star ~12,000 BCE.'
  },
  {
    id: 'arcturus',
    name: 'Arcturus',
    scientificName: 'Alpha Boötis / HD 124897',
    constellation: 'Boötes',
    distanceLightYears: 36.7,
    radiusSunRatio: 25.4,
    radiusKm: 17687036,
    massSunRatio: 1.08,
    luminositySunRatio: 170.0,
    temperatureKelvin: 4286,
    spectralClass: 'K',
    spectralSubtype: 'K0III (Orange Giant)',
    colorHex: '#F77F00',
    glowColorHex: '#D62828',
    apparentMagnitude: -0.05,
    absoluteMagnitude: -0.30,
    description: 'An ancient orange giant star belonging to the Galactic Halo/Thick Disk, speeding through the solar neighborhood in an eccentric inclined orbit.',
    historicalSignificance: 'Fourth brightest star in the night sky. In 1933, light from Arcturus was captured via photoelectric cells to turn on the lights of the Chicago World’s Fair.'
  },
  {
    id: 'aldebaran',
    name: 'Aldebaran (Eye of the Bull)',
    scientificName: 'Alpha Tauri / HD 29139',
    constellation: 'Taurus',
    distanceLightYears: 65.3,
    radiusSunRatio: 44.13,
    radiusKm: 30730000,
    massSunRatio: 1.16,
    luminositySunRatio: 518.0,
    temperatureKelvin: 3900,
    spectralClass: 'K',
    spectralSubtype: 'K5+III (Red/Orange Giant)',
    colorHex: '#FF5400',
    glowColorHex: '#9E2A2B',
    apparentMagnitude: 0.85,
    absoluteMagnitude: -0.63,
    description: 'An evolved giant star that has depleted its core hydrogen. If placed in our solar system, its surface would extend halfway to Mercury’s orbit.',
    historicalSignificance: 'One of the Four Royal Stars of ancient Persian astronomy, marking the vernal equinox around 3000 BCE.'
  },
  {
    id: 'rigel',
    name: 'Rigel',
    scientificName: 'Beta Orionis / HD 34085',
    constellation: 'Orion',
    distanceLightYears: 860.0,
    radiusSunRatio: 78.9,
    radiusKm: 54940000,
    massSunRatio: 21.0,
    luminositySunRatio: 120000.0,
    temperatureKelvin: 12100,
    spectralClass: 'B',
    spectralSubtype: 'B8Ia (Blue Supergiant)',
    colorHex: '#64DFDF',
    glowColorHex: '#48CAE4',
    apparentMagnitude: 0.13,
    absoluteMagnitude: -7.84,
    description: 'A luminous blue supergiant shining with the power of 120,000 Suns. It illuminates surrounding interstellar dust clouds like the Witch Head Nebula.',
    historicalSignificance: 'Forms the bright left foot of Orion the Hunter; destined to end its life in a devastating Type II core-collapse supernova.'
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    scientificName: 'Alpha Orionis / HD 39801',
    constellation: 'Orion',
    distanceLightYears: 642.5,
    radiusSunRatio: 764.0,
    radiusKm: 532000000,
    massSunRatio: 16.5,
    luminositySunRatio: 126000.0,
    temperatureKelvin: 3500,
    spectralClass: 'M',
    spectralSubtype: 'M1-2Ia-ab (Red Supergiant)',
    colorHex: '#D00000',
    glowColorHex: '#9D0208',
    apparentMagnitude: 0.50,
    absoluteMagnitude: -5.85,
    isVariableStar: true,
    description: 'A titanic pulsating red supergiant. If placed at the center of our solar system, its pulsing outer atmosphere would engulf the orbits of Mercury, Venus, Earth, Mars, and Jupiter!',
    historicalSignificance: 'Experienced the famous "Great Dimming" in 2019-2020 due to a massive surface convective dust ejection event. It will explode as a supernova within 100,000 years.'
  },
  {
    id: 'uy-scuti',
    name: 'UY Scuti (Red Hypergiant)',
    scientificName: 'UY Scuti / BD-12°5055',
    constellation: 'Scutum',
    distanceLightYears: 5800.0,
    radiusSunRatio: 1708.0,
    radiusKm: 1189000000,
    massSunRatio: 10.0,
    luminositySunRatio: 340000.0,
    temperatureKelvin: 3365,
    spectralClass: 'M',
    spectralSubtype: 'M2-M4Ia-Iab (Extreme Hypergiant)',
    colorHex: '#9B2226',
    glowColorHex: '#6A040F',
    apparentMagnitude: 8.95,
    absoluteMagnitude: -6.20,
    isVariableStar: true,
    description: 'One of the largest known stars in the observable universe. Its volume could hold approximately 5 billion Suns, spanning out past the orbit of Saturn!',
    historicalSignificance: 'Cataloged at the Bonn Observatory in 1860; serves as a stellar benchmark for the extreme physical limits of stellar envelope radius.'
  },
  {
    id: 'gargantua',
    name: 'Gargantua (Supermassive Black Hole)',
    scientificName: 'Kerr Metric SMBH (Interstellar)',
    constellation: 'Interstellar System / Deep Void',
    distanceLightYears: 10000000000.0,
    radiusSunRatio: 430.0, // Event horizon radius ~ 300 million km (2 AU, ~430 Solar Radii)
    radiusKm: 299195741,
    massSunRatio: 100000000.0, // 100 Million Solar Masses (Kip Thorne model)
    luminositySunRatio: 1000000000.0, // Accretion disk optical output
    temperatureKelvin: 10000000, // Accretion disk plasma temp ~10 Million K (X-ray/UV/Optical)
    spectralClass: 'BH',
    spectralSubtype: 'Extreme Kerr Metric (Spin a/M = 0.998)',
    colorHex: '#FFB703',
    glowColorHex: '#FB8500',
    apparentMagnitude: -1.2,
    absoluteMagnitude: -14.5,
    description: 'The supermassive rotating Kerr black hole modelled by Nobel laureate Kip Thorne for Interstellar. Its spin is 99.8% the speed of light, dragging spacetime in an ergosphere where 1 hour on Miller’s planet equals 7 Earth years.',
    historicalSignificance: 'First computationally exact relativistic ray-traced depiction of gravitational lensing, Doppler beaming asymmetry, Einstein cross rings, and an extreme Kerr horizon in science & cinema.'
  },
  {
    id: 'sagittarius-a',
    name: 'Sagittarius A* (Milky Way Core)',
    scientificName: 'Sgr A* / Galactic Center SMBH',
    constellation: 'Sagittarius',
    distanceLightYears: 26673.0,
    radiusSunRatio: 31.6, // Event horizon ~ 22 Million km (~31.6 Solar Radii)
    radiusKm: 22000000,
    massSunRatio: 4154000.0, // 4.15 Million Solar Masses
    luminositySunRatio: 250000.0,
    temperatureKelvin: 8500000,
    spectralClass: 'BH',
    spectralSubtype: 'Galactic Center Supermassive Compact Object',
    colorHex: '#F77F00',
    glowColorHex: '#D62828',
    apparentMagnitude: 16.0,
    absoluteMagnitude: -4.5,
    description: 'The supermassive black hole anchoring the center of our Milky Way Galaxy. Stars like S2 orbit it at up to 7,650 km/s (2.5% the speed of light) in extreme relativistic trajectories.',
    historicalSignificance: 'Directly imaged by the Event Horizon Telescope (EHT) collaboration in 2022, confirming Einstein’s General Theory of Relativity in the strong field regime.'
  }
];
