'use client';

import { Player } from "@/app/types";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import LeagueTable from "@/app/components/LeagueTable";
import { getQualifiedPlayerIds, MIN_MATCHES_FOR_RATIOS } from "@/app/utils/playerHelpers";

type Props = {
    appearances: Record<string, number>;
    players: Player[];
    goals: Record<string, number>;
}

export default function GoalsPerGame({appearances, players, goals}: Props) {
    const { matches} = usePlayerMatchData();
    const { getGoalsPerGame } = usePlayerStats(matches);

    const ids = getQualifiedPlayerIds(appearances).sort((a, b) =>
        (goals[b] || 0) / appearances[b] - (goals[a] || 0) / appearances[a]);

    return (
        <LeagueTable
            title="⚽ Goals per game"
            note={`More than ${MIN_MATCHES_FOR_RATIOS} matches played`}
            unit="Per game"
            players={players}
            rows={ids.map((id) => ({ id, value: getGoalsPerGame(id) }))}
        />
    )
}
