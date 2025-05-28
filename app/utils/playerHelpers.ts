export type Player = {
    id: string;
    name: string;
};

export function getPlayerName(players: Player[], id: string): string {
    return players.find((p) => p.id === id)?.name || 'Unknown';
}

export function getTrophy(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
}