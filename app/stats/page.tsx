'use client';

import { getTrophy, getPlayerName } from "@/app/utils/playerHelpers";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import TopScorers from "@/app/components/TopScorers";
import MostWins from "@/app/components/MostWins";


export default function Dashboard() {
    const { players, matches, loading } = usePlayerMatchData();
    const { goals, wins, appearances, getWinRatio } = usePlayerStats(matches);

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

                <div>
                    <h2 className="text-xl font-semibold mb-2">📅 Matches Played</h2>
                    <ul className="space-y-1">
                        {Object.entries(appearances)
                            .map(([id, matches], index) => (
                                <li key={id} className="flex justify-between border-b py-1">
                                    <span><span className="text-xl">{getTrophy(index)}</span> {getPlayerName(players, id)}</span>
                                    <span className="text-sm text-gray-600">{matches} matches</span>
                                </li>
                            ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">📈 Win Ratios</h2>
                    <ul className="space-y-1">
                        {Object.keys(appearances)
                            .sort((a, b) => {
                                const ratioA = (wins[a] || 0) / appearances[a];
                                const ratioB = (wins[b] || 0) / appearances[b];
                                return ratioB - ratioA;
                            })
                            .map((id, index) => (
                                <li key={id} className="flex justify-between border-b py-1">
                                    <span><span className="text-xl">{getTrophy(index)}</span> {getPlayerName(players, id)}</span>
                                    <span className="text-sm text-gray-600">{getWinRatio(id)}</span>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
