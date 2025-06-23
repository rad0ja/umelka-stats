'use client';

import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import TopScorers from "@/app/components/TopScorers";
import MostWins from "@/app/components/MostWins";
import MatchesPlayed from "@/app/components/MatchesPlayed";
import WinRatios from "@/app/components/WinRatios";
import RecentForm from "@/app/components/RecentForm";
import GoalsPerGame from "@/app/components/GoalsPerGame";
import PlayerCard from "@/app/components/PlayerCard";
import {getSortedStats} from "@/app/utils/playerHelpers";
import { getPlayerName, getTrophy } from "@/app/utils/playerHelpers";
import Link from 'next/link';


export default function StatsFull() {
    const { players, matches, loading } = usePlayerMatchData();
    const { goals, wins, appearances} = usePlayerStats(matches);
    const sortedGoals = getSortedStats(goals)
    const sortedAppearances = getSortedStats(appearances);
    const sortedWins = getSortedStats(wins);

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

                <RecentForm/>

                <GoalsPerGame
                    appearances={appearances}
                    players={players}
                    goals={goals}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {sortedGoals.map(([id, goals], index) => (
                        <PlayerCard
                            key={id}
                            name={getPlayerName(players, id)}
                            goals={goals}
                            wins={wins[id] || 0}
                            matchesPlayed={appearances[id] || 0}
                            trophy={getTrophy(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
