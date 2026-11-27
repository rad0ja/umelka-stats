'use client';

import { Player } from "@/app/types";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import LeagueTable from "@/app/components/LeagueTable";
import { getQualifiedPlayerIds, MIN_MATCHES_FOR_RATIOS } from "@/app/utils/playerHelpers";

type Props = {
    appearances: Record<string, number>;
    players: Player[];
    wins: Record<string, number>;
}

export default function WinRatios({appearances, players, wins}: Props)  {
    const { matches } = usePlayerMatchData();
    const { getWinRatio } = usePlayerStats(matches);

    const ids = getQualifiedPlayerIds(appearances).sort((a, b) =>
        (wins[b] || 0) / appearances[b] - (wins[a] || 0) / appearances[a]);

    return (
        <LeagueTable
            title="📈 Win ratios"
            note={`More than ${MIN_MATCHES_FOR_RATIOS} matches played`}
            unit="Win rate"
            players={players}
            rows={ids.map((id) => ({ id, value: getWinRatio(id) }))}
        />
    )
}
