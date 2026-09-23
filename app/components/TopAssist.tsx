'use client'

import {Player} from "@/app/types";
import {getSortedStats} from "@/app/utils/playerHelpers";
import CustomBadgeForPlayer from "@/app/components/CustomBadgeForPlayer";

type Props = {
    assists: Record<string, number>;
    players: Player[];
    showAll?: boolean;
}

export default function TopAssist({assists, players, showAll}: Props) {
    const sortedAssists = getSortedStats(assists);
    const displayedAssists = showAll ? sortedAssists : sortedAssists.slice(0, 5);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">🤝 Top Assists</h2>
            <ul className="space-y-1">
                {displayedAssists.map(([id, assists], index) => (
                    <li key={id} className="flex justify-between border-b py-1">
                        <span>
                            <CustomBadgeForPlayer id={id} players={players} index={index} />
                        </span>
                        <span className="text-sm text-gray-600 dark:text-white">{assists} assists</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}