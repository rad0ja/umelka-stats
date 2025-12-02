import { Player, Match, PlayerStat } from "@/app/types";
import {matches} from "es-toolkit/compat";

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

export const getLastMatches = (matches: Match[], n: number = 1): Match[] => {
    if (!matches.length || n <= 0) return [];

    return [...matches].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, n);
}

export const getSortedStats = (stats: Record<string, number>) => Object.entries(stats)
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