'use client';

import { Player } from "@/app/types";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import CustomBadgeForPlayer from "@/app/components/CustomBadgeForPlayer";
import { getQualifiedPlayerIds, MIN_MATCHES_FOR_RATIOS } from "@/app/utils/playerHelpers";

type Props = {
    appearances: Record<string, number>;
    players: Player[];
    goals: Record<string, number>;
}

export default function GoalsPerGame({appearances, players, goals}: Props) {
    const { matches} = usePlayerMatchData();
    const { getGoalsPerGame } = usePlayerStats(matches);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">⚽ Goals Per Game</h2>
            <p className="text-xs text-gray-500 mb-2">More than {MIN_MATCHES_FOR_RATIOS} matches played</p>
            <ul className="space-y-1">
                {getQualifiedPlayerIds(appearances)
                    .sort((a, b) => {
                        const ratioA = (goals[a] || 0) / appearances[a];
                        const ratioB = (goals[b] || 0) / appearances[b];
                        return ratioB - ratioA;
                    })
                    .map((id, index) => (
                        <li key={id} className="flex justify-between border-b py-1">
                            <CustomBadgeForPlayer id={id} players={players} index={index} />
                            <span className="text-sm text-gray-600 dark:text-white">{getGoalsPerGame(id)} GPG</span>
                        </li>
                    ))}
            </ul>
        </div>
    )
}