import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { CelestialBody, PlanetId, ViewMode, SolarSystemSettings } from '../../types/solar';
import {
  generatePlanetTexture,
  generatePlanetBumpMap,
  generateEarthNightLightsTexture,
  generateEarthSpecularMap,
  generateEarthCloudsTexture,
  generateSaturnRingsTexture,
  generateSpaceBackground,
  generateHDREnvironmentMap,
  generateSunCoronaSpriteTexture,
  generateAsteroidTexture,
  generateAsteroidBumpMap,
  generateKuiperTexture,
  generateDustParticleSprite,
  setGlobalMaxAnisotropy
} from '../../utils/textureGenerator';

interface SolarSystem3DProps {
  planets: CelestialBody[];
  activePlanetId: PlanetId;
  viewMode: ViewMode;
  settings: SolarSystemSettings;
  onSelectPlanet: (id: PlanetId) => void;
  showAtmosphere: boolean;
  showMoons: boolean;
}

interface PlanetMeshEntry {
  body: CelestialBody;
  group: THREE.Group;
  mesh: THREE.Mesh;
  cloudsMesh?: THREE.Mesh;
  atmosphereGlowMesh?: THREE.Mesh;
  hazeInnerMesh?: THREE.Mesh;
  hazeOuterMesh?: THREE.Mesh;
  ringsMesh?: THREE.Mesh;
  moonsGroup: THREE.Group;
  orbitLine: THREE.Line;
  currentAngle: number;
}

export const SolarSystem3D: React.FC<SolarSystem3DProps> = ({
  planets,
  activePlanetId,
  viewMode,
  settings,
  onSelectPlanet,
  showAtmosphere,
  showMoons
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetMeshesRef = useRef<Map<PlanetId, PlanetMeshEntry>>(new Map());
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.PointLight | null>(null);
  const sunCoronaSpriteRef = useRef<THREE.Sprite | null>(null);
  const sunCoronaRef = useRef<THREE.Mesh | null>(null);
  const sunOuterGlowRef = useRef<THREE.Mesh | null>(null);
  const cameraHeadlightRef = useRef<THREE.DirectionalLight | null>(null);
  const asteroidBeltRef = useRef<THREE.InstancedMesh | null>(null);
  const kuiperBeltRef = useRef<THREE.InstancedMesh | null>(null);
  const dustPointsRef = useRef<THREE.Points | null>(null);

  // Real-time FPS telemetry tracking state
  const [fps, setFps] = React.useState<number>(60);
  const [frameTimeMs, setFrameTimeMs] = React.useState<number>(16.6);
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(performance.now());

  // Interaction State
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraTargetPos = useRef(new THREE.Vector3(0, 30, 85));
  const cameraLookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const userRotation = useRef({ x: 0.22, y: 0 });
  const autoOrbitAngle = useRef(0);

  // Robust Zoom State & Multiplier
  const userZoomMultiplier = useRef(1.0);
  const targetZoomMultiplier = useRef(1.0);

  // Raycasting for interactive clicks
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Smoothly ease zoom back to default comfortable framing when switching planets
  useEffect(() => {
    targetZoomMultiplier.current = 1.0;
  }, [activePlanetId]);

  // Global Keyboard Zoom Listener (ArrowUp / ArrowDown / +/- / W / S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === '=' || e.key === '+' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        // Zoom IN (reduce distance multiplier, clamped to min)
        targetZoomMultiplier.current = Math.max(0.28, targetZoomMultiplier.current * 0.85);
      } else if (e.key === 'ArrowDown' || e.key === '-' || e.key === '_' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        // Zoom OUT (increase distance multiplier, clamped to max)
        targetZoomMultiplier.current = Math.min(4.5, targetZoomMultiplier.current * 1.18);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // 4K Ultra-Deep Celestial Skybox Sphere with Spiral Galaxies, Dust Nebulae, and Black Hole
    const skyGeo = new THREE.SphereGeometry(950, 64, 64);
    const skyTex = generateSpaceBackground();
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      depthWrite: false
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 4000);
    camera.position.set(0, 45, 110);
    cameraRef.current = camera;

    // 3. 200% Enhanced Ultra HD Graphics Setup
    const pixelRatioMax = 3.0; // Maximum subpixel sharpness across 3x Retina and high-DPI smartphone OLED screens

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioMax));

    // Synchronize dynamic GPU maximum anisotropic filtering to eliminate distance blur
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    setGlobalMaxAnisotropy(maxAnisotropy);
    
    // ACESFilmic Tone Mapping for rich dynamic range without blown-out whites or crushed blacks
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    
    // Enable High Dynamic Real-time Shadows
    renderer.shadowMap.enabled = settings.showShadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Enhanced Multi-Source Space & Planetary Illumination:
    // (a) Ambient Cosmic Fill Light: Ensures planets are never pitch black in shadow, revealing vibrant surface details
    const cosmicAmbient = new THREE.AmbientLight(0xf1f5f9, 1.15);
    scene.add(cosmicAmbient);

    // (b) Dual-Tone Hemisphere Cosmic Fill: Soft cyan starlight from above & warm nebular bounce from below
    const hemisphereFill = new THREE.HemisphereLight(0x7dd3fc, 0x1e293b, 0.75);
    scene.add(hemisphereFill);

    // (c) Central Sun Point Light: Linear reach (decay: 0) to ensure outer planets (Jupiter, Saturn, Uranus, Neptune, Pluto) are brightly illuminated
    const sunLight = new THREE.PointLight(0xfffbf0, 4.2, 4000, 0);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = settings.showShadows;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0002;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 4000;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // (d) Secondary atmospheric limb radiance light
    const sunSecondaryLight = new THREE.PointLight(0x38bdf8, 0.95, 2000, 0);
    sunSecondaryLight.position.set(0, 0, 0);
    scene.add(sunSecondaryLight);

    // (e) Dynamic Viewport Camera Headlight: Casts frontal illumination directly onto whichever planet is currently observed
    const cameraHeadlight = new THREE.DirectionalLight(0xffffff, 0.85);
    cameraHeadlight.position.set(0, 20, 50);
    scene.add(cameraHeadlight);
    cameraHeadlightRef.current = cameraHeadlight;

    // 5. Build High-Fidelity Celestial Bodies
    const planetEntries = new Map<PlanetId, PlanetMeshEntry>();

    planets.forEach((body, idx) => {
      const group = new THREE.Group();
      scene.add(group);

      const texture = generatePlanetTexture(body.id, settings.ultraHD4K);
      let mesh: THREE.Mesh;
      let cloudsMesh: THREE.Mesh | undefined;
      let atmosphereGlowMesh: THREE.Mesh | undefined;
      let hazeInnerMesh: THREE.Mesh | undefined;
      let hazeOuterMesh: THREE.Mesh | undefined;
      let ringsMesh: THREE.Mesh | undefined;

      const scale = body.visualScale;
      // 200% High-polygon sphere tessellation for silky smooth circular silhouettes
      const sphereSegments = ['sun', 'jupiter', 'saturn', 'earth'].includes(body.id) ? 96 : 64;

      if (body.id === 'sun') {
        // Blazing Photosphere Core
        const sunGeo = new THREE.SphereGeometry(scale, 96, 96);
        const sunMat = new THREE.MeshBasicMaterial({
          map: texture
        });
        mesh = new THREE.Mesh(sunGeo, sunMat);
        mesh.userData = { planetId: body.id };
        group.add(mesh);
        sunMeshRef.current = mesh;

        // Dynamic Inner Solar Corona / Prominences Shell
        const coronaGeo = new THREE.SphereGeometry(scale * 1.15, 48, 48);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: 0xff8800,
          transparent: true,
          opacity: 0.32,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        });
        const corona = new THREE.Mesh(coronaGeo, coronaMat);
        group.add(corona);
        sunCoronaRef.current = corona;

        // Outer Chromosphere Volumetric Halo
        const outerGlowGeo = new THREE.SphereGeometry(scale * 1.35, 48, 48);
        const outerGlowMat = new THREE.MeshBasicMaterial({
          color: 0xffaa33,
          transparent: true,
          opacity: 0.16,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        });
        const outerGlow = new THREE.Mesh(outerGlowGeo, outerGlowMat);
        group.add(outerGlow);
        sunOuterGlowRef.current = outerGlow;

        // Additive Billboard Corona Sprite for realistic atmospheric glare & coronal rays
        const coronaSpriteTex = generateSunCoronaSpriteTexture();
        const coronaSpriteMat = new THREE.SpriteMaterial({
          map: coronaSpriteTex,
          transparent: true,
          opacity: 0.92,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const coronaSprite = new THREE.Sprite(coronaSpriteMat);
        coronaSprite.scale.set(scale * 4.2, scale * 4.2, 1);
        group.add(coronaSprite);
        sunCoronaSpriteRef.current = coronaSprite;

      } else {
        // High Precision PBR Planetary Surface Material with Vibrant Emissive Luminescence
        const planetGeo = new THREE.SphereGeometry(scale, sphereSegments, sphereSegments);
        let planetMat: THREE.MeshStandardMaterial;

        if (body.id === 'earth') {
          // Multi-layer Earth: Diffuse + Bump Topography + Ocean Specular Highlight + Night City Lights
          const bumpTex = generatePlanetBumpMap('earth');
          const specTex = generateEarthSpecularMap();
          const nightLightsTex = generateEarthNightLightsTexture();

          planetMat = new THREE.MeshStandardMaterial({
            map: texture,
            bumpMap: bumpTex,
            bumpScale: 0.05,
            roughnessMap: specTex,
            roughness: 0.55,
            metalness: 0.08,
            emissiveMap: settings.showNightLights ? nightLightsTex : undefined,
            emissive: settings.showNightLights ? new THREE.Color(0xffe4b5) : new THREE.Color(0x1e3a8a),
            emissiveIntensity: settings.showNightLights ? 0.90 : 0.20
          });
        } else if (body.id === 'mars' || body.id === 'mercury' || body.id === 'ceres' || body.id === 'pluto') {
          // Rocky bodies with Relief Bump Mapping & distinctive planetary glow
          const bumpTex = generatePlanetBumpMap(body.id);
          planetMat = new THREE.MeshStandardMaterial({
            map: texture,
            bumpMap: bumpTex,
            bumpScale: body.id === 'mars' ? 0.07 : 0.04,
            roughness: 0.65,
            metalness: 0.04,
            emissive: new THREE.Color(body.colorHex),
            emissiveIntensity: 0.22
          });
        } else {
          // Gas & Ice Giants (Jupiter, Saturn, Uranus, Neptune, Venus)
          planetMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.48,
            metalness: 0.04,
            emissive: new THREE.Color(body.colorHex),
            emissiveIntensity: 0.25
          });
        }

        mesh = new THREE.Mesh(planetGeo, planetMat);
        mesh.userData = { planetId: body.id };
        mesh.rotation.z = THREE.MathUtils.degToRad(body.axialTiltDeg);
        mesh.castShadow = settings.showShadows;
        mesh.receiveShadow = settings.showShadows;
        group.add(mesh);

        // Soft volumetric-style atmospheric haze shells for Gas & Ice Giants (Banding Parallax)
        if (['jupiter', 'saturn', 'uranus', 'neptune'].includes(body.id)) {
          const hazeColor =
            body.id === 'jupiter'
              ? 0xfbbf24
              : body.id === 'saturn'
              ? 0xfde047
              : body.id === 'uranus'
              ? 0x22d3ee
              : 0x3b82f6;

          // Inner atmospheric haze shell
          const innerHazeGeo = new THREE.SphereGeometry(scale * 1.012, 48, 48);
          const innerHazeMat = new THREE.MeshBasicMaterial({
            color: hazeColor,
            transparent: true,
            opacity: 0.22,
            side: THREE.FrontSide,
            blending: THREE.NormalBlending
          });
          hazeInnerMesh = new THREE.Mesh(innerHazeGeo, innerHazeMat);
          hazeInnerMesh.rotation.z = THREE.MathUtils.degToRad(body.axialTiltDeg);
          group.add(hazeInnerMesh);

          // Outer limb scattering shell
          const outerHazeGeo = new THREE.SphereGeometry(scale * 1.026, 48, 48);
          const outerHazeMat = new THREE.MeshBasicMaterial({
            color: hazeColor,
            transparent: true,
            opacity: 0.18,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
          });
          hazeOuterMesh = new THREE.Mesh(outerHazeGeo, outerHazeMat);
          hazeOuterMesh.rotation.z = THREE.MathUtils.degToRad(body.axialTiltDeg);
          group.add(hazeOuterMesh);
        }

        // Earth Atmospheric Cloud System (Self-shadowing with light glow)
        if (body.id === 'earth') {
          const cloudsGeo = new THREE.SphereGeometry(scale * 1.022, 64, 64);
          const cloudsTex = generateEarthCloudsTexture();
          const cloudsMat = new THREE.MeshStandardMaterial({
            map: cloudsTex,
            transparent: true,
            opacity: 0.90,
            blending: THREE.NormalBlending,
            roughness: 0.60,
            emissive: new THREE.Color(0xffffff),
            emissiveIntensity: 0.18
          });
          cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
          cloudsMesh.castShadow = settings.showShadows;
          group.add(cloudsMesh);
        }

        // Rayleigh Atmospheric Scattering Fresnel Rim Halo (NASA ISS Glowing Limb Look)
        if (body.hasAtmosphere && settings.showAtmosphereGlow) {
          let atmosphereColor = 0x38bdf8; // Earth cyan/blue
          let atmosphereOpacity = 0.45;
          let atmosphereRadius = scale * 1.055;

          if (body.id === 'venus') {
            atmosphereColor = 0xfbbf24; // Venus sulfuric amber
            atmosphereOpacity = 0.50;
            atmosphereRadius = scale * 1.07;
          } else if (body.id === 'mars') {
            atmosphereColor = 0xc084fc; // Mars thin twilight haze
            atmosphereOpacity = 0.30;
            atmosphereRadius = scale * 1.04;
          } else if (body.id === 'jupiter') {
            atmosphereColor = 0xfbbf24;
            atmosphereOpacity = 0.32;
          } else if (body.id === 'saturn') {
            atmosphereColor = 0xfde047;
            atmosphereOpacity = 0.32;
          } else if (body.id === 'uranus') {
            atmosphereColor = 0x22d3ee;
            atmosphereOpacity = 0.40;
          } else if (body.id === 'neptune') {
            atmosphereColor = 0x38bdf8;
            atmosphereOpacity = 0.45;
          }

          const atmoGeo = new THREE.SphereGeometry(atmosphereRadius, 48, 48);
          const atmoMat = new THREE.MeshBasicMaterial({
            color: atmosphereColor,
            transparent: true,
            opacity: atmosphereOpacity,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
          });
          atmosphereGlowMesh = new THREE.Mesh(atmoGeo, atmoMat);
          group.add(atmosphereGlowMesh);
        }

        // Saturn & Giant Ring Systems with True Shadow Casting & Ring Luminescence
        if (body.hasRings && body.ringDetails) {
          const innerR = scale * body.ringDetails.innerRadius;
          const outerR = scale * body.ringDetails.outerRadius;
          const ringGeo = new THREE.RingGeometry(innerR, outerR, 128);
          ringGeo.rotateX(-Math.PI / 2);

          // Convert planar UVs to radial/cylindrical coordinates for crisp concentric rings without blur
          const posAttr = ringGeo.attributes.position;
          const uvAttr = ringGeo.attributes.uv;
          for (let vi = 0; vi < posAttr.count; vi++) {
            const vx = posAttr.getX(vi);
            const vz = posAttr.getZ(vi);
            const vDist = Math.sqrt(vx * vx + vz * vz);
            const uNorm = (vDist - innerR) / (outerR - innerR);
            uvAttr.setXY(vi, Math.max(0, Math.min(1, uNorm)), 0.5);
          }
          uvAttr.needsUpdate = true;

          let ringMat: THREE.Material;
          if (body.id === 'saturn') {
            const ringTex = generateSaturnRingsTexture();
            ringMat = new THREE.MeshStandardMaterial({
              map: ringTex,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.98,
              roughness: 0.45,
              emissive: new THREE.Color(0xfde047),
              emissiveIntensity: 0.22
            });
          } else {
            ringMat = new THREE.MeshBasicMaterial({
              color: new THREE.Color(body.ringDetails.colors[0] || body.colorHex),
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.60
            });
          }

          ringsMesh = new THREE.Mesh(ringGeo, ringMat);
          ringsMesh.rotation.z = THREE.MathUtils.degToRad(body.ringDetails.tiltDeg);
          ringsMesh.receiveShadow = settings.showShadows;
          ringsMesh.castShadow = settings.showShadows;
          group.add(ringsMesh);
        }
      }

      // High-Fidelity Moons with Orbit Trajectories & Specular Ice & Luminescence
      const moonsGroup = new THREE.Group();
      group.add(moonsGroup);

      if (body.moonsList.length > 0) {
        body.moonsList.forEach((moon, mIdx) => {
          const moonDist = scale + 1.9 + mIdx * 1.5;
          const moonSize = Math.max(0.22, (moon.radiusKm / 3000) * 0.52);
          const moonGeo = new THREE.SphereGeometry(moonSize, 28, 28);
          
          // Check if moon is icy (Europa, Enceladus, Triton, etc.) for high specular reflection
          const isIcyMoon = ['Europa', 'Enceladus', 'Triton', 'Mimas', 'Tethys', 'Dione', 'Rhea', 'Ganymede'].some(
            name => moon.name.includes(name)
          );

          const moonMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(moon.color),
            roughness: isIcyMoon ? 0.22 : 0.65,
            metalness: isIcyMoon ? 0.14 : 0.05,
            emissive: new THREE.Color(moon.color),
            emissiveIntensity: 0.25
          });
          const moonMesh = new THREE.Mesh(moonGeo, moonMat);
          moonMesh.position.set(moonDist, 0, 0);
          moonMesh.castShadow = settings.showShadows;
          moonMesh.receiveShadow = settings.showShadows;
          moonMesh.userData = { moonName: moon.name, orbitRadius: moonDist, speed: 1.4 / (mIdx + 1) };
          moonsGroup.add(moonMesh);

          // Subtle glowing orbit path
          const moonOrbitGeo = new THREE.BufferGeometry();
          const moonPoints: THREE.Vector3[] = [];
          for (let a = 0; a <= 64; a++) {
            const th = (a / 64) * Math.PI * 2;
            moonPoints.push(new THREE.Vector3(Math.cos(th) * moonDist, 0, Math.sin(th) * moonDist));
          }
          moonOrbitGeo.setFromPoints(moonPoints);
          const moonOrbitMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.18
          });
          const moonOrbitLine = new THREE.Line(moonOrbitGeo, moonOrbitMat);
          moonsGroup.add(moonOrbitLine);
        });
      }

      // Smooth Keplerian Orbital Ellipse
      const orbitRadius = body.visualOrbitDistance;
      const orbitGeo = new THREE.BufferGeometry();
      const orbitPoints: THREE.Vector3[] = [];
      const segments = 180;
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        const e = body.orbitalEccentricity * 0.4;
        const r = orbitRadius * (1 - e * Math.cos(theta));
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        const y = Math.sin(theta) * (orbitRadius * Math.sin(THREE.MathUtils.degToRad(body.orbitalInclinationDeg * 0.5)));
        orbitPoints.push(new THREE.Vector3(x, y, z));
      }
      orbitGeo.setFromPoints(orbitPoints);

      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(body.colorHex),
        transparent: true,
        opacity: body.id === 'sun' ? 0 : 0.32
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // Nicely distributed initial planetary orbital phases
      const initialAngle = (idx * 0.68) + 0.2;

      planetEntries.set(body.id, {
        body,
        group,
        mesh,
        cloudsMesh,
        atmosphereGlowMesh,
        hazeInnerMesh,
        hazeOuterMesh,
        ringsMesh,
        moonsGroup,
        orbitLine,
        currentAngle: initialAngle
      });
    });

    planetMeshesRef.current = planetEntries;

    // 7. Asteroid Belt (High-Fidelity Instanced Mesh with Procedural Rock Displacements & Normal Relief)
    const asteroidCount = 1800;
    
    // Irregular faceted rock geometry with authentic crater indentations
    const asteroidGeo = new THREE.DodecahedronGeometry(0.24, 2);
    const posAttr = asteroidGeo.attributes.position;
    const vTemp = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      vTemp.fromBufferAttribute(posAttr, i);
      const nx = vTemp.x * 3.2;
      const ny = vTemp.y * 3.2;
      const nz = vTemp.z * 3.2;
      const rockNoise = Math.sin(nx * 2.8) * Math.cos(ny * 2.8) * Math.sin(nz * 2.8) * 0.25
        + Math.sin(nx * 5.5 + ny * 3.2) * 0.10;
      const craterDivot = Math.max(0, Math.sin(nx * 4.0 + nz * 2.5) - 0.5) * 0.30;
      vTemp.multiplyScalar(1.0 + rockNoise - craterDivot);
      posAttr.setXYZ(i, vTemp.x, vTemp.y, vTemp.z);
    }
    asteroidGeo.computeVertexNormals();

    const asteroidTex = generateAsteroidTexture();
    const asteroidBump = generateAsteroidBumpMap();
    const asteroidMat = new THREE.MeshStandardMaterial({
      map: asteroidTex,
      bumpMap: asteroidBump,
      bumpScale: 0.08,
      roughness: 0.88,
      metalness: 0.12
    });

    const asteroidInst = new THREE.InstancedMesh(asteroidGeo, asteroidMat, asteroidCount);
    const dummy = new THREE.Object3D();
    const rockColor = new THREE.Color();

    for (let i = 0; i < asteroidCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 47.5 + Math.random() * 13.5; // Main Asteroid Belt between Mars and Jupiter
      const height = (Math.random() - 0.5) * 4.2;
      
      // Distinct oblong, non-spherical boulder dimensions (Eros, Ryugu, Bennu morphology)
      const baseScale = 0.35 + Math.random() * 1.5;
      const sx = baseScale * (0.75 + Math.random() * 0.55);
      const sy = baseScale * (0.65 + Math.random() * 0.45);
      const sz = baseScale * (0.80 + Math.random() * 0.60);

      dummy.position.set(Math.cos(angle) * dist, height, Math.sin(angle) * dist);
      dummy.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      asteroidInst.setMatrixAt(i, dummy.matrix);

      // Real Astronomical Asteroid Spectral Compositions:
      const randType = Math.random();
      if (randType < 0.72) {
        // 72% Carbonaceous C-Type (dark graphite/charcoal with subtle blue-grey tinge)
        const v = 0.30 + Math.random() * 0.18;
        rockColor.setRGB(v * 0.95, v, v * 1.05);
      } else if (randType < 0.90) {
        // 18% Silicate S-Type (stony reddish-ochre iron-magnesium silicates)
        const v = 0.48 + Math.random() * 0.25;
        rockColor.setRGB(v * 1.15, v * 0.95, v * 0.75);
      } else {
        // 10% Metallic M-Type (nickel-iron silvery sheen)
        const v = 0.65 + Math.random() * 0.30;
        rockColor.setRGB(v * 1.0, v * 1.05, v * 1.15);
      }
      asteroidInst.setColorAt(i, rockColor);
    }
    asteroidInst.instanceMatrix.needsUpdate = true;
    if (asteroidInst.instanceColor) asteroidInst.instanceColor.needsUpdate = true;
    scene.add(asteroidInst);
    asteroidBeltRef.current = asteroidInst;

    // 8. Kuiper Belt (Trans-Neptunian Icy Crystalline Boulders)
    const kuiperCount = 1100;
    const kuiperGeo = new THREE.IcosahedronGeometry(0.30, 2);
    const kPos = kuiperGeo.attributes.position;
    for (let i = 0; i < kPos.count; i++) {
      vTemp.fromBufferAttribute(kPos, i);
      const kNoise = Math.sin(vTemp.x * 4.0) * Math.cos(vTemp.z * 4.0) * 0.22;
      vTemp.multiplyScalar(1.0 + kNoise);
      kPos.setXYZ(i, vTemp.x, vTemp.y, vTemp.z);
    }
    kuiperGeo.computeVertexNormals();

    const kuiperTex = generateKuiperTexture();
    const kuiperMat = new THREE.MeshStandardMaterial({
      map: kuiperTex,
      bumpMap: asteroidBump,
      bumpScale: 0.06,
      roughness: 0.35,
      metalness: 0.25
    });

    const kuiperInst = new THREE.InstancedMesh(kuiperGeo, kuiperMat, kuiperCount);
    for (let i = 0; i < kuiperCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 38;
      const height = (Math.random() - 0.5) * 10;
      const baseScale = 0.40 + Math.random() * 1.7;
      const sx = baseScale * (0.8 + Math.random() * 0.5);
      const sy = baseScale * (0.7 + Math.random() * 0.5);
      const sz = baseScale * (0.8 + Math.random() * 0.6);

      dummy.position.set(Math.cos(angle) * dist, height, Math.sin(angle) * dist);
      dummy.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      kuiperInst.setMatrixAt(i, dummy.matrix);

      // Distant Kuiper methane/nitrogen ice and reddish organic tholins
      if (Math.random() < 0.65) {
        const iceV = 0.75 + Math.random() * 0.25;
        rockColor.setRGB(iceV * 0.85, iceV * 0.95, iceV);
      } else {
        const tholinV = 0.55 + Math.random() * 0.25;
        rockColor.setRGB(tholinV * 1.15, tholinV * 0.65, tholinV * 0.55);
      }
      kuiperInst.setColorAt(i, rockColor);
    }
    kuiperInst.instanceMatrix.needsUpdate = true;
    if (kuiperInst.instanceColor) kuiperInst.instanceColor.needsUpdate = true;
    scene.add(kuiperInst);
    kuiperBeltRef.current = kuiperInst;

    // 9. Ultra-Sharp Interplanetary Stardust / Micro-Particle Field
    const dustCount = 600;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustScales = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 15 + Math.random() * 160;
      const y = (Math.random() - 0.5) * 35;
      dustPositions[i * 3] = Math.cos(theta) * r;
      dustPositions[i * 3 + 1] = y;
      dustPositions[i * 3 + 2] = Math.sin(theta) * r;
      dustScales[i] = Math.random() * 0.8 + 0.4;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('scale', new THREE.BufferAttribute(dustScales, 1));

    const dustTex = generateDustParticleSprite();
    const dustMat = new THREE.PointsMaterial({
      map: dustTex,
      size: 0.65,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x93c5fd
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Dynamic Resize & DPR Synchronization
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioMax));
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
      }
    };
  }, [planets, settings.ultraHD4K, settings.showShadows]);

  // Handle Drag & 3D Orbit Interaction
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      userRotation.current.x = Math.max(-1.4, Math.min(1.4, userRotation.current.x + deltaY * 0.005));
      userRotation.current.y += deltaX * 0.005;

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch support for mobile / iPad
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

      userRotation.current.x = Math.max(-1.4, Math.min(1.4, userRotation.current.x + deltaY * 0.006));
      userRotation.current.y += deltaX * 0.006;

      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Smooth Wheel Zoom seamlessly modulating targetZoomMultiplier
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0018;
      targetZoomMultiplier.current = Math.max(0.28, Math.min(4.5, targetZoomMultiplier.current * (1 + delta)));
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Raycasting click to select planet in 3D scene
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    const meshesToCheck: THREE.Mesh[] = [];
    planetMeshesRef.current.forEach(entry => {
      meshesToCheck.push(entry.mesh);
    });

    const intersects = raycasterRef.current.intersectObjects(meshesToCheck, false);
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const planetId = clickedMesh.userData.planetId as PlanetId;
      if (planetId) {
        onSelectPlanet(planetId);
      }
    }
  }, [onSelectPlanet]);

  // Main Render & Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // 0. Update Real-Time FPS and Frame-time Telemetry
      frameCountRef.current++;
      if (time - lastFpsUpdateRef.current >= 400) {
        const calculatedFps = Math.round((frameCountRef.current * 1000) / (time - lastFpsUpdateRef.current));
        const calculatedFrameTime = (time - lastFpsUpdateRef.current) / frameCountRef.current;
        setFps(Math.min(144, Math.max(1, calculatedFps)));
        setFrameTimeMs(parseFloat(calculatedFrameTime.toFixed(1)));
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = time;
      }

      const speedMult = settings.isPaused ? 0 : settings.orbitSpeedMultiplier;

      // Smoothly interpolate user zoom multiplier with damped spring physics
      userZoomMultiplier.current += (targetZoomMultiplier.current - userZoomMultiplier.current) * Math.min(1, delta * 9.0);

      // 1. Rotate & Orbit Celestial Bodies
      planetMeshesRef.current.forEach(entry => {
        const {
          body,
          group,
          mesh,
          cloudsMesh,
          atmosphereGlowMesh,
          hazeInnerMesh,
          hazeOuterMesh,
          moonsGroup,
          orbitLine
        } = entry;

        orbitLine.visible = settings.showOrbits && body.id !== 'sun';
        moonsGroup.visible = showMoons;

        if (atmosphereGlowMesh) {
          atmosphereGlowMesh.visible = showAtmosphere && settings.showAtmosphereGlow;
        }

        if (body.id === 'sun') {
          // Dynamic Solar Flare Pulses & Convective Spin
          mesh.rotation.y += delta * 0.18;
          if (sunCoronaRef.current) {
            sunCoronaRef.current.rotation.y -= delta * 0.12;
            sunCoronaRef.current.rotation.z += delta * 0.06;
            const pulse = 1.15 + Math.sin(time * 0.002) * 0.03;
            sunCoronaRef.current.scale.set(pulse, pulse, pulse);
          }
          if (sunOuterGlowRef.current) {
            sunOuterGlowRef.current.rotation.y += delta * 0.04;
            const outerPulse = 1.35 + Math.cos(time * 0.0015) * 0.04;
            sunOuterGlowRef.current.scale.set(outerPulse, outerPulse, outerPulse);
          }
          if (sunCoronaSpriteRef.current) {
            const spritePulse = 1.0 + Math.sin(time * 0.0025) * 0.05;
            const baseScale = body.visualScale * 4.2;
            sunCoronaSpriteRef.current.scale.set(baseScale * spritePulse, baseScale * spritePulse, 1);
          }
        } else {
          // Orbital Revolution Around Sun (Keplerian physics)
          if (body.orbitalPeriodDays > 0) {
            const orbitalSpeed = (365.25 / body.orbitalPeriodDays) * 0.15 * speedMult;
            entry.currentAngle += delta * orbitalSpeed;

            const r = body.visualOrbitDistance;
            const inc = THREE.MathUtils.degToRad(body.orbitalInclinationDeg * 0.5);
            const x = Math.cos(entry.currentAngle) * r;
            const z = Math.sin(entry.currentAngle) * r;
            const y = Math.sin(entry.currentAngle) * (r * Math.sin(inc));

            group.position.set(x, y, z);
          }

          // Axial Planetary Rotation
          const spinDirection = body.retrogradeRotation ? -1 : 1;
          const spinSpeed = (24 / Math.abs(body.rotationPeriodHours || 24)) * 0.75;
          mesh.rotation.y += delta * spinSpeed * spinDirection * (settings.isPaused ? 0.2 : 1);

          // Differential Atmospheric Wind Rotation (Clouds spin faster)
          if (cloudsMesh) {
            cloudsMesh.visible = showAtmosphere;
            cloudsMesh.rotation.y += delta * spinSpeed * 1.14;
          }

          // Gas Giant Atmospheric Haze Shells (Differential banding parallax)
          if (hazeInnerMesh) {
            hazeInnerMesh.visible = showAtmosphere;
            hazeInnerMesh.rotation.y += delta * spinSpeed * 1.06;
          }
          if (hazeOuterMesh) {
            hazeOuterMesh.visible = showAtmosphere;
            hazeOuterMesh.rotation.y -= delta * spinSpeed * 0.94;
          }

          // Moons orbital loops
          if (showMoons && moonsGroup.children.length > 0) {
            moonsGroup.children.forEach(child => {
              if (child.userData.orbitRadius) {
                const mAngle = (time * 0.001 * child.userData.speed) % (Math.PI * 2);
                child.position.x = Math.cos(mAngle) * child.userData.orbitRadius;
                child.position.z = Math.sin(mAngle) * child.userData.orbitRadius;
              }
            });
          }
        }
      });

      // Asteroid & Kuiper Belts rotation
      if (asteroidBeltRef.current) {
        asteroidBeltRef.current.visible = settings.showAsteroidBelt;
        asteroidBeltRef.current.rotation.y += delta * 0.04 * speedMult;
      }
      if (kuiperBeltRef.current) {
        kuiperBeltRef.current.visible = settings.showAsteroidBelt;
        kuiperBeltRef.current.rotation.y += delta * 0.015 * speedMult;
      }

      // 2. 4K Cinematic Camera Motion, Tracking & Clamped Zoom
      const activeEntry = planetMeshesRef.current.get(activePlanetId);
      const cam = cameraRef.current;

      if (cam && activeEntry) {
        const targetPlanetPos = activeEntry.group.position.clone();
        const planetScale = activeEntry.body.visualScale;
        const zoom = userZoomMultiplier.current;

        // Subtle slow cinematic auto-orbit drift when enabled and not dragging
        if (settings.cinematicCamera && !isDraggingRef.current) {
          autoOrbitAngle.current += delta * 0.04;
        }

        if (viewMode === 'orrery') {
          // Wide Heliocentric Orrery Overview with Clamped Zoom
          const orreryDist = Math.max(25, Math.min(650, 140 * zoom));
          const camAngleY = userRotation.current.y + autoOrbitAngle.current;
          const targetCamX = Math.sin(camAngleY) * Math.cos(userRotation.current.x) * orreryDist;
          const targetCamY = Math.sin(userRotation.current.x) * orreryDist + 42 * Math.min(1.5, Math.max(0.4, zoom));
          const targetCamZ = Math.cos(camAngleY) * Math.cos(userRotation.current.x) * orreryDist;

          cameraTargetPos.current.set(targetCamX, targetCamY, targetCamZ);
          cameraLookAtTarget.current.set(0, 0, 0);

        } else if (viewMode === 'lab') {
          // Close-up Laboratory Inspection with Clamped Zoom (prevent clipping through planet)
          const baseLabDist = planetScale * 3.6 + 2.2;
          const minLabDist = planetScale * 1.25;
          const maxLabDist = planetScale * 25.0;
          const labDist = Math.max(minLabDist, Math.min(maxLabDist, baseLabDist * zoom));

          const camAngleY = userRotation.current.y + autoOrbitAngle.current;
          const camX = targetPlanetPos.x + Math.sin(camAngleY) * Math.cos(userRotation.current.x) * labDist;
          const camY = targetPlanetPos.y + Math.sin(userRotation.current.x) * labDist;
          const camZ = targetPlanetPos.z + Math.cos(camAngleY) * Math.cos(userRotation.current.x) * labDist;

          cameraTargetPos.current.set(camX, camY, camZ);
          cameraLookAtTarget.current.copy(targetPlanetPos);

        } else {
          // Journey / Exploration Mode: Cinematic Orbital Framing with Clamped Zoom
          const baseJourneyDist = planetScale * 3.2 + 3.8;
          const minJourneyDist = planetScale * 1.30;
          const maxJourneyDist = planetScale * 28.0;
          const journeyDist = Math.max(minJourneyDist, Math.min(maxJourneyDist, baseJourneyDist * zoom));

          const camAngleY = userRotation.current.y + 0.35 + autoOrbitAngle.current;
          const camX = targetPlanetPos.x + Math.sin(camAngleY) * Math.cos(userRotation.current.x) * journeyDist;
          const camY = targetPlanetPos.y + Math.sin(userRotation.current.x) * journeyDist + 1.0 * Math.min(2.0, zoom);
          const camZ = targetPlanetPos.z + Math.cos(camAngleY) * Math.cos(userRotation.current.x) * journeyDist;

          cameraTargetPos.current.set(camX, camY, camZ);
          cameraLookAtTarget.current.copy(targetPlanetPos);
        }

        // Damped Spring Smoothing
        const lerpFactor = Math.min(1, delta * 4.0);
        cam.position.lerp(cameraTargetPos.current, lerpFactor);
        currentLookAt.current.lerp(cameraLookAtTarget.current, lerpFactor);
        cam.lookAt(currentLookAt.current);

        // Dynamically align viewport camera headlight with active celestial target
        if (cameraHeadlightRef.current) {
          cameraHeadlightRef.current.position.copy(cam.position);
          if (activeEntry) {
            cameraHeadlightRef.current.target = activeEntry.group;
          }
        }
      }

      // Render 4K HDR Scene
      if (rendererRef.current && sceneRef.current && cam) {
        rendererRef.current.render(sceneRef.current, cam);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activePlanetId, viewMode, settings, showAtmosphere, showMoons]);

  return (
    <div
      id="solar-system-canvas-container"
      ref={containerRef}
      onClick={handleClick}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* 4K Ultra HD Live Telemetry Status Pill */}
      <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center gap-2 opacity-85 hover:opacity-100 transition-opacity duration-300">
        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[10px] font-mono text-cyan-300 tracking-wider uppercase backdrop-blur-xl bg-[#070B14]/85 px-3 py-1.5 rounded-xl border border-cyan-500/20 flex items-center gap-2">
          <span className="font-bold text-white font-display">
            {settings.graphicsQuality === 'ultra' ? '4K ULTRA HD' : `${settings.graphicsQuality.toUpperCase()} GRAPHICS`}
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-cyan-400">PHYSICS & HDR</span>
        </span>
      </div>

      {/* Bottom Left: Real-time FPS Meter & Simulation Controls Legend */}
      <div className="absolute bottom-3 left-3 pointer-events-none z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        {/* Real-time FPS Meter */}
        <div
          id="solar-fps-meter"
          className="text-[10px] font-mono backdrop-blur-xl bg-[#070B14]/90 px-2.5 py-1.5 rounded-xl border border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex items-center gap-2 text-gray-300"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              fps >= 55 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : fps >= 30 ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
            } animate-pulse`}
          />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white tracking-wider">{fps} <span className="text-cyan-400">FPS</span></span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">{frameTimeMs} ms</span>
          </div>
        </div>

        {/* Interaction Hint */}
        <div className="hidden lg:flex text-[10px] font-mono text-gray-400 backdrop-blur-xl bg-[#070B14]/85 px-3 py-1.5 rounded-xl border border-white/10 items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Drag to orbit • <kbd className="text-cyan-300 font-bold px-1 bg-black/50 rounded border border-gray-800">↑</kbd><kbd className="text-cyan-300 font-bold px-1 bg-black/50 rounded border border-gray-800">↓</kbd> / Scroll to zoom • Click planet to focus</span>
        </div>
      </div>
    </div>
  );
};

