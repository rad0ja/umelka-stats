'use client'

import StatCard from "@/app/components/StatCard";

type Props = {
    name: string;
    goals: number;
    assists: number;
    wins: number;
    matchesPlayed: number;
    trophy?: string;
    totalMatches: number;
    score: number | string;
    draws: number;
};

export default function PlayerCard({ name, goals, assists, wins, matchesPlayed, totalMatches, score, draws }: Props) {
    const winRatio = matchesPlayed === 0 ? '0%' : `${((wins / matchesPlayed) * 100).toFixed(1)}%`;
    const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);

    return (
        <div className="mb-6">
            <div className="mowed text-white rounded-2xl px-5 py-5 grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 mb-4">
                <div className="num grid place-items-center w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-bib text-ink text-3xl sm:text-4xl italic">
                    {initials}
                </div>
                <div className="min-w-0">
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold italic leading-tight break-words">{name}</h1>
                    <p className="text-white/75 text-sm">{matchesPlayed} of {totalMatches} matches played</p>
                </div>
                <div className="col-span-2 sm:col-span-1 flex flex-row-reverse items-baseline justify-between sm:block sm:text-right border-t border-white/20 pt-3 sm:border-0 sm:pt-0">
                    <p className="num text-5xl sm:text-6xl leading-none text-bib">{score}</p>
                    <p className="text-sm text-white/75">MVP points</p>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard value={goals} title="Goals" emoji="🥅" />
                <StatCard value={assists} title="Assists" emoji="🤝" />
                <StatCard value={winRatio} title="Win ratio" emoji="📈" />
                <StatCard value={wins} title="Won" emoji="🏆" />
                <StatCard value={draws} title="Drawn" emoji="➖" />
                <StatCard value={matchesPlayed - wins - draws} title="Lost" emoji="💩" />
            </div>
        </div>
    );
}
