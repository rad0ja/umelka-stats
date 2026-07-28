'use client';

import { Player } from "@/app/types";
import CustomBadgeForPlayer from "@/app/components/CustomBadgeForPlayer";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";

type Props = {
    players: Player[];
    goals: Record<string, number>;
    assists: Record<string, number>;
    appearances: Record<string, number>;
    showAll?: boolean;
}

export default function CanadianPointsPerGame({players, goals, assists, appearances, showAll}: Props) {
    const { matches } = usePlayerMatchData();
    const { getCanadianPointsPerGame, getGoalsPerGame, getAssistsPerGame } = usePlayerStats(matches);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">🧮 Canadian Points Per Game</h2>
            <ul className="space-y-1">
                    {Object.keys(appearances)
                                    .sort((a, b) => {
                                        const ratioA = ((goals[a] || 0) + assists[a]) / appearances[a];
                                        const ratioB = ((goals[b] || 0) + assists[b]) / appearances[b];
                                        return ratioB - ratioA;
                                    })
                                    .map((id, index) => (
                                        <li key={id} className="flex justify-between border-b py-1">
                                            <CustomBadgeForPlayer id={id} players={players} index={index} />
                                            <span className="text-sm text-gray-600 dark:text-white">
                                                {getCanadianPointsPerGame(id)} ({getGoalsPerGame(id)}G + {getAssistsPerGame(id)}A)
                                                </span>
                                        </li>
                                    ))}
            </ul>
        </div>
    )
}