'use client';

import { Player } from "@/app/types";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import CustomBadgeForPlayer from "@/app/components/ui/deprecated/CustomBadgeForPlayer";

type Props = {
    appearances: Record<string, number>;
    players: Player[];
    wins: Record<string, number>;
}

export default function WinRatios({appearances, players, wins}: Props)  {
    const { matches } = usePlayerMatchData();
    const { getWinRatio } = usePlayerStats(matches);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">📈 Win Ratios</h2>
            <ul className="space-y-1">
                {Object.keys(appearances)
                    .sort((a, b) => {
                        const ratioA = (wins[a] || 0) / appearances[a];
                        const ratioB = (wins[b] || 0) / appearances[b];
                        return ratioB - ratioA;
                    })
                    .map((id, index) => (
                        <li key={id} className="flex justify-between border-b py-1">
                            <CustomBadgeForPlayer id={id} players={players} index={index} />
                            <span className="text-sm text-gray-600 dark:text-white">{getWinRatio(id)}</span>
                        </li>
                    ))}
            </ul>
        </div>
    )
}



