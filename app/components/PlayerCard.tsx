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
            <div className="mowed text-white rounded-2xl px-5 py-6 flex items-center gap-5 mb-4">
                <div className="num grid place-items-center w-20 h-20 shrink-0 rounded-full bg-bib text-ink text-4xl italic">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="font-display text-4xl font-extrabold italic leading-tight truncate">{name}</h1>
                    <p className="text-white/75 text-sm">{matchesPlayed} of {totalMatches} matches played</p>
                </div>
                <div className="text-right">
                    <p className="num text-6xl leading-none text-bib">{score}</p>
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
