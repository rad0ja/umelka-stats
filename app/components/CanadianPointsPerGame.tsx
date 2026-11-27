'use client';

import { Player } from "@/app/types";
import LeagueTable from "@/app/components/LeagueTable";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { getQualifiedPlayerIds, MIN_MATCHES_FOR_RATIOS } from "@/app/utils/playerHelpers";

type Props = {
    players: Player[];
    goals: Record<string, number>;
    assists: Record<string, number>;
    appearances: Record<string, number>;
    showAll?: boolean;
}

export default function CanadianPointsPerGame({players, goals, assists, appearances}: Props) {
    const { matches } = usePlayerMatchData();
    const { getCanadianPointsPerGame, getGoalsPerGame, getAssistsPerGame } = usePlayerStats(matches);

    const ids = getQualifiedPlayerIds(appearances).sort((a, b) =>
        ((goals[b] || 0) + assists[b]) / appearances[b] - ((goals[a] || 0) + assists[a]) / appearances[a]);

    return (
        <LeagueTable
            title="🧮 Canadian points per game"
            note={`More than ${MIN_MATCHES_FOR_RATIOS} matches played`}
            unit="Per game"
            players={players}
            rows={ids.map((id) => ({ id, value: getCanadianPointsPerGame(id), detail: `${getGoalsPerGame(id)}G + ${getAssistsPerGame(id)}A` }))}
        />
    )
}
