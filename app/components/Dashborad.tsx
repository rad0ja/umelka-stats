'use client';

import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { getLastMatch } from "@/app/utils/playerHelpers";
import MatchSummary from "@/app/components/MatchSummary";
import TopScorers from "@/app/components/TopScorers";
import Link from "next/link";
import MostWins from "@/app/components/MostWins";
import SeasonPicker from "@/app/components/SeasonPicker";
import { STATS_HIDDEN } from "@/app/utils/statsMask";

export default function Dashboard() {
    const { players, matches, loading } = usePlayerMatchData();
    const { goals, wins } = usePlayerStats(matches);
    const lastMatch = getLastMatch(matches);

    if (loading) return <div className="p-10 text-center text-muted">Loading the league…</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h1 className="font-display text-4xl font-extrabold italic">Matchday</h1>
                <SeasonPicker />
            </div>
            {STATS_HIDDEN && (
                <p className="text-sm text-muted mb-4">🤫 Stats are scrambled until the last match of the season</p>
            )}
            {lastMatch && <MatchSummary match={lastMatch} players={players}/>}

            <div className="panel flex flex-wrap items-center justify-between gap-3 p-4 mb-6">
                <div>
                    <h2 className="font-display text-xl font-bold">Next match</h2>
                    <p className="text-sm text-muted">Balanced line-ups for the next game.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link href="/teams" className="btn btn-bib">⚖️ Suggest teams</Link>
                    <Link href="/add-match" className="btn">+ Add result</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TopScorers goals={goals} players={players} showAll={false} />
                <MostWins wins={wins} players={players} showAll={false} />
            </div>

            <div className="flex flex-wrap gap-2 mt-6 justify-center">
                <Link href="/stats" className="btn btn-ghost">Full tables</Link>
                <Link href="/matches" className="btn btn-ghost">All matches</Link>
                <Link href="/summary" className="btn btn-ghost">🏁 Season summary</Link>
            </div>
        </div>
    );
}
