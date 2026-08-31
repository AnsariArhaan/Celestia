import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { SURFACE_LANDING_SITES, SurfaceLandingSite, SampleTarget } from '../../data/surfaceSitesData';
import { PlanetId } from '../../types/solar';
import { cosmicAudio } from '../../utils/audioSynthesizer';
import { setGlobalMaxAnisotropy } from '../../utils/textureGenerator';
import {
  Compass,
  Maximize2,
  Minimize2,
  Camera,
  Eye,
  Crosshair,
  Flame,
  Moon,
  Sun,
  Wind,
  Thermometer,
  Gauge,
  Radiation,
  Zap,
  Activity,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Target,
  Layers,
  Radio
} from 'lucide-react';

interface SurfaceExplorer3DProps {
  initialPlanetId?: PlanetId;
  onClose: () => void;
  onSelectSitePlanet?: (planetId: PlanetId) => void;
}

type VisionMode = 'normal' | 'thermal' | 'nightvision' | 'spectroscopy';

export const SurfaceExplorer3D: React.FC<SurfaceExplorer3DProps> = ({
  initialPlanetId,
  onClose,
  onSelectSitePlanet
}) => {
  // Find initial site matching the planet or fallback to Mars Jezero
  const defaultSiteIndex = Math.max(
    0,
    SURFACE_LANDING_SITES.findIndex(s => s.planetId === initialPlanetId)
  );

  const [currentSiteIndex, setCurrentSiteIndex] = useState<number>(
    defaultSiteIndex !== -1 ? defaultSiteIndex : 0
  );
  const site = SURFACE_LANDING_SITES[currentSiteIndex];

  // Visual Controls
  const [visionMode, setVisionMode] = useState<VisionMode>('normal');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 1x to 8x
  const [timeOfDayHours, setTimeOfDayHours] = useState<number>(12.0); // 0 to 24 hours
  const [selectedTarget, setSelectedTarget] = useState<SampleTarget | null>(null);
  const [isLaserFiring, setIsLaserFiring] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isInfoExpanded, setIsInfoExpanded] = useState<boolean>(true);

  // 3D Canvas Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const skyMeshRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const skyBodyMeshRef = useRef<THREE.Mesh | null>(null);
  const laserBeamRef = useRef<THREE.Line | null>(null);

  // Mouse camera rotation controls (First person panoramic look)
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const cameraAnglesRef = useRef({ yaw: 0, pitch: 0.05 });
  const targetAnglesRef = useRef({ yaw: 0, pitch: 0.05 });

  // Handle site selection
  const handleSelectSite = useCallback((index: number) => {
    setCurrentSiteIndex(index);
    setSelectedTarget(null);
    setIsLaserFiring(false);
    cosmicAudio.playTransitionChime();
    if (onSelectSitePlanet) {
      onSelectSitePlanet(SURFACE_LANDING_SITES[index].planetId);
    }
  }, [onSelectSitePlanet]);

  // Target Laser Spectroscopy trigger
  const handleAnalyzeTarget = useCallback((target: SampleTarget) => {
    setSelectedTarget(target);
    setIsLaserFiring(true);
    cosmicAudio.playLaserShot();

    // Aim camera smoothly towards target
    const [tx, ty, tz] = target.position;
    const yaw = Math.atan2(-tx, -tz);
    const distXZ = Math.sqrt(tx * tx + tz * tz);
    const pitch = Math.atan2(ty - 1.6, distXZ);
    targetAnglesRef.current = { yaw, pitch };

    setTimeout(() => {
      setIsLaserFiring(false);
    }, 1200);
  }, []);

  // Initialize and Update 3D Surface Panorama Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Create Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55 / zoomLevel, width / height, 0.1, 2000);
    camera.position.set(0, 1.6, 0); // 1.6m eye level (Rover mast height)
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    setGlobalMaxAnisotropy(renderer.capabilities.getMaxAnisotropy());

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Fog and Atmospheric Horizon
    const fogColor = new THREE.Color(site.fogColorHex);
    scene.fog = new THREE.FogExp2(fogColor, site.fogDensity);

    // 4. Procedural Sky Dome
    const skyGeo = new THREE.SphereGeometry(800, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(site.skyColorHex),
      side: THREE.BackSide
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);
    skyMeshRef.current = skyMesh;

    // Starfield for vacuum/thin-atmosphere bodies
    if (site.pressureAtm < 0.05) {
      const starGeo = new THREE.BufferGeometry();
      const starCount = 3500;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 750;
        starPos[i] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i + 1] = Math.abs(r * Math.cos(phi)) + 10; // keep above horizon
        starPos[i + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2.2,
        transparent: true,
        opacity: site.pressureAtm < 0.001 ? 0.95 : 0.4
      });
      const starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);
    }

    // 5. Sun and Sunlight
    const sunLight = new THREE.DirectionalLight(0xffffff, site.sunIntensity * 2.0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const ambientLight = new THREE.AmbientLight(
      new THREE.Color(site.horizonColorHex),
      site.pressureAtm > 0.1 ? 1.4 : 0.35
    );
    scene.add(ambientLight);

    // Glowing Sun Disc in Sky
    const sunDiscGeo = new THREE.SphereGeometry(18 * site.sunSize, 16, 16);
    const sunDiscMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
    const sunDisc = new THREE.Mesh(sunDiscGeo, sunDiscMat);
    scene.add(sunDisc);

    // 6. Sky Celestial Body (e.g. Earth in Moon sky, Jupiter in Europa sky, Saturn in Titan sky)
    if (site.skyCelestialBody) {
      const { size, altitudeDeg, azimuthDeg, textureType, hasRings } = site.skyCelestialBody;
      const bodyRadius = 500;
      const altRad = (altitudeDeg * Math.PI) / 180;
      const azRad = (azimuthDeg * Math.PI) / 180;

      const bx = bodyRadius * Math.cos(altRad) * Math.sin(azRad);
      const by = bodyRadius * Math.sin(altRad);
      const bz = -bodyRadius * Math.cos(altRad) * Math.cos(azRad);

      const skyBodyGeo = new THREE.SphereGeometry(size, 32, 32);
      
      // Dynamic color & procedural pattern based on body
      let bodyColor = 0x38bdf8; // Earth blue
      if (textureType === 'jupiter') bodyColor = 0xd97706;
      else if (textureType === 'saturn') bodyColor = 0xfde047;
      else if (textureType === 'phobos') bodyColor = 0x78716c;
      else if (textureType === 'charon') bodyColor = 0x94a3b8;

      const skyBodyMat = new THREE.MeshBasicMaterial({
        color: bodyColor,
        wireframe: false
      });
      const skyBodyMesh = new THREE.Mesh(skyBodyGeo, skyBodyMat);
      skyBodyMesh.position.set(bx, by, bz);
      scene.add(skyBodyMesh);
      skyBodyMeshRef.current = skyBodyMesh;

      // Add rings if Saturn
      if (hasRings) {
        const ringGeo = new THREE.RingGeometry(size * 1.3, size * 2.3, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xfef08a,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.6;
        ringMesh.rotation.y = Math.PI / 6;
        skyBodyMesh.add(ringMesh);
      }
    }

    // 7. Procedural Extraterrestrial 3D Terrain
    const terrainSize = 500;
    const segments = 120;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      
      // Distance from center landing zone
      const dist = Math.sqrt(x * x + z * z);
      const smoothCenter = Math.min(1.0, Math.max(0.0, (dist - 15) / 40));

      // Layered noise for ridges, craters, and undulating dunes
      let height = (
        Math.sin(x * 0.04) * Math.cos(z * 0.04) * 3.5 +
        Math.sin(x * 0.12 + 1.2) * Math.cos(z * 0.08) * 1.5 +
        Math.sin(x * 0.015) * Math.cos(z * 0.02) * 8.0
      ) * smoothCenter;

      // Crater depressions
      const craterDist = Math.sqrt((x - 40) * (x - 40) + (z + 60) * (z + 60));
      if (craterDist < 30) {
        height -= Math.cos((craterDist / 30) * Math.PI * 0.5) * 6.0;
      }

      pos.setY(i, height);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(site.groundColorHex),
      roughness: 0.88,
      metalness: site.planetId === 'venus' || site.planetId === 'mercury' ? 0.2 : 0.05,
      flatShading: true
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // 8. Scatter Planetary Boulders & Regolith Rocks
    const rockGeo = new THREE.DodecahedronGeometry(1, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(site.rockColorHex),
      roughness: 0.95,
      flatShading: true
    });

    const rockCount = 120;
    const rockInstanced = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
    rockInstanced.castShadow = true;
    rockInstanced.receiveShadow = true;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < rockCount; i++) {
      const radius = 6 + Math.random() * 80;
      const angle = Math.random() * Math.PI * 2;
      const rx = Math.cos(angle) * radius;
      const rz = Math.sin(angle) * radius;
      const scale = 0.2 + Math.random() * 1.6;

      dummy.position.set(rx, scale * 0.45, rz);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(scale, scale * (0.6 + Math.random() * 0.8), scale);
      dummy.updateMatrix();
      rockInstanced.setMatrixAt(i, dummy.matrix);
    }
    rockInstanced.instanceMatrix.needsUpdate = true;
    scene.add(rockInstanced);

    // 9. Atmospheric Particulate Dynamics (Dust Devils, Cryo-Geyser Steam, Methane Rain)
    if (site.particlesType !== 'none') {
      const particleCount = 1500;
      const particleGeo = new THREE.BufferGeometry();
      const pPositions = new Float32Array(particleCount * 3);
      const pVelocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        pPositions[i] = (Math.random() - 0.5) * 80;
        pPositions[i + 1] = Math.random() * 30;
        pPositions[i + 2] = (Math.random() - 0.5) * 80;

        pVelocities[i] = (Math.random() - 0.5) * 0.1;
        pVelocities[i + 1] = site.particlesType === 'methane-rain' ? -0.3 : (Math.random() - 0.5) * 0.05;
        pVelocities[i + 2] = (Math.random() - 0.5) * 0.1;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      
      let pColor = 0xffffff;
      let pSize = 0.8;
      if (site.particlesType === 'dust') {
        pColor = 0xd97706;
        pSize = 1.2;
      } else if (site.particlesType === 'methane-rain') {
        pColor = 0x38bdf8;
        pSize = 0.9;
      } else if (site.particlesType === 'steam') {
        pColor = 0xe2e8f0;
        pSize = 1.8;
      }

      const particleMat = new THREE.PointsMaterial({
        color: pColor,
        size: pSize,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);
      particleSystemRef.current = particleSystem;
    }

    // 10. Rover Laser Beam Indicator (for ChemCam spectroscopy)
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      linewidth: 3,
      transparent: true,
      opacity: 0.9
    });
    const laserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.4, 0),
      new THREE.Vector3(0, 0, -10)
    ]);
    const laserLine = new THREE.Line(laserGeo, laserMat);
    laserLine.visible = false;
    scene.add(laserLine);
    laserBeamRef.current = laserLine;

    // 11. Render Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      cameraAnglesRef.current.yaw += (targetAnglesRef.current.yaw - cameraAnglesRef.current.yaw) * 0.08;
      cameraAnglesRef.current.pitch += (targetAnglesRef.current.pitch - cameraAnglesRef.current.pitch) * 0.08;

      // Apply Pitch limit (-85 deg to +85 deg)
      cameraAnglesRef.current.pitch = Math.max(-1.48, Math.min(1.48, cameraAnglesRef.current.pitch));

      const yaw = cameraAnglesRef.current.yaw;
      const pitch = cameraAnglesRef.current.pitch;

      const lookTarget = new THREE.Vector3(
        -Math.sin(yaw) * Math.cos(pitch),
        1.6 + Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch)
      );
      camera.lookAt(lookTarget);

      // Dynamic Sun Position based on Time of Day Slider
      const sunAngle = ((timeOfDayHours - 6) / 24) * Math.PI * 2;
      const sunElevation = Math.sin(sunAngle);
      const sunDistance = 400;

      const sx = Math.cos(sunAngle) * sunDistance;
      const sy = Math.max(-50, sunElevation * sunDistance);
      const sz = -Math.sin(sunAngle) * sunDistance;

      sunLight.position.set(sx, sy, sz);
      sunDisc.position.set(sx, sy, sz);
      sunLight.intensity = Math.max(0.1, sunElevation * site.sunIntensity * 2.5);

      // Animate Particles
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += Math.sin(elapsedTime + i) * 0.04;
          positions[i + 1] += site.particlesType === 'methane-rain' ? -0.4 : Math.sin(elapsedTime * 0.5 + i) * 0.03;
          positions[i + 2] += Math.cos(elapsedTime + i) * 0.04;

          if (positions[i + 1] < 0) positions[i + 1] = 25;
          if (positions[i + 1] > 30) positions[i + 1] = 0;
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Laser Line Animation
      if (laserBeamRef.current && isLaserFiring && selectedTarget) {
        laserBeamRef.current.visible = true;
        const [tx, ty, tz] = selectedTarget.position;
        const positions = new Float32Array([0, 1.4, 0, tx, ty, tz]);
        laserBeamRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      } else if (laserBeamRef.current) {
        laserBeamRef.current.visible = false;
      }

      // Rotate Sky Celestial Body slowly
      if (skyBodyMeshRef.current) {
        skyBodyMeshRef.current.rotation.y = elapsedTime * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.fov = 55 / zoomLevel;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
    };
  }, [site, timeOfDayHours, zoomLevel, isLaserFiring, selectedTarget]);

  // Mouse Drag / Touch Look Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.0035 / zoomLevel;
    targetAnglesRef.current.yaw += deltaX * sensitivity;
    targetAnglesRef.current.pitch += deltaY * sensitivity;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      id="surface-explorer-modal"
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none overflow-hidden font-sans"
    >
      {/* 1. 3D WebGL Canvas Layer */}
      <div
        ref={containerRef}
        id="surface-canvas-container"
        className={`absolute inset-0 z-0 cursor-grab active:cursor-grabbing ${
          visionMode === 'thermal'
            ? 'filter hue-rotate-180 contrast-125 saturate-200'
            : visionMode === 'nightvision'
            ? 'filter brightness-125 contrast-150 sepia(100%) hue-rotate(85deg) saturate(300%)'
            : ''
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* 2. Top Rover Telemetry & Mission Header */}
      <div className="relative z-20 pointer-events-none p-3 md:p-4 flex items-start justify-between gap-3">
        {/* Site & Lander Identification Badge */}
        <div className="pointer-events-auto bg-[#070B14]/90 hover:bg-[#070B14]/98 backdrop-blur-2xl border border-white/10 hover:border-cyan-500/40 rounded-2xl p-3 md:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.8)] max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              SURFACE LANDING TELEMETRY // {site.planetName}
            </span>
          </div>

          <h2 className="text-lg md:text-2xl font-extrabold text-white uppercase tracking-tight font-display">
            {site.name}
          </h2>
          <p className="text-xs text-gray-300 font-medium">
            {site.subtitle} • <span className="text-cyan-300 font-mono">{site.coordinates}</span>
          </p>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-[11px] font-mono text-gray-300">
            <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">
              {site.roverOrLander}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">{site.missionAgency} ({site.landingYear})</span>
          </div>
        </div>

        {/* Vision Mode & Camera Filter Switchers */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#070B14]/90 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
          <button
            id="vision-mode-normal"
            onClick={() => setVisionMode('normal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              visionMode === 'normal'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Natural True Color Optical Panorama"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Optical</span>
          </button>

          <button
            id="vision-mode-thermal"
            onClick={() => setVisionMode('thermal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              visionMode === 'thermal'
                ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-gray-400 hover:text-white'
            }`}
            title="FLIR Infrared Thermal Signature Mode"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thermal FLIR</span>
          </button>

          <button
            id="vision-mode-nightvision"
            onClick={() => setVisionMode('nightvision')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              visionMode === 'nightvision'
                ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Phosphor Night Vision"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Night Vision</span>
          </button>

          {/* Sound Synthesizer toggle */}
          <button
            id="surface-sound-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            title="Toggle Extraterrestrial Soundscape"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Exit Surface View Modal */}
          <button
            id="close-surface-explorer-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 transition-all cursor-pointer ml-1"
            title="Return to Solar System Orbit (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Reticle Crosshair in Center for Mastcam */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative w-24 h-24 border border-cyan-400/20 rounded-full flex items-center justify-center">
          <div className="absolute w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-cyan-400/40" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-cyan-400/40" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-3 bg-cyan-400/40" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-3 bg-cyan-400/40" />
        </div>
      </div>

      {/* 4. Left Instrument Telemetry Overlay */}
      <div className="relative z-20 pointer-events-none p-3 md:p-4 flex flex-col justify-end gap-3 max-w-sm">
        {/* Physical Gauges Matrix */}
        <div className="pointer-events-auto bg-[#070B14]/90 backdrop-blur-2xl border border-white/10 p-3.5 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] space-y-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Surface Environment Telemetry
            </span>
            <span className="text-[9px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/30">
              NOMINAL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {/* Temperature */}
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-gray-400 uppercase flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-rose-400" />
                <span>Surface Temp</span>
              </div>
              <div className="text-white font-bold text-sm mt-0.5">
                {site.surfaceTempC}°C <span className="text-[10px] text-gray-400 font-normal">({site.surfaceTempF}°F)</span>
              </div>
            </div>

            {/* Pressure */}
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-gray-400 uppercase flex items-center gap-1">
                <Gauge className="w-3 h-3 text-cyan-400" />
                <span>Pressure</span>
              </div>
              <div className="text-white font-bold text-xs mt-0.5 truncate" title={site.pressureDisplay}>
                {site.pressureAtm >= 1 ? `${site.pressureAtm} atm` : `${site.pressureDisplay}`}
              </div>
            </div>

            {/* Gravity */}
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-gray-400 uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Gravity</span>
              </div>
              <div className="text-white font-bold text-sm mt-0.5">
                {site.gravityMs2} m/s² <span className="text-[10px] text-gray-400 font-normal">({site.gravityG}g)</span>
              </div>
            </div>

            {/* Radiation */}
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-gray-400 uppercase flex items-center gap-1">
                <Radiation className="w-3 h-3 text-purple-400" />
                <span>Radiation</span>
              </div>
              <div className="text-white font-bold text-xs mt-0.5">
                {site.radiationLevelMsvYear} mSv/yr
              </div>
            </div>
          </div>

          {/* Atmosphere Gas String */}
          <div className="text-[10px] font-mono bg-white/5 p-2 rounded-xl border border-white/5 text-gray-300">
            <span className="text-gray-400 uppercase">Atmosphere: </span>
            <span className="text-cyan-300 font-semibold">{site.atmosphericComposition}</span>
          </div>

          {/* Time of Day Slider */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Sun Position / Diurnal Cycle</span>
              </span>
              <span className="text-cyan-300 font-bold">{timeOfDayHours.toFixed(1)}:00 UTC</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={timeOfDayHours}
              onChange={(e) => setTimeOfDayHours(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Optical Zoom Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3 text-cyan-400" />
                <span>Mastcam Optical Zoom</span>
              </span>
              <span className="text-cyan-300 font-bold">{zoomLevel.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="0.2"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* 5. Right Laser Spectroscopy & Sample Target Analysis Panel */}
      {selectedTarget && (
        <div className="absolute right-3 md:right-4 top-20 z-30 pointer-events-auto max-w-sm bg-[#070B14]/95 backdrop-blur-2xl border border-cyan-500/50 p-4 rounded-2xl shadow-[0_16px_50px_rgba(6,182,212,0.3)] animate-fadeIn">
          <div className="flex items-start justify-between pb-2 border-b border-white/10">
            <div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 font-bold uppercase">
                <Target className="w-3 h-3 animate-spin" />
                <span>LIBS LASER SPECTROSCOPY</span>
              </div>
              <h3 className="text-base font-bold text-white font-display mt-0.5">
                {selectedTarget.name}
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">{selectedTarget.type}</p>
            </div>
            <button
              onClick={() => setSelectedTarget(null)}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 text-xs font-mono">
            <div>
              <span className="text-[9px] text-gray-400 uppercase">Mineral Composition:</span>
              <p className="text-gray-200 mt-0.5 leading-relaxed">{selectedTarget.composition}</p>
            </div>

            <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 space-y-1.5">
              <span className="text-[9px] text-cyan-400 uppercase font-bold tracking-wider">Elemental Abundance:</span>
              
              {selectedTarget.spectroscopy.siliconPercent !== undefined && (
                <div>
                  <div className="flex justify-between text-[10px] text-gray-300">
                    <span>Silicon (Si)</span>
                    <span className="font-bold text-cyan-300">{selectedTarget.spectroscopy.siliconPercent}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${selectedTarget.spectroscopy.siliconPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {selectedTarget.spectroscopy.ironPercent !== undefined && (
                <div>
                  <div className="flex justify-between text-[10px] text-gray-300">
                    <span>Iron (Fe)</span>
                    <span className="font-bold text-amber-400">{selectedTarget.spectroscopy.ironPercent}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${selectedTarget.spectroscopy.ironPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {selectedTarget.spectroscopy.carbonPercent !== undefined && (
                <div>
                  <div className="flex justify-between text-[10px] text-gray-300">
                    <span>Carbon / Tholins (C)</span>
                    <span className="font-bold text-emerald-400">{selectedTarget.spectroscopy.carbonPercent}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${selectedTarget.spectroscopy.carbonPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {selectedTarget.spectroscopy.icePercent !== undefined && (
                <div>
                  <div className="flex justify-between text-[10px] text-gray-300">
                    <span>Cryogenic H₂O Ice</span>
                    <span className="font-bold text-blue-400">{selectedTarget.spectroscopy.icePercent}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="bg-blue-400 h-full rounded-full"
                      style={{ width: `${selectedTarget.spectroscopy.icePercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] text-cyan-300/90 leading-relaxed font-sans bg-cyan-950/40 p-2 rounded-xl border border-cyan-500/20">
              💡 {selectedTarget.discoveryNote}
            </p>

            <button
              onClick={() => handleAnalyzeTarget(selectedTarget)}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Fire ChemCam Laser Pulse</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Bottom Extraterrestrial Site Selection Carousel */}
      <div className="relative z-20 pointer-events-none p-3 md:p-4 flex flex-col items-center gap-2">
        {/* Sample Targets Direct Quick Buttons */}
        {site.sampleTargets.length > 0 && (
          <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-black/60 px-2 py-1 rounded-lg border border-white/10 shrink-0">
              Surface Targets:
            </span>
            {site.sampleTargets.map((target) => (
              <button
                key={target.id}
                onClick={() => handleAnalyzeTarget(target)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  selectedTarget?.id === target.id
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                    : 'bg-[#070B14]/85 hover:bg-white/10 border-white/10 text-gray-300'
                }`}
              >
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>{target.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Global Planetary Landing Site Carousel */}
        <div className="pointer-events-auto w-full max-w-5xl bg-[#070B14]/90 hover:bg-[#070B14]/98 backdrop-blur-2xl border border-white/15 p-2 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.85)] flex items-center justify-between gap-2">
          <button
            onClick={() => handleSelectSite((currentSiteIndex - 1 + SURFACE_LANDING_SITES.length) % SURFACE_LANDING_SITES.length)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white cursor-pointer shrink-0 transition-colors"
            title="Previous Landing Site"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-1">
            {SURFACE_LANDING_SITES.map((s, idx) => {
              const isCurrent = idx === currentSiteIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSite(idx)}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-left transition-all duration-200 shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_16px_rgba(6,182,212,0.35)]'
                      : 'bg-white/5 border-white/10 hover:border-cyan-500/30 hover:bg-white/10 opacity-75 hover:opacity-100'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/40 shadow-sm shrink-0"
                    style={{
                      backgroundColor: s.groundColorHex,
                      boxShadow: isCurrent ? '0 0 10px rgba(6,182,212,0.8)' : 'none'
                    }}
                  />
                  <div>
                    <div className={`text-xs font-bold font-display uppercase tracking-wider leading-tight ${isCurrent ? 'text-cyan-300' : 'text-gray-200'}`}>
                      {s.name}
                    </div>
                    <div className="text-[9px] font-mono text-gray-400">
                      {s.planetName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleSelectSite((currentSiteIndex + 1) % SURFACE_LANDING_SITES.length)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white cursor-pointer shrink-0 transition-colors"
            title="Next Landing Site"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
