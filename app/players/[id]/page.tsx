// app/players/[id]/page.tsx
'use client';

import PlayerCard from '@/app/components/PlayerCard';
import { getTrophy } from '@/app/utils/playerHelpers';
import { usePlayerCalculatedScore } from "@/app/hooks/usePlayerCalculatedScore";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import PlayerMatchHistory from "@/app/components/PlayerMatchHistory";
import { playerMatchHistory } from "@/app/utils/playerMatchHistory";
import { getAllMVPs } from "@/app/utils/getAllMVPs";
import { useParams } from "next/navigation";
import { computeMostWinsLossesWith } from "@/app/utils/playerVsPlayer";
import { maskCount, maskName, maskScore, STATS_HIDDEN } from "@/app/utils/statsMask";
import { playerStreaks } from "@/app/utils/playerStreaks";

export default function PlayerDetailPage() {
    const { id } = useParams();
    const playerID = id as string
    const { playerCalc, goalsCalc, matchesPlayedCalc, winsCalc, drawsCalc, assistsCalc } = usePlayerCalculatedScore();
    const { matches , players} = usePlayerMatchData();
    const allData = playerMatchHistory(matches);
    const allMvps = getAllMVPs(players, matches)
    const PvP = computeMostWinsLossesWith(matches, playerID, players)
    const { mvpScore } = getAllMVPs(players, matches).find(p => p.id === playerID) || { mvpScore: 0 };

    const streaks = playerStreaks(allData[playerID]?.matches || []);

    if (!playerCalc) return <div className="p-6 text-center">Loading...</div>;

    // Same keys as usePlayerStats, so the profile matches the (masked) leaderboards
    const matchesPlayed = STATS_HIDDEN
        ? Math.min(Math.max(maskCount(matchesPlayedCalc, `appearances:${playerID}`), 1), matches.length)
        : matchesPlayedCalc;
    const wins = Math.min(maskCount(winsCalc, `wins:${playerID}`), matchesPlayed);
    const draws = Math.min(maskCount(drawsCalc, `draws:${playerID}`), matchesPlayed - wins);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <PlayerCard
                    name={maskName(playerCalc.name)}
                    goals={maskCount(goalsCalc, `goals:${playerID}`)}
                    assists={maskCount(assistsCalc, `assists:${playerID}`)}
                    wins={wins}
                    draws={draws}
                    matchesPlayed={matchesPlayed}
                    totalMatches={matches.length}
                    score={maskScore(mvpScore, `mvp:${playerID}`).toFixed(1)}
                    trophy={getTrophy(0)} // optional
                />
            <div className="panel divide-y divide-line mb-6">
                <div className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                        <p className="text-sm text-muted">Wins most with</p>
                        <p className="font-display text-2xl font-bold break-words">{PvP.mostWinsWithName && maskName(PvP.mostWinsWithName)}</p>
                    </div>
                    <span className="num text-4xl text-pitch">{maskCount(PvP.winsCount, `pvpWins:${playerID}`)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                        <p className="text-sm text-muted">Loses most with</p>
                        <p className="font-display text-2xl font-bold break-words">{PvP.mostLossesWithName && maskName(PvP.mostLossesWithName)}</p>
                    </div>
                    <span className="num text-4xl text-red-card">{maskCount(PvP.lossesCount, `pvpLosses:${playerID}`)}</span>
                </div>
            </div>
            {/* Hidden with the match history: streaks would reveal the real results */}
            {!STATS_HIDDEN && (
                <div className="panel divide-y divide-line mb-6">
                    {[
                        { label: "🏆 Longest win streak", value: streaks.longestWinningStreak },
                        { label: "💀 Longest loss streak", value: streaks.longestLosingStreak },
                        { label: "🔥 Longest scoring streak", value: streaks.longestScoringStreak },
                        { label: "🥶 Longest goalless streak", value: streaks.longestNonScoringStreak },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
                            <p className="font-medium">{label}</p>
                            <span className="num text-3xl">{value}</span>
                        </div>
                    ))}
                </div>
            )}
            {/*<GoalProgress />*/}
            {STATS_HIDDEN ? (
                <p className="text-center text-gray-500 mt-6">🤫 Match history is hidden until the end of the season</p>
            ) : (
                <PlayerMatchHistory playerId={playerCalc.id} history={allData} allMVPs={allMvps}/>
            )}
        </div>
    );
}
