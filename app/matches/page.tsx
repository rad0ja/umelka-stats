// app/matches/page.tsx
'use client';

import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { getPlayerName } from "@/app/utils/playerHelpers";
import Link from "next/link";
import { maskMatchCount } from "@/app/utils/statsMask";
import BoardPhoto from "@/app/components/BoardPhoto";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

export default function MatchesPage() {
    const { players, matches, loading } = usePlayerMatchData();
    const user = useCurrentUser();

    if (loading) return <div className="p-10 text-center text-muted">Loading matches…</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="font-display text-4xl font-extrabold italic mb-4">All matches</h1>
            {matches
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((match) => (
                    <div key={match.id} className="panel p-4 mb-4">
                        <div className="text-center mb-3 flex items-center justify-center gap-4">
                            <span className="font-display text-lg font-semibold flex-1 text-right">Team A</span>
                            <span className="num italic text-5xl leading-none">{match.score_a}<span className="text-pitch px-1">:</span>{match.score_b}</span>
                            <span className="font-display text-lg font-semibold flex-1 text-left">Team B</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[match.team_a, match.team_b].map((team, i) => (
                                <div key={i}>
                                    <h3 className="font-semibold mb-2">{i === 0 ? 'Team A' : 'Team B'}</h3>
                                    <ul className="text-sm space-y-1">
                                        {team.map((id: string) => (
                                            <li key={id} className="flex justify-between border-b py-1">
                                                <Link
                                                    href={`players/${id}`}
                                                    className="hover:underline text-blue-800 dark:text-blue-400">

                                                    <span>{getPlayerName(players, id)}</span>
                                                </Link>
                                                <span>{maskMatchCount(match.goals[id] || 0)} goals</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="text-xs text-gray-500 text-center mt-2">
                            {new Date(match.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            Comments: {match.comments || "No comments"}
                        </div>
                        <BoardPhoto match={match} canManage={!!user} />
                    </div>
                ))}
        </div>
    );
}
