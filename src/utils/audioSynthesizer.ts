import { PlanetId } from '../types/solar';
import { CELESTIAL_BODIES } from '../data/planetsData';

class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  
  // Ambient drone nodes
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientGain: GainNode | null = null;

  // Planet specific tone nodes
  private planetOsc: OscillatorNode | null = null;
  private planetLfo: OscillatorNode | null = null;
  private planetLfoGain: GainNode | null = null;
  private planetFilter: BiquadFilterNode | null = null;
  private planetGain: GainNode | null = null;

  private activePlanetId: PlanetId | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupAmbientDrone();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private setupAmbientDrone() {
    if (!this.ctx || !this.masterGain) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    this.ambientFilter = this.ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

    this.ambientOsc1 = this.ctx.createOscillator();
    this.ambientOsc1.type = 'sine';
    this.ambientOsc1.frequency.setValueAtTime(43.65, this.ctx.currentTime); // F1 cosmic drone

    this.ambientOsc2 = this.ctx.createOscillator();
    this.ambientOsc2.type = 'triangle';
    this.ambientOsc2.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2

    this.ambientOsc1.connect(this.ambientFilter);
    this.ambientOsc2.connect(this.ambientFilter);
    this.ambientFilter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    this.ambientOsc1.start();
    this.ambientOsc2.start();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.initContext();

    if (this.ctx && this.masterGain) {
      const targetGain = muted ? 0.0001 : 0.35;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(targetGain, this.ctx.currentTime + 0.3);
    }
  }

  public playPlanetSonification(planetId: PlanetId) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const planet = CELESTIAL_BODIES.find(p => p.id === planetId);
    if (!planet) return;

    this.activePlanetId = planetId;
    const { baseFreq, modFreq, timbre, filterFreq } = planet.sonification;

    // Clean up previous planet oscillator if any
    if (this.planetGain) {
      this.planetGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.planetGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
    }

    setTimeout(() => {
      if (!this.ctx || !this.masterGain || this.activePlanetId !== planetId) return;

      try {
        if (this.planetOsc) {
          this.planetOsc.stop();
          this.planetOsc.disconnect();
        }
        if (this.planetLfo) {
          this.planetLfo.stop();
          this.planetLfo.disconnect();
        }
      } catch {
        // ignore already stopped
      }

      this.planetGain = this.ctx.createGain();
      this.planetGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.planetGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 0.4);

      this.planetFilter = this.ctx.createBiquadFilter();
      this.planetFilter.type = 'lowpass';
      this.planetFilter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);

      this.planetOsc = this.ctx.createOscillator();
      this.planetOsc.type = timbre;
      this.planetOsc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

      // LFO for planetary wave modulation
      this.planetLfo = this.ctx.createOscillator();
      this.planetLfo.type = 'sine';
      this.planetLfo.frequency.setValueAtTime(modFreq, this.ctx.currentTime);

      this.planetLfoGain = this.ctx.createGain();
      this.planetLfoGain.gain.setValueAtTime(baseFreq * 0.08, this.ctx.currentTime);

      this.planetLfo.connect(this.planetLfoGain);
      this.planetLfoGain.connect(this.planetOsc.frequency);

      this.planetOsc.connect(this.planetFilter);
      this.planetFilter.connect(this.planetGain);
      this.planetGain.connect(this.masterGain);

      this.planetOsc.start();
      this.planetLfo.start();
    }, 220);
  }

  public playTransitionChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  // Laser Spectroscopy firing chime for Rover LIBS/ChemCam
  public playLaserShot() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }
}

export const cosmicAudio = new CosmicAudioEngine();

