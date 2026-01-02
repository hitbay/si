
class AudioService {
  private ctx: AudioContext | null = null;
  private enabled = true;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  toggle(state: boolean) {
    this.enabled = state;
  }

  private playSquish(freqStart: number, freqEnd: number, duration: number, volume: number, type: OscillatorType = 'sine') {
    if (!this.ctx || !this.enabled) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playShoot() {
    // Szybki "whiplash" dźwięk
    this.playSquish(800, 200, 0.15, 0.1, 'sine');
  }

  playExplosion() {
    // Miękki, mokry wybuch
    this.playSquish(200, 40, 0.4, 0.2, 'triangle');
  }

  playDamage() {
    // Rezonujący, niski dźwięk uderzenia w tkankę
    this.playSquish(150, 10, 0.5, 0.25, 'sine');
  }

  playNextLevel() {
    if (!this.ctx || !this.enabled) return;
    // Biologiczny "puls" zwycięstwa
    [523, 659, 783, 1046].forEach((f, i) => {
      setTimeout(() => this.playSquish(f, f/2, 0.3, 0.1, 'sine'), i * 120);
    });
  }
}

export const audioService = new AudioService();
