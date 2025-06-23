'use client'

type Props = {
    name: string;
    goals?: number;
    wins: number;
    matchesPlayed: number;
    trophy?: string;
};

export default function PlayerCard({ name, goals, wins, matchesPlayed, trophy }: Props) {
    const winRatio = matchesPlayed === 0 ? '0%' : `${((wins / matchesPlayed) * 100).toFixed(1)}%`;

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 flex flex-col items-center text-center">
            <div className="text-4xl">{trophy}</div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>⚽ Goals: {goals}</p>
                <p>🏆 Wins: {wins}</p>
                <p>📊 Win Ratio: {winRatio}</p>
                <p>🎯 Matches: {matchesPlayed}</p>
            </div>
        </div>
    );
}