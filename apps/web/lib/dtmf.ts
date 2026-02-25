/**
 * DTMF utility functions for converting letters to phone keypad digits
 * and sanitizing input for DTMF tone sending.
 */

/** Standard phone keypad letter-to-digit mapping */
const LETTER_TO_DIGIT: Record<string, string> = {
    a: '2', b: '2', c: '2',
    d: '3', e: '3', f: '3',
    g: '4', h: '4', i: '4',
    j: '5', k: '5', l: '5',
    m: '6', n: '6', o: '6',
    p: '7', q: '7', r: '7', s: '7',
    t: '8', u: '8', v: '8',
    w: '9', x: '9', y: '9', z: '9',
};

/** Valid DTMF characters that pass through unchanged */
const VALID_DTMF = new Set('0123456789*#');

/**
 * Convert a single character to its DTMF digit equivalent.
 * - Digits 0-9, *, # pass through unchanged
 * - Letters a-z map to their phone keypad digit (abc→2, def→3, etc.)
 * - Everything else is stripped (returns empty string)
 */
export function charToDTMF(char: string): string {
    if (VALID_DTMF.has(char)) return char;
    const lower = char.toLowerCase();
    return LETTER_TO_DIGIT[lower] ?? '';
}

/**
 * Sanitize an entire input string for DTMF sending.
 * Converts letters to digits and strips invalid characters.
 *
 * Examples:
 *   "123a234"  → "1232234"
 *   "1*2#abc"  → "1*2#222"
 *   "hello"    → "43556"
 */
export function sanitizeDTMFInput(input: string): string {
    return input.split('').map(charToDTMF).join('');
}
