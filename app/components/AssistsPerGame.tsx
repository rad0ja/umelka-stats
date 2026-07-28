'use client';

import { Player } from "@/app/types";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import CustomBadgeForPlayer from "@/app/components/CustomBadgeForPlayer";

type Props = {
    appearances: Record<string, number>;
    players: Player[];
    assists: Record<string, number>;
}

export default function AssistsPerGame({appearances, players, assists}: Props) {
    const { matches} = usePlayerMatchData();
    const { getAssistsPerGame } = usePlayerStats(matches);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">🤝 Assists Per Game</h2>
            <ul className="space-y-1">
                {Object.keys(appearances)
                    .sort((a, b) => {
                        const ratioA = (assists[a] || 0) / appearances[a];
                        const ratioB = (assists[b] || 0) / appearances[b];
                        return ratioB - ratioA;
                    })
                    .map((id, index) => (
                        <li key={id} className="flex justify-between border-b py-1">
                            <CustomBadgeForPlayer id={id} players={players} index={index} />
                            <span className="text-sm text-gray-600 dark:text-white">{getAssistsPerGame(id)} APG</span>
                        </li>
                    ))}
            </ul>
        </div>
    )
}