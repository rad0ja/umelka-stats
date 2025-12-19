'use client';

import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { getLastMatches } from "@/app/utils/playerHelpers";
import TopScorers from "@/app/components/TopScorers";
import Link from "next/link";
import MostWins from "@/app/components/MostWins";
import MatchResults from "@/app/components/MatchResult";
import {playerVsPlayerStats} from "@/app/utils/playerVsPlayerStats";

export default function Dashboard() {
    const { players, matches, loading } = usePlayerMatchData();
    const { goals, wins } = usePlayerStats(matches);
    const recentMatches = getLastMatches(matches, 3)
    console.log(goals, wins, recentMatches)

    const result = playerVsPlayerStats(matches, "56d7386b-39d2-4a14-ade4-83138a7b5c3b");
    console.log(`Most wins with: ${result.mostWinsWith} (${result.winsCount} wins)`);
    console.log(`Most losses with: ${result.mostLossesWith} (${result.lossesCount} losses)`);
    console.log(`Most draws with: ${result.mostDrawsWith} (${result.drawsCount} draws)`);

    if (loading) return <div className="text-center">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto p-6">
            <MatchResults match={recentMatches} players={players}/>
            {/*{lastMatch && <MatchSummary match={lastMatch} players={players}/>}*/}

            <div className="text-center mb-6">
                <Link href={"/matches"}
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
            {/*<FeedbackForm />*/}
        </div>
    );
}
