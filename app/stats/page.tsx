'use client';

import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import TopScorers from "@/app/components/TopScorers";
import MostWins from "@/app/components/MostWins";
import MatchesPlayed from "@/app/components/MatchesPlayed";
import WinRatios from "@/app/components/WinRatios";
import RecentFormBadge from "@/app/components/RecentFormBadge";
import { getRecentForm } from "@/app/utils/form-utils";


export default function StatsFull() {
    const { players, matches, loading } = usePlayerMatchData();
    const { goals, wins, appearances} = usePlayerStats(matches);
    const recentForm = getRecentForm(matches, players.map(p => p.id));
    const sortedByMatchCount = players
        .map((player) => ({
            ...player,
            matchCount: recentForm[player.id]?.length || 0,
        }))
        .sort((a, b) => b.matchCount - a.matchCount);

    if (loading) return <div className="text-center">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">🏟️ Player Stats Dashboard - Umelka 2025</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TopScorers
                    goals={goals}
                    players={players}
                    showAll={true}
                />

                <MostWins
                    wins={wins}
                    players={players}
                    showAll={true}
                />

                <MatchesPlayed
                    players={players}
                    appearances={appearances}
                    showAll={true}
                />

                <WinRatios
                    appearances={appearances}
                    players={players}
                    wins={wins}
                />

                <div>
                    <h2 className="text-xl font-semibold mb-2">📈 Recent Form</h2>
                    <ul className="space-y-1">
                        {sortedByMatchCount.map(player => (
                            <li key={player.id} className="flex justify-between border-b py-1">
            <span>
                <div className="font-bold">{player.name}</div>
            </span>
                                <span className="text-sm text-gray-600 dark:text-white">
                                <RecentFormBadge form={recentForm[player.id] || []}/>
                            </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
</div>
);
}
