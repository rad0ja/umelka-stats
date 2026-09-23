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

export default function PlayerDetailPage() {
    const { id } = useParams();
    const playerID = id as string
    const { playerCalc, goalsCalc, matchesPlayedCalc, winsCalc, drawsCalc, assistsCalc } = usePlayerCalculatedScore();
    const { matches , players} = usePlayerMatchData();
    const allData = playerMatchHistory(matches);
    const allMvps = getAllMVPs(players, matches)
    const PvP = computeMostWinsLossesWith(matches, playerID, players)
    const { mvpScore } = getAllMVPs(players, matches).find(p => p.id === playerID) || { mvpScore: 0 };

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
            <h2 className="mb-2 text-xl font-semibold">Most wins with: {PvP.mostWinsWithName && maskName(PvP.mostWinsWithName)} - {maskCount(PvP.winsCount, `pvpWins:${playerID}`)}</h2>
            <h2 className="mb-2 text-xl font-semibold">Most loses with: {PvP.mostLossesWithName && maskName(PvP.mostLossesWithName)} - {maskCount(PvP.lossesCount, `pvpLosses:${playerID}`)}</h2>
            {/*<GoalProgress />*/}
            {STATS_HIDDEN ? (
                <p className="text-center text-gray-500 mt-6">🤫 Match history is hidden until the end of the season</p>
            ) : (
                <PlayerMatchHistory playerId={playerCalc.id} history={allData} allMVPs={allMvps}/>
            )}
        </div>
    );
}
