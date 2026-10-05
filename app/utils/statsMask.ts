// Temporary "hidden stats" mode for the last match of the season.
// Every displayed player name becomes the same fake name and every number is
// scaled by a per-player random factor, so the real standings can't be read.
// Set STATS_HIDDEN to false to show real stats again.

export const STATS_HIDDEN = false;
export const HIDDEN_PLAYER_NAME = "Tom Mol";

// Fixed seed so the fake numbers are the same on every reload and for every viewer
// (random-per-reload values could be averaged back to the real ones).
const MASK_SEED = "umelka-finale";

// FNV-1a hash of the key (+ murmur3 finalizer so similar keys spread out), mapped to a factor between 0.6 and 1.4
export function maskFactor(key: string): number {
    let hash = 0x811c9dc5;
    const input = `${MASK_SEED}:${key}`;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 0x85ebca6b);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 0xc2b2ae35);
    hash ^= hash >>> 16;
    return 0.6 + ((hash >>> 0) / 0xffffffff) * 0.8;
}

export const maskName = (name: string) => STATS_HIDDEN ? HIDDEN_PLAYER_NAME : name;

export const maskCount = (value: number, key: string) =>
    STATS_HIDDEN ? Math.round(value * maskFactor(key)) : value;

export const maskScore = (value: number, key: string) =>
    STATS_HIDDEN ? value * maskFactor(key) : value;

// Per-match counts are small (mostly 0-2), so a multiplier would barely change them; hide them fully instead
export const maskMatchCount = (value: number) => STATS_HIDDEN ? '?' : value;

export function maskRecord(record: Record<string, number>, stat: string): Record<string, number> {
    if (!STATS_HIDDEN) return record;
    return Object.fromEntries(
        Object.entries(record).map(([playerId, value]) => [playerId, maskCount(value, `${stat}:${playerId}`)])
    );
}
