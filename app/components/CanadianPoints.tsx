'use client';

import {  getSortedStats } from "@/app/utils/playerHelpers";
import { Player } from "@/app/types";
import CustomBadgeForPlayer from "@/app/components/CustomBadgeForPlayer";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";

type Props = {
    players: Player[];
    goals: Record<string, number>;
    assists: Record<string, number>;
    showAll?: boolean;
}

export default function CanadianPoints({players, goals, assists, showAll}: Props) {
    const { matches } = usePlayerMatchData();
    const { canadianPoints } = usePlayerStats(matches);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">🧮 Canadian Points</h2>
            <ul className="space-y-1">
                    {Object.keys(goals)
                                    .sort((a, b) => {
                                        const ratioA = (goals[a] || 0) + assists[a];
                                        const ratioB = (goals[b] || 0) + assists[b];
                                        return ratioB - ratioA;
                                    })
                                    .map((id, index) => (
                                        <li key={id} className="flex justify-between border-b py-1">
                                            <CustomBadgeForPlayer id={id} players={players} index={index} />
                                            <span className="text-sm text-gray-600 dark:text-white">
                                                {canadianPoints(id)} ({goals[id] || 0} + {assists[id] || 0})
                                                </span>
                                        </li>
                                    ))}
            </ul>
        </div>
    )
}