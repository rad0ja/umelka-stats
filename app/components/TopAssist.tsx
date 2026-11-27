'use client'

import {Player} from "@/app/types";
import {getSortedStats} from "@/app/utils/playerHelpers";
import LeagueTable from "@/app/components/LeagueTable";

type Props = {
    assists: Record<string, number>;
    players: Player[];
    showAll?: boolean;
}

export default function TopAssist({assists, players, showAll}: Props) {
    const sortedAssists = getSortedStats(assists);
    const displayedAssists = showAll ? sortedAssists : sortedAssists.slice(0, 5);

    return (
        <LeagueTable
            title="🤝 Top assists"
            unit="Assists"
            players={players}
            rows={displayedAssists.map(([id, value]) => ({ id, value }))}
        />
    )
}
