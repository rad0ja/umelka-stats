'use client';

import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { getLastMatch } from "@/app/utils/playerHelpers";
import MatchSummary from "@/app/components/MatchSummary";
import TopScorers from "@/app/components/TopScorers";
import Link from "next/link";
import MostWins from "@/app/components/MostWins";


export default function Dashboard() {
    const { players, matches, loading } = usePlayerMatchData();;
    const { goals, wins, appearances } = usePlayerStats(matches);
    const lastMatch = getLastMatch(matches);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">🏟️ Player Stats Dashboard - Umelka 2025</h1>
            {lastMatch && <MatchSummary match={lastMatch} players={players} />}

            <div className="text-center mb-6">
                <Link href="/matches"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    📋 View All Matches
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TopScorers
                    goals={goals}
                    players={players}
                    showAll={false}
                />

                <MostWins
                    wins={wins}
                    players={players}
                    showAll={false}
                />
            </div>

            <div className="text-center mb-6 mt-6">
                <Link href="/stats"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    📋 View All Stats
                </Link>
            </div>

        </div>
    );
}
