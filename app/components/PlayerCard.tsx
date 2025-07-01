'use client'

import StatCard from "@/app/components/StatCard";

type Props = {
    name: string;
    goals: number;
    wins: number;
    matchesPlayed: number;
    trophy?: string;
    totalMatches: number
};

export default function PlayerCard({ name, goals, wins, matchesPlayed, totalMatches }: Props) {
    const winRatio = matchesPlayed === 0 ? '0%' : `${((wins / matchesPlayed) * 100).toFixed(1)}%`;

    return (
        /*<div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 flex flex-col items-center text-center">
            <div className="text-4xl">{trophy}</div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>⚽ Goals: {goals}</p>
                <p>🏆 Wins: {wins}</p>
                <p>📈 Win Ratio: {winRatio}</p>
                <p>🎯 Matches: {matchesPlayed}</p>
            </div>
        </div>*/

        <div className="px-4 py-8 mx-auto max-w-screen-xl sm:py-16 lg:px-6 xl:px-0">
            <div className="mx-auto mb-8 max-w-screen-md text-center md:mb-16">
                <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 md:text-4xl dark:text-white">
                        {name}
                </h2>
            </div>
            <div className="mb-4 space-y-4 md:grid md:grid-cols-2 md:gap-4 xl:gap-16 md:space-y-0 md:mb-8">
                <StatCard
                        value={matchesPlayed}
                        maxValue={totalMatches}
                        title="Matches played"
                        subtitle="Ujde to"
                        emoji="📅"
                />

                <StatCard
                    value={goals}
                    title="Goals scored"
                    subtitle="Ujde to"
                    emoji="🥅"
                />

                <StatCard
                    value={wins}
                    title="Games won"
                    subtitle="Ujde to"
                    emoji="🏆"
                />

                <StatCard
                    value={totalMatches - wins}
                    title="Games lost"
                    subtitle="Ujde to"
                    emoji="💩"
                />

                <StatCard
                        value={winRatio}
                        title="Win ratio"
                        subtitle="Ujde to"
                        emoji="📈"
                />

                <StatCard
                    value="Mamba"
                    title="MVP Score"
                    subtitle="Ujde to"
                    emoji="🎖️"
                />

            </div>
        </div>
    );
}