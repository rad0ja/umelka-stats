import { Player, Match, PlayerStat } from "@/app/types";

export function getPlayerName(players: Player[], id: string): string {
    return players.find((p) => p.id === id)?.name || 'Unknown';
}

export function getTrophy(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
}

export const getLastMatch = (matches: Match[]): Match | null => {
    if (!matches.length) return null;
    return [...matches].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
}

// Per-game / ratio stats only include players with more than this many matches,
// so e.g. a single won match doesn't put someone on top with a 100% win ratio.
export const MIN_MATCHES_FOR_RATIOS = 5;

export const getQualifiedPlayerIds = (appearances: Record<string, number>) => Object.keys(appearances)
    .filter((id) => appearances[id] > MIN_MATCHES_FOR_RATIOS);

export const getSortedStats =(stats: Record<string, number>) => Object.entries(stats)
    .sort((a, b) => b[1] - a[1]);

export function getStatRankSubtitle(
    players: PlayerStat[],
    targetPlayer: PlayerStat,
    stat: 'goals' | 'wins' | 'matchesPlayed',
): string {
    const sorted = [...players].sort((a, b) => b[stat] - a[stat]);
    const rank = sorted.findIndex(p => p.name === targetPlayer.name) + 1;

    if (rank === 1) return 'GOAT';
    if (rank > 1 && rank <= 5) return 'GOOD';
    return 'ZABER';
}