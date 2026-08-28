// Web Audio API Synthesizer for beatmaps and interactive feedback

let audioCtx: AudioContext | null = null;
let currentOscillators: { stop: () => void }[] = [];
let previewTimer: number | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: 'select' | 'vote' | 'favorite' | 'hit300' | 'hit100' | 'miss' | 'card_slide') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);

    if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'vote') {
      // Dual-tone celebratory coin chime (+50 pts)
      const frequencies = [587.33, 880, 1174.66]; // D5, A5, D6
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.26);
      });
    } else if (type === 'favorite') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'card_slide') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.07);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'hit300') {
      // High crisp rhythm hit clap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.exponentialRampToValueAtTime(493.88, now + 0.07);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'hit100') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'miss') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (err) {
    console.warn('Audio playback not permitted or unavailable:', err);
  }
}

// Interactive rhythmic preview player
export function stopMusicPreview() {
  if (previewTimer) {
    window.clearInterval(previewTimer);
    previewTimer = null;
  }
  currentOscillators.forEach(item => {
    try {
      item.stop();
    } catch {
      // Already stopped
    }
  });
  currentOscillators = [];
}

export function playBeatmapPreview(
  bpm: number = 180,
  genre: string = 'Electronic',
  onTick?: (elapsedSeconds: number) => void,
  onFinish?: () => void
) {
  stopMusicPreview();
  const ctx = getAudioContext();
  if (!ctx) return;

  const beatInterval = 60 / bpm; // Seconds per beat
  let step = 0;
  let elapsed = 0;

  // Electronic arpeggio sequence notes (MIDI note converted to frequency)
  const scaleElectronic = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
  const scaleRock = [196.00, 220.00, 261.63, 293.66, 329.63, 392.00];
  const scale = genre.toLowerCase().includes('rock') ? scaleRock : scaleElectronic;

  const intervalMs = Math.max(100, (beatInterval / 2) * 1000); // 8th notes

  previewTimer = window.setInterval(() => {
    elapsed += intervalMs / 1000;
    if (elapsed >= 30) { // 30 sec preview limit
      stopMusicPreview();
      if (onFinish) onFinish();
      return;
    }

    if (onTick) onTick(elapsed);

    if (!ctx || ctx.state === 'suspended') return;
    const now = ctx.currentTime;

    // Kick drum on quarters
    if (step % 2 === 0) {
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(150, now);
      kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08);
      kickGain.gain.setValueAtTime(0.2, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      kickOsc.connect(kickGain);
      kickGain.connect(ctx.destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.1);
    }

    // Hi-hat / Snare
    if (step % 2 === 1) {
      const hatOsc = ctx.createOscillator();
      const hatGain = ctx.createGain();
      hatOsc.type = 'triangle';
      hatOsc.frequency.setValueAtTime(1800, now);
      hatGain.gain.setValueAtTime(0.06, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      hatOsc.connect(hatGain);
      hatGain.connect(ctx.destination);
      hatOsc.start(now);
      hatOsc.stop(now + 0.05);
    }

    // Synth melody note
    const noteFreq = scale[(step * 2) % scale.length];
    const synthOsc = ctx.createOscillator();
    const synthGain = ctx.createGain();
    synthOsc.type = genre.toLowerCase().includes('rock') ? 'sawtooth' : 'sine';
    synthOsc.frequency.setValueAtTime(noteFreq, now);
    synthGain.gain.setValueAtTime(0.08, now);
    synthGain.gain.exponentialRampToValueAtTime(0.001, now + (beatInterval * 0.4));
    synthOsc.connect(synthGain);
    synthGain.connect(ctx.destination);
    synthOsc.start(now);
    synthOsc.stop(now + (beatInterval * 0.45));

    step++;
  }, intervalMs);
}
