import { Player, Match } from "@/app/types";

export function getPlayerName(players: Player[], id: string): string {
    return players.find((p) => p.id === id)?.name || 'Unknown';
}

export function getTrophy(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
}

export const getSortedGoals = (goals: Record<string,number>) => Object.entries(goals)
    .sort((a, b) => b[1] - a[1]);

export const getSortedWins = (wins: Record<string, number>) => Object.entries(wins)
    .sort((a, b) => b[1] - a[1]);

export const getLastMatch = (matches: Match[]): Match | null => {
    if (!matches.length) return null;
    return [...matches].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
}