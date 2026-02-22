/**
 * Client-side audio notification utility for call controls.
 *
 * Generates notification tones using the Web Audio API — no audio files needed.
 * Agent hears instant feedback when toggling recording or hold.
 *
 * Usage:
 *   import { playRecordingPaused, playRecordingResumed, playHoldOn, playHoldOff } from '@/lib/callSounds';
 *   playRecordingPaused();  // double-beep
 *   playRecordingResumed(); // ascending chime
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    // Resume if suspended (browsers require user gesture)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/**
 * Play a tone at a given frequency for a given duration.
 */
function playTone(
    frequency: number,
    durationMs: number,
    startOffsetMs: number = 0,
    volume: number = 0.15,
    type: OscillatorType = 'sine'
): void {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;

    // Fade in/out to avoid clicks
    const startTime = ctx.currentTime + startOffsetMs / 1000;
    const endTime = startTime + durationMs / 1000;
    const fadeTime = 0.01;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + fadeTime);
    gain.gain.setValueAtTime(volume, endTime - fadeTime);
    gain.gain.linearRampToValueAtTime(0, endTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(endTime);
}

// ─── Recording Notifications ────────────────────────────────────────────────

/**
 * Recording PAUSED — double descending beep (⏸ feel)
 */
export function playRecordingPaused(): void {
    playTone(880, 120, 0, 0.12);    // A5
    playTone(660, 150, 180, 0.12);  // E5 (descending)
}

/**
 * Recording RESUMED — ascending chime (▶ feel)
 */
export function playRecordingResumed(): void {
    playTone(660, 120, 0, 0.12);    // E5
    playTone(880, 150, 180, 0.12);  // A5 (ascending)
}

// ─── Hold Notifications ─────────────────────────────────────────────────────

/**
 * Call ON HOLD — single low tone
 */
export function playHoldOn(): void {
    playTone(440, 200, 0, 0.10);  // A4
}

/**
 * Call OFF HOLD — quick ascending double-beep
 */
export function playHoldOff(): void {
    playTone(440, 100, 0, 0.10);   // A4
    playTone(660, 120, 150, 0.10); // E5
}
