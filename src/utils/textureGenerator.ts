import * as THREE from 'three';
import { PlanetId } from '../types/solar';

// Texture caching system
const textureCache = new Map<string, THREE.CanvasTexture>();

let globalMaxAnisotropy = 16;

/**
 * Dynamically synchronize GPU maximum anisotropic filtering capability
 * across all existing and future celestial procedural textures
 */
export function setGlobalMaxAnisotropy(maxAniso: number) {
  if (!maxAniso || maxAniso < 1) return;
  globalMaxAnisotropy = Math.min(maxAniso, 16);
  textureCache.forEach(texture => {
    if (texture.anisotropy !== globalMaxAnisotropy) {
      texture.anisotropy = globalMaxAnisotropy;
      texture.needsUpdate = true;
    }
  });
}

// Helper to determine accurate Earth continental landmasses and biomes for photorealistic modern Earth
function getEarthGeography(lonDeg: number, latDeg: number, u: number, v: number) {
  // Fractal coastline micro-roughness
  const coastNoise = fbm(u * 70, v * 70, 4) * 5.0 - 2.5;
  const lon = lonDeg + coastNoise * (Math.cos(latDeg * (Math.PI / 180)));
  const lat = latDeg + coastNoise * 0.8;

  let isLand = false;
  let elevation = 0;
  let isIce = false;
  let isDesert = false;
  let isRainforest = false;
  let isMountain = false;

  // 1. Antarctica
  if (lat < -63) {
    isLand = true;
    isIce = true;
    elevation = 0.6;
  }
  // Antarctic Peninsula
  else if (lat >= -75 && lat <= -62 && lon >= -74 && lon <= -56) {
    isLand = true;
    isIce = true;
    elevation = 0.5;
  }
  // 2. Greenland & Arctic Ice
  else if (lat > 78) {
    isLand = false;
    isIce = true; // Polar sea ice pack
  }
  else if (lat >= 59 && lat <= 83 && lon >= -73 && lon <= -18) {
    isLand = true;
    isIce = true;
    elevation = 0.7;
  }
  // 3. North America
  // Alaska
  else if (lat >= 54 && lat <= 72 && lon >= -168 && lon <= -130) {
    isLand = true;
    elevation = 0.5;
    if (lon < -140) isMountain = true;
  }
  // Canada & Northern Islands (exclude Hudson Bay)
  else if (lat >= 48 && lat <= 76 && lon >= -140 && lon <= -52) {
    const inHudsonBay = (lat >= 51 && lat <= 64 && lon >= -94 && lon <= -78);
    if (!inHudsonBay) {
      isLand = true;
      elevation = (lat > 60) ? 0.3 : 0.4;
      if (lon < -115) isMountain = true; // Canadian Rockies
    }
  }
  // USA Contiguous
  else if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -67) {
    isLand = true;
    elevation = 0.35;
    // Rockies & Sierra Nevada
    if (lon >= -122 && lon <= -104 && lat >= 33 && lat <= 48) {
      isMountain = true;
      elevation = 0.8;
    }
    // Southwest Desert (Mojave/Sonoran)
    if (lon >= -117 && lon <= -102 && lat >= 28 && lat <= 38) {
      isDesert = true;
    }
  }
  // Mexico & Central America
  else if (lat >= 14 && lat <= 32 && lon >= -117 && lon <= -86) {
    // Baja California
    const inBaja = (lon >= -115 && lon <= -109 && lat >= 23 && lat <= 32);
    // Mainland Mexico
    const inMainland = (lon >= -106 && lon <= -87 && lat >= 15 && lat <= 32);
    const inYucatan = (lon >= -91 && lon <= -86 && lat >= 18 && lat <= 22);
    if (inBaja || inMainland || inYucatan) {
      isLand = true;
      elevation = 0.5;
      if (lat > 22 && lon < -100) isDesert = true;
      else isMountain = true;
    }
  }
  else if (lat >= 7 && lat <= 18 && lon >= -92 && lon <= -77) {
    isLand = true;
    isRainforest = true;
    elevation = 0.4;
  }
  // Caribbean (Cuba, Hispaniola, PR)
  else if (lat >= 17 && lat <= 24 && lon >= -85 && lon <= -65) {
    const isIsland = Math.sin(lon * 2) * Math.cos(lat * 3) > 0.3;
    if (isIsland) {
      isLand = true;
      isRainforest = true;
      elevation = 0.3;
    }
  }
  // 4. South America
  else if (lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34) {
    // Polygon / Envelope boundary for South America
    let southAmericaWidth = 0;
    if (lat > 0) southAmericaWidth = (lat + 5) * 2.8; // Northern wedge
    else if (lat > -22) southAmericaWidth = 46; // Brazil wide belt
    else southAmericaWidth = Math.max(8, 46 - (-lat - 22) * 1.3); // Southern taper to Patagonia

    const centerLon = -60 + lat * 0.15;
    if (Math.abs(lon - centerLon) < southAmericaWidth / 2) {
      isLand = true;
      elevation = 0.35;

      // Andes Mountain Spine along Western Pacific edge
      if (lon <= centerLon - southAmericaWidth / 2 + 7.5) {
        isMountain = true;
        elevation = 0.85;
      }
      // Amazon Rainforest Basin
      else if (lat >= -12 && lat <= 5 && lon >= -74 && lon <= -48) {
        isRainforest = true;
      }
      // Atacama & Patagonian Desert
      else if ((lat >= -28 && lat <= -18 && lon >= -71 && lon <= -67) || (lat <= -38 && lon >= -70 && lon <= -62)) {
        isDesert = true;
      }
    }
  }
  // 5. Europe & Scandinavia
  else if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 42) {
    const inScandinavia = (lat >= 55 && lat <= 71 && lon >= 4 && lon <= 32);
    const inUK = (lat >= 50 && lat <= 59 && lon >= -10 && lon <= 2);
    const inIberia = (lat >= 36 && lat <= 44 && lon >= -9 && lon <= 3);
    const inItaly = (lat >= 37 && lat <= 46 && lon >= 8 && lon <= 18);
    const inBalkans = (lat >= 36 && lat <= 43 && lon >= 19 && lon <= 28);
    const inMainEurope = (lat >= 43 && lat <= 57 && lon >= -4 && lon <= 40);

    if (inScandinavia || inUK || inIberia || inItaly || inBalkans || inMainEurope) {
      isLand = true;
      elevation = 0.4;
      // Alps & Pyrenees
      if ((lat >= 44 && lat <= 48 && lon >= 5 && lon <= 16) || (lat >= 42 && lat <= 43 && lon >= -2 && lon <= 3)) {
        isMountain = true;
        elevation = 0.8;
      }
    }
  }
  // 6. Africa
  else if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 52) {
    let inAfrica = false;
    // North Africa (wide)
    if (lat >= 12 && lat <= 37 && lon >= -17 && lon <= 35) inAfrica = true;
    // Horn of Africa
    else if (lat >= 0 && lat <= 15 && lon >= 35 && lon <= 51) inAfrica = true;
    // Central & Southern Africa
    else if (lat >= -35 && lat < 12 && lon >= 8 && lon <= 42) inAfrica = true;
    // Madagascar
    else if (lat >= -26 && lat <= -12 && lon >= 43 && lon <= 51) inAfrica = true;

    if (inAfrica) {
      isLand = true;
      elevation = 0.4;
      // Sahara & Sahel Desert
      if (lat >= 15 && lat <= 34 && lon >= -15 && lon <= 35) {
        isDesert = true;
      }
      // Kalahari / Namib Desert
      else if (lat >= -30 && lat <= -18 && lon >= 14 && lon <= 26) {
        isDesert = true;
      }
      // Congo Rainforest Basin
      else if (lat >= -6 && lat <= 5 && lon >= 10 && lon <= 30) {
        isRainforest = true;
      }
      // Atlas Mountains & East African Rift
      else if (lat >= 30 && lat <= 35 && lon >= -8 && lon <= 8) {
        isMountain = true;
        elevation = 0.75;
      }
    }
  }
  // 7. Asia
  else if (lat >= 1 && lat <= 78 && lon >= 35 && lon <= 180) {
    // Arabian Peninsula
    const inArabia = (lat >= 12 && lat <= 33 && lon >= 35 && lon <= 60);
    // India Subcontinent
    const inIndia = (lat >= 8 && lat <= 34 && lon >= 68 && lon <= 92);
    // Siberia & Russia
    const inSiberia = (lat >= 50 && lat <= 78 && lon >= 40 && lon <= 180);
    // China & Central Asia
    const inEastAsia = (lat >= 20 && lat <= 50 && lon >= 75 && lon <= 130);
    // Japan
    const inJapan = (lat >= 30 && lat <= 45 && lon >= 129 && lon <= 146);
    // Korea
    const inKorea = (lat >= 34 && lat <= 42 && lon >= 124 && lon <= 130);
    // Southeast Asia (Indochina)
    const inIndochina = (lat >= 8 && lat <= 24 && lon >= 96 && lon <= 110);
    // Indonesia & Philippines
    const inMaritime = (lat >= -10 && lat <= 18 && lon >= 95 && lon <= 130 && Math.sin(lon * 3) * Math.cos(lat * 3) > 0.15);

    if (inArabia || inIndia || inSiberia || inEastAsia || inJapan || inKorea || inIndochina || inMaritime) {
      isLand = true;
      elevation = 0.45;

      // Arabian Desert
      if (inArabia) isDesert = true;
      // Himalayas & Tibetan Plateau (Roof of the World)
      else if (lat >= 26 && lat <= 38 && lon >= 74 && lon <= 104) {
        isMountain = true;
        elevation = 0.95; // Snowy peaks
      }
      // Gobi & Taklamakan Deserts
      else if (lat >= 37 && lat <= 46 && lon >= 78 && lon <= 110) {
        isDesert = true;
      }
      // Southeast Asian Rainforests
      else if (inIndochina || inMaritime) {
        isRainforest = true;
      }
      // Siberian Taiga & Tundra
      else if (inSiberia && lat > 62) {
        elevation = 0.3;
      }
    }
  }
  // 8. Australia, New Zealand & Oceania
  else if (lat >= -48 && lat <= -8 && lon >= 110 && lon <= 180) {
    // Australia Mainland
    const inAustralia = (lat >= -39 && lat <= -11 && lon >= 113 && lon <= 154);
    // New Zealand
    const inNZ = (lat >= -47 && lat <= -34 && lon >= 166 && lon <= 178);
    // Papua New Guinea
    const inPNG = (lat >= -10 && lat <= 0 && lon >= 130 && lon <= 152);

    if (inAustralia || inNZ || inPNG) {
      isLand = true;
      elevation = 0.35;
      if (inAustralia) {
        // Red Outback Center
        if (lon >= 118 && lon <= 145 && lat >= -33 && lat <= -18) {
          isDesert = true;
          elevation = 0.4;
        }
      } else if (inPNG) {
        isRainforest = true;
      } else if (inNZ) {
        isMountain = true;
        elevation = 0.75;
      }
    }
  }

  // Micro-terrain noise to prevent flat solid blocks
  if (isLand && !isIce) {
    const terrainDetail = fbm(u * 140, v * 140, 5) * 0.15;
    elevation += terrainDetail;
  }

  return {
    isLand,
    elevation: Math.min(1, Math.max(0, elevation)),
    isIce,
    isDesert,
    isRainforest,
    isMountain
  };
}

// Procedural Asteroid Regolith Texture with ultra-sharp crater facets & mineral grain
export function generateAsteroidTexture(): THREE.CanvasTexture {
  const key = 'asteroid_rock_diffuse_v3_sharp';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const n = (fbm(x / 24, y / 24, 7) + 1) * 0.5;
      const micro = (noise2D(x / 3.5, y / 3.5) + 1) * 0.18;
      const chiseled = Math.abs(noise2D(x / 12, y / 12)) * 0.22;
      const val = Math.floor(100 + n * 105 + micro * 35 + chiseled * 45);

      data[idx] = Math.min(255, val + 5);
      data[idx + 1] = Math.min(255, Math.max(0, val - 4));
      data[idx + 2] = Math.min(255, Math.max(0, val - 10));
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Micro and Macro Impact Craters with Sharp Raised Rims & Radial Ejecta Rays
  for (let i = 0; i < 90; i++) {
    const cx = Math.random() * w;
    const cy = Math.random() * h;
    const r = Math.random() * 12 + 2.5;

    // Crater depression
    const g = ctx.createRadialGradient(cx, cy, r * 0.15, cx, cy, r);
    g.addColorStop(0, 'rgba(25, 20, 20, 0.95)');
    g.addColorStop(0.65, 'rgba(65, 60, 60, 0.7)');
    g.addColorStop(0.85, 'rgba(225, 215, 210, 0.9)'); // Bright elevated crater rim
    g.addColorStop(1, 'rgba(100, 95, 95, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // High-contrast ray ejecta streaks for large impacts
    if (r > 7) {
      ctx.strokeStyle = 'rgba(240, 235, 230, 0.35)';
      ctx.lineWidth = 1.0;
      for (let ray = 0; ray < 6; ray++) {
        const ang = (ray / 6) * Math.PI * 2 + Math.random() * 0.4;
        const len = r * (1.8 + Math.random() * 1.6);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * (r * 0.8), cy + Math.sin(ang) * (r * 0.8));
        ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
        ctx.stroke();
      }
    }
  }

  applyUnsharpAndContrast(ctx, w, h, 1.30, 0.50);
  return createConfiguredTexture(canvas, key);
}

// Procedural Asteroid Normal / Bump Map (High-Pass Chiseled Rock Facets)
export function generateAsteroidBumpMap(): THREE.CanvasTexture {
  const key = 'asteroid_rock_bump_v3_sharp';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const n = (fbm(x / 16, y / 16, 6) + 1) * 0.5;
      const ridge = Math.abs(noise2D(x / 8, y / 8));
      const cr = Math.min(255, Math.floor(n * 200 + ridge * 55));
      data[idx] = cr;
      data[idx + 1] = cr;
      data[idx + 2] = cr;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  applyUnsharpAndContrast(ctx, w, h, 1.35, 0.55);
  return createConfiguredTexture(canvas, key);
}

// Kuiper Belt Trans-Neptunian Icy Object Texture (Nitrogen/Methane Ice & Tholins)
export function generateKuiperTexture(): THREE.CanvasTexture {
  const key = 'kuiper_ice_diffuse_v3_sharp';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const n = (fbm(x / 20, y / 20, 6) + 1) * 0.5;
      const iceCracks = Math.pow(Math.abs(noise2D(x / 10, y / 10)), 0.6);
      const val = Math.floor(160 + n * 75 + iceCracks * 20);

      data[idx] = Math.min(255, Math.max(0, val - 12));
      data[idx + 1] = Math.min(255, Math.max(0, val + 8));
      data[idx + 2] = Math.min(255, val + 32); // Crystalline icy cyan sheen
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  applyUnsharpAndContrast(ctx, w, h, 1.25, 0.45);
  return createConfiguredTexture(canvas, key);
}

// Crisp Dust Sparkle Particle Sprite (with Micro Optical Diffraction Spikes)
export function generateDustParticleSprite(): THREE.CanvasTexture {
  const key = 'dust_particle_sprite_sharp_v3';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const cx = 64;
  const cy = 64;

  ctx.clearRect(0, 0, 128, 128);

  // 1. Soft Blue-White Outer Glow
  const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, 58);
  g.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  g.addColorStop(0.18, 'rgba(210, 240, 255, 0.95)');
  g.addColorStop(0.45, 'rgba(120, 200, 255, 0.45)');
  g.addColorStop(0.85, 'rgba(50, 140, 255, 0.12)');
  g.addColorStop(1.0, 'rgba(0, 50, 180, 0.0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, 58, 0, Math.PI * 2);
  ctx.fill();

  // 2. Razor-Sharp 4-Point Optical Glint Cross Spikes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 48, cy);
  ctx.lineTo(cx + 48, cy);
  ctx.moveTo(cx, cy - 48);
  ctx.lineTo(cx, cy + 48);
  ctx.stroke();

  // Diagonal micro rays
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy - 24);
  ctx.lineTo(cx + 24, cy + 24);
  ctx.moveTo(cx + 24, cy - 24);
  ctx.lineTo(cx - 24, cy + 24);
  ctx.stroke();

  // 3. Ultra-Bright Pinpoint Core
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
  ctx.fill();

  return createConfiguredTexture(canvas, key, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
}
function createPerlinNoise2D() {
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const n = Math.floor(Math.sin(i * 12.9898 + 78.233) * 43758.5453) % (i + 1);
    const j = Math.abs(n);
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 256; i++) p[256 + i] = p[i];

  function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(t: number, a: number, b: number) { return a + t * (b - a); }
  function grad(hash: number, x: number, y: number) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
  }

  return function noise(x: number, y: number) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);

    const A = p[X] + Y;
    const B = p[X + 1] + Y;

    return lerp(v,
      lerp(u, grad(p[A], xf, yf), grad(p[B], xf - 1, yf)),
      lerp(u, grad(p[A + 1], xf, yf - 1), grad(p[B + 1], xf - 1, yf - 1))
    );
  };
}

const noise2D = createPerlinNoise2D();

function fbm(x: number, y: number, octaves = 5) {
  let val = 0;
  let amp = 0.5;
  let freq = 1.0;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise2D(x * freq, y * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

// Domain Warped Fractal Noise for realistic atmospheric bands & geology
function warpedFbm(x: number, y: number, octaves = 5) {
  const qx = fbm(x + 0.0, y + 0.0, octaves);
  const qy = fbm(x + 5.2, y + 1.3, octaves);
  const rx = fbm(x + 4.0 * qx + 1.7, y + 4.0 * qy + 9.2, octaves);
  const ry = fbm(x + 4.0 * qx + 8.3, y + 4.0 * qy + 2.8, octaves);
  return fbm(x + 4.0 * rx, y + 4.0 * ry, octaves);
}

// Helper to apply 4K/2K Unsharp Masking & Micro-Contrast Enhancement filter to generated planetary textures
function applyUnsharpAndContrast(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  contrastFactor: number = 1.14,
  sharpenAmount: number = 0.35
) {
  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const len = data.length;

    // 1. Contrast Adjustment (Pivot at 128)
    const factor = (259 * (contrastFactor * 255 - 255 + 255)) / (255 * (259 - (contrastFactor * 255 - 255)));
    for (let i = 0; i < len; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }

    // 2. High-Pass Sharpening Convolution (Kernel [-sharpen, 1 + 4*sharpen, -sharpen])
    if (sharpenAmount > 0) {
      const src = new Uint8ClampedArray(data);
      const k = sharpenAmount;
      const centerK = 1 + 4 * k;
      for (let y = 1; y < h - 1; y++) {
        const row = y * w;
        const rowUp = (y - 1) * w;
        const rowDown = (y + 1) * w;
        for (let x = 1; x < w - 1; x++) {
          const idx = (row + x) * 4;
          const upIdx = (rowUp + x) * 4;
          const downIdx = (rowDown + x) * 4;
          const leftIdx = (row + x - 1) * 4;
          const rightIdx = (row + x + 1) * 4;

          for (let c = 0; c < 3; c++) {
            const sharpVal = centerK * src[idx + c] - k * (src[upIdx + c] + src[downIdx + c] + src[leftIdx + c] + src[rightIdx + c]);
            data[idx + c] = sharpVal < 0 ? 0 : sharpVal > 255 ? 255 : sharpVal;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    // Ignore if canvas tainted or unreadable
  }
}

// Helper to create texture with anisotropic filtering, mipmapping, and hardware synchronization
function createConfiguredTexture(
  canvas: HTMLCanvasElement,
  key: string,
  wrapS: THREE.Wrapping = THREE.RepeatWrapping,
  wrapT: THREE.Wrapping = THREE.ClampToEdgeWrapping
): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = wrapS;
  texture.wrapT = wrapT;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = globalMaxAnisotropy;
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Generates High-Definition Primary Color/Diffuse Texture for Celestial Bodies (200% Enhanced Quality)
 */
export function generatePlanetTexture(id: PlanetId, ultraHD: boolean = true): THREE.CanvasTexture {
  const key = `planet_diffuse_${id}_${ultraHD ? '200' : '100'}`;
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  // High definition 200% texture resolution (2048x1024 for main bodies, 1024x512 for minor)
  const isMajor = ['sun', 'earth', 'jupiter', 'saturn'].includes(id);
  canvas.width = ultraHD ? (isMajor ? 2048 : 1024) : (isMajor ? 1024 : 512);
  canvas.height = canvas.width / 2;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  switch (id) {
    case 'sun': {
      // Photosphere Granulation, Magnetic Loops & Sunspots
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const nx = x / 40;
          const ny = y / 40;
          const granulation = (fbm(nx, ny, 7) + 1) * 0.5;
          const microGranules = (noise2D(x / 6, y / 6) + 1) * 0.15;
          const val = Math.min(1, Math.max(0, granulation + microGranules));

          // 4K Solar plasma gradient: blazing white-hot core, deep orange, golden yellow
          data[idx] = 255;
          data[idx + 1] = Math.floor(135 + val * 115);
          data[idx + 2] = Math.floor(val * 45);
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // High Definition Sunspot Groups (Umbra & Penumbra with magnetic fibrils)
      const sunspotClusters = [
        { x: w * 0.28, y: h * 0.42, r: 26 },
        { x: w * 0.32, y: h * 0.45, r: 16 },
        { x: w * 0.35, y: h * 0.41, r: 12 },
        { x: w * 0.65, y: h * 0.58, r: 32 },
        { x: w * 0.70, y: h * 0.60, r: 18 },
        { x: w * 0.73, y: h * 0.56, r: 14 },
        { x: w * 0.50, y: h * 0.35, r: 15 }
      ];

      sunspotClusters.forEach(s => {
        // Penumbra
        const penumbraGrad = ctx.createRadialGradient(s.x, s.y, s.r * 0.3, s.x, s.y, s.r);
        penumbraGrad.addColorStop(0, 'rgba(120, 30, 0, 0.9)');
        penumbraGrad.addColorStop(0.6, 'rgba(180, 50, 0, 0.7)');
        penumbraGrad.addColorStop(1, 'rgba(255, 140, 0, 0)');
        ctx.fillStyle = penumbraGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Dark Umbra Core
        const umbraGrad = ctx.createRadialGradient(s.x, s.y, 1, s.x, s.y, s.r * 0.45);
        umbraGrad.addColorStop(0, 'rgba(25, 5, 0, 1)');
        umbraGrad.addColorStop(0.8, 'rgba(45, 10, 0, 0.95)');
        umbraGrad.addColorStop(1, 'rgba(100, 20, 0, 0.8)');
        ctx.fillStyle = umbraGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'mercury': {
      // Heavily cratered basaltic crust with Tycho-like ejecta ray systems
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const n = (fbm(x / 35, y / 35, 6) + 1) * 0.5;
          const micro = (noise2D(x / 8, y / 8) + 1) * 0.2;
          const tone = Math.floor(95 + n * 80 + micro * 25);
          data[idx] = tone;
          data[idx + 1] = Math.max(0, tone - 4);
          data[idx + 2] = Math.max(0, tone - 6);
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Caloris Basin & Major Impact Ray Craters
      const majorCraters = [
        { x: w * 0.35, y: h * 0.45, r: 42, rays: 16, name: 'Caloris' },
        { x: w * 0.72, y: h * 0.65, r: 24, rays: 12, name: 'Kuiper' },
        { x: w * 0.18, y: h * 0.30, r: 18, rays: 10, name: 'Debussy' },
        { x: w * 0.85, y: h * 0.38, r: 20, rays: 8, name: 'Beethoven' }
      ];

      majorCraters.forEach(c => {
        // Ejecta Rays
        ctx.strokeStyle = 'rgba(235, 235, 245, 0.25)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < c.rays; i++) {
          const ang = (i / c.rays) * Math.PI * 2;
          const rayLen = c.r * (2.5 + Math.sin(i * 3) * 1.5);
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x + Math.cos(ang) * rayLen, c.y + Math.sin(ang) * rayLen);
          ctx.stroke();
        }

        // Rim and floor
        const cGrad = ctx.createRadialGradient(c.x, c.y, c.r * 0.2, c.x, c.y, c.r);
        cGrad.addColorStop(0, 'rgba(50, 50, 55, 0.8)');
        cGrad.addColorStop(0.7, 'rgba(80, 80, 85, 0.6)');
        cGrad.addColorStop(0.9, 'rgba(210, 210, 220, 0.8)');
        cGrad.addColorStop(1, 'rgba(100, 100, 105, 0)');
        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Procedural micro-craters
      ctx.fillStyle = 'rgba(40, 40, 45, 0.4)';
      ctx.strokeStyle = 'rgba(190, 190, 200, 0.3)';
      for (let i = 0; i < 350; i++) {
        const cx = (Math.sin(i * 123) * 0.5 + 0.5) * w;
        const cy = (Math.cos(i * 77) * 0.45 + 0.5) * h;
        const cr = 2 + (i % 8);
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'venus': {
      // Dense Sulfuric Acid Cloud Decks with UV-absorber Chevron Waves
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        const latNorm = (y / h - 0.5) * 2;
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          // Characteristic Venusian Y/V chevron cloud morphology
          const chevron = Math.abs(Math.sin((x / w) * Math.PI * 4 - latNorm * 1.5));
          const turb = warpedFbm(x / 80, y / 60, 5);
          const blend = (chevron * 0.4 + turb * 0.6 + 1) * 0.5;

          // Creamy ochre, pale amber, butter-yellow clouds
          data[idx] = Math.floor(235 + blend * 20);
          data[idx + 1] = Math.floor(190 + blend * 40);
          data[idx + 2] = Math.floor(130 + blend * 45);
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Polar Vortex swirls
      const polarSwirlTop = ctx.createRadialGradient(w * 0.5, 0, 10, w * 0.5, 0, h * 0.25);
      polarSwirlTop.addColorStop(0, 'rgba(180, 140, 80, 0.6)');
      polarSwirlTop.addColorStop(1, 'rgba(240, 200, 140, 0)');
      ctx.fillStyle = polarSwirlTop;
      ctx.fillRect(0, 0, w, h * 0.25);
      break;
    }

    case 'earth': {
      // Photorealistic Modern Earth: Authentic Continents, Shallow Turquoise Shelves, Deserts, Rainforests, Glaciers & Himalayas
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        const v = y / h;
        const latDeg = (0.5 - v) * 180; // 90 to -90

        for (let x = 0; x < w; x++) {
          const u = x / w;
          const lonDeg = (u - 0.5) * 360; // -180 to 180
          const idx = (y * w + x) * 4;

          const geo = getEarthGeography(lonDeg, latDeg, u, v);

          if (geo.isIce) {
            // Arctic & Antarctic Glacial Ice Shelves (Crisp Pure White / Pale Ice Blue)
            data[idx] = 246;
            data[idx + 1] = 250;
            data[idx + 2] = 255;
          } else if (geo.isLand) {
            if (geo.isMountain && geo.elevation > 0.75) {
              // High Alpine Snow & Glaciers (Himalayas, Andes, Rockies, Alps)
              const peakSnow = geo.elevation > 0.85;
              data[idx] = peakSnow ? 245 : 175;
              data[idx + 1] = peakSnow ? 248 : 178;
              data[idx + 2] = peakSnow ? 255 : 185;
            } else if (geo.isDesert) {
              // Sahara, Arabian, Gobi, Australian Outback, Atacama
              const dNoise = noise2D(u * 80, v * 80) * 20;
              data[idx] = Math.min(255, Math.floor(218 + dNoise));
              data[idx + 1] = Math.min(255, Math.floor(175 + dNoise * 0.8));
              data[idx + 2] = Math.min(255, Math.floor(115 + dNoise * 0.5));
            } else if (geo.isRainforest) {
              // Amazon, Congo Basin, Southeast Asia (Deep Emerald & Viridian)
              const rfNoise = noise2D(u * 90, v * 90) * 15;
              data[idx] = Math.floor(24 + rfNoise * 0.4);
              data[idx + 1] = Math.floor(95 + rfNoise);
              data[idx + 2] = Math.floor(36 + rfNoise * 0.5);
            } else {
              // Temperate Grasslands, Woodlands & Mixed Farmland
              const vegNoise = noise2D(u * 60, v * 60) * 25;
              data[idx] = Math.floor(65 + vegNoise * 0.7);
              data[idx + 1] = Math.floor(130 + vegNoise);
              data[idx + 2] = Math.floor(55 + vegNoise * 0.6);
            }
          } else {
            // Oceans: Shallow Turquoise Coastline / Coral Atolls to Deep Pelagic Abyssal Blue
            // Distance check to nearest land (shallow coastal shelf)
            const sampleUp = getEarthGeography(lonDeg, latDeg + 1.2, u, v);
            const sampleDown = getEarthGeography(lonDeg, latDeg - 1.2, u, v);
            const sampleLeft = getEarthGeography(lonDeg - 1.5, latDeg, u, v);
            const sampleRight = getEarthGeography(lonDeg + 1.5, latDeg, u, v);

            const isNearCoast = sampleUp.isLand || sampleDown.isLand || sampleLeft.isLand || sampleRight.isLand;

            if (isNearCoast) {
              // Vibrant Caribbean / Bahamas / Great Barrier Reef turquoise coastal waters
              data[idx] = 18;
              data[idx + 1] = 145;
              data[idx + 2] = 185;
            } else {
              // Deep Ocean Navy / Royal Blue
              const deepWave = (noise2D(u * 40, v * 40) + 1) * 0.5;
              data[idx] = Math.floor(6 + deepWave * 8);
              data[idx + 1] = Math.floor(38 + deepWave * 18);
              data[idx + 2] = Math.floor(115 + deepWave * 25);
            }
          }
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      break;
    }

    case 'mars': {
      // Ultra HD Mars: Rusted Basalt, Valles Marineris Rift, Olympus Mons, Polar CO2 Ice
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        const lat = (y / h - 0.5) * 2;
        const isPolar = Math.abs(lat) > 0.87;

        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const n = (fbm(x / 70, y / 70, 7) + 1) * 0.5;
          const craterGrain = (noise2D(x / 12, y / 12) + 1) * 0.1;

          if (isPolar) {
            // White Polar Ice Caps with spiral sublimation troughs
            const spiral = Math.sin(x * 0.05 + lat * 10);
            data[idx] = spiral > 0.5 ? 200 : 250;
            data[idx + 1] = spiral > 0.5 ? 170 : 250;
            data[idx + 2] = spiral > 0.5 ? 150 : 255;
          } else {
            // Ochre red, iron oxide, dark basaltic plains (Syrtis Major)
            const rust = n + craterGrain;
            data[idx] = Math.floor(185 + rust * 55);
            data[idx + 1] = Math.floor(85 + rust * 45);
            data[idx + 2] = Math.floor(40 + rust * 30);
          }
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Valles Marineris Grand Canyon System (4,000 km chasm)
      ctx.strokeStyle = 'rgba(65, 18, 8, 0.9)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w * 0.38, h * 0.54);
      ctx.bezierCurveTo(w * 0.44, h * 0.56, w * 0.50, h * 0.53, w * 0.58, h * 0.57);
      ctx.stroke();

      // Tributary canyon branches
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.45, h * 0.55);
      ctx.lineTo(w * 0.47, h * 0.60);
      ctx.moveTo(w * 0.52, h * 0.54);
      ctx.lineTo(w * 0.54, h * 0.49);
      ctx.stroke();

      // Olympus Mons Shield Volcano (Caldera & Scarp Ring)
      const omX = w * 0.25;
      const omY = h * 0.45;
      const omGrad = ctx.createRadialGradient(omX, omY, 4, omX, omY, 32);
      omGrad.addColorStop(0, 'rgba(55, 15, 8, 0.95)');
      omGrad.addColorStop(0.35, 'rgba(120, 38, 20, 0.85)');
      omGrad.addColorStop(0.85, 'rgba(175, 70, 35, 0.7)');
      omGrad.addColorStop(1, 'rgba(195, 90, 45, 0)');
      ctx.fillStyle = omGrad;
      ctx.beginPath();
      ctx.arc(omX, omY, 32, 0, Math.PI * 2);
      ctx.fill();

      // Caldera summit craters
      ctx.fillStyle = 'rgba(40, 10, 5, 0.95)';
      ctx.beginPath();
      ctx.arc(omX, omY, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'ceres': {
      // Carbonaceous dwarf planet with Occator Crater Bright Salt Faculae
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const n = (fbm(x / 40, y / 40, 6) + 1) * 0.5;
          const baseGrey = Math.floor(100 + n * 60);
          data[idx] = baseGrey;
          data[idx + 1] = baseGrey;
          data[idx + 2] = baseGrey + 4;
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Occator Crater Brilliant Sodium Carbonate Salt Deposits (Cerealia Facula)
      const occX = w * 0.48;
      const occY = h * 0.48;
      const occGrad = ctx.createRadialGradient(occX, occY, 2, occX, occY, 22);
      occGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      occGrad.addColorStop(0.4, 'rgba(235, 245, 255, 0.9)');
      occGrad.addColorStop(0.8, 'rgba(170, 185, 200, 0.4)');
      occGrad.addColorStop(1, 'rgba(100, 100, 110, 0)');
      ctx.fillStyle = occGrad;
      ctx.beginPath();
      ctx.arc(occX, occY, 22, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'jupiter': {
      // 4K Jovian Zonal Jet Stream Belts with Shearing Vortices & Great Red Spot
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        const latNorm = (y / h - 0.5) * 2;
        // Strong equatorial & temperate zonal bands
        const band1 = Math.sin(latNorm * 18) * 0.4;
        const band2 = Math.cos(latNorm * 36) * 0.2;
        const band3 = Math.sin(latNorm * 6) * 0.3;

        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          // Zonal shearing turbulence along latitude boundaries
          const shear = warpedFbm(x / 75, y / 25, 6) * 0.45;
          const val = (band1 + band2 + band3 + shear + 1) * 0.5;

          // Rich Jovian palette: deep terracotta, butterscotch, warm ivory, ochre, pearl
          data[idx] = Math.floor(215 + val * 38);
          data[idx + 1] = Math.floor(135 + val * 80);
          data[idx + 2] = Math.floor(80 + val * 85);
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Great Red Spot (Anti-cyclonic storm with inner counter-rotating spiral)
      const grsX = w * 0.60;
      const grsY = h * 0.68;
      const grsGrad = ctx.createRadialGradient(grsX, grsY, 6, grsX, grsY, 65);
      grsGrad.addColorStop(0, '#A82B18');
      grsGrad.addColorStop(0.4, '#C8482A');
      grsGrad.addColorStop(0.75, '#DE935F');
      grsGrad.addColorStop(1, 'rgba(215, 140, 90, 0)');
      ctx.fillStyle = grsGrad;
      ctx.beginPath();
      ctx.ellipse(grsX, grsY, 70, 38, 0.04, 0, Math.PI * 2);
      ctx.fill();

      // Inner spiral filament
      ctx.strokeStyle = 'rgba(255, 230, 200, 0.75)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(grsX, grsY, 40, 20, 0.08, 0, Math.PI * 2);
      ctx.stroke();

      // White Oval Storms (String of Pearls in Southern Temperate Belt)
      for (let p = 0; p < 6; p++) {
        const px = (w * 0.2 + p * (w * 0.13)) % w;
        const py = h * 0.78;
        const oGrad = ctx.createRadialGradient(px, py, 2, px, py, 14);
        oGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        oGrad.addColorStop(0.7, 'rgba(240, 230, 220, 0.8)');
        oGrad.addColorStop(1, 'rgba(200, 160, 120, 0)');
        ctx.fillStyle = oGrad;
        ctx.beginPath();
        ctx.ellipse(px, py, 14, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'saturn': {
      // Golden Amber and Butterscotch Cloud Belts with Polar Hexagon
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        const lat = (y / h - 0.5) * 2;
        const band = Math.sin(lat * 14) * 0.25 + Math.cos(lat * 28) * 0.1;
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const turb = fbm(x / 100, y / 40, 5) * 0.2;
          const v = (band + turb + 1) * 0.5;

          // Creamy butter, caramel, and golden haze
          data[idx] = Math.floor(230 + v * 24);
          data[idx + 1] = Math.floor(190 + v * 42);
          data[idx + 2] = Math.floor(130 + v * 48);
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // North Polar Hexagon Jetstream (Distinctive 6-sided geometric wave)
      const hexY = h * 0.08;
      ctx.fillStyle = 'rgba(150, 140, 100, 0.5)';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const hx = w * 0.5 + Math.cos(ang) * 45;
        const hy = hexY + Math.sin(ang) * 18;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'uranus': {
      // Aquamarine/Cyan Methane Atmosphere with Subtle High-Altitude Cirrus
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        const lat = (y / h - 0.5) * 2;
        const band = Math.sin(lat * 8) * 0.08;
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const haze = fbm(x / 120, y / 120, 4) * 0.08;
          const v = (band + haze + 1) * 0.5;

          data[idx] = Math.floor(75 + v * 35);
          data[idx + 1] = Math.floor(205 + v * 35);
          data[idx + 2] = Math.floor(225 + v * 28);
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      break;
    }

    case 'neptune': {
      // Dynamic Deep Electric Azure Atmosphere, Great Dark Spot, and Methane Cirrus (Scooter)
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        const lat = (y / h - 0.5) * 2;
        const band = Math.sin(lat * 12) * 0.18;
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const stormTurb = warpedFbm(x / 90, y / 50, 5) * 0.25;
          const v = (band + stormTurb + 1) * 0.5;

          data[idx] = Math.floor(18 + v * 30);
          data[idx + 1] = Math.floor(98 + v * 60);
          data[idx + 2] = Math.floor(210 + v * 45);
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Great Dark Spot (Voyager 2 Earth-sized storm)
      const dsX = w * 0.40;
      const dsY = h * 0.48;
      const dsGrad = ctx.createRadialGradient(dsX, dsY, 4, dsX, dsY, 45);
      dsGrad.addColorStop(0, '#001438');
      dsGrad.addColorStop(0.65, '#00255A');
      dsGrad.addColorStop(1, 'rgba(0, 119, 210, 0)');
      ctx.fillStyle = dsGrad;
      ctx.beginPath();
      ctx.ellipse(dsX, dsY, 48, 26, -0.08, 0, Math.PI * 2);
      ctx.fill();

      // Companion Cirrus "Scooter" Methane Cloud Streaks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(dsX - 60, dsY + 28);
      ctx.bezierCurveTo(dsX, dsY + 36, dsX + 50, dsY + 24, dsX + 100, dsY + 30);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w * 0.72, h * 0.32);
      ctx.bezierCurveTo(w * 0.78, h * 0.34, w * 0.84, h * 0.30, w * 0.92, h * 0.33);
      ctx.stroke();
      break;
    }

    case 'pluto': {
      // Ultra-HD Pluto: Sputnik Planitia Nitrogen Heart & Cthulhu Macula Tholins
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const n = (fbm(x / 60, y / 60, 6) + 1) * 0.5;
          data[idx] = Math.floor(180 + n * 48);
          data[idx + 1] = Math.floor(115 + n * 42);
          data[idx + 2] = Math.floor(70 + n * 35);
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Sputnik Planitia (Bright Tombaugh Regio Heart Glacier)
      const hx = w * 0.46;
      const hy = h * 0.52;
      ctx.fillStyle = 'rgba(252, 246, 235, 0.95)';
      ctx.beginPath();
      ctx.moveTo(hx, hy + 30);
      ctx.bezierCurveTo(hx - 60, hy - 25, hx - 75, hy - 65, hx - 25, hy - 65);
      ctx.bezierCurveTo(hx, hy - 65, hx, hy - 40, hx, hy - 20);
      ctx.bezierCurveTo(hx, hy - 40, hx, hy - 65, hx + 25, hy - 65);
      ctx.bezierCurveTo(hx + 75, hy - 65, hx + 60, hy - 25, hx, hy + 30);
      ctx.fill();
      break;
    }
  }

  // 4K & 2K Adaptive Micro-Contrast & High-Pass Edge Sharpening Pass
  applyUnsharpAndContrast(ctx, w, h, 1.15, ultraHD ? 0.38 : 0.28);

  return createConfiguredTexture(canvas, key);
}

/**
 * Generates High-Resolution Bump / Normal Relief Maps for Terrestrial Bodies
 */
export function generatePlanetBumpMap(id: PlanetId): THREE.CanvasTexture {
  const key = `planet_bump_${id}_v2`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    const v = y / h;
    const latDeg = (0.5 - v) * 180;
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const lonDeg = (u - 0.5) * 360;
      const idx = (y * w + x) * 4;
      let height = 0;

      if (id === 'earth') {
        const geo = getEarthGeography(lonDeg, latDeg, u, v);
        if (geo.isLand) {
          height = Math.floor(60 + geo.elevation * 195);
        } else {
          height = 10;
        }
      } else if (id === 'mars') {
        const m = (fbm(x / 35, y / 35, 4) + 1) * 0.5;
        height = Math.floor(m * 255);
      } else if (id === 'mercury' || id === 'ceres') {
        const cr = (fbm(x / 20, y / 20, 4) + 1) * 0.5;
        height = Math.floor(cr * 255);
      } else {
        height = 128;
      }

      data[idx] = height;
      data[idx + 1] = height;
      data[idx + 2] = height;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  applyUnsharpAndContrast(ctx, w, h, 1.2, 0.35);
  return createConfiguredTexture(canvas, key);
}

/**
 * Generates Earth Night City Lights (Highways, Metropolitan Clusters, Coastlines)
 */
export function generateEarthNightLightsTexture(): THREE.CanvasTexture {
  const key = 'earth_night_lights_v2';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  // Dark base
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  // Accurate metropolitan coordinates on equirectangular globe
  // Longitude [-180, 180] -> x = (lon + 180)/360 * w
  // Latitude [90, -90] -> y = (90 - lat)/180 * h
  const cities = [
    // North America
    { name: 'NYC / Bos-Wash Megalopolis', lon: -74, lat: 40.7, r: 24, intensity: 1.0 },
    { name: 'Chicago / Great Lakes', lon: -87.6, lat: 41.8, r: 18, intensity: 0.95 },
    { name: 'Los Angeles / SoCal', lon: -118.2, lat: 34.0, r: 22, intensity: 1.0 },
    { name: 'San Francisco Bay Area', lon: -122.4, lat: 37.7, r: 16, intensity: 0.95 },
    { name: 'Texas Triangle (Dallas/Houston)', lon: -96.8, lat: 32.7, r: 20, intensity: 0.9 },
    { name: 'Florida / Miami Corridor', lon: -80.2, lat: 25.8, r: 15, intensity: 0.9 },
    { name: 'Mexico City Megacity', lon: -99.1, lat: 19.4, r: 18, intensity: 0.9 },
    // South America
    { name: 'Sao Paulo / Rio', lon: -46.6, lat: -23.5, r: 22, intensity: 0.95 },
    { name: 'Buenos Aires', lon: -58.4, lat: -34.6, r: 16, intensity: 0.85 },
    { name: 'Bogota & Lima', lon: -74.1, lat: 4.7, r: 14, intensity: 0.8 },
    // Europe
    { name: 'London & UK', lon: -0.1, lat: 51.5, r: 22, intensity: 1.0 },
    { name: 'Paris & Rhine-Ruhr Belt', lon: 2.3, lat: 48.8, r: 28, intensity: 1.0 },
    { name: 'Milan / Northern Italy', lon: 9.2, lat: 45.4, r: 16, intensity: 0.9 },
    { name: 'Madrid & Iberian Coast', lon: -3.7, lat: 40.4, r: 15, intensity: 0.85 },
    { name: 'Moscow', lon: 37.6, lat: 55.7, r: 18, intensity: 0.9 },
    // Asia & Middle East
    { name: 'Tokyo / Kanto (World largest night cluster)', lon: 139.7, lat: 35.7, r: 30, intensity: 1.0 },
    { name: 'Seoul Metropolitan Area', lon: 127.0, lat: 37.5, r: 18, intensity: 1.0 },
    { name: 'Shanghai / Yangtze River Delta', lon: 121.5, lat: 31.2, r: 28, intensity: 1.0 },
    { name: 'Beijing & Tianjin', lon: 116.4, lat: 39.9, r: 24, intensity: 0.95 },
    { name: 'Pearl River Delta (Guangzhou/Shenzhen/HK)', lon: 113.3, lat: 23.1, r: 25, intensity: 1.0 },
    { name: 'Taipei', lon: 121.5, lat: 25.0, r: 12, intensity: 0.9 },
    { name: 'Singapore / Malaysia', lon: 103.8, lat: 1.3, r: 14, intensity: 0.95 },
    { name: 'India Indo-Gangetic Plain & Delhi', lon: 77.2, lat: 28.6, r: 28, intensity: 0.95 },
    { name: 'Mumbai & Western Coast', lon: 72.8, lat: 19.0, r: 22, intensity: 0.9 },
    { name: 'Persian Gulf (Dubai / Doha / Kuwait)', lon: 55.3, lat: 25.2, r: 18, intensity: 1.0 },
    { name: 'Nile River Delta & Cairo', lon: 31.2, lat: 30.0, r: 18, intensity: 0.9 },
    // Australia & Africa
    { name: 'Sydney & Melbourne', lon: 151.2, lat: -33.8, r: 16, intensity: 0.85 },
    { name: 'Johannesburg', lon: 28.0, lat: -26.2, r: 14, intensity: 0.8 },
    { name: 'Lagos & West African Coast', lon: 3.4, lat: 6.5, r: 16, intensity: 0.8 }
  ];

  cities.forEach(c => {
    const cx = ((c.lon + 180) / 360) * w;
    const cy = ((90 - c.lat) / 180) * h;

    const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, c.r);
    g.addColorStop(0, `rgba(255, 230, 150, ${c.intensity})`);
    g.addColorStop(0.25, `rgba(255, 185, 75, ${c.intensity * 0.85})`);
    g.addColorStop(0.6, `rgba(245, 130, 30, ${c.intensity * 0.35})`);
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, c.r, 0, Math.PI * 2);
    ctx.fill();

    // Sharp pinpoint city lights
    for (let p = 0; p < 35; p++) {
      const px = cx + (Math.random() - 0.5) * c.r * 1.5;
      const py = cy + (Math.random() - 0.5) * c.r * 1.5;
      const sz = Math.random() * 1.2 + 0.4;
      ctx.fillStyle = Math.random() < 0.3 ? '#FFF0B3' : '#FFB732';
      ctx.beginPath();
      ctx.arc(px, py, sz, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  applyUnsharpAndContrast(ctx, w, h, 1.15, 0.3);
  return createConfiguredTexture(canvas, key);
}

/**
 * Generates Earth Specular Map (Oceans reflective white, continents matte black)
 */
export function generateEarthSpecularMap(): THREE.CanvasTexture {
  const key = 'earth_specular_v2';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    const v = y / h;
    const latDeg = (0.5 - v) * 180;

    for (let x = 0; x < w; x++) {
      const u = x / w;
      const lonDeg = (u - 0.5) * 360;
      const idx = (y * w + x) * 4;

      const geo = getEarthGeography(lonDeg, latDeg, u, v);

      let spec = 0;
      if (geo.isIce) {
        spec = 120; // Polar ice has subtle semi-gloss reflection
      } else if (geo.isLand) {
        spec = 8; // Land is matte
      } else {
        spec = 255; // Ocean water has pristine mirror specularity
      }

      data[idx] = spec;
      data[idx + 1] = spec;
      data[idx + 2] = spec;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  applyUnsharpAndContrast(ctx, w, h, 1.1, 0.25);
  return createConfiguredTexture(canvas, key);
}

/**
 * Generates Earth Atmospheric Clouds Texture
 */
export function generateEarthCloudsTexture(): THREE.CanvasTexture {
  const key = 'earth_clouds_hd';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    const lat = (y / h - 0.5) * 2;
    // Equatorial ITCZ and Mid-latitude storm belt cloud bias
    const itcz = Math.exp(-lat * lat * 18) * 0.25;
    const midLat = Math.exp(-(Math.abs(lat) - 0.5) * (Math.abs(lat) - 0.5) * 12) * 0.2;

    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const swirl = warpedFbm(x / 45, y / 30, 3);
      const n = swirl + itcz + midLat;

      if (n > 0.08) {
        const alpha = Math.min(245, Math.floor((n - 0.08) * 420));
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = alpha;
      } else {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 0;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Add 2 realistic spiral cyclones
  const cyclones = [
    { x: w * 0.32, y: h * 0.35, r: 35 },
    { x: w * 0.78, y: h * 0.40, r: 40 }
  ];

  cyclones.forEach(cy => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 3;
    for (let arm = 0; arm < 3; arm++) {
      ctx.beginPath();
      for (let t = 0; t < 20; t++) {
        const angle = (t / 8) + (arm * Math.PI * 0.66);
        const rad = t * 1.5;
        const px = cy.x + Math.cos(angle) * rad;
        const py = cy.y + Math.sin(angle) * rad;
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  });

  return createConfiguredTexture(canvas, key);
}

/**
 * Generates Photorealistic Saturn Rings Texture with Cassini Division & Encke Gap
 */
export function generateSaturnRingsTexture(): THREE.CanvasTexture {
  const key = 'saturn_rings_hd_v2';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let x = 0; x < w; x++) {
    const pos = x / w; // 0 to 1 along ring radius
    let alpha = 0;
    let r = 215, g = 185, b = 140;

    // D ring (faint inner): 0.0 - 0.12
    if (pos >= 0.02 && pos < 0.12) {
      alpha = 35 + Math.sin(pos * 90) * 15;
      r = 160; g = 135; b = 105;
    }
    // C ring: 0.12 - 0.32 (translucent creamer with fine sub-bands)
    else if (pos >= 0.12 && pos < 0.32) {
      alpha = 95 + Math.sin(pos * 180) * 35 + Math.sin(pos * 900) * 10;
      r = 185; g = 155; b = 120;
    }
    // B ring: 0.32 - 0.68 (dense, bright, highly reflective ice sheets)
    else if (pos >= 0.32 && pos < 0.68) {
      alpha = 245 + Math.sin(pos * 350) * 8 + Math.sin(pos * 1200) * 5;
      r = 248; g = 215; b = 165;
    }
    // Cassini Division: 0.68 - 0.74 (major 4,800 km dark resonance gap)
    else if (pos >= 0.68 && pos < 0.74) {
      alpha = 6;
      r = 40; g = 30; b = 20;
    }
    // A ring: 0.74 - 0.95 (bright with Encke & Keeler gaps)
    else if (pos >= 0.74 && pos < 0.95) {
      if (pos > 0.882 && pos < 0.898) {
        // Encke gap (325 km clear gap)
        alpha = 4;
      } else if (pos > 0.938 && pos < 0.944) {
        // Keeler gap
        alpha = 4;
      } else {
        alpha = 210 + Math.sin(pos * 220) * 28 + Math.sin(pos * 800) * 10;
        r = 228; g = 195; b = 148;
      }
    }
    // F ring: 0.97 - 0.985 (narrow braided shepherd ring)
    else if (pos >= 0.97 && pos <= 0.985) {
      alpha = 130;
      r = 210; g = 180; b = 140;
    }

    for (let y = 0; y < h; y++) {
      const idx = (y * w + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = Math.max(0, Math.min(255, Math.floor(alpha)));
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return createConfiguredTexture(canvas, key, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
}

/**
 * Generates Ultra-HD Deep Space Panorama (Deep Black Void, Distant Spiral Galaxies, Gravitationally-Lensed Interstellar Black Hole, Nebulae, Constellations)
 */
export function generateSpaceBackground(): THREE.CanvasTexture {
  const key = 'deep_space_sky_celestial_v3';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  // 1. Pure Pitch-Black Deep Cosmic Vacuum (#000000)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  // 2. Distant Spiral Galaxy (like Andromeda / M31) with core, spiral arms, blue star clusters
  const gx = w * 0.74;
  const gy = h * 0.28;
  const gAngle = -0.42;

  ctx.save();
  ctx.translate(gx, gy);
  ctx.rotate(gAngle);

  // Outer Galaxy Glow & Disc
  const galaxyHalo = ctx.createRadialGradient(0, 0, 8, 0, 0, 140);
  galaxyHalo.addColorStop(0, 'rgba(255, 240, 210, 0.45)');
  galaxyHalo.addColorStop(0.18, 'rgba(220, 200, 255, 0.22)');
  galaxyHalo.addColorStop(0.45, 'rgba(147, 197, 253, 0.12)');
  galaxyHalo.addColorStop(0.8, 'rgba(59, 130, 246, 0.04)');
  galaxyHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = galaxyHalo;
  ctx.beginPath();
  ctx.ellipse(0, 0, 140, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spiral Arms (Logarithmic spiral rendering)
  for (let arm = 0; arm < 2; arm++) {
    const armOffset = arm * Math.PI;
    ctx.beginPath();
    for (let t = 0; t < 60; t++) {
      const theta = (t / 12) + armOffset;
      const radius = 10 + Math.pow(t / 8, 1.8) * 16;
      const px = Math.cos(theta) * radius;
      const py = Math.sin(theta) * radius * 0.36; // Foreshortened inclination
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.16)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Starburst H-II nodes along spiral arms
    for (let s = 10; s < 55; s += 4) {
      const theta = (s / 12) + armOffset + (Math.random() - 0.5) * 0.2;
      const radius = 10 + Math.pow(s / 8, 1.8) * 16;
      const px = Math.cos(theta) * radius;
      const py = Math.sin(theta) * radius * 0.36;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(147, 197, 253, 0.5)' : 'rgba(244, 114, 182, 0.45)';
      ctx.beginPath();
      ctx.arc(px, py, Math.random() * 1.5 + 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Intense Galactic Nucleus
  const coreGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 22);
  coreGrad.addColorStop(0, 'rgba(255, 255, 245, 0.95)');
  coreGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.7)');
  coreGrad.addColorStop(0.7, 'rgba(251, 146, 60, 0.25)');
  coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // 3. Distant Edge-on Lenticular / Sombrero Galaxy (with dark absorption dust lane)
  const egx = w * 0.14;
  const egy = h * 0.32;
  ctx.save();
  ctx.translate(egx, egy);
  ctx.rotate(0.25);

  const sombreroGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 75);
  sombreroGlow.addColorStop(0, 'rgba(255, 250, 230, 0.55)');
  sombreroGlow.addColorStop(0.3, 'rgba(224, 231, 255, 0.25)');
  sombreroGlow.addColorStop(0.7, 'rgba(129, 140, 248, 0.06)');
  sombreroGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sombreroGlow;
  ctx.beginPath();
  ctx.ellipse(0, 0, 75, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark Equator Dust Lane bisecting the galaxy
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.beginPath();
  ctx.ellipse(0, 2, 70, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Interstellar Kip Thorne Relativistic Black Hole (Gargantua Style)
  // Featuring razor-sharp gravitational lensing, Doppler beaming, upper & lower Einstein rings, photon sphere
  const bhX = w * 0.28;
  const bhY = h * 0.74;
  const bhRadius = 32;

  ctx.save();
  ctx.translate(bhX, bhY);

  // A. Broad Gravitational Deflection Aura
  const bhAura = ctx.createRadialGradient(0, 0, bhRadius * 0.8, 0, 0, bhRadius * 4.2);
  bhAura.addColorStop(0, 'rgba(255, 230, 160, 0.65)');
  bhAura.addColorStop(0.15, 'rgba(255, 175, 60, 0.45)');
  bhAura.addColorStop(0.4, 'rgba(234, 88, 12, 0.2)');
  bhAura.addColorStop(0.7, 'rgba(147, 51, 234, 0.06)');
  bhAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bhAura;
  ctx.beginPath();
  ctx.arc(0, 0, bhRadius * 4.2, 0, Math.PI * 2);
  ctx.fill();

  // B. Warped Lensed Background Starlight Deflection Arc (Einstein Ring Distortion)
  for (let a = 0; a < 36; a++) {
    const angle = (a / 36) * Math.PI * 2;
    const rDist = bhRadius * (2.8 + Math.sin(a * 5) * 0.2);
    const starX = Math.cos(angle) * rDist;
    const starY = Math.sin(angle) * rDist;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(starX, starY, Math.random() * 0.8 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // C. Upper Gravitational Lensing Halo (Light from rear disk bent UP over top of horizon)
  ctx.save();
  const upperLensedGrad = ctx.createLinearGradient(-bhRadius * 2.8, -bhRadius * 1.8, bhRadius * 2.8, 0);
  upperLensedGrad.addColorStop(0, 'rgba(255, 255, 240, 1.0)'); // Approaching blueshifted side
  upperLensedGrad.addColorStop(0.3, 'rgba(254, 215, 120, 0.95)');
  upperLensedGrad.addColorStop(0.65, 'rgba(249, 115, 22, 0.85)');
  upperLensedGrad.addColorStop(1, 'rgba(154, 52, 18, 0.35)'); // Receding redshifted side
  ctx.strokeStyle = upperLensedGrad;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, -bhRadius * 0.15, bhRadius * 1.85, bhRadius * 1.62, 0, Math.PI * 0.82, Math.PI * 2.18);
  ctx.stroke();

  // Fine Upper Accretion Streamlines
  for (let s = 1; s <= 3; s++) {
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = `rgba(255, 245, 200, ${0.9 - s * 0.25})`;
    ctx.beginPath();
    ctx.ellipse(0, -bhRadius * 0.15, bhRadius * (1.85 + s * 0.18), bhRadius * (1.62 + s * 0.16), 0, Math.PI * 0.86, Math.PI * 2.14);
    ctx.stroke();
  }
  ctx.restore();

  // D. Lower Gravitational Lensing Halo (Light bent DOWN under the horizon)
  ctx.save();
  const lowerLensedGrad = ctx.createLinearGradient(-bhRadius * 2.4, 0, bhRadius * 2.4, bhRadius * 1.8);
  lowerLensedGrad.addColorStop(0, 'rgba(255, 240, 180, 0.9)');
  lowerLensedGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.7)');
  lowerLensedGrad.addColorStop(1, 'rgba(124, 45, 18, 0.25)');
  ctx.strokeStyle = lowerLensedGrad;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.ellipse(0, bhRadius * 0.15, bhRadius * 1.75, bhRadius * 1.48, 0, Math.PI * 0.05, Math.PI * 0.95);
  ctx.stroke();
  ctx.restore();

  // E. Main Relativistic Equatorial Accretion Disk (Doppler Beaming Asymmetry)
  ctx.save();
  // Relativistic Doppler beaming gradient: approaching side (left) is intense white-hot gold, receding side (right) is dark copper
  const diskGrad = ctx.createLinearGradient(-bhRadius * 3.4, 0, bhRadius * 3.4, 0);
  diskGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
  diskGrad.addColorStop(0.12, 'rgba(255, 255, 255, 1.0)'); // Extreme Doppler hotspot
  diskGrad.addColorStop(0.28, 'rgba(254, 240, 138, 0.98)');
  diskGrad.addColorStop(0.5, 'rgba(251, 146, 60, 0.9)');
  diskGrad.addColorStop(0.75, 'rgba(194, 65, 12, 0.65)');
  diskGrad.addColorStop(0.92, 'rgba(124, 45, 18, 0.25)');
  diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = diskGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, bhRadius * 3.3, bhRadius * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();

  // Razor-sharp concentric plasma streamlines within accretion disk
  for (let ring = 1; ring <= 5; ring++) {
    const ringRadX = bhRadius * (1.4 + ring * 0.36);
    const ringRadY = ringRadX * 0.145;
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = `rgba(255, 240, 180, ${0.7 - ring * 0.11})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, ringRadX, ringRadY, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // F. Pure Black Event Horizon Shadow (Schwarzschild / Kerr Metric Event Horizon)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(0, 0, bhRadius, 0, Math.PI * 2);
  ctx.fill();

  // G. Ultra-Sharp Relativistic Photon Ring (Thin 1.5 rs boundary of trapped photons)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.98)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, bhRadius * 1.02, 0, Math.PI * 2);
  ctx.stroke();

  // Sub-pixel secondary photon ring
  ctx.strokeStyle = 'rgba(254, 215, 120, 0.75)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(0, 0, bhRadius * 1.07, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  // 5. Interstellar Dust Clouds & Nebulae (Ethereal Cosmic Gas Filaments)
  const nebulae = [
    // Orion-like Crimson H-alpha emission & Teal reflection
    { x: w * 0.44, y: h * 0.42, rx: 280, ry: 160, rot: 0.3, color: 'rgba(244, 63, 94, 0.05)' },
    { x: w * 0.47, y: h * 0.39, rx: 180, ry: 110, rot: -0.2, color: 'rgba(56, 189, 248, 0.055)' },
    // Carina / Veil Purple & Cyan gas
    { x: w * 0.88, y: h * 0.68, rx: 260, ry: 150, rot: -0.4, color: 'rgba(168, 85, 247, 0.045)' },
    { x: w * 0.08, y: h * 0.78, rx: 220, ry: 130, rot: 0.5, color: 'rgba(45, 212, 191, 0.045)' }
  ];

  nebulae.forEach(n => {
    ctx.save();
    ctx.translate(n.x, n.y);
    ctx.rotate(n.rot);
    const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, n.rx);
    grad.addColorStop(0, n.color);
    grad.addColorStop(0.5, n.color.replace(/[\d\.]+\)$/, '0.02)'));
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, n.rx, n.ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // 6. Milky Way Galactic Plane & Core Dust Stream
  ctx.save();
  ctx.translate(w * 0.5, h * 0.5);
  ctx.rotate(-0.32);

  // Milky Way Core
  const mwCore = ctx.createRadialGradient(0, 0, 20, 0, 0, 360);
  mwCore.addColorStop(0, 'rgba(255, 235, 200, 0.09)');
  mwCore.addColorStop(0.3, 'rgba(216, 180, 254, 0.06)');
  mwCore.addColorStop(0.7, 'rgba(96, 165, 250, 0.03)');
  mwCore.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = mwCore;
  ctx.beginPath();
  ctx.ellipse(0, 0, 480, 140, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dense Galactic Plane Ribbon
  const mwRibbon = ctx.createLinearGradient(-w, 0, w, 0);
  mwRibbon.addColorStop(0, 'rgba(59, 130, 246, 0.02)');
  mwRibbon.addColorStop(0.5, 'rgba(230, 180, 255, 0.07)');
  mwRibbon.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
  ctx.fillStyle = mwRibbon;
  ctx.fillRect(-w, -70, w * 2, 140);

  ctx.restore();

  // 7. Multi-Tiered Star Population: 2,400 Crisp Multi-Spectral Stars & Sparkling Pinpricks
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const isBright = Math.random() < 0.035;
    const isMedium = Math.random() < 0.15;
    const size = isBright ? (Math.random() * 1.8 + 1.1) : isMedium ? (Math.random() * 0.9 + 0.5) : (Math.random() * 0.55 + 0.2);
    const alpha = Math.random() * 0.85 + 0.15;

    // Stellar spectral classifications: O/B (blue-white), A/F (white), G (yellow Sol-like), K (orange), M (red supergiant)
    const spec = Math.random();
    let col = `rgba(255, 255, 255, ${alpha})`;
    if (spec < 0.25) col = `rgba(186, 230, 253, ${alpha})`; // Blue-white (Rigel/Vega)
    else if (spec < 0.45) col = `rgba(254, 240, 138, ${alpha})`; // Yellow-white (Sol/Alpha Centauri)
    else if (spec < 0.58) col = `rgba(254, 215, 170, ${alpha})`; // Warm Orange (Arcturus)
    else if (spec < 0.68) col = `rgba(252, 165, 165, ${alpha})`; // Red Supergiant (Betelgeuse)

    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    // 4-Point Optical Diffraction Spikes for Landmark Supergiants
    if (isBright && size > 1.5) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
      ctx.lineWidth = 0.6;
      const spikeLen = size * 4.5;

      ctx.beginPath();
      ctx.moveTo(x - spikeLen, y);
      ctx.lineTo(x + spikeLen, y);
      ctx.moveTo(x, y - spikeLen);
      ctx.lineTo(x, y + spikeLen);
      ctx.stroke();
    }
  }

  return createConfiguredTexture(canvas, key, THREE.RepeatWrapping, THREE.ClampToEdgeWrapping);
}

/**
 * Generates an HDR-style equirectangular celestial environment map for PBR specular reflections
 */
export function generateHDREnvironmentMap(): THREE.CanvasTexture {
  const key = 'hdr_environment_map_specular_v2';
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  // Pure pitch black cosmic base
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  // Milky Way band reflection
  const mwGrad = ctx.createLinearGradient(0, h * 0.2, w, h * 0.8);
  mwGrad.addColorStop(0, 'rgba(56, 189, 248, 0.0)');
  mwGrad.addColorStop(0.4, 'rgba(147, 197, 253, 0.2)');
  mwGrad.addColorStop(0.5, 'rgba(254, 215, 170, 0.3)');
  mwGrad.addColorStop(0.6, 'rgba(192, 132, 252, 0.2)');
  mwGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
  ctx.fillStyle = mwGrad;
  ctx.fillRect(0, 0, w, h);

  // Specular stellar pinpricks
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 1.1 + 0.3;
    const intense = Math.random() > 0.8;
    ctx.fillStyle = intense ? '#ffffff' : 'rgba(224, 242, 254, 0.75)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = createConfiguredTexture(canvas, key, THREE.RepeatWrapping, THREE.ClampToEdgeWrapping);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

/**
 * Generates a high-fidelity Sun Corona & Glare billboard sprite texture
 * with soft exponential falloff and radial streamer rays for additive blending.
 */
export function generateSunCoronaSpriteTexture(): THREE.CanvasTexture {
  const key = 'sun_corona_billboard_sprite_v2';
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  // Clear to transparent
  ctx.clearRect(0, 0, w, h);

  // 1. Broad exponential outer glow
  const outerGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, cx);
  outerGrad.addColorStop(0, 'rgba(255, 245, 220, 1.0)');
  outerGrad.addColorStop(0.12, 'rgba(255, 190, 70, 0.85)');
  outerGrad.addColorStop(0.35, 'rgba(255, 120, 20, 0.4)');
  outerGrad.addColorStop(0.65, 'rgba(230, 60, 5, 0.12)');
  outerGrad.addColorStop(1.0, 'rgba(180, 20, 0, 0.0)');
  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, cx, 0, Math.PI * 2);
  ctx.fill();

  // 2. Fine coronal magnetic streamers / diffraction rays
  const numRays = 48;
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * Math.PI * 2;
    const rayLen = cx * (0.6 + Math.sin(i * 3.7) * 0.25 + Math.cos(i * 7.1) * 0.15);
    const rayWidth = (Math.PI * 2) / numRays * 0.45;

    ctx.fillStyle = 'rgba(255, 210, 130, 0.07)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rayLen, angle - rayWidth / 2, angle + rayWidth / 2);
    ctx.closePath();
    ctx.fill();
  }

  // 3. Ultra-bright solar core hotspot
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx * 0.35);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  coreGrad.addColorStop(0.4, 'rgba(255, 240, 200, 0.9)');
  coreGrad.addColorStop(0.8, 'rgba(255, 180, 80, 0.3)');
  coreGrad.addColorStop(1.0, 'rgba(255, 120, 20, 0.0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, cx * 0.35, 0, Math.PI * 2);
  ctx.fill();

  return createConfiguredTexture(canvas, key, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
}

